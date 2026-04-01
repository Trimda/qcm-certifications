import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, parseSessionCookie } from '@/lib/auth';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { Qcm, Question, AnswerOption, Topic, LocalizedText, User } from '@/types';

const VALID_TOPICS: Topic[] = ['scrum', 'devops', 'safe'];
const VALID_OPTION_IDS = ['a', 'b', 'c', 'd'];

const usersPath = join(process.cwd(), 'src', 'data', 'users.json');

const readUsers = (): User[] =>
  JSON.parse(readFileSync(usersPath, 'utf-8')) as User[];

async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE);
  if (!sessionCookie) return null;
  const userId = parseSessionCookie(sessionCookie.value);
  if (!userId) return null;
  const users = readUsers();
  return users.find(u => u.id === userId) ?? null;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function validateLocalizedText(field: unknown, fieldName: string): string | null {
  if (typeof field !== 'object' || field === null) {
    return `"${fieldName}" doit être un objet { fr, en }`;
  }
  const lt = field as Record<string, unknown>;
  const hasFr = isNonEmptyString(lt.fr);
  const hasEn = isNonEmptyString(lt.en);
  if (!hasFr && !hasEn) {
    return `"${fieldName}" doit contenir au moins une traduction (fr ou en)`;
  }
  return null;
}

function validateQcm(data: unknown): { error: string } | { qcm: Qcm } {
  if (!Array.isArray(data) && typeof data !== 'object') {
    return { error: 'Format invalide : le contenu doit être un objet QCM ou un tableau contenant un QCM.' };
  }

  // Accept array with one element (as exported by the example JSON)
  const raw = Array.isArray(data) ? data[0] : data;

  if (typeof raw !== 'object' || raw === null) {
    return { error: 'Structure invalide : le QCM doit être un objet.' };
  }

  const obj = raw as Record<string, unknown>;

  // Validate title
  const titleErr = validateLocalizedText(obj.title, 'title');
  if (titleErr) return { error: titleErr };

  // Validate description
  const descErr = validateLocalizedText(obj.description, 'description');
  if (descErr) return { error: descErr };

  // Validate topic
  if (!VALID_TOPICS.includes(obj.topic as Topic)) {
    return { error: `"topic" doit être l'une des valeurs : ${VALID_TOPICS.join(', ')}. Reçu : "${String(obj.topic)}"` };
  }

  // Validate questions
  if (!Array.isArray(obj.questions) || obj.questions.length === 0) {
    return { error: '"questions" doit être un tableau non vide.' };
  }

  if (obj.questions.length > 40) {
    return { error: `Le QCM ne peut pas contenir plus de 40 questions. Reçu : ${obj.questions.length} questions.` };
  }

  for (let i = 0; i < obj.questions.length; i++) {
    const q = obj.questions[i] as Record<string, unknown>;
    const qLabel = `Question ${i + 1}`;

    const qTextErr = validateLocalizedText(q.text, `${qLabel}.text`);
    if (qTextErr) return { error: qTextErr };

    if (!Array.isArray(q.options) || q.options.length !== 4) {
      return { error: `${qLabel} : "options" doit contenir exactement 4 éléments (a, b, c, d).` };
    }

    const optionIds = (q.options as Record<string, unknown>[]).map(o => o.id);
    for (const expectedId of VALID_OPTION_IDS) {
      if (!optionIds.includes(expectedId)) {
        return { error: `${qLabel} : l'option "${expectedId}" est manquante.` };
      }
    }

    for (const opt of q.options as Record<string, unknown>[]) {
      const optErr = validateLocalizedText(opt.text, `${qLabel}.options.${String(opt.id)}.text`);
      if (optErr) return { error: optErr };
    }

    const correctArr: string[] = Array.isArray(q.correctAnswer)
      ? (q.correctAnswer as string[])
      : [q.correctAnswer as string];
    if (correctArr.length === 0) {
      return { error: `${qLabel} : "correctAnswer" ne peut pas être vide.` };
    }
    for (const ca of correctArr) {
      if (!VALID_OPTION_IDS.includes(ca)) {
        return {
          error: `${qLabel} : "correctAnswer" contient une valeur invalide : "${ca}". Valeurs acceptées : ${VALID_OPTION_IDS.join(', ')}.`,
        };
      }
    }
  }

  // Validate answerMode if present
  const validAnswerModes = ['single', 'multiple', 'mixed'];
  if (obj.answerMode !== undefined && !validAnswerModes.includes(obj.answerMode as string)) {
    return { error: `"answerMode" doit être 'single', 'multiple' ou 'mixed'. Reçu : "${String(obj.answerMode)}"` };
  }

  // Build a normalized Qcm (without id/createdBy/createdAt — those are added at creation time)
  const normalized: Omit<Qcm, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'> & Partial<Pick<Qcm, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>> = {
    title: obj.title as LocalizedText,
    description: obj.description as LocalizedText,
    topic: obj.topic as Topic,
    answerMode: (obj.answerMode as 'single' | 'multiple' | 'mixed' | undefined) ?? 'single',
    isPrivate: obj.isPrivate === true,
    questions: (obj.questions as Record<string, unknown>[]).map((q, i) => ({
      id: (q.id as string | undefined) ?? `q-import-${i + 1}`,
      text: q.text as LocalizedText,
      options: (q.options as Record<string, unknown>[]).map(opt => ({
        id: opt.id as string,
        text: opt.text as LocalizedText,
      })) as AnswerOption[],
      correctAnswer: q.correctAnswer as string | string[],
      isMultiple: (q.isMultiple as boolean | undefined) ?? false,
    })) as Question[],
  };

  return { qcm: normalized as Qcm };
}

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Vous devez être connecté pour valider un QCM.' }, { status: 401 });
    }
    if (currentUser.role === 'user') {
      return NextResponse.json({ error: 'Vous n\'avez pas les droits pour créer un QCM.' }, { status: 403 });
    }

    const body = await request.json() as { qcm: unknown };

    if (!body || typeof body !== 'object' || !('qcm' in body)) {
      return NextResponse.json({ error: 'Corps de requête invalide : { qcm } attendu.' }, { status: 400 });
    }

    const result = validateQcm(body.qcm);

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ valid: true, qcm: result.qcm }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}

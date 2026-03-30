import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { cookies } from 'next/headers';
import type { User, UserScore } from '@/types';
import { SESSION_COOKIE, parseSessionCookie } from '@/lib/auth';

const scoresPath = join(process.cwd(), 'src', 'data', 'scores.json');
const usersPath  = join(process.cwd(), 'src', 'data', 'users.json');

const readScores = (): UserScore[] => JSON.parse(readFileSync(scoresPath, 'utf-8')) as UserScore[];
const writeScores = (s: UserScore[]) => writeFileSync(scoresPath, JSON.stringify(s, null, 2), 'utf-8');
const readUsers  = (): User[]  => JSON.parse(readFileSync(usersPath,  'utf-8')) as User[];

async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE);
  if (!sessionCookie) return null;
  const userId = parseSessionCookie(sessionCookie.value);
  if (!userId) return null;
  const users = readUsers();
  return users.find(u => u.id === userId) ?? null;
}

/** GET /api/scores — returns { [qcmId]: bestScore } for the current user */
export async function GET(): Promise<NextResponse> {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const scores = readScores();
  const userScores = scores.filter(s => s.userId === currentUser.id);

  const result: Record<string, number> = {};
  for (const s of userScores) {
    result[s.qcmId] = s.bestScore;
  }

  return NextResponse.json(result);
}

/** PATCH /api/scores — body: { qcmId: string, score: number }
 *  Only updates if the new score is strictly better than the stored best.
 */
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json() as { qcmId?: string; score?: number };
  const { qcmId, score } = body;

  if (!qcmId || typeof score !== 'number' || score < 0 || score > 100) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const scores = readScores();
  const idx = scores.findIndex(s => s.userId === currentUser.id && s.qcmId === qcmId);

  if (idx === -1) {
    // New entry
    scores.push({
      userId: currentUser.id,
      qcmId,
      bestScore: score,
      updatedAt: new Date().toISOString(),
    });
  } else if (score > scores[idx].bestScore) {
    // Only update if improved
    scores[idx].bestScore = score;
    scores[idx].updatedAt = new Date().toISOString();
  }

  writeScores(scores);

  return NextResponse.json({ qcmId, bestScore: scores[idx]?.bestScore ?? score });
}

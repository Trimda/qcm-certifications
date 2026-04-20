import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { cookies } from 'next/headers';
import type { Qcm, Topic, User } from '@/types';
import { generateId, SESSION_COOKIE, parseSessionCookie } from '@/lib/auth';
import { checkAndUnlock } from '@/lib/achievementEngine';

const qcmsPath = join(process.cwd(), 'src', 'data', 'qcms.json');
const usersPath = join(process.cwd(), 'src', 'data', 'users.json');

const readQcms = (): Qcm[] => {
  return JSON.parse(readFileSync(qcmsPath, 'utf-8')) as Qcm[];
};

const writeQcms = (qcms: Qcm[]) => {
  writeFileSync(qcmsPath, JSON.stringify(qcms, null, 2), 'utf-8');
};

const readUsers = (): User[] => {
  return JSON.parse(readFileSync(usersPath, 'utf-8')) as User[];
};

async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE);
  if (!sessionCookie) return null;
  const userId = parseSessionCookie(sessionCookie.value);
  if (!userId) return null;
  const users = readUsers();
  return users.find(u => u.id === userId) ?? null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic') as Topic | null;
    const createdBy = searchParams.get('createdBy');

    const currentUser = await getCurrentUser();
    const qcms = readQcms();

    // Visibility filter:
    // - admin: sees all QCMs
    // - authenticated user: sees public QCMs + their own private QCMs
    // - unauthenticated: sees only public QCMs
    const visible = qcms.filter(q => {
      if (!q.isPrivate) return true;
      if (!currentUser) return false;
      if (currentUser.role === 'admin') return true;
      return q.createdBy === currentUser.id;
    });

    let filtered = visible;
    if (topic) filtered = filtered.filter(q => q.topic === topic);
    if (createdBy) filtered = filtered.filter(q => q.createdBy === createdBy);

    return NextResponse.json(filtered);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Omit<Qcm, 'id' | 'createdAt' | 'updatedAt'>;
    const qcms = readQcms();

    const newQcm: Qcm = {
      ...body,
      id: generateId('qcm'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!Array.isArray(newQcm.questions) || newQcm.questions.length === 0) {
      return NextResponse.json({ error: 'Le QCM doit contenir au moins une question.' }, { status: 400 });
    }
    if (newQcm.questions.length > 40) {
      return NextResponse.json({ error: `Le QCM ne peut pas contenir plus de 40 questions.` }, { status: 400 });
    }

    qcms.push(newQcm);
    writeQcms(qcms);

    // Fire achievement trigger (non-blocking)
    const currentUser = await getCurrentUser();
    if (currentUser) {
      try { checkAndUnlock(currentUser.id, 'first_qcm_created'); } catch { /* silent */ }
    }

    return NextResponse.json(newQcm, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

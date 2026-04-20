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
  return readUsers().find(u => u.id === userId) ?? null;
}

/** GET /api/scores - returns { [qcmId]: { bestScore, rating? } } for the current user */
export async function GET(): Promise<NextResponse> {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const scores = readScores().filter(s => s.userId === currentUser.id);
  const result: Record<string, { bestScore: number; rating?: number }> = {};
  for (const s of scores) {
    result[s.qcmId] = { bestScore: s.bestScore, ...(s.rating ? { rating: s.rating } : {}) };
  }
  return NextResponse.json(result);
}

/** PATCH /api/scores - body: { qcmId, score?, rating? }
 *  score: only persisted if better than current best.
 *  rating: always overwritten (user can change their mind).
 */
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json() as { qcmId?: string; score?: number; rating?: number };
  const { qcmId, score, rating } = body;

  if (!qcmId) return NextResponse.json({ error: 'Missing qcmId' }, { status: 400 });
  if (score !== undefined && (typeof score !== 'number' || score < 0 || score > 100))
    return NextResponse.json({ error: 'Invalid score' }, { status: 400 });
  if (rating !== undefined && (typeof rating !== 'number' || rating < 1 || rating > 5))
    return NextResponse.json({ error: 'Invalid rating' }, { status: 400 });

  const scores = readScores();
  const idx = scores.findIndex(s => s.userId === currentUser.id && s.qcmId === qcmId);

  if (idx === -1) {
    scores.push({
      userId: currentUser.id,
      qcmId,
      bestScore: score ?? 0,
      ...(rating !== undefined ? { rating } : {}),
      updatedAt: new Date().toISOString(),
    });
  } else {
    if (score !== undefined && score > scores[idx].bestScore) scores[idx].bestScore = score;
    if (rating !== undefined) scores[idx].rating = rating;
    scores[idx].updatedAt = new Date().toISOString();
  }

  writeScores(scores);

  const updated = scores.find(s => s.userId === currentUser.id && s.qcmId === qcmId)!;
  return NextResponse.json({ qcmId: updated.qcmId, bestScore: updated.bestScore, rating: updated.rating });
}
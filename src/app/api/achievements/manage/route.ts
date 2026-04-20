import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { cookies } from 'next/headers';
import type { Achievement, User } from '@/types';
import { SESSION_COOKIE, parseSessionCookie, generateId } from '@/lib/auth';

const achievementsPath = join(process.cwd(), 'src', 'data', 'achievements.json');
const usersPath = join(process.cwd(), 'src', 'data', 'users.json');

const readAchievements = (): Achievement[] =>
  JSON.parse(readFileSync(achievementsPath, 'utf-8')) as Achievement[];
const writeAchievements = (data: Achievement[]) =>
  writeFileSync(achievementsPath, JSON.stringify(data, null, 2), 'utf-8');

async function getAdminUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE);
  if (!sessionCookie) return null;
  const userId = parseSessionCookie(sessionCookie.value);
  if (!userId) return null;
  const users = JSON.parse(readFileSync(usersPath, 'utf-8')) as User[];
  const user = users.find(u => u.id === userId);
  return user?.role === 'admin' ? user : null;
}

/** GET /api/achievements/manage — all achievements (admin only) */
export async function GET(): Promise<NextResponse> {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  return NextResponse.json(readAchievements());
}

/** POST /api/achievements/manage — create new achievement (admin only) */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json() as Omit<Achievement, 'id' | 'createdAt'>;
  const achievements = readAchievements();

  const newAch: Achievement = {
    ...body,
    id: generateId('ach'),
    createdAt: new Date().toISOString(),
  };

  achievements.push(newAch);
  writeAchievements(achievements);
  return NextResponse.json(newAch, { status: 201 });
}

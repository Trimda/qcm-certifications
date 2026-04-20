import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { cookies } from 'next/headers';
import type { Achievement, User } from '@/types';
import { SESSION_COOKIE, parseSessionCookie } from '@/lib/auth';

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

/** PUT /api/achievements/manage/[id] */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const achievements = readAchievements();
  const idx = achievements.findIndex(a => a.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = await request.json() as Partial<Achievement>;
  achievements[idx] = { ...achievements[idx], ...body, id, createdAt: achievements[idx].createdAt };
  writeAchievements(achievements);
  return NextResponse.json(achievements[idx]);
}

/** DELETE /api/achievements/manage/[id] */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const achievements = readAchievements();
  const filtered = achievements.filter(a => a.id !== id);
  if (filtered.length === achievements.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  writeAchievements(filtered);
  return NextResponse.json({ success: true });
}

import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { cookies } from 'next/headers';
import type { User } from '@/types';
import { SESSION_COOKIE, parseSessionCookie } from '@/lib/auth';
import { grantManual } from '@/lib/achievementEngine';

const usersPath = join(process.cwd(), 'src', 'data', 'users.json');

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

/** POST /api/achievements/grant — { userId, achievementId } */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json() as { userId?: string; achievementId?: string };
  if (!body.userId || !body.achievementId)
    return NextResponse.json({ error: 'Missing userId or achievementId' }, { status: 400 });

  const result = grantManual(body.userId, body.achievementId);
  if (!result) return NextResponse.json({ error: 'Already unlocked or achievement not found' }, { status: 409 });

  return NextResponse.json(result, { status: 201 });
}

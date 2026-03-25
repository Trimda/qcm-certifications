import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { User } from '@/types';
import { SESSION_COOKIE, parseSessionCookie } from '@/lib/auth';

const usersPath = join(process.cwd(), 'src', 'data', 'users.json');

const readUsers = (): User[] => {
  return JSON.parse(readFileSync(usersPath, 'utf-8')) as User[];
};

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get(SESSION_COOKIE);
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = parseSessionCookie(sessionCookie.value);
    if (!userId) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const users = readUsers();
    const user = users.find(u => u.id === userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

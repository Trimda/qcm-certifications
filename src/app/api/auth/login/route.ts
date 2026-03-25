import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { User } from '@/types';
import { SESSION_COOKIE, createSessionValue, verifyPassword } from '@/lib/auth';

const usersPath = join(process.cwd(), 'src', 'data', 'users.json');

const readUsers = (): User[] => {
  return JSON.parse(readFileSync(usersPath, 'utf-8')) as User[];
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { email?: string; password?: string };
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const users = readUsers();
    const user = users.find(u => u.email === email);

    if (!user || !user.password || !verifyPassword(password, user.password)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const { password: _, ...userWithoutPassword } = user;
    const sessionValue = createSessionValue(user.id);

    const response = NextResponse.json(userWithoutPassword, { status: 200 });
    response.cookies.set(SESSION_COOKIE, sessionValue, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

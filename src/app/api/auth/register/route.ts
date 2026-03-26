import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { User, Role } from '@/types';
import { generateId, hashPassword, SESSION_COOKIE, createSessionValue } from '@/lib/auth';

const usersPath = join(process.cwd(), 'src', 'data', 'users.json');

const readUsers = (): User[] => {
  return JSON.parse(readFileSync(usersPath, 'utf-8')) as User[];
};

const writeUsers = (users: User[]) => {
  writeFileSync(usersPath, JSON.stringify(users, null, 2), 'utf-8');
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      username?: string;
      email?: string;
      password?: string;
      role?: Role;
    };
    const { username, email, password, role = 'user' } = body;

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const users = readUsers();

    if (users.some(u => u.email === email)) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
    }

    const hashed = await hashPassword(password);

    const newUser: User = {
      id: generateId('user'),
      username,
      email,
      password: hashed,
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);
    writeUsers(users);

    const { password: _, ...userWithoutPassword } = newUser;
    const sessionValue = createSessionValue(newUser.id);

    const response = NextResponse.json(userWithoutPassword, { status: 201 });
    response.cookies.set(SESSION_COOKIE, sessionValue, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

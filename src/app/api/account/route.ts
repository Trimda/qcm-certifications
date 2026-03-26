import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { cookies } from 'next/headers';
import type { User } from '@/types';
import { SESSION_COOKIE, parseSessionCookie, verifyPassword, hashPassword } from '@/lib/auth';

const usersPath = join(process.cwd(), 'src', 'data', 'users.json');

const readUsers = (): User[] =>
  JSON.parse(readFileSync(usersPath, 'utf-8')) as User[];

const writeUsers = (users: User[]) =>
  writeFileSync(usersPath, JSON.stringify(users, null, 2), 'utf-8');

async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE);
  if (!sessionCookie) return null;
  return parseSessionCookie(sessionCookie.value);
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = readUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json() as {
      username?: string;
      currentPassword?: string;
      newPassword?: string;
    };

    // ── Update username ──────────────────────────────────────────────────────
    if (body.username !== undefined) {
      const trimmed = body.username.trim();
      if (trimmed.length < 2) {
        return NextResponse.json(
          { error: 'Username must be at least 2 characters' },
          { status: 400 }
        );
      }
      const taken = users.some(
        u => u.id !== userId && u.username.toLowerCase() === trimmed.toLowerCase()
      );
      if (taken) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
      }
      users[index] = { ...users[index], username: trimmed, updatedAt: new Date().toISOString() };
    }

    // ── Update password ──────────────────────────────────────────────────────
    if (body.newPassword !== undefined) {
      if (!body.currentPassword) {
        return NextResponse.json(
          { error: 'Current password is required' },
          { status: 400 }
        );
      }
      const valid = await verifyPassword(body.currentPassword, users[index].password ?? '');
      if (!valid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        );
      }
      if (body.newPassword.length < 6) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters' },
          { status: 400 }
        );
      }
      users[index] = {
        ...users[index],
        password: await hashPassword(body.newPassword),
        updatedAt: new Date().toISOString(),
      };
    }

    writeUsers(users);

    const { password: _, ...userWithoutPassword } = users[index];
    return NextResponse.json(userWithoutPassword);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

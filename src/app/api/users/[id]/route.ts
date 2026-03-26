import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { User } from '@/types';
import { hashPassword } from '@/lib/auth';

const usersPath = join(process.cwd(), 'src', 'data', 'users.json');

const readUsers = (): User[] => {
  return JSON.parse(readFileSync(usersPath, 'utf-8')) as User[];
};

const writeUsers = (users: User[]) => {
  writeFileSync(usersPath, JSON.stringify(users, null, 2), 'utf-8');
};

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json() as Partial<User & { password?: string }>;
    const users = readUsers();
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (body.password) {
      body.password = await hashPassword(body.password);
    }

    users[index] = { ...users[index], ...body, updatedAt: new Date().toISOString() };
    writeUsers(users);

    const { password: _, ...userWithoutPassword } = users[index];
    return NextResponse.json(userWithoutPassword);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const users = readUsers();
    const filtered = users.filter(u => u.id !== id);

    if (filtered.length === users.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    writeUsers(filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

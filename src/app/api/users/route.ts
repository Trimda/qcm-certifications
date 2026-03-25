import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { User } from '@/types';

const usersPath = join(process.cwd(), 'src', 'data', 'users.json');

const readUsers = (): User[] => {
  return JSON.parse(readFileSync(usersPath, 'utf-8')) as User[];
};

export async function GET(_request: NextRequest) {
  try {
    const users = readUsers();
    const safeUsers = users.map(({ password: _, ...u }) => u);
    return NextResponse.json(safeUsers);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

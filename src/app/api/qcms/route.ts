import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { Qcm, Topic } from '@/types';
import { generateId } from '@/lib/auth';

const qcmsPath = join(process.cwd(), 'src', 'data', 'qcms.json');

const readQcms = (): Qcm[] => {
  return JSON.parse(readFileSync(qcmsPath, 'utf-8')) as Qcm[];
};

const writeQcms = (qcms: Qcm[]) => {
  writeFileSync(qcmsPath, JSON.stringify(qcms, null, 2), 'utf-8');
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic') as Topic | null;
    const qcms = readQcms();
    const filtered = topic ? qcms.filter(q => q.topic === topic) : qcms;
    return NextResponse.json(filtered);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Omit<Qcm, 'id' | 'createdAt' | 'updatedAt'>;
    const qcms = readQcms();

    const newQcm: Qcm = {
      ...body,
      id: generateId('qcm'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    qcms.push(newQcm);
    writeQcms(qcms);

    return NextResponse.json(newQcm, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

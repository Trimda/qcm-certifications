import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { Qcm } from '@/types';

const qcmsPath = join(process.cwd(), 'src', 'data', 'qcms.json');

const readQcms = (): Qcm[] => {
  return JSON.parse(readFileSync(qcmsPath, 'utf-8')) as Qcm[];
};

const writeQcms = (qcms: Qcm[]) => {
  writeFileSync(qcmsPath, JSON.stringify(qcms, null, 2), 'utf-8');
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const qcms = readQcms();
    const qcm = qcms.find(q => q.id === id);
    if (!qcm) {
      return NextResponse.json({ error: 'QCM not found' }, { status: 404 });
    }
    return NextResponse.json(qcm);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json() as Partial<Qcm>;
    const qcms = readQcms();
    const index = qcms.findIndex(q => q.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'QCM not found' }, { status: 404 });
    }

    qcms[index] = { ...qcms[index], ...body, updatedAt: new Date().toISOString() };
    writeQcms(qcms);

    return NextResponse.json(qcms[index]);
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
    const qcms = readQcms();
    const filtered = qcms.filter(q => q.id !== id);

    if (filtered.length === qcms.length) {
      return NextResponse.json({ error: 'QCM not found' }, { status: 404 });
    }

    writeQcms(filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

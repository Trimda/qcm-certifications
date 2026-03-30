import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { UserScore } from '@/types';

const scoresPath = join(process.cwd(), 'src', 'data', 'scores.json');
const readScores = (): UserScore[] => JSON.parse(readFileSync(scoresPath, 'utf-8')) as UserScore[];

/** GET /api/ratings - public, returns { [qcmId]: { avg: number, count: number } } */
export async function GET(): Promise<NextResponse> {
  const scores = readScores();
  const ratingMap: Record<string, number[]> = {};

  for (const s of scores) {
    if (s.rating && s.rating > 0) {
      if (!ratingMap[s.qcmId]) ratingMap[s.qcmId] = [];
      ratingMap[s.qcmId].push(s.rating);
    }
  }

  const result: Record<string, { avg: number; count: number }> = {};
  for (const [qcmId, rs] of Object.entries(ratingMap)) {
    const avg = rs.reduce((a, b) => a + b, 0) / rs.length;
    result[qcmId] = { avg: Math.round(avg * 10) / 10, count: rs.length };
  }

  return NextResponse.json(result);
}
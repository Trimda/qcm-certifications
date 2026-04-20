import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, parseSessionCookie } from '@/lib/auth';
import { checkAndUnlock } from '@/lib/achievementEngine';
import type { Achievement, AchievementTrigger } from '@/types';
import achievementsData from '@/data/achievements.json';

const allAchievements = achievementsData as Achievement[];

async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE);
  if (!sessionCookie) return null;
  return parseSessionCookie(sessionCookie.value);
}

/** POST /api/achievements/check — body: { trigger: AchievementTrigger } */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json() as { trigger?: AchievementTrigger };
  if (!body.trigger) return NextResponse.json({ error: 'Missing trigger' }, { status: 400 });

  const newlyUnlocked = checkAndUnlock(userId, body.trigger);

  const enriched = newlyUnlocked.map(ua => ({
    ...ua,
    achievement: allAchievements.find(a => a.id === ua.achievementId) ?? null,
  })).filter(ua => ua.achievement !== null);

  return NextResponse.json({ unlocked: enriched });
}

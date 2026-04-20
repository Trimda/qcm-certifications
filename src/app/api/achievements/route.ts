import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { cookies } from 'next/headers';
import type { Achievement, UserAchievement } from '@/types';
import { SESSION_COOKIE, parseSessionCookie } from '@/lib/auth';
import { readUserAchievements } from '@/lib/achievementEngine';

const achievementsPath = join(process.cwd(), 'src', 'data', 'achievements.json');

const readAchievements = (): Achievement[] =>
  JSON.parse(readFileSync(achievementsPath, 'utf-8')) as Achievement[];

async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE);
  if (!sessionCookie) return null;
  return parseSessionCookie(sessionCookie.value);
}

export interface AchievementWithStatus extends Achievement {
  unlocked: boolean;
  unlockedAt?: string;
  level?: number;
}

/** GET /api/achievements — list achievements with unlock status for the current user */
export async function GET(): Promise<NextResponse> {
  const userId = await getCurrentUserId();
  const achievements = readAchievements();
  const userAchievements: UserAchievement[] = userId ? readUserAchievements().filter(ua => ua.userId === userId) : [];

  const now = new Date();
  const result: AchievementWithStatus[] = [];

  for (const ach of achievements) {
    if (!ach.active) continue;
    if (ach.availableFrom && new Date(ach.availableFrom) > now) continue;
    if (ach.availableTo && new Date(ach.availableTo) < now) continue;

    const userUnlock = userAchievements.find(ua => ua.achievementId === ach.id);
    const unlocked = !!userUnlock;

    // Secret badges not yet unlocked → completely hidden
    if (ach.secret && !unlocked) continue;

    result.push({
      ...ach,
      unlocked,
      unlockedAt: userUnlock?.unlockedAt,
      level: userUnlock?.level,
    });
  }

  return NextResponse.json(result);
}

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { Achievement, UserAchievement, UserScore, Qcm } from '@/types';

const achievementsPath = join(process.cwd(), 'src', 'data', 'achievements.json');
const userAchievementsPath = join(process.cwd(), 'src', 'data', 'user-achievements.json');
const scoresPath = join(process.cwd(), 'src', 'data', 'scores.json');
const qcmsPath = join(process.cwd(), 'src', 'data', 'qcms.json');

const readAchievements = (): Achievement[] =>
  JSON.parse(readFileSync(achievementsPath, 'utf-8')) as Achievement[];

export const readUserAchievements = (): UserAchievement[] =>
  JSON.parse(readFileSync(userAchievementsPath, 'utf-8')) as UserAchievement[];

const writeUserAchievements = (data: UserAchievement[]) =>
  writeFileSync(userAchievementsPath, JSON.stringify(data, null, 2), 'utf-8');

const readScores = (): UserScore[] =>
  JSON.parse(readFileSync(scoresPath, 'utf-8')) as UserScore[];

const readQcms = (): Qcm[] =>
  JSON.parse(readFileSync(qcmsPath, 'utf-8')) as Qcm[];

function isAvailable(achievement: Achievement): boolean {
  if (!achievement.active) return false;
  const now = new Date();
  if (achievement.availableFrom && new Date(achievement.availableFrom) > now) return false;
  if (achievement.availableTo && new Date(achievement.availableTo) < now) return false;
  return true;
}

function checkCondition(
  achievement: Achievement,
  userId: string,
  trigger: string,
  scores: UserScore[],
  qcms: Qcm[],
): boolean {
  if (achievement.trigger !== trigger) return false;
  if (!isAvailable(achievement)) return false;

  const userScores = scores.filter(s => s.userId === userId);

  switch (trigger) {
    case 'first_qcm_done':
      return userScores.length >= 1;

    case 'perfect_score':
      return userScores.some(s => s.bestScore === 100);

    case 'complete_N_qcms': {
      const n = achievement.triggerThreshold ?? 1;
      return userScores.length >= n;
    }

    case 'streak_7_days': {
      if (userScores.length < 7) return false;
      const dates = [...new Set(
        userScores.map(s => new Date(s.updatedAt).toDateString()),
      )].map(d => new Date(d).getTime()).sort((a, b) => a - b);
      const DAY = 86400000;
      for (let i = 0; i <= dates.length - 7; i++) {
        let consecutive = true;
        for (let j = 1; j < 7; j++) {
          if (dates[i + j] - dates[i + j - 1] !== DAY) {
            consecutive = false;
            break;
          }
        }
        if (consecutive) return true;
      }
      return false;
    }

    case 'first_qcm_created':
      return qcms.filter(q => q.createdBy === userId).length >= 1;

    case 'rocket_click':
    case 'manual':
      return true;

    default:
      return false;
  }
}

/** Check all achievements for a given trigger and unlock eligible ones. Returns newly unlocked. */
export function checkAndUnlock(userId: string, trigger: string): UserAchievement[] {
  const achievements = readAchievements();
  const userAchievements = readUserAchievements();
  const scores = readScores();
  const qcms = readQcms();

  const newlyUnlocked: UserAchievement[] = [];

  for (const achievement of achievements) {
    const existingCount = userAchievements.filter(
      ua => ua.userId === userId && ua.achievementId === achievement.id,
    ).length;

    if (existingCount > 0 && !achievement.stackable) continue;

    if (achievement.unique) {
      const takenByOther = userAchievements.some(
        ua => ua.achievementId === achievement.id && ua.userId !== userId,
      );
      if (takenByOther) continue;
    }

    if (checkCondition(achievement, userId, trigger, scores, qcms)) {
      const ua: UserAchievement = {
        userId,
        achievementId: achievement.id,
        unlockedAt: new Date().toISOString(),
        ...(achievement.stackable ? { level: existingCount + 1 } : {}),
      };
      userAchievements.push(ua);
      newlyUnlocked.push(ua);
    }
  }

  if (newlyUnlocked.length > 0) {
    writeUserAchievements(userAchievements);
  }

  return newlyUnlocked;
}

/** Manually grant a badge to a user (admin action). */
export function grantManual(userId: string, achievementId: string): UserAchievement | null {
  const achievements = readAchievements();
  const achievement = achievements.find(a => a.id === achievementId);
  if (!achievement) return null;

  const userAchievements = readUserAchievements();
  const alreadyUnlocked = userAchievements.some(
    ua => ua.userId === userId && ua.achievementId === achievementId,
  );
  if (alreadyUnlocked && !achievement.stackable) return null;

  const ua: UserAchievement = {
    userId,
    achievementId,
    unlockedAt: new Date().toISOString(),
    ...(achievement.stackable ? {
      level: userAchievements.filter(
        x => x.userId === userId && x.achievementId === achievementId,
      ).length + 1,
    } : {}),
  };
  userAchievements.push(ua);
  writeUserAchievements(userAchievements);
  return ua;
}

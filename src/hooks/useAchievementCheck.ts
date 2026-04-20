'use client';

import { useCallback } from 'react';
import { useToast } from '@/contexts/ToastContext';
import type { AchievementTrigger } from '@/types';

export const useAchievementCheck = () => {
  const { addToast } = useToast();

  const checkAchievements = useCallback(
    async (trigger: AchievementTrigger, context?: Record<string, unknown>) => {
      try {
        const res = await fetch('/api/achievements/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trigger, context }),
        });
        if (!res.ok) return;

        const data: { unlocked: { achievement: import('@/types').Achievement; level?: number }[] } =
          await res.json();

        for (const item of data.unlocked ?? []) {
          addToast(item.achievement, item.level);
        }
      } catch {
        // silently ignore — achievements are non-critical
      }
    },
    [addToast]
  );

  return { checkAchievements };
};

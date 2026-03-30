'use client';

import { useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

/** Stores and retrieves best percentage scores per QCM id in localStorage */
export const useBestScores = () => {
  const [scores, setScores] = useLocalStorage<Record<string, number>>('qcm_best_scores', {});

  const updateBestScore = useCallback(
    (qcmId: string, percentage: number, current: Record<string, number>) => {
      setScores({ ...current, [qcmId]: Math.max(percentage, current[qcmId] ?? 0) });
    },
    [setScores],
  );

  return { scores, updateBestScore };
};

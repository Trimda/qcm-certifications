'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/hooks/useAuth';

const LS_KEY = 'qcm_best_scores';

/**
 * Persists best scores in src/data/scores.json via /api/scores for authenticated users.
 * Falls back to localStorage for guest (unauthenticated) users.
 */
export const useBestScores = () => {
  const { currentUser } = useAuth();
  const isAuth = !!currentUser;

  // Server-backed state for authenticated users
  const [serverScores, setServerScores] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);

  // localStorage fallback for guests
  const [guestScores, setGuestScores] = useLocalStorage<Record<string, number>>(LS_KEY, {});

  // Load scores from API when the user is authenticated
  useEffect(() => {
    if (!isAuth) return;
    setIsLoading(true);
    fetch('/api/scores')
      .then(res => (res.ok ? (res.json() as Promise<Record<string, number>>) : {}))
      .then(data => setServerScores(data as Record<string, number>))
      .catch(() => setServerScores({}))
      .finally(() => setIsLoading(false));
  }, [isAuth]);

  const scores = isAuth ? serverScores : guestScores;

  const updateBestScore = useCallback(
    async (qcmId: string, percentage: number, current: Record<string, number>) => {
      if (!isAuth) {
        // Guest: persist in localStorage only
        setGuestScores({
          ...current,
          [qcmId]: Math.max(percentage, current[qcmId] ?? 0),
        });
        return;
      }

      // Authenticated: optimistic update then persist to API
      const newBest = Math.max(percentage, current[qcmId] ?? 0);
      setServerScores(prev => ({ ...prev, [qcmId]: newBest }));

      try {
        await fetch('/api/scores', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ qcmId, score: percentage }),
        });
      } catch {
        // Silent fail — optimistic state is already updated
      }
    },
    [isAuth, setGuestScores],
  );

  return { scores, updateBestScore, isLoading };
};

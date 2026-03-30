'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/hooks/useAuth';

const LS_KEY = 'qcm_best_scores';
interface ServerEntry { bestScore: number; rating?: number; }

/**
 * Persists best scores + star ratings in src/data/scores.json via /api/scores
 * for authenticated users. Falls back to localStorage for guests.
 */
export const useBestScores = () => {
  const { currentUser } = useAuth();
  const isAuth = !!currentUser;

  const [serverData, setServerData] = useState<Record<string, ServerEntry>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [guestScores, setGuestScores] = useLocalStorage<Record<string, number>>(LS_KEY, {});

  useEffect(() => {
    if (!isAuth) return;
    setIsLoading(true);
    fetch('/api/scores')
      .then(res => (res.ok ? (res.json() as Promise<Record<string, ServerEntry>>) : Promise.resolve({})))
      .then(data => setServerData(data as Record<string, ServerEntry>))
      .catch(() => setServerData({}))
      .finally(() => setIsLoading(false));
  }, [isAuth]);

  // Backward-compat flat map: Record<qcmId, bestScore>
  const scores: Record<string, number> = isAuth
    ? Object.fromEntries(Object.entries(serverData).map(([k, v]) => [k, v.bestScore]))
    : guestScores;

  // User's own star ratings (authenticated only)
  const userRatings: Record<string, number> = isAuth
    ? Object.fromEntries(
        Object.entries(serverData)
          .filter(([, v]) => v.rating !== undefined && (v.rating ?? 0) > 0)
          .map(([k, v]) => [k, v.rating!]),
      )
    : {};

  const updateBestScore = useCallback(
    async (qcmId: string, percentage: number, current: Record<string, number>) => {
      if (!isAuth) {
        setGuestScores({ ...current, [qcmId]: Math.max(percentage, current[qcmId] ?? 0) });
        return;
      }
      const newBest = Math.max(percentage, current[qcmId] ?? 0);
      setServerData(prev => ({ ...prev, [qcmId]: { ...(prev[qcmId] ?? {}), bestScore: newBest } }));
      try {
        await fetch('/api/scores', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ qcmId, score: percentage }),
        });
      } catch { /* silent */ }
    },
    [isAuth, setGuestScores],
  );

  const submitRating = useCallback(
    async (qcmId: string, rating: number) => {
      if (!isAuth) return;
      setServerData(prev => ({ ...prev, [qcmId]: { ...(prev[qcmId] ?? { bestScore: 0 }), rating } }));
      try {
        await fetch('/api/scores', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ qcmId, rating }),
        });
      } catch { /* silent */ }
    },
    [isAuth],
  );

  return { scores, userRatings, updateBestScore, submitRating, isLoading };
};
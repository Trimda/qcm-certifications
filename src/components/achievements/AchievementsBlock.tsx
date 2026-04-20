'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from '@/components/ui/Card';
import { TrophyIcon } from '@phosphor-icons/react';
import { AchievementBadge } from './AchievementBadge';
import type { AchievementWithStatus } from '@/app/api/achievements/route';

export const AchievementsBlock: React.FC = () => {
  const { t } = useTranslation();
  const [achievements, setAchievements] = useState<AchievementWithStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/achievements')
      .then(r => (r.ok ? r.json() : Promise.resolve([])))
      .then(data => setAchievements(data as AchievementWithStatus[]))
      .catch(() => setAchievements([]))
      .finally(() => setLoading(false));
  }, []);

  const unlocked = achievements.filter(a => a.unlocked).length;
  const total = achievements.length;

  return (
    <Card className="mb-6">
      <div className="flex items-center gap-2 mb-5">
        <TrophyIcon size={22} weight="bold" />
        <h2 className="memphis-heading text-xl">{t('achievements.title')}</h2>
        <span className="ml-auto text-xs font-black px-2 py-0.5 border-2 border-black">
          {unlocked} / {total}
        </span>
      </div>

      {loading ? (
        <p className="font-bold text-sm opacity-60">{t('common.loading')}</p>
      ) : achievements.length === 0 ? (
        <p className="font-bold text-sm opacity-60">{t('achievements.noAchievements')}</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {achievements.map(ach => (
            <AchievementBadge key={ach.id} achievement={ach} />
          ))}
        </div>
      )}
    </Card>
  );
};

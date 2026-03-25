'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { Topic } from '@/types';

export const TopicSelector: React.FC = () => {
  const { t } = useTranslation();

  const topics: { topic: Topic; label: string; emoji: string; color: 'yellow' | 'blue' | 'red' }[] = [
    { topic: 'scrum', label: 'SCRUM', emoji: '🏃', color: 'yellow' },
    { topic: 'devops', label: 'DevOps', emoji: '⚙️', color: 'blue' },
    { topic: 'safe', label: 'SAFe', emoji: '🚀', color: 'red' },
  ];

  return (
    <div>
      <h1 className="memphis-heading text-3xl mb-8">{t('practice.title')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {topics.map(({ topic, label, emoji, color }) => (
          <Link key={topic} href={`/practice/${topic}`} className="no-underline">
            <Card variant={color} className="flex flex-col gap-3 cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform h-full">
              <div className="text-4xl">{emoji}</div>
              <div className="flex items-center gap-2">
                <h2 className="memphis-heading text-xl">{label}</h2>
                <Badge variant={topic}>{topic.toUpperCase()}</Badge>
              </div>
              <Button variant="ghost" size="sm" className="mt-auto">
                {t('practice.startButton')} →
              </Button>
            </Card>
          </Link>
        ))}

        {/* Mixed session */}
        <Link href="/practice/mixed" className="no-underline">
          <Card className="flex flex-col gap-3 cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform h-full">
            <div className="text-4xl">🔀</div>
            <div className="flex items-center gap-2">
              <h2 className="memphis-heading text-xl">{t('practice.mixed')}</h2>
            </div>
            <p className="text-sm font-bold">{t('practice.mixedDesc')}</p>
            <Button variant="primary" size="sm" className="mt-auto">
              {t('practice.startButton')} →
            </Button>
          </Card>
        </Link>
      </div>
    </div>
  );
};

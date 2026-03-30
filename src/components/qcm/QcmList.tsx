'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { resolveText } from '@/lib/localizedText';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LockSimpleIcon, TrophyIcon } from '@phosphor-icons/react';
import type { Qcm, Topic } from '@/types';

interface QcmListProps {
  qcms: Qcm[];
  onDelete?: (id: string) => void;
  onStart?: (qcm: Qcm) => void;
  showActions?: boolean;
  bestScores?: Record<string, number>;
}

export const QcmList: React.FC<QcmListProps> = ({
  qcms,
  onDelete,
  onStart,
  showActions = false,
  bestScores = {},
}) => {
  const { t, i18n } = useTranslation();

  if (qcms.length === 0) {
    return <p className="font-bold">{t('practice.noQcm')}</p>;
  }

  const topicColors: Record<Topic, 'yellow' | 'blue' | 'red'> = {
    scrum: 'yellow',
    devops: 'blue',
    safe: 'red',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {qcms.map(qcm => (
        <Card key={qcm.id} variant={topicColors[qcm.topic]} className="flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="memphis-heading text-lg flex-1">{resolveText(qcm.title, i18n.language)}</h3>
            <Badge variant={qcm.topic}>{qcm.topic.toUpperCase()}</Badge>
            {qcm.isPrivate && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-black text-white text-xs font-black border-2 border-black">
                <LockSimpleIcon size={12} weight="bold" />
                {t('contributor.private')}
              </span>
            )}
          </div>
          <p className="text-sm font-bold flex-1">{resolveText(qcm.description, i18n.language)}</p>
          <p className="text-xs font-black opacity-60">
            {qcm.questions.length} {t('admin.questions').toLowerCase()}
          </p>
          {bestScores[qcm.id] !== undefined && (
            <p className="text-xs font-black flex items-center gap-1 text-[var(--memphis-blue)]">
              <TrophyIcon size={13} weight="bold" />
              {t('practice.bestScore')} : {bestScores[qcm.id]}%
            </p>
          )}
          <div className="flex gap-2 flex-wrap">
            {onStart ? (
              <Button variant="primary" size="sm" onClick={() => onStart(qcm)}>
                {bestScores[qcm.id] !== undefined ? t('practice.restart') : t('practice.startButton')}
              </Button>
            ) : (
              <Link href={`/practice/${qcm.topic}`}>
                <Button variant="ghost" size="sm">
                  {t('practice.startButton')}
                </Button>
              </Link>
            )}
            {showActions && (
              <>
                <Link href={`/contributor/qcm/${qcm.id}/edit`}>
                  <Button variant="secondary" size="sm">
                    {t('common.edit')}
                  </Button>
                </Link>
                {onDelete && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(qcm.id)}
                  >
                    {t('common.delete')}
                  </Button>
                )}
              </>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

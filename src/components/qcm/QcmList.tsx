'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { Qcm, Topic } from '@/types';

interface QcmListProps {
  qcms: Qcm[];
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export const QcmList: React.FC<QcmListProps> = ({
  qcms,
  onDelete,
  showActions = false,
}) => {
  const { t } = useTranslation();

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
            <h3 className="memphis-heading text-lg flex-1">{qcm.title}</h3>
            <Badge variant={qcm.topic}>{qcm.topic.toUpperCase()}</Badge>
          </div>
          <p className="text-sm font-bold flex-1">{qcm.description}</p>
          <p className="text-xs font-black opacity-60">
            {qcm.questions.length} questions
          </p>
          <div className="flex gap-2 flex-wrap">
            <Link href={`/practice/${qcm.topic}`}>
              <Button variant="ghost" size="sm">
                {t('practice.startButton')}
              </Button>
            </Link>
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

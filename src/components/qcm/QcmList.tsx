'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { resolveText } from '@/lib/localizedText';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { LockSimpleIcon, TrophyIcon, PencilSimpleIcon, TrashIcon, DownloadSimpleIcon } from '@phosphor-icons/react';
import { exportQcmJson, exportQcmCsv } from '@/lib/qcmExport';
import type { Qcm, Topic } from '@/types';

interface QcmListProps {
  qcms: Qcm[];
  onDelete?: (id: string) => void;
  onStart?: (qcm: Qcm) => void;
  onStartExam?: (qcm: Qcm) => void;
  showActions?: boolean;
  bestScores?: Record<string, number>;
  avgRatings?: Record<string, { avg: number; count: number }>;
}

export const QcmList: React.FC<QcmListProps> = ({
  qcms,
  onDelete,
  onStart,
  onStartExam,
  showActions = false,
  bestScores = {},
  avgRatings = {},
}) => {
  const { t, i18n } = useTranslation();
  const [openExport, setOpenExport] = useState<string | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setOpenExport(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

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
          {avgRatings[qcm.id] && (
            <div className="flex items-center gap-2">
              <StarRating value={Math.round(avgRatings[qcm.id].avg)} size={14} />
              <span className="text-xs font-bold opacity-60">
                {avgRatings[qcm.id].avg}/5 ({avgRatings[qcm.id].count})
              </span>
            </div>
          )}
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
            {onStartExam && (
              <Button variant="ghost" size="sm" onClick={() => onStartExam(qcm)}>
                {t('practice.examMode')}
              </Button>
            )}
            {showActions && (
              <>
                <Link href={`/contributor/qcm/${qcm.id}/edit`}>
                  <button
                    title={t('common.edit')}
                    className="p-1.5 border-2 border-black hover:bg-black hover:text-white transition-colors"
                  >
                    <PencilSimpleIcon size={15} weight="bold" />
                  </button>
                </Link>
                {onDelete && (
                  <button
                    title={t('common.delete')}
                    className="p-1.5 border-2 border-black hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
                    style={{ height: 'fit-content' }}
                    onClick={() => onDelete(qcm.id)}
                  >
                    <TrashIcon size={15} weight="bold" />
                  </button>
                )}
                <div className="relative" ref={openExport === qcm.id ? exportRef : undefined}>
                  <button
                    title={t('common.export')}
                    className="p-1.5 border-2 border-black hover:bg-[var(--memphis-blue)] hover:text-white hover:border-[var(--memphis-blue)] transition-colors"
                    onClick={() => setOpenExport(openExport === qcm.id ? null : qcm.id)}
                  >
                    <DownloadSimpleIcon size={15} weight="bold" />
                  </button>
                  {openExport === qcm.id && (
                    <div className="absolute right-0 top-full mt-1 bg-white border-2 border-black z-10 min-w-[120px]">
                      <button
                        className="w-full text-left px-3 py-2 text-sm font-black hover:bg-[var(--memphis-yellow)] border-b-2 border-black"
                        onClick={() => { exportQcmJson(qcm); setOpenExport(null); }}
                      >
                        {t('common.exportJson')}
                      </button>
                      <button
                        className="w-full text-left px-3 py-2 text-sm font-black hover:bg-[var(--memphis-yellow)]"
                        onClick={() => { exportQcmCsv(qcm); setOpenExport(null); }}
                      >
                        {t('common.exportCsv')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

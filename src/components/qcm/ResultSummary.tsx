'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { resolveText } from '@/lib/localizedText';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { CheckIcon, XIcon } from '@phosphor-icons/react';
import type { Question } from '@/types';
import { isAnswerCorrect } from '@/lib/questionHelpers';

interface ResultSummaryProps {
  questions: Question[];
  answers: Record<string, string[]>;
  onRetry: () => void;
  backHref?: string;
  onBack?: () => void;
  onComplete?: (percentage: number) => void;
  /** Only defined for single-QCM sessions — enables star rating */
  qcmId?: string;
  userRating?: number;
  onRate?: (rating: number) => void;
  onRetryExam?: () => void;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({
  questions,
  answers,
  onRetry,
  backHref = '/practice',
  onBack,
  onComplete,
  qcmId,
  userRating = 0,
  onRate,
  onRetryExam,
}) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const completedRef = useRef(false);

  const correct = questions.filter(q => isAnswerCorrect(q, answers[q.id] ?? [])).length;
  const total = questions.length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  useEffect(() => {
    if (!completedRef.current && onComplete) {
      completedRef.current = true;
      onComplete(percentage);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scoreColor =
    percentage >= 80 ? 'text-green-700' :
    percentage >= 50 ? 'text-[var(--memphis-blue)]' :
    'text-[var(--memphis-red)]';

  return (
    <Card className="max-w-lg mx-auto text-center">
      <h1 className="memphis-heading text-3xl mb-2">{t('practice.score')}</h1>
      <div className={`memphis-heading text-6xl my-6 ${scoreColor}`}>
        {percentage}%
      </div>
      <p className="font-bold text-lg mb-4">
        {correct} / {total}
      </p>

      {/* Star rating — only for single-QCM sessions */}
      {qcmId && (
        <div className="flex flex-col items-center gap-2 mb-8 p-3 border-2 border-black bg-white">
          <p className="font-black text-sm uppercase tracking-wide">{t('practice.rateQcm')}</p>
          <StarRating value={userRating} onChange={onRate} size={28} />
          {userRating > 0 && (
            <p className="text-xs font-bold opacity-60">{t('practice.yourRating')} : {userRating}/5</p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-4 mb-6">
        {questions.map((q, i) => {
          const isCorrect = isAnswerCorrect(q, answers[q.id] ?? []);
          return (
            <div
              key={q.id}
              className={`text-left p-3 border-2 border-black font-bold text-sm ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}
            >
              <span className="mr-2 inline-flex">{isCorrect
                ? <CheckIcon size={16} weight="bold" className="text-green-700" />
                : <XIcon size={16} weight="bold" className="text-[var(--memphis-red)]" />
              }</span>
              {i + 1}. {resolveText(q.text, i18n.language)}
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 justify-center flex-wrap">
        <Button variant="primary" onClick={onRetry}>
          {t('practice.retry')}
        </Button>
        {onRetryExam && (
          <Button variant="secondary" onClick={onRetryExam}>
            {t('practice.retryExam')}
          </Button>
        )}
        <Button
          variant="ghost"
          onClick={() => {
            onBack?.();
            router.push(backHref);
          }}
        >
          {t('practice.backToTopics')}
        </Button>
      </div>
    </Card>
  );
};

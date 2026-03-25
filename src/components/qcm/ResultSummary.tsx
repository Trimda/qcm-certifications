'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { Question } from '@/types';

interface ResultSummaryProps {
  questions: Question[];
  answers: Record<string, string>;
  onRetry: () => void;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({
  questions,
  answers,
  onRetry,
}) => {
  const { t } = useTranslation();

  const correct = questions.filter(q => answers[q.id] === q.correctAnswer).length;
  const total = questions.length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

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
      <p className="font-bold text-lg mb-8">
        {correct} / {total}
      </p>

      <div className="flex flex-col gap-4 mb-6">
        {questions.map((q, i) => {
          const isCorrect = answers[q.id] === q.correctAnswer;
          return (
            <div
              key={q.id}
              className={`text-left p-3 border-2 border-black font-bold text-sm ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}
            >
              <span className="mr-2">{isCorrect ? '✓' : '✗'}</span>
              {i + 1}. {q.text}
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 justify-center flex-wrap">
        <Button variant="primary" onClick={onRetry}>
          {t('practice.retry')}
        </Button>
        <Link href="/practice">
          <Button variant="ghost">
            {t('practice.backToTopics')}
          </Button>
        </Link>
      </div>
    </Card>
  );
};

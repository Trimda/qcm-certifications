'use client';

import React, { useEffect } from 'react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { QuestionCard } from '@/components/qcm/QuestionCard';
import { ResultSummary } from '@/components/qcm/ResultSummary';
import { QcmList } from '@/components/qcm/QcmList';
import { useQcm } from '@/hooks/useQcm';
import { useTranslation } from '@/hooks/useTranslation';
import type { Qcm } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function MixedPracticePage() {
  const { t } = useTranslation();
  const { qcms, session, loadQcms, startSession, submitAnswer, nextQuestion, finishSession, resetSession } = useQcm();

  useEffect(() => {
    void loadQcms(); // Load all topics
  }, [loadQcms]);

  const handleStart = (qcm: Qcm) => {
    startSession([qcm]);
  };

  if (session) {
    if (session.isFinished) {
      return (
        <div className="max-w-3xl mx-auto px-4 py-12">
          <ResultSummary
            questions={session.questions}
            answers={session.answers}
            onRetry={() => { resetSession(); }}
          />
        </div>
      );
    }

    const currentQuestion = session.questions[session.currentIndex];
    const isLast = session.currentIndex === session.questions.length - 1;

    return (
      <RoleGuard allowedRoles={['user', 'contributor', 'admin']}>
        <div className="max-w-3xl mx-auto px-4 py-12">
          <QuestionCard
            question={currentQuestion}
            questionNumber={session.currentIndex + 1}
            totalQuestions={session.questions.length}
            isLast={isLast}
            onAnswer={(optionId: string) => submitAnswer(currentQuestion.id, optionId)}
            onNext={() => {
              if (isLast) finishSession();
              else nextQuestion();
            }}
          />
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={['user', 'contributor', 'admin']}>
      <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <h1 className="memphis-heading text-3xl flex-1">{t('practice.mixed')}</h1>
          <Link href="/practice">
            <Button variant="ghost">{t('practice.backToTopics')}</Button>
          </Link>
        </div>
        <p className="font-bold">{t('practice.mixedDesc')}</p>
        <QcmList qcms={qcms} onStart={handleStart} />
      </div>
    </RoleGuard>
  );
}

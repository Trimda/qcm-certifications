'use client';

import React, { useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { QuestionCard } from '@/components/qcm/QuestionCard';
import { ResultSummary } from '@/components/qcm/ResultSummary';
import { QcmList } from '@/components/qcm/QcmList';
import { useQcm } from '@/hooks/useQcm';
import { useTranslation } from '@/hooks/useTranslation';
import { useBestScores } from '@/hooks/useBestScores';
import { ShuffleIcon } from '@phosphor-icons/react';
import type { Qcm, Topic } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const MIXED_MAX = 40;

export default function TopicPracticePage() {
  const params = useParams();
  const topic = params.topic as Topic;
  const { t } = useTranslation();
  const { qcms, session, loadQcms, startSession, submitAnswer, nextQuestion, finishSession, resetSession } = useQcm();
  const { scores, updateBestScore } = useBestScores();

  // Track which QCM or session was launched so we can retry/save score
  const activeQcmRef = useRef<{ qcms: Qcm[]; max?: number } | null>(null);

  useEffect(() => {
    void loadQcms(topic);
  }, [topic, loadQcms]);

  const handleStart = (qcm: Qcm) => {
    activeQcmRef.current = { qcms: [qcm] };
    startSession([qcm]);
  };

  const handleMixed = () => {
    activeQcmRef.current = { qcms, max: MIXED_MAX };
    startSession(qcms, MIXED_MAX);
  };

  const handleRetry = () => {
    const prev = activeQcmRef.current;
    if (!prev) return;
    resetSession();
    startSession(prev.qcms, prev.max);
  };

  const handleComplete = (percentage: number) => {
    // Only track score for single-QCM sessions
    const prev = activeQcmRef.current;
    if (prev && prev.qcms.length === 1 && !prev.max) {
      updateBestScore(prev.qcms[0].id, percentage, scores);
    }
  };

  if (session) {
    if (session.isFinished) {
      return (
        <RoleGuard allowedRoles={['user', 'contributor', 'admin']}>
          <div className="max-w-3xl mx-auto px-4 py-12">
            <ResultSummary
              questions={session.questions}
              answers={session.answers}
              onRetry={handleRetry}
              backHref={`/practice/${topic}`}
              onBack={resetSession}
              onComplete={handleComplete}
            />
          </div>
        </RoleGuard>
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
            onAnswer={(optionId) => submitAnswer(currentQuestion.id, optionId)}
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
          <h1 className="memphis-heading text-3xl capitalize flex-1">{topic}</h1>
          <Link href="/practice">
            <Button variant="ghost">{t('practice.backToTopics')}</Button>
          </Link>
        </div>
        {qcms.length > 0 && (
          <div className="flex items-center justify-between p-4 border-2 border-black bg-white">
            <div>
              <p className="font-black text-sm uppercase tracking-wide">{t('practice.mixed')}</p>
              <p className="text-sm font-bold opacity-70">{t('practice.mixedTopicDesc', { max: MIXED_MAX })}</p>
            </div>
            <Button variant="secondary" onClick={handleMixed}>
              <ShuffleIcon size={16} weight="bold" className="inline mr-2" />
              {t('practice.startMixed')}
            </Button>
          </div>
        )}
        <QcmList qcms={qcms} onStart={handleStart} bestScores={scores} />
      </div>
    </RoleGuard>
  );
}

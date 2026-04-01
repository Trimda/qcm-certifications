'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { QuestionCard } from '@/components/qcm/QuestionCard';
import { ResultSummary } from '@/components/qcm/ResultSummary';
import { QcmList } from '@/components/qcm/QcmList';
import { Modal } from '@/components/ui/Modal';
import { useQcm } from '@/hooks/useQcm';
import { useTranslation } from '@/hooks/useTranslation';
import { useBestScores } from '@/hooks/useBestScores';
import { ShuffleIcon, BookOpenIcon } from '@phosphor-icons/react';
import type { Qcm, Topic } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const MIXED_MAX = 40;

export default function TopicPracticePage() {
  const params = useParams();
  const topic = params.topic as Topic;
  const { t } = useTranslation();
  const {
    qcms, session, loadQcms, startSession, submitAnswer,
    nextQuestion, previousQuestion, goToQuestion, finishSession, resetSession,
  } = useQcm();
  const { scores, userRatings, updateBestScore, submitRating } = useBestScores();
  const [avgRatings, setAvgRatings] = useState<Record<string, { avg: number; count: number }>>({});
  const [showExamConfirm, setShowExamConfirm] = useState(false);
  const [examUnansweredCount, setExamUnansweredCount] = useState(0);

  const activeQcmRef = useRef<{ qcms: Qcm[]; max?: number; examMode?: boolean } | null>(null);

  useEffect(() => {
    void loadQcms(topic);
    fetch('/api/ratings')
      .then(r => (r.ok ? r.json() : Promise.resolve({})))
      .then(data => setAvgRatings(data as Record<string, { avg: number; count: number }>))
      .catch(() => { /* silent */ });
  }, [topic, loadQcms]);

  const handleStart = (qcm: Qcm) => {
    activeQcmRef.current = { qcms: [qcm] };
    startSession([qcm]);
  };

  const handleStartExam = (qcm: Qcm) => {
    activeQcmRef.current = { qcms: [qcm], examMode: true };
    startSession([qcm], undefined, true);
  };

  const handleMixed = () => {
    activeQcmRef.current = { qcms, max: MIXED_MAX };
    startSession(qcms, MIXED_MAX);
  };

  const handleMixedExam = () => {
    activeQcmRef.current = { qcms, max: MIXED_MAX, examMode: true };
    startSession(qcms, MIXED_MAX, true);
  };

  const handleRetry = () => {
    const prev = activeQcmRef.current;
    if (!prev) return;
    resetSession();
    startSession(prev.qcms, prev.max);
  };

  const handleRetryExam = () => {
    const prev = activeQcmRef.current;
    if (!prev) return;
    resetSession();
    startSession(prev.qcms, prev.max, true);
  };

  const handleComplete = (percentage: number) => {
    const prev = activeQcmRef.current;
    if (prev && prev.qcms.length === 1 && !prev.max) {
      void updateBestScore(prev.qcms[0].id, percentage, scores);
    }
  };

  const handleExamValidate = () => {
    if (!session) return;
    const unanswered = session.questions.filter(
      q => !session.answers[q.id] || session.answers[q.id].length === 0
    );
    if (unanswered.length > 0) {
      setExamUnansweredCount(unanswered.length);
      setShowExamConfirm(true);
    } else {
      finishSession();
    }
  };

  const activeSingleQcmId =
    activeQcmRef.current?.qcms.length === 1 && !activeQcmRef.current?.max
      ? activeQcmRef.current.qcms[0].id
      : undefined;

  if (session) {
    if (session.isFinished) {
      return (
        <RoleGuard allowedRoles={['user', 'contributor', 'admin']}>
          <div className="max-w-3xl mx-auto px-4 py-12">
            <ResultSummary
              questions={session.questions}
              answers={session.answers}
              onRetry={handleRetry}
              onRetryExam={handleRetryExam}
              backHref={`/practice/${topic}`}
              onBack={resetSession}
              onComplete={handleComplete}
              qcmId={activeSingleQcmId}
              userRating={activeSingleQcmId ? (userRatings[activeSingleQcmId] ?? 0) : 0}
              onRate={activeSingleQcmId
                ? (r) => { void submitRating(activeSingleQcmId, r); }
                : undefined}
            />
          </div>
        </RoleGuard>
      );
    }

    const currentQuestion = session.questions[session.currentIndex];
    const isLast = session.currentIndex === session.questions.length - 1;
    const questionIds = session.questions.map(q => q.id);

    return (
      <RoleGuard allowedRoles={['user', 'contributor', 'admin']}>
        <div className="max-w-3xl mx-auto px-4 py-12">
          <QuestionCard
            key={session.currentIndex}
            question={currentQuestion}
            questionNumber={session.currentIndex + 1}
            totalQuestions={session.questions.length}
            isLast={isLast}
            onAnswer={(optionIds) => submitAnswer(currentQuestion.id, optionIds)}
            onNext={session.examMode
              ? (isLast ? handleExamValidate : nextQuestion)
              : (isLast ? finishSession : nextQuestion)}
            examMode={session.examMode}
            onPrevious={session.examMode && session.currentIndex > 0 ? previousQuestion : undefined}
            onGoTo={session.examMode ? goToQuestion : undefined}
            initialAnswer={session.answers[currentQuestion.id] ?? []}
            answers={session.examMode ? session.answers : undefined}
            questionIds={session.examMode ? questionIds : undefined}
          />

          <Modal
            isOpen={showExamConfirm}
            onClose={() => setShowExamConfirm(false)}
            title={t('practice.examConfirmTitle')}
            footer={
              <>
                <Button variant="ghost" onClick={() => setShowExamConfirm(false)}>
                  {t('practice.examConfirmCancel')}
                </Button>
                <Button
                  variant="primary"
                  onClick={() => { setShowExamConfirm(false); finishSession(); }}
                >
                  {t('practice.examConfirmYes')}
                </Button>
              </>
            }
          >
            <p className="font-bold">
              {t('practice.examConfirmBody', { count: examUnansweredCount })}
            </p>
          </Modal>
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
            <div className="flex gap-2 flex-wrap">
              <Button variant="secondary" onClick={handleMixed}>
                <ShuffleIcon size={16} weight="bold" className="inline mr-2" />
                {t('practice.startMixed')}
              </Button>
              <Button variant="ghost" onClick={handleMixedExam}>
                <BookOpenIcon size={16} weight="bold" className="inline mr-2" />
                {t('practice.startMixedExam')}
              </Button>
            </div>
          </div>
        )}
        <QcmList
          qcms={qcms}
          onStart={handleStart}
          onStartExam={handleStartExam}
          bestScores={scores}
          avgRatings={avgRatings}
        />
      </div>
    </RoleGuard>
  );
}

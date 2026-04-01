'use client';

import React, { useEffect, useRef, useState } from 'react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { QuestionCard } from '@/components/qcm/QuestionCard';
import { ResultSummary } from '@/components/qcm/ResultSummary';
import { QcmList } from '@/components/qcm/QcmList';
import { Modal } from '@/components/ui/Modal';
import { useQcm } from '@/hooks/useQcm';
import { useTranslation } from '@/hooks/useTranslation';
import type { Qcm } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function MixedPracticePage() {
  const { t } = useTranslation();
  const {
    qcms, session, loadQcms, startSession, submitAnswer,
    nextQuestion, previousQuestion, goToQuestion, finishSession, resetSession,
  } = useQcm();
  const [showExamConfirm, setShowExamConfirm] = useState(false);
  const [examUnansweredCount, setExamUnansweredCount] = useState(0);

  const activeQcmRef = useRef<{ qcms: Qcm[]; examMode?: boolean } | null>(null);

  useEffect(() => {
    void loadQcms();
  }, [loadQcms]);

  const handleStart = (qcm: Qcm) => {
    activeQcmRef.current = { qcms: [qcm] };
    startSession([qcm]);
  };

  const handleStartExam = (qcm: Qcm) => {
    activeQcmRef.current = { qcms: [qcm], examMode: true };
    startSession([qcm], undefined, true);
  };

  const handleRetry = () => {
    const prev = activeQcmRef.current;
    if (!prev) return;
    resetSession();
    startSession(prev.qcms);
  };

  const handleRetryExam = () => {
    const prev = activeQcmRef.current;
    if (!prev) return;
    resetSession();
    startSession(prev.qcms, undefined, true);
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
              backHref="/practice"
              onBack={resetSession}
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
            onAnswer={(optionIds: string[]) => submitAnswer(currentQuestion.id, optionIds)}
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
          <h1 className="memphis-heading text-3xl flex-1">{t('practice.mixed')}</h1>
          <Link href="/practice">
            <Button variant="ghost">{t('practice.backToTopics')}</Button>
          </Link>
        </div>
        <p className="font-bold">{t('practice.mixedDesc')}</p>
        <QcmList qcms={qcms} onStart={handleStart} onStartExam={handleStartExam} />
      </div>
    </RoleGuard>
  );
}

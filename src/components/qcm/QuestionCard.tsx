'use client';

import React, { useState } from 'react';
import type { Question } from '@/types';
import { AnswerOption } from './AnswerOption';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useTranslation } from '@/hooks/useTranslation';
import { resolveText } from '@/lib/localizedText';
import { getCorrectAnswers, isAnswerCorrect } from '@/lib/questionHelpers';
import { BookOpenIcon } from '@phosphor-icons/react';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  isLast?: boolean;
  onAnswer: (optionIds: string[]) => void;
  onNext: () => void;
  /** Exam mode — free navigation, deferred validation */
  examMode?: boolean;
  onPrevious?: () => void;
  onGoTo?: (index: number) => void;
  initialAnswer?: string[];
  answers?: Record<string, string[]>;
  questionIds?: string[];
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  isLast = false,
  onAnswer,
  onNext,
  examMode = false,
  onPrevious,
  onGoTo,
  initialAnswer = [],
  answers,
  questionIds,
}) => {
  const { t, i18n } = useTranslation();
  const [selectedOptions, setSelectedOptions] = useState<string[]>(initialAnswer);
  const [submitted, setSubmitted] = useState(false);

  const isMultiple = question.isMultiple === true;
  const questionText = resolveText(question.text, i18n.language);
  const correctAnswers = getCorrectAnswers(question);

  const handleSelect = (optionId: string) => {
    if (!examMode && submitted) return;
    let newOptions: string[];
    if (isMultiple) {
      newOptions = selectedOptions.includes(optionId)
        ? selectedOptions.filter(id => id !== optionId)
        : [...selectedOptions, optionId];
    } else {
      newOptions = [optionId];
    }
    setSelectedOptions(newOptions);
    // In exam mode, auto-save on every selection change
    if (examMode) {
      onAnswer(newOptions);
    }
  };

  const handleSubmit = () => {
    if (selectedOptions.length === 0 || submitted) return;
    setSubmitted(true);
    onAnswer(selectedOptions);
  };

  const handleNext = () => {
    setSelectedOptions([]);
    setSubmitted(false);
    onNext();
  };

  const getOptionState = (optionId: string) => {
    // Exam mode — only show selected state, never reveal correct/wrong
    if (examMode) {
      return selectedOptions.includes(optionId) ? 'selected' : 'default';
    }
    if (!submitted) {
      return selectedOptions.includes(optionId) ? 'selected' : 'default';
    }
    const isCorrectOption = correctAnswers.includes(optionId);
    const wasSelected = selectedOptions.includes(optionId);
    if (isCorrectOption) return 'correct';
    if (wasSelected) return 'wrong';
    return 'default';
  };

  const answeredCorrectly = submitted && isAnswerCorrect(question, selectedOptions);

  return (
    <div className="memphis-card p-6 flex flex-col gap-5">
      {/* Progress bar — segmented + clickable in exam mode */}
      <ProgressBar
        current={questionNumber}
        total={totalQuestions}
        questionIds={examMode ? questionIds : undefined}
        answers={examMode ? answers : undefined}
        onGoTo={examMode && onGoTo ? onGoTo : undefined}
      />

      {/* Exam mode badge */}
      {examMode && (
        <div className="flex items-center gap-2 self-start px-2 py-1 bg-black text-white text-xs font-black uppercase tracking-wider">
          <BookOpenIcon size={12} weight="bold" />
          {t('practice.examModeActive')}
        </div>
      )}

      <p className="text-xs font-black uppercase tracking-wider opacity-60">
        {t('practice.question')} {questionNumber} {t('practice.of')} {totalQuestions}
      </p>

      <h2 className="memphis-heading text-xl">{questionText}</h2>

      <p className="text-sm font-bold opacity-70 -mt-2">
        {isMultiple ? t('practice.selectMultipleAnswers') : t('practice.selectOneAnswer')}
      </p>

      <div className="flex flex-col gap-3">
        {question.options.map(option => (
          <AnswerOption
            key={option.id}
            option={option}
            state={getOptionState(option.id)}
            disabled={!examMode && submitted}
            onClick={handleSelect}
            inputType={isMultiple ? 'checkbox' : 'radio'}
          />
        ))}
      </div>

      {/* Feedback — normal mode only */}
      {!examMode && submitted && (
        <p className={`font-black text-sm ${answeredCorrectly ? 'text-green-700' : 'text-[var(--memphis-red)]'}`}>
          {answeredCorrectly ? t('practice.correct') : t('practice.wrong')}
        </p>
      )}

      {/* Action buttons */}
      {examMode ? (
        <div className="flex gap-3 flex-wrap">
          {onPrevious && (
            <Button variant="ghost" onClick={onPrevious}>
              {t('practice.previousQuestion')}
            </Button>
          )}
          <Button variant={isLast ? 'primary' : 'secondary'} onClick={onNext}>
            {isLast ? t('practice.validateExam') : t('practice.nextQuestion')}
          </Button>
        </div>
      ) : (
        <div className="flex gap-3">
          {!submitted ? (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={selectedOptions.length === 0}
            >
              {t('practice.submitAnswer')}
            </Button>
          ) : (
            <Button variant="secondary" onClick={handleNext}>
              {isLast ? t('practice.seeResults') : t('practice.nextQuestion')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
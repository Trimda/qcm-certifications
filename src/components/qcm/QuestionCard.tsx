'use client';

import React, { useState } from 'react';
import type { Question } from '@/types';
import { AnswerOption } from './AnswerOption';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useTranslation } from '@/hooks/useTranslation';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (optionId: string) => void;
  onNext: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onNext,
}) => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (optionId: string) => {
    if (submitted) return;
    setSelectedOption(optionId);
  };

  const handleSubmit = () => {
    if (!selectedOption || submitted) return;
    setSubmitted(true);
    onAnswer(selectedOption);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setSubmitted(false);
    onNext();
  };

  const getOptionState = (optionId: string) => {
    if (!submitted) {
      return selectedOption === optionId ? 'selected' : 'default';
    }
    if (optionId === question.correctAnswer) return 'correct';
    if (optionId === selectedOption) return 'wrong';
    return 'default';
  };

  return (
    <div className="memphis-card p-6 flex flex-col gap-5">
      <ProgressBar current={questionNumber} total={totalQuestions} />

      <p className="text-xs font-black uppercase tracking-wider opacity-60">
        {t('practice.question')} {questionNumber} {t('practice.of')} {totalQuestions}
      </p>

      <h2 className="memphis-heading text-xl">{question.text}</h2>

      <div className="flex flex-col gap-3">
        {question.options.map(option => (
          <AnswerOption
            key={option.id}
            option={option}
            state={getOptionState(option.id)}
            disabled={submitted}
            onClick={handleSelect}
          />
        ))}
      </div>

      {submitted && (
        <p className={`font-black text-sm ${selectedOption === question.correctAnswer ? 'text-green-700' : 'text-[var(--memphis-red)]'}`}>
          {selectedOption === question.correctAnswer ? t('practice.correct') : t('practice.wrong')}
        </p>
      )}

      <div className="flex gap-3">
        {!submitted ? (
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!selectedOption}
          >
            {t('practice.submitAnswer')}
          </Button>
        ) : (
          <Button variant="secondary" onClick={handleNext}>
            {t('practice.nextQuestion')}
          </Button>
        )}
      </div>
    </div>
  );
};

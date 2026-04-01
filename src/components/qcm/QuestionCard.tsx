'use client';

import React, { useState } from 'react';
import type { Question } from '@/types';
import { AnswerOption } from './AnswerOption';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useTranslation } from '@/hooks/useTranslation';
import { resolveText } from '@/lib/localizedText';
import { getCorrectAnswers, isAnswerCorrect } from '@/lib/questionHelpers';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  isLast?: boolean;
  onAnswer: (optionIds: string[]) => void;
  onNext: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  isLast = false,
  onAnswer,
  onNext,
}) => {
  const { t, i18n } = useTranslation();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const isMultiple = question.isMultiple === true;
  const questionText = resolveText(question.text, i18n.language);
  const correctAnswers = getCorrectAnswers(question);

  const handleSelect = (optionId: string) => {
    if (submitted) return;
    if (isMultiple) {
      setSelectedOptions(prev =>
        prev.includes(optionId) ? prev.filter(id => id !== optionId) : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
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
      <ProgressBar current={questionNumber} total={totalQuestions} />

      <p className="text-xs font-black uppercase tracking-wider opacity-60">
        {t('practice.question')} {questionNumber} {t('practice.of')} {totalQuestions}
      </p>

      <h2 className="memphis-heading text-xl">{questionText}</h2>

      {/* Instruction label */}
      <p className="text-sm font-bold opacity-70 -mt-2">
        {isMultiple ? t('practice.selectMultipleAnswers') : t('practice.selectOneAnswer')}
      </p>

      <div className="flex flex-col gap-3">
        {question.options.map(option => (
          <AnswerOption
            key={option.id}
            option={option}
            state={getOptionState(option.id)}
            disabled={submitted}
            onClick={handleSelect}
            inputType={isMultiple ? 'checkbox' : 'radio'}
          />
        ))}
      </div>

      {submitted && (
        <p className={`font-black text-sm ${answeredCorrectly ? 'text-green-700' : 'text-[var(--memphis-red)]'}`}>
          {answeredCorrectly ? t('practice.correct') : t('practice.wrong')}
        </p>
      )}

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
    </div>
  );
};

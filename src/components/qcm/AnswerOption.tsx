'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { resolveText } from '@/lib/localizedText';
import type { AnswerOption as AnswerOptionType } from '@/types';

interface AnswerOptionProps {
  option: AnswerOptionType;
  state: 'default' | 'selected' | 'correct' | 'wrong';
  disabled?: boolean;
  onClick: (optionId: string) => void;
  inputType?: 'radio' | 'checkbox';
}

export const AnswerOption: React.FC<AnswerOptionProps> = ({
  option,
  state,
  disabled = false,
  onClick,
  inputType = 'radio',
}) => {
  const { i18n } = useTranslation();

  const stateClass = {
    default: '',
    selected: 'memphis-answer-selected',
    correct: 'memphis-answer-correct',
    wrong: 'memphis-answer-wrong',
  }[state];

  const isFilled = state === 'selected' || state === 'correct' || state === 'wrong';

  return (
    <button
      className={`memphis-answer ${stateClass} flex items-center gap-3`}
      onClick={() => onClick(option.id)}
      disabled={disabled}
      type="button"
    >
      {/* Radio / Checkbox shape indicator */}
      <span
        className={`shrink-0 w-4 h-4 border-2 border-current flex items-center justify-center ${
          inputType === 'checkbox' ? 'rounded-none' : 'rounded-full'
        }`}
        aria-hidden="true"
      >
        {isFilled && (
          inputType === 'checkbox'
            ? <span className="w-2 h-2 bg-current block" />
            : <span className="w-2 h-2 bg-current rounded-full block" />
        )}
      </span>
      <span className="font-black uppercase">{option.id}.</span>
      {resolveText(option.text, i18n.language)}
    </button>
  );
};


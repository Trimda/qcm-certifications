'use client';

import React from 'react';
import type { AnswerOption as AnswerOptionType } from '@/types';

interface AnswerOptionProps {
  option: AnswerOptionType;
  state: 'default' | 'selected' | 'correct' | 'wrong';
  disabled?: boolean;
  onClick: (optionId: string) => void;
}

export const AnswerOption: React.FC<AnswerOptionProps> = ({
  option,
  state,
  disabled = false,
  onClick,
}) => {
  const stateClass = {
    default: '',
    selected: 'memphis-answer-selected',
    correct: 'memphis-answer-correct',
    wrong: 'memphis-answer-wrong',
  }[state];

  return (
    <button
      className={`memphis-answer ${stateClass}`}
      onClick={() => onClick(option.id)}
      disabled={disabled}
      type="button"
    >
      <span className="font-black mr-3 uppercase">{option.id}.</span>
      {option.text}
    </button>
  );
};

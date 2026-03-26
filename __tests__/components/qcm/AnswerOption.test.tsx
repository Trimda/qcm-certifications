import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AnswerOption } from '@/components/qcm/AnswerOption';
import type { AnswerOption as AnswerOptionType } from '@/types';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

const mockOption: AnswerOptionType = {
  id: 'a',
  text: { fr: 'Réponse test', en: 'Test answer' },
};

describe('AnswerOption', () => {
  it('renders the option text', () => {
    render(
      <AnswerOption
        option={mockOption}
        state="default"
        onClick={jest.fn()}
      />
    );
    expect(screen.getByText('Test answer')).toBeInTheDocument();
  });

  it('calls onClick with option id', () => {
    const handleClick = jest.fn();
    render(
      <AnswerOption
        option={mockOption}
        state="default"
        onClick={handleClick}
      />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledWith('a');
  });

  it('applies correct state when selected', () => {
    const { container } = render(
      <AnswerOption
        option={mockOption}
        state="selected"
        onClick={jest.fn()}
      />
    );
    expect(container.firstChild).toHaveClass('memphis-answer-selected');
  });

  it('is disabled when disabled prop is set', () => {
    render(
      <AnswerOption
        option={mockOption}
        state="default"
        disabled={true}
        onClick={jest.fn()}
      />
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });
});

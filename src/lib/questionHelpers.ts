import type { Question } from '@/types';

/** Normalize correctAnswer (string or string[]) to a sorted string[] */
export const getCorrectAnswers = (question: Question): string[] => {
  if (Array.isArray(question.correctAnswer)) {
    return [...question.correctAnswer].sort();
  }
  return [question.correctAnswer];
};

/**
 * Check if the user's selected options exactly match all correct answers.
 * All correct answers must be selected, and no extra options.
 */
export const isAnswerCorrect = (question: Question, selected: string[]): boolean => {
  const correct = getCorrectAnswers(question);
  const sortedSelected = [...selected].sort();
  if (correct.length !== sortedSelected.length) return false;
  return correct.every((id, i) => id === sortedSelected[i]);
};

'use client';

import React, { createContext, useState, useCallback } from 'react';
import type { Qcm, Topic, Question } from '@/types';
import { fetchQcms, fetchQcmById, createQcm, updateQcm, deleteQcm } from '@/services/qcmService';

interface PracticeSession {
  qcms: Qcm[];
  questions: Question[];
  currentIndex: number;
  answers: Record<string, string>; // questionId -> selectedOptionId
  isFinished: boolean;
}

interface QcmContextValue {
  qcms: Qcm[];
  isLoading: boolean;
  session: PracticeSession | null;
  loadQcms: (topic?: Topic) => Promise<void>;
  loadQcmById: (id: string) => Promise<Qcm>;
  createNewQcm: (qcm: Omit<Qcm, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Qcm>;
  editQcm: (id: string, updates: Partial<Qcm>) => Promise<Qcm>;
  removeQcm: (id: string) => Promise<void>;
  startSession: (qcms: Qcm[]) => void;
  submitAnswer: (questionId: string, optionId: string) => void;
  nextQuestion: () => void;
  finishSession: () => void;
  resetSession: () => void;
}

export const QcmContext = createContext<QcmContextValue | null>(null);

export const QcmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [qcms, setQcms] = useState<Qcm[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<PracticeSession | null>(null);

  const loadQcms = useCallback(async (topic?: Topic) => {
    setIsLoading(true);
    try {
      const data = await fetchQcms(topic);
      setQcms(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadQcmById = useCallback(async (id: string) => {
    return fetchQcmById(id);
  }, []);

  const createNewQcm = useCallback(async (qcm: Omit<Qcm, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await createQcm(qcm);
    setQcms(prev => [...prev, created]);
    return created;
  }, []);

  const editQcm = useCallback(async (id: string, updates: Partial<Qcm>) => {
    const updated = await updateQcm(id, updates);
    setQcms(prev => prev.map(q => q.id === id ? updated : q));
    return updated;
  }, []);

  const removeQcm = useCallback(async (id: string) => {
    await deleteQcm(id);
    setQcms(prev => prev.filter(q => q.id !== id));
  }, []);

  const startSession = useCallback((selectedQcms: Qcm[]) => {
    const allQuestions = selectedQcms.flatMap(q => q.questions);
    // Shuffle questions
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    setSession({
      qcms: selectedQcms,
      questions: shuffled,
      currentIndex: 0,
      answers: {},
      isFinished: false,
    });
  }, []);

  const submitAnswer = useCallback((questionId: string, optionId: string) => {
    setSession(prev => {
      if (!prev) return prev;
      return { ...prev, answers: { ...prev.answers, [questionId]: optionId } };
    });
  }, []);

  const nextQuestion = useCallback(() => {
    setSession(prev => {
      if (!prev) return prev;
      const nextIndex = prev.currentIndex + 1;
      if (nextIndex >= prev.questions.length) {
        return { ...prev, isFinished: true };
      }
      return { ...prev, currentIndex: nextIndex };
    });
  }, []);

  const finishSession = useCallback(() => {
    setSession(prev => prev ? { ...prev, isFinished: true } : prev);
  }, []);

  const resetSession = useCallback(() => {
    setSession(null);
  }, []);

  return (
    <QcmContext.Provider value={{
      qcms, isLoading, session,
      loadQcms, loadQcmById, createNewQcm, editQcm, removeQcm,
      startSession, submitAnswer, nextQuestion, finishSession, resetSession,
    }}>
      {children}
    </QcmContext.Provider>
  );
};

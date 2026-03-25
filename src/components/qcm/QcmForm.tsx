'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import { useQcm } from '@/hooks/useQcm';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { generateId } from '@/lib/auth';
import type { Qcm, Question, AnswerOption, Topic } from '@/types';

interface QcmFormProps {
  initialQcm?: Qcm;
  mode: 'create' | 'edit';
}

const emptyQuestion = (): Question => ({
  id: generateId('q'),
  text: '',
  options: [
    { id: 'a', text: '' },
    { id: 'b', text: '' },
    { id: 'c', text: '' },
    { id: 'd', text: '' },
  ],
  correctAnswer: 'a',
});

export const QcmForm: React.FC<QcmFormProps> = ({ initialQcm, mode }) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { createNewQcm, editQcm } = useQcm();
  const router = useRouter();

  const [title, setTitle] = useState(initialQcm?.title ?? '');
  const [description, setDescription] = useState(initialQcm?.description ?? '');
  const [topic, setTopic] = useState<Topic>(initialQcm?.topic ?? 'scrum');
  const [questions, setQuestions] = useState<Question[]>(initialQcm?.questions ?? [emptyQuestion()]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const addQuestion = () => {
    setQuestions(prev => [...prev, emptyQuestion()]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof Question, value: string) => {
    setQuestions(prev => prev.map((q, i) => i === index ? { ...q, [field]: value } : q));
  };

  const updateOption = (qIndex: number, optionId: string, text: string) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i !== qIndex) return q;
      return {
        ...q,
        options: q.options.map((opt: AnswerOption) =>
          opt.id === optionId ? { ...opt, text } : opt
        ),
      };
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'create') {
        await createNewQcm({
          title,
          description,
          topic,
          questions,
          createdBy: currentUser.id,
        });
      } else if (initialQcm) {
        await editQcm(initialQcm.id, { title, description, topic, questions });
      }
      router.push('/admin/qcms');
    } catch {
      setError(t('contributor.saveError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => { void handleSubmit(e); }} className="flex flex-col gap-6 max-w-3xl mx-auto">
      <h1 className="memphis-heading text-3xl">
        {mode === 'create' ? t('contributor.createQcm') : t('contributor.editQcm')}
      </h1>

      <Card>
        <div className="flex flex-col gap-4">
          <Input
            id="title"
            label={t('contributor.titleLabel')}
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <Input
            id="description"
            label={t('contributor.descriptionLabel')}
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
          <div className="flex flex-col gap-1">
            <label htmlFor="topic" className="font-black text-sm uppercase tracking-wide">
              {t('contributor.topicLabel')}
            </label>
            <select
              id="topic"
              value={topic}
              onChange={e => setTopic(e.target.value as Topic)}
              className="memphis-input"
            >
              <option value="scrum">SCRUM</option>
              <option value="devops">DevOps</option>
              <option value="safe">SAFe</option>
            </select>
          </div>
        </div>
      </Card>

      {questions.map((question, qIndex) => (
        <Card key={question.id}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="memphis-heading text-lg">
                {t('contributor.questionText')} {qIndex + 1}
              </h3>
              {questions.length > 1 && (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => removeQuestion(qIndex)}
                >
                  {t('contributor.deleteQuestion')}
                </Button>
              )}
            </div>
            <Input
              id={`q-${qIndex}-text`}
              label={t('contributor.questionText')}
              value={question.text}
              onChange={e => updateQuestion(qIndex, 'text', e.target.value)}
              required
            />
            {question.options.map((opt: AnswerOption) => (
              <Input
                key={opt.id}
                id={`q-${qIndex}-opt-${opt.id}`}
                label={`${t('contributor.optionText')} ${opt.id.toUpperCase()}`}
                value={opt.text}
                onChange={e => updateOption(qIndex, opt.id, e.target.value)}
                required
              />
            ))}
            <div className="flex flex-col gap-1">
              <label htmlFor={`q-${qIndex}-correct`} className="font-black text-sm uppercase tracking-wide">
                {t('contributor.correctAnswer')}
              </label>
              <select
                id={`q-${qIndex}-correct`}
                value={question.correctAnswer}
                onChange={e => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                className="memphis-input"
              >
                {question.options.map((opt: AnswerOption) => (
                  <option key={opt.id} value={opt.id}>{opt.id.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>
      ))}

      <Button type="button" variant="ghost" onClick={addQuestion}>
        + {t('contributor.addQuestion')}
      </Button>

      {error && <p className="text-[var(--memphis-red)] font-bold">{error}</p>}

      <Button type="submit" variant="primary" size="lg" disabled={isLoading}>
        {isLoading ? t('common.loading') : t('contributor.saveButton')}
      </Button>
    </form>
  );
};

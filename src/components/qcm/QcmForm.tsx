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
import type { Qcm, Question, AnswerOption, Topic, LocalizedText } from '@/types';

type LangMode = 'fr' | 'en' | 'both';

interface QcmFormProps {
  initialQcm?: Qcm;
  mode: 'create' | 'edit';
}

const emptyLocalizedText = (): LocalizedText => ({ fr: '', en: '' });

const emptyQuestion = (): Question => ({
  id: generateId('q'),
  text: emptyLocalizedText(),
  options: [
    { id: 'a', text: emptyLocalizedText() },
    { id: 'b', text: emptyLocalizedText() },
    { id: 'c', text: emptyLocalizedText() },
    { id: 'd', text: emptyLocalizedText() },
  ],
  correctAnswer: 'a',
});

const detectLangMode = (qcm?: Qcm): LangMode => {
  if (!qcm) return 'fr';
  const hasFr = !!qcm.title.fr;
  const hasEn = !!qcm.title.en;
  if (hasFr && hasEn) return 'both';
  if (hasEn) return 'en';
  return 'fr';
};

export const QcmForm: React.FC<QcmFormProps> = ({ initialQcm, mode }) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { createNewQcm, editQcm } = useQcm();
  const router = useRouter();

  const [langMode, setLangMode] = useState<LangMode>(detectLangMode(initialQcm));
  const [title, setTitle] = useState<LocalizedText>(initialQcm?.title ?? emptyLocalizedText());
  const [description, setDescription] = useState<LocalizedText>(initialQcm?.description ?? emptyLocalizedText());
  const [topic, setTopic] = useState<Topic>(initialQcm?.topic ?? 'scrum');
  const [isPrivate, setIsPrivate] = useState<boolean>(initialQcm?.isPrivate ?? false);
  const [questions, setQuestions] = useState<Question[]>(initialQcm?.questions ?? [emptyQuestion()]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const showFr = langMode === 'fr' || langMode === 'both';
  const showEn = langMode === 'en' || langMode === 'both';

  const addQuestion = () => {
    setQuestions(prev => [...prev, emptyQuestion()]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuestionText = (index: number, lang: 'fr' | 'en', value: string) => {
    setQuestions(prev => prev.map((q, i) =>
      i === index ? { ...q, text: { ...q.text, [lang]: value } } : q
    ));
  };

  const updateCorrectAnswer = (index: number, value: string) => {
    setQuestions(prev => prev.map((q, i) =>
      i === index ? { ...q, correctAnswer: value } : q
    ));
  };

  const updateOption = (qIndex: number, optionId: string, lang: 'fr' | 'en', value: string) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i !== qIndex) return q;
      return {
        ...q,
        options: q.options.map((opt: AnswerOption) =>
          opt.id === optionId ? { ...opt, text: { ...opt.text, [lang]: value } } : opt
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
          isPrivate,
          questions,
          createdBy: currentUser.id,
        });
      } else if (initialQcm) {
        await editQcm(initialQcm.id, { title, description, topic, isPrivate, questions });
      }
      router.push('/my-qcms');
    } catch {
      setError(t('contributor.saveError'));
    } finally {
      setIsLoading(false);
    }
  };

  const langModes: { value: LangMode; label: string }[] = [
    { value: 'fr', label: t('contributor.langFrOnly') },
    { value: 'en', label: t('contributor.langEnOnly') },
    { value: 'both', label: t('contributor.langBoth') },
  ];

  return (
    <form onSubmit={(e) => { void handleSubmit(e); }} className="flex flex-col gap-6 max-w-3xl mx-auto">
      <h1 className="memphis-heading text-3xl">
        {mode === 'create' ? t('contributor.createQcm') : t('contributor.editQcm')}
      </h1>

      {/* Language mode selector */}
      <Card>
        <div className="flex flex-col gap-3">
          <p className="font-black text-sm uppercase tracking-wide">{t('contributor.langLabel')}</p>
          <div className="flex gap-2">
            {langModes.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setLangMode(value)}
                className={`px-4 py-2 font-black text-sm border-2 border-black transition-colors ${
                  langMode === value
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-4">
          {/* Title */}
          <div className={`grid gap-3 ${langMode === 'both' ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {showFr && (
              <Input
                id="title-fr"
                label={`${t('contributor.titleLabel')}${langMode === 'both' ? ' (FR)' : ''}`}
                value={title.fr}
                onChange={e => setTitle(prev => ({ ...prev, fr: e.target.value }))}
                required
              />
            )}
            {showEn && (
              <Input
                id="title-en"
                label={`${t('contributor.titleLabel')}${langMode === 'both' ? ' (EN)' : ''}`}
                value={title.en}
                onChange={e => setTitle(prev => ({ ...prev, en: e.target.value }))}
                required
              />
            )}
          </div>
          {/* Description */}
          <div className={`grid gap-3 ${langMode === 'both' ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {showFr && (
              <Input
                id="description-fr"
                label={`${t('contributor.descriptionLabel')}${langMode === 'both' ? ' (FR)' : ''}`}
                value={description.fr}
                onChange={e => setDescription(prev => ({ ...prev, fr: e.target.value }))}
                required
              />
            )}
            {showEn && (
              <Input
                id="description-en"
                label={`${t('contributor.descriptionLabel')}${langMode === 'both' ? ' (EN)' : ''}`}
                value={description.en}
                onChange={e => setDescription(prev => ({ ...prev, en: e.target.value }))}
                required
              />
            )}
          </div>
          {/* Topic */}
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
          {/* Visibility */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={e => setIsPrivate(e.target.checked)}
              className="w-4 h-4 border-2 border-black accent-black"
            />
            <span className="font-black text-sm">{t('contributor.isPrivateLabel')}</span>
          </label>
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
            {/* Question text */}
            <div className={`grid gap-3 ${langMode === 'both' ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {showFr && (
                <Input
                  id={`q-${qIndex}-text-fr`}
                  label={`${t('contributor.questionText')}${langMode === 'both' ? ' (FR)' : ''}`}
                  value={question.text.fr}
                  onChange={e => updateQuestionText(qIndex, 'fr', e.target.value)}
                  required
                />
              )}
              {showEn && (
                <Input
                  id={`q-${qIndex}-text-en`}
                  label={`${t('contributor.questionText')}${langMode === 'both' ? ' (EN)' : ''}`}
                  value={question.text.en}
                  onChange={e => updateQuestionText(qIndex, 'en', e.target.value)}
                  required
                />
              )}
            </div>
            {/* Options */}
            {question.options.map((opt: AnswerOption) => (
              <div key={opt.id} className={`grid gap-3 ${langMode === 'both' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {showFr && (
                  <Input
                    id={`q-${qIndex}-opt-${opt.id}-fr`}
                    label={`${t('contributor.optionText')} ${opt.id.toUpperCase()}${langMode === 'both' ? ' (FR)' : ''}`}
                    value={opt.text.fr}
                    onChange={e => updateOption(qIndex, opt.id, 'fr', e.target.value)}
                    required
                  />
                )}
                {showEn && (
                  <Input
                    id={`q-${qIndex}-opt-${opt.id}-en`}
                    label={`${t('contributor.optionText')} ${opt.id.toUpperCase()}${langMode === 'both' ? ' (EN)' : ''}`}
                    value={opt.text.en}
                    onChange={e => updateOption(qIndex, opt.id, 'en', e.target.value)}
                    required
                  />
                )}
              </div>
            ))}
            <div className="flex flex-col gap-1">
              <label htmlFor={`q-${qIndex}-correct`} className="font-black text-sm uppercase tracking-wide">
                {t('contributor.correctAnswer')}
              </label>
              <select
                id={`q-${qIndex}-correct`}
                value={question.correctAnswer}
                onChange={e => updateCorrectAnswer(qIndex, e.target.value)}
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

'use client';

import React from 'react';
import Link from 'next/link';
import { Trans } from 'react-i18next';
import {
  BookOpenIcon,
  TagIcon,
  FileArrowUpIcon,
  DownloadSimpleIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  StarIcon,
  UsersIcon,
  CheckSquareIcon,
  RadioButtonIcon,
  ShuffleIcon,
} from '@phosphor-icons/react';
import { useTranslation } from '@/hooks/useTranslation';

export default function AboutPage() {
  const { t } = useTranslation();

  const jsonExample = `[
  {
    "title": { "fr": "My QCM title (French)", "en": "My QCM title (English)" },
    "description": { "fr": "Short description (French).", "en": "Short description (English)." },
    "topic": "scrum",           // "scrum" | "devops" | "safe"
    "answerMode": "mixed",      // "single" | "multiple" | "mixed"
    "isPrivate": false,
    "questions": [
      {
        "text": { "fr": "Single-answer question (French)?", "en": "Single-answer question (English)?" },
        "options": [
          { "id": "a", "text": { "fr": "Option A", "en": "Option A" } },
          { "id": "b", "text": { "fr": "Option B", "en": "Option B" } },
          { "id": "c", "text": { "fr": "Option C", "en": "Option C" } },
          { "id": "d", "text": { "fr": "Option D", "en": "Option D" } }
        ],
        "correctAnswer": "b",   // string for single answer
        "isMultiple": false
      },
      {
        "text": { "fr": "Multiple-answer question (French)?", "en": "Multiple-answer question (English)?" },
        "options": [
          { "id": "a", "text": { "fr": "Option A", "en": "Option A" } },
          { "id": "b", "text": { "fr": "Option B", "en": "Option B" } },
          { "id": "c", "text": { "fr": "Option C", "en": "Option C" } },
          { "id": "d", "text": { "fr": "Option D", "en": "Option D" } }
        ],
        "correctAnswer": ["a", "c"], // string[] for multiple answers
        "isMultiple": true
      }
    ]
  }
]`;

  const csvExample = `title_fr,title_en,description_fr,description_en,topic,is_private,question_fr,question_en,option_a_fr,option_a_en,option_b_fr,option_b_en,option_c_fr,option_c_en,option_d_fr,option_d_en,correct_answer
My QCM (FR),My QCM (EN),Description (FR),Description (EN),scrum,false,Question 1 (FR)?,Question 1 (EN)?,A (FR),A (EN),B (FR),B (EN),C (FR),C (EN),D (FR),D (EN),b
My QCM (FR),My QCM (EN),Description (FR),Description (EN),scrum,false,Question 2 (FR)?,Question 2 (EN)?,A (FR),A (EN),B (FR),B (EN),C (FR),C (EN),D (FR),D (EN),a`;

  const validationRules = t('about.import.rules', { returnObjects: true }) as string[];

  const inlineCode = 'bg-gray-100 px-1 py-0.5 text-xs';
  const tx = { strong: <strong key="strong" />, code: <code key="code" className={inlineCode} /> };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-16">

      {/* ── Presentation ── */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <BookOpenIcon size={32} weight="bold" />
          <h1 className="memphis-heading text-3xl">{t('about.title')}</h1>
        </div>
        <p className="text-base leading-relaxed">
          <Trans i18nKey="about.intro" components={tx} />
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <StarIcon size={20} weight="bold" />, label: t('about.features.practice.label'), desc: t('about.features.practice.desc') },
            { icon: <UsersIcon size={20} weight="bold" />, label: t('about.features.contributor.label'), desc: t('about.features.contributor.desc') },
            { icon: <ShieldCheckIcon size={20} weight="bold" />, label: t('about.features.roles.label'), desc: t('about.features.roles.desc') },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="memphis-card flex flex-col gap-2 p-4">
              <div className="flex items-center gap-2 font-black">
                {icon}
                <span>{label}</span>
              </div>
              <p className="text-sm opacity-80">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Available topics ── */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <TagIcon size={28} weight="bold" />
          <h2 className="memphis-heading text-2xl">{t('about.themes.title')}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { topic: 'SCRUM', color: 'var(--memphis-yellow)', desc: t('about.themes.scrum') },
            { topic: 'DevOps', color: 'var(--memphis-blue)', desc: t('about.themes.devops') },
            { topic: 'SAFe', color: 'var(--memphis-pink)', desc: t('about.themes.safe') },
          ].map(({ topic, color, desc }) => (
            <div key={topic} className="memphis-card p-4 flex flex-col gap-2" style={{ borderColor: color }}>
              <span className="font-black text-lg" style={{ color }}>{topic}</span>
              <p className="text-sm opacity-80">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Answer modes ── */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <CheckSquareIcon size={28} weight="bold" />
          <h2 className="memphis-heading text-2xl">{t('about.answerModes.title')}</h2>
        </div>
        <p className="text-base leading-relaxed">
          <Trans i18nKey="about.answerModes.intro" components={tx} />
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <RadioButtonIcon size={20} weight="bold" />, label: t('about.answerModes.single.label'), desc: t('about.answerModes.single.desc') },
            { icon: <CheckSquareIcon size={20} weight="bold" />, label: t('about.answerModes.multiple.label'), desc: t('about.answerModes.multiple.desc') },
            { icon: <ShuffleIcon size={20} weight="bold" />, label: t('about.answerModes.mixed.label'), desc: t('about.answerModes.mixed.desc') },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="memphis-card flex flex-col gap-3 p-4">
              <div className="flex items-center gap-2 font-black">
                {icon}
                <span>{label}</span>
              </div>
              <p className="text-sm opacity-80">{desc}</p>
            </div>
          ))}
        </div>
        <div className="memphis-card p-4 flex flex-col gap-2" style={{ background: 'var(--memphis-yellow)' }}>
          <p className="font-black text-sm">{t('about.answerModes.scoringTitle')}</p>
          <p className="text-sm">
            <Trans i18nKey="about.answerModes.scoringDesc" components={tx} />
          </p>
        </div>
      </section>

      {/* ── Import QCMs ── */}
      <section id="import" className="flex flex-col gap-6 scroll-mt-24">
        <div className="flex items-center gap-3">
          <FileArrowUpIcon size={28} weight="bold" />
          <h2 className="memphis-heading text-2xl">{t('about.import.title')}</h2>
        </div>
        <p className="text-base leading-relaxed">
          <Trans i18nKey="about.import.intro" components={tx} />
        </p>

        {/* JSON */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="font-black text-lg uppercase tracking-wide">{t('about.import.jsonTitle')}</h3>
            <a
              href="/examples/qcm-example.json"
              download="qcm-example.json"
              className="memphis-button-outline inline-flex items-center gap-2 text-sm self-start sm:self-auto"
            >
              <DownloadSimpleIcon size={16} weight="bold" />
              {t('about.import.downloadJson')}
            </a>
          </div>
          <p className="text-sm opacity-80">
            <Trans i18nKey="about.import.jsonDesc" components={tx} />
          </p>
          <pre className="bg-gray-950 text-green-400 text-xs p-4 overflow-x-auto border-2 border-black leading-relaxed">
            {jsonExample}
          </pre>
        </div>

        {/* CSV */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="font-black text-lg uppercase tracking-wide">{t('about.import.csvTitle')}</h3>
            <a
              href="/examples/qcm-example.csv"
              download="qcm-example.csv"
              className="memphis-button-outline inline-flex items-center gap-2 text-sm self-start sm:self-auto"
            >
              <DownloadSimpleIcon size={16} weight="bold" />
              {t('about.import.downloadCsv')}
            </a>
          </div>
          <p className="text-sm opacity-80">
            <Trans i18nKey="about.import.csvDesc" components={tx} />
          </p>
          <pre className="bg-gray-950 text-green-400 text-xs p-4 overflow-x-auto border-2 border-black leading-relaxed whitespace-pre">
            {csvExample}
          </pre>
        </div>

        {/* Validation rules */}
        <div className="memphis-card p-4 flex flex-col gap-3">
          <h3 className="font-black text-base uppercase tracking-wide flex items-center gap-2">
            <ShieldCheckIcon size={18} weight="bold" />
            {t('about.import.validationTitle')}
          </h3>
          <ul className="flex flex-col gap-2">
            {validationRules.map((rule, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircleIcon size={16} weight="bold" className="shrink-0 mt-0.5" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-3">
          <Link href="/contributor/qcm/new" className="memphis-button-primary inline-flex items-center gap-2 text-sm">
            <FileArrowUpIcon size={16} weight="bold" />
            {t('about.import.createButton')}
          </Link>
        </div>
      </section>

    </main>
  );
}

'use client';

import React, { useCallback, useRef, useState } from 'react';
import Papa from 'papaparse';
import Link from 'next/link';
import {
  FileArrowUpIcon,
  XCircleIcon,
  CheckCircleIcon,
  WarningCircleIcon,
  SpinnerIcon,
  ArrowSquareOutIcon,
} from '@phosphor-icons/react';
import { useTranslation } from '@/hooks/useTranslation';
import type { Qcm, Question, AnswerOption, LocalizedText, Topic } from '@/types';
import { generateId } from '@/lib/auth';

interface QcmImportZoneProps {
  onImported: (qcm: Qcm) => void;
  hasExistingData?: boolean;
}

type ImportState =
  | { status: 'idle' }
  | { status: 'selected'; fileName: string }
  | { status: 'validating'; fileName: string }
  | { status: 'success'; fileName: string; questionCount: number; qcm: Qcm }
  | { status: 'error'; fileName: string; message: string };

const ACCEPTED_TYPES = ['application/json', 'text/csv', 'text/plain'];
const ACCEPTED_EXTENSIONS = ['.json', '.csv'];

// ─── CSV → Qcm parser ──────────────────────────────────────────────────────

interface CsvRow {
  title_fr: string;
  title_en: string;
  description_fr: string;
  description_en: string;
  topic: string;
  is_private: string;
  question_fr: string;
  question_en: string;
  option_a_fr: string;
  option_a_en: string;
  option_b_fr: string;
  option_b_en: string;
  option_c_fr: string;
  option_c_en: string;
  option_d_fr: string;
  option_d_en: string;
  correct_answer: string;
}

function csvToQcm(rows: CsvRow[]): unknown {
  if (rows.length === 0) throw new Error('Le fichier CSV est vide.');

  const first = rows[0];
  const lt = (fr: string, en: string): LocalizedText => ({ fr: fr?.trim() ?? '', en: en?.trim() ?? '' });

  const questions: unknown[] = rows.map((row, i) => ({
    id: generateId('q'),
    text: lt(row.question_fr, row.question_en),
    options: [
      { id: 'a', text: lt(row.option_a_fr, row.option_a_en) },
      { id: 'b', text: lt(row.option_b_fr, row.option_b_en) },
      { id: 'c', text: lt(row.option_c_fr, row.option_c_en) },
      { id: 'd', text: lt(row.option_d_fr, row.option_d_en) },
    ],
    correctAnswer: row.correct_answer?.trim().toLowerCase(),
  }));

  return {
    title: lt(first.title_fr, first.title_en),
    description: lt(first.description_fr, first.description_en),
    topic: first.topic?.trim().toLowerCase(),
    isPrivate: first.is_private?.trim().toLowerCase() === 'true',
    questions,
  };
}

// ─── Front-end structural validation (lightweight) ─────────────────────────

function quickValidate(data: unknown): string | null {
  const raw = Array.isArray(data) ? data[0] : data;
  if (typeof raw !== 'object' || raw === null) return 'Structure invalide.';
  const obj = raw as Record<string, unknown>;

  if (!obj.title || !obj.description) return 'Champs "title" et "description" requis.';
  if (!obj.topic) return 'Champ "topic" requis (scrum, devops, safe).';
  if (!Array.isArray(obj.questions) || obj.questions.length === 0) {
    return 'Le QCM doit contenir au moins une question.';
  }
  if (obj.questions.length > 40) {
    return `Le QCM ne peut pas contenir plus de 40 questions (reçu : ${obj.questions.length}).`;
  }
  return null;
}

// ─── Component ─────────────────────────────────────────────────────────────

export const QcmImportZone: React.FC<QcmImportZoneProps> = ({ onImported, hasExistingData = false }) => {
  const { t } = useTranslation();
  const [state, setState] = useState<ImportState>({ status: 'idle' });
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setState({ status: 'idle' });
    if (inputRef.current) inputRef.current.value = '';
  };

  const processFile = useCallback(async (file: File) => {
    // Type check
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'json' && ext !== 'csv') {
      setState({ status: 'error', fileName: file.name, message: t('contributor.import.errorType') });
      return;
    }

    setState({ status: 'selected', fileName: file.name });

    let parsed: unknown;

    try {
      const text = await file.text();

      if (ext === 'json') {
        parsed = JSON.parse(text) as unknown;
      } else {
        const result = Papa.parse<CsvRow>(text, { header: true, skipEmptyLines: true });
        if (result.errors.length > 0) {
          throw new Error(`CSV invalide : ${result.errors[0].message}`);
        }
        parsed = csvToQcm(result.data);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setState({ status: 'error', fileName: file.name, message: `${t('contributor.import.errorStructure')} — ${msg}` });
      return;
    }

    // Front-end quick validation
    const quickErr = quickValidate(parsed);
    if (quickErr) {
      setState({ status: 'error', fileName: file.name, message: quickErr });
      return;
    }

    // Back-end validation
    setState({ status: 'validating', fileName: file.name });

    try {
      const response = await fetch('/api/qcms/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qcm: parsed }),
      });

      const json = await response.json() as { valid?: boolean; qcm?: Qcm; error?: string };

      if (!response.ok || !json.valid || !json.qcm) {
        setState({ status: 'error', fileName: file.name, message: json.error ?? t('contributor.import.errorServer') });
        return;
      }

      const qcm = json.qcm;
      const questionCount = qcm.questions.length;

      setState({ status: 'success', fileName: file.name, questionCount, qcm });
      onImported(qcm);
    } catch {
      setState({ status: 'error', fileName: file.name, message: t('contributor.import.errorServer') });
    }
  }, [t, onImported]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void processFile(file);
  };

  const handleChangeFile = () => {
    if (hasExistingData && state.status === 'success') {
      if (!confirm(t('contributor.import.confirmOverwrite'))) return;
    }
    reset();
    setTimeout(() => inputRef.current?.click(), 50);
  };

  // ── Render ──

  if (state.status === 'success') {
    return (
      <div className="border-2 border-black bg-[var(--memphis-green)] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <CheckCircleIcon size={24} weight="bold" className="shrink-0" />
          <div>
            <p className="font-black text-sm">
              {t('contributor.import.success', { count: state.questionCount })}
            </p>
            <p className="text-xs font-bold opacity-70 truncate max-w-xs">{state.fileName}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleChangeFile}
          className="font-black text-sm underline hover:no-underline shrink-0"
        >
          {t('contributor.import.changeFile')}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
        <h2 className="font-black text-base uppercase tracking-wide">
          {t('contributor.import.title')}
        </h2>
        <Link
          href="/about#import"
          target="_blank"
          className="inline-flex items-center gap-1 text-xs font-bold underline hover:no-underline"
        >
          {t('contributor.import.linkAbout')}
          <ArrowSquareOutIcon size={13} weight="bold" />
        </Link>
      </div>
      <p className="text-sm font-bold opacity-70">{t('contributor.import.hint')}</p>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => state.status !== 'validating' && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
        className={`border-2 border-dashed border-black p-8 text-center cursor-pointer transition-colors flex flex-col items-center gap-3
          ${isDragOver ? 'bg-[var(--memphis-yellow)] border-solid' : 'bg-white hover:bg-gray-50'}
          ${state.status === 'validating' ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        {state.status === 'validating' ? (
          <SpinnerIcon size={32} weight="bold" className="animate-spin" />
        ) : (
          <FileArrowUpIcon size={32} weight="bold" />
        )}

        <div>
          {state.status === 'validating' ? (
            <p className="font-black text-sm">{t('contributor.import.importing')}</p>
          ) : isDragOver ? (
            <p className="font-black text-sm">{t('contributor.import.dragActive')}</p>
          ) : (
            <>
              <p className="font-black text-sm">{t('contributor.import.dropzone')}</p>
              <p className="text-xs opacity-60 mt-1">JSON, CSV</p>
            </>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(',')}
          onChange={handleFileChange}
          className="hidden"
          aria-label={t('contributor.import.dropzone')}
        />
      </div>

      {/* Error state */}
      {state.status === 'error' && (
        <div className="border-2 border-black bg-[var(--memphis-red)] text-white p-3 flex items-start gap-3">
          <WarningCircleIcon size={20} weight="bold" className="shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-black text-sm">{state.fileName}</p>
            <p className="text-sm">{state.message}</p>
          </div>
          <button
            type="button"
            onClick={reset}
            aria-label={t('contributor.import.remove')}
            className="shrink-0 hover:opacity-70"
          >
            <XCircleIcon size={20} weight="bold" />
          </button>
        </div>
      )}

      {/* Selected state (before validation response) */}
      {state.status === 'selected' && (
        <div className="flex items-center gap-2 text-sm font-bold">
          <span className="truncate">{state.fileName}</span>
          <button type="button" onClick={reset} aria-label={t('contributor.import.remove')}>
            <XCircleIcon size={18} weight="bold" />
          </button>
        </div>
      )}
    </div>
  );
};

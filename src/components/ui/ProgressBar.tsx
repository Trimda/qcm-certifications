'use client';

import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
  /** Exam mode — segmented clickable bar */
  questionIds?: string[];
  answers?: Record<string, string[]>;
  onGoTo?: (index: number) => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  className = '',
  questionIds,
  answers,
  onGoTo,
}) => {
  const isExamMode = !!onGoTo && !!questionIds;

  if (isExamMode) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div
          className="flex flex-1 border-2 border-black overflow-hidden"
          style={{ height: 14 }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
        >
          {questionIds.map((qid, i) => {
            const isAnswered = !!(answers?.[qid] && answers[qid].length > 0);
            const isCurrent = i === current - 1;
            let bg: string;
            if (isCurrent) bg = 'bg-black';
            else if (isAnswered) bg = 'bg-[var(--memphis-yellow)]';
            else bg = 'bg-white';

            return (
              <button
                key={qid}
                type="button"
                className={`${bg} flex-1 transition-colors hover:opacity-60`}
                style={{ borderRight: i < questionIds.length - 1 ? '1px solid black' : 'none' }}
                onClick={() => onGoTo(i)}
                aria-label={`Question ${i + 1}`}
                title={`Question ${i + 1}`}
              />
            );
          })}
        </div>
        <span className="text-xs font-black tabular-nums whitespace-nowrap">
          {current}/{total}
        </span>
      </div>
    );
  }

  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="memphis-progress flex-1">
        <div
          className="memphis-progress-fill"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
        />
      </div>
      <span className="text-xs font-black tabular-nums whitespace-nowrap">
        {current}/{total}
      </span>
    </div>
  );
};

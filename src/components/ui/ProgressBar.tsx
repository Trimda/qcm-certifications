'use client';

import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, className = '' }) => {
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

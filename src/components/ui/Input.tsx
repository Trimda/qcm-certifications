'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  id,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={id} className="font-black text-sm uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`memphis-input ${error ? 'border-[var(--memphis-red)]' : ''} ${className}`}
        {...props}
      />
      {error && (
        <span className="text-[var(--memphis-red)] text-xs font-bold mt-0.5">{error}</span>
      )}
    </div>
  );
};

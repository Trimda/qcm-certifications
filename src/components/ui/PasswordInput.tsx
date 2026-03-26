'use client';

import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  error,
  id,
  className = '',
  ...props
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={id} className="font-black text-sm uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          className={`memphis-input w-full pr-10 ${error ? 'border-[var(--memphis-red)]' : ''} ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow(v => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-black transition-colors"
          aria-label={show ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          {show
            ? <EyeSlashIcon size={18} weight="bold" />
            : <EyeIcon size={18} weight="bold" />
          }
        </button>
      </div>
      {error && (
        <span className="text-[var(--memphis-red)] text-xs font-bold mt-0.5">{error}</span>
      )}
    </div>
  );
};

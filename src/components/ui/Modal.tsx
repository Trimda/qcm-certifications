'use client';

import React, { useEffect } from 'react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center memphis-modal-overlay"
      onClick={onClose}
    >
      <div
        className="memphis-modal w-full max-w-lg mx-4"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {title && (
          <div className="flex items-center justify-between p-5 border-b-2 border-black">
            <h2 className="memphis-heading text-lg">{title}</h2>
            <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
              ✕
            </Button>
          </div>
        )}
        <div className="p-5">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 p-5 border-t-2 border-black">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

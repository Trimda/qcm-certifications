'use client';

import { useContext } from 'react';
import { QcmContext } from '@/contexts/QcmContext';

/**
 * Consumes the QcmContext.
 * Must be used inside a QcmProvider.
 */
export const useQcm = () => {
  const context = useContext(QcmContext);
  if (!context) {
    throw new Error('useQcm must be used within a QcmProvider');
  }
  return context;
};

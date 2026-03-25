'use client';

import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

/**
 * Consumes the AuthContext.
 * Must be used inside an AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

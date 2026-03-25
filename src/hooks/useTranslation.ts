'use client';

import { useTranslation as useI18nTranslation } from 'react-i18next';

/**
 * Wrapper around react-i18next useTranslation.
 * Uses 'common' namespace by default.
 */
export const useTranslation = (ns = 'common') => {
  return useI18nTranslation(ns);
};

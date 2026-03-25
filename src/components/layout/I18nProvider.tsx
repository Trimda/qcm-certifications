'use client';

import React, { useEffect } from 'react';
import '@/lib/i18n';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // i18n is initialized client-side in i18n.ts
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

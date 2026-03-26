'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import i18n from '@/lib/i18n';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language?.startsWith('fr') ? 'en' : 'fr';
    void i18n.changeLanguage(nextLang);
    localStorage.setItem('i18n_lang', nextLang);
  };

  return (
    <footer className="memphis-footer">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-black text-lg">{t('app.name')}</p>
        <p className="text-sm opacity-80">{t('app.tagline')}</p>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-white font-bold hover:text-[var(--memphis-yellow)] transition-colors">
            {t('nav.home')}
          </Link>
          <Link href="/login" className="text-white font-bold hover:text-[var(--memphis-yellow)] transition-colors">
            {t('nav.login')}
          </Link>
          <button
            onClick={toggleLanguage}
            className="text-white font-black border-2 border-white px-3 py-1 hover:bg-white hover:text-black transition-colors"
          >
            {i18n.language?.startsWith('fr') ? t('common.langEn') : t('common.langFr')}
          </button>
        </div>
      </div>
    </footer>
  );
};

'use client';

import React from 'react';
import { Navigation } from './Navigation';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/hooks/useTranslation';
import i18n from '@/lib/i18n';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language?.startsWith('fr') ? 'en' : 'fr';
    void i18n.changeLanguage(nextLang);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-[var(--memphis-yellow)] border-b-2 border-black md:hidden">
      <div className="flex justify-end p-4">
        <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close menu">
          ✕
        </Button>
      </div>
      <div className="flex-1 px-6 py-4 flex flex-col gap-4">
        <Navigation onLinkClick={onClose} />
        <div className="mt-auto">
          <Button variant="ghost" size="sm" onClick={toggleLanguage}>
            {i18n.language?.startsWith('fr') ? t('common.langEn') : t('common.langFr')}
          </Button>
        </div>
      </div>
    </div>
  );
};

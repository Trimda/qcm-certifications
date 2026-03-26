'use client';

import React, { useEffect } from 'react';
import { Navigation } from './Navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import i18n from '@/lib/i18n';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { currentUser, logout } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  // Body scroll lock when menu is open
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

  const toggleLanguage = () => {
    const nextLang = i18n.language?.startsWith('fr') ? 'en' : 'fr';
    void i18n.changeLanguage(nextLang);
    localStorage.setItem('i18n_lang', nextLang);
  };

  const handleLogout = async () => {
    onClose();
    await logout();
    router.push('/');
  };

  const currentLang = i18n.language?.startsWith('fr') ? 'FR' : 'EN';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-[var(--memphis-yellow)] border-b-2 border-black lg:hidden">
      <div className="flex-1 px-6 py-4 mt-16 flex flex-col gap-4">
        <Navigation onLinkClick={onClose} />
        <div className="mt-auto flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="memphis-btn memphis-btn-ghost text-sm"
          >
            {currentLang}
          </button>
          {!currentUser && (
            <>
              <Link href="/login" onClick={onClose}
                className="memphis-btn memphis-btn-ghost text-sm">
                {t('nav.login')}
              </Link>
              <Link href="/register" onClick={onClose}
                className="memphis-btn memphis-btn-primary text-sm">
                {t('nav.register')}
              </Link>
            </>
          )}
          {currentUser && (
            <button
              onClick={() => { void handleLogout(); }}
              className="memphis-btn memphis-btn-danger text-sm"
            >
              {t('nav.logout')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

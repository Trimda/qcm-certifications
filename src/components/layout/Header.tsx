'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navigation } from './Navigation';
import { MobileMenu } from './MobileMenu';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { useRouter } from 'next/navigation';
import i18n from '@/lib/i18n';

export const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language?.startsWith('fr') ? 'en' : 'fr';
    void i18n.changeLanguage(nextLang);
  };

  const currentLang = i18n.language?.startsWith('fr') ? 'FR' : 'EN';
  const nextLang = i18n.language?.startsWith('fr') ? 'EN' : 'FR';

  return (
    <>
      <header className="memphis-header">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="memphis-heading text-xl no-underline text-black">
            {t('app.name')}
          </Link>

          {/* Desktop Navigation (centered) */}
          <div className="hidden md:flex flex-1 justify-center">
            <Navigation />
          </div>

          {/* Desktop Right Controls */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={toggleLanguage} title={`Switch to ${nextLang}`}>
              {currentLang}
            </Button>
            {currentUser && (
              <>
                <span className="text-xs font-bold">{currentUser.username}</span>
                <Button variant="danger" size="sm" onClick={() => { void handleLogout(); }}>
                  {t('nav.logout')}
                </Button>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 border-2 border-black bg-white font-black text-lg"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
};

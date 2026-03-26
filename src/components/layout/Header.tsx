'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navigation } from './Navigation';
import { MobileMenu } from './MobileMenu';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { useRouter } from 'next/navigation';
import { ListIcon, XIcon } from '@phosphor-icons/react';

export const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <>
      <header className="memphis-header">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="memphis-heading text-xl no-underline text-black">
            {t('app.name')}
          </Link>

          {/* Desktop Navigation (centered) */}
          <div className="hidden lg:flex flex-1 justify-center">
            <Navigation />
          </div>

          {/* Desktop Right Controls */}
          <div className="hidden lg:flex items-center gap-2">
            {!currentUser && (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">{t('nav.login')}</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">{t('nav.register')}</Button>
                </Link>
              </>
            )}
            {currentUser && (
              <Button variant="danger" size="sm" onClick={() => { void handleLogout(); }}>
                {t('nav.logout')}
              </Button>
            )}
          </div>

          {/* Mobile / Tablet Hamburger / Close */}
          <button
            className="lg:hidden p-2 border-2 border-black bg-white font-black text-lg leading-none"
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <XIcon size={22} weight="bold" /> : <ListIcon size={22} weight="bold" />}
          </button>
        </div>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
};

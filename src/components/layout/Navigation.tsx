'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';

export const Navigation: React.FC<{ onLinkClick?: () => void }> = ({ onLinkClick }) => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();

  const linkClass = 'memphis-nav-link block';

  return (
    <nav aria-label="Main navigation">
      <ul className="flex flex-col lg:flex-row items-start lg:items-center gap-1 lg:gap-0 list-none m-0 p-0">
        <li>
          <Link href="/" className={linkClass} onClick={onLinkClick}>
            {t('nav.home')}
          </Link>
        </li>

        {!currentUser && (
          <>
            <li>
              <Link href="/login" className={linkClass} onClick={onLinkClick}>
                {t('nav.login')}
              </Link>
            </li>
            <li>
              <Link href="/register" className={linkClass} onClick={onLinkClick}>
                {t('nav.register')}
              </Link>
            </li>
          </>
        )}

        {currentUser && (
          <>
            <li>
              <Link href="/dashboard" className={linkClass} onClick={onLinkClick}>
                {t('nav.dashboard')}
              </Link>
            </li>
            <li>
              <Link href="/practice" className={linkClass} onClick={onLinkClick}>
                {t('nav.practice')}
              </Link>
            </li>
            <li>
              <Link href="/account" className={linkClass} onClick={onLinkClick}>
                {t('nav.account')}
              </Link>
            </li>
          </>
        )}

        {currentUser && (currentUser.role === 'contributor' || currentUser.role === 'admin') && (
          <li>
            <Link href="/contributor/qcm/new" className={linkClass} onClick={onLinkClick}>
              {t('nav.createQcm')}
            </Link>
          </li>
        )}

        {currentUser?.role === 'admin' && (
          <li>
            <Link href="/admin/users" className={linkClass} onClick={onLinkClick}>
              {t('nav.admin')}
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

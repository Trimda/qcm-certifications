'use client';

import React from 'react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowRightIcon } from '@phosphor-icons/react';
import Link from 'next/link';

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const { t } = useTranslation();

  return (
    <RoleGuard allowedRoles={['user', 'contributor', 'admin']}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8 flex items-center gap-3">
          <h1 className="memphis-heading text-3xl">{t('dashboard.title')}</h1>
          {currentUser && <Badge variant={currentUser.role}>{currentUser.role}</Badge>}
        </div>

        {currentUser && (
          <p className="font-bold text-lg mb-8">
            {t('dashboard.welcome', { username: currentUser.username })}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Practice Card — everyone */}
          <Card variant="yellow">
            <h2 className="memphis-heading text-xl mb-2">{t('dashboard.practiceTitle')}</h2>
            <p className="font-bold mb-4">{t('dashboard.practiceDesc')}</p>
            <Link href="/practice">
              <Button variant="secondary" size="sm">{t('nav.practice')} <ArrowRightIcon size={13} weight="bold" className="inline ml-1" /></Button>
            </Link>
          </Card>

          {/* Contributor Card */}
          {currentUser && (currentUser.role === 'contributor' || currentUser.role === 'admin') && (
            <Card variant="blue">
              <h2 className="memphis-heading text-xl mb-2">{t('dashboard.contributorTitle')}</h2>
              <p className="font-bold mb-4">{t('dashboard.contributorDesc')}</p>
              <Link href="/contributor/qcm/new">
                <Button variant="ghost" size="sm">{t('nav.createQcm')} <ArrowRightIcon size={13} weight="bold" className="inline ml-1" /></Button>
              </Link>
            </Card>
          )}

          {/* Admin Card */}
          {currentUser?.role === 'admin' && (
            <Card variant="red">
              <h2 className="memphis-heading text-xl mb-2">{t('dashboard.adminTitle')}</h2>
              <p className="font-bold mb-4">{t('dashboard.adminDesc')}</p>
              <Link href="/admin/users">
                <Button variant="ghost" size="sm">{t('nav.admin')} <ArrowRightIcon size={13} weight="bold" className="inline ml-1" /></Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { QcmList } from '@/components/qcm/QcmList';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import { fetchQcms, deleteQcm } from '@/services/qcmService';
import type { Qcm } from '@/types';

export default function MyQcmsPage() {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [qcms, setQcms] = useState<Qcm[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    fetchQcms(undefined, currentUser.id)
      .then(setQcms)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [currentUser]);

  const handleDelete = async (id: string) => {
    await deleteQcm(id);
    setQcms(prev => prev.filter(q => q.id !== id));
  };

  return (
    <RoleGuard allowedRoles={['contributor', 'admin']}>
      <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <h1 className="memphis-heading text-3xl flex-1">{t('nav.myQcms')}</h1>
          <Link href="/contributor/qcm/new">
            <Button variant="primary">{t('contributor.createQcm')}</Button>
          </Link>
        </div>
        {isLoading ? (
          <p className="font-bold">{t('common.loading')}</p>
        ) : (
          <QcmList
            qcms={qcms}
            showActions
            onDelete={(id) => { void handleDelete(id); }}
          />
        )}
      </div>
    </RoleGuard>
  );
}

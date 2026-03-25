'use client';

import React, { useEffect, useState } from 'react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { QcmList } from '@/components/qcm/QcmList';
import { useTranslation } from '@/hooks/useTranslation';
import { fetchQcms, deleteQcm } from '@/services/qcmService';
import type { Qcm } from '@/types';

export default function AdminQcmsPage() {
  const { t } = useTranslation();
  const [qcms, setQcms] = useState<Qcm[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchQcms()
      .then(setQcms)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    await deleteQcm(id);
    setQcms(prev => prev.filter((q: Qcm) => q.id !== id));
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="memphis-heading text-3xl mb-8">{t('admin.qcms')}</h1>
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

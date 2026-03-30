'use client';

import React, { useEffect, useState } from 'react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { QcmTable } from '@/components/admin/QcmTable';
import { useTranslation } from '@/hooks/useTranslation';
import { fetchQcms, deleteQcm } from '@/services/qcmService';
import { fetchUsers } from '@/services/userService';
import type { Qcm, User } from '@/types';

export default function AdminQcmsPage() {
  const { t } = useTranslation();
  const [qcms, setQcms] = useState<Qcm[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [avgRatings, setAvgRatings] = useState<Record<string, { avg: number; count: number }>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchQcms(),
      fetchUsers(),
      fetch('/api/ratings').then(r => (r.ok ? r.json() : Promise.resolve({}))),
    ])
      .then(([q, u, ratings]) => {
        setQcms(q as Qcm[]);
        setUsers(u as User[]);
        setAvgRatings(ratings as Record<string, { avg: number; count: number }>);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    await deleteQcm(id);
    setQcms(prev => prev.filter((q: Qcm) => q.id !== id));
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="memphis-heading text-3xl mb-8">{t('admin.qcms')}</h1>
        {isLoading ? (
          <p className="font-bold">{t('common.loading')}</p>
        ) : (
          <QcmTable
            qcms={qcms}
            users={users}
            avgRatings={avgRatings}
            onDelete={(id) => { void handleDelete(id); }}
          />
        )}
      </div>
    </RoleGuard>
  );
}

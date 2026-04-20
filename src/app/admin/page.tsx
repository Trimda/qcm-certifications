'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { UserTable } from '@/components/admin/UserTable';
import { QcmTable } from '@/components/admin/QcmTable';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/hooks/useTranslation';
import { fetchQcms, deleteQcm } from '@/services/qcmService';
import { fetchUsers, updateUser, deleteUser } from '@/services/userService';
import type { Qcm, User } from '@/types';

const PREVIEW_COUNT = 5;

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [qcms, setQcms] = useState<Qcm[]>([]);
  const [avgRatings, setAvgRatings] = useState<Record<string, { avg: number; count: number }>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchUsers(),
      fetchQcms(),
      fetch('/api/ratings').then(r => (r.ok ? r.json() : Promise.resolve({}))),
    ])
      .then(([u, q, ratings]) => {
        setUsers(u as User[]);
        setQcms(q as Qcm[]);
        setAvgRatings(ratings as Record<string, { avg: number; count: number }>);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleDeleteUser = async (id: string) => {
    await deleteUser(id);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const handleUpdateUser = async (id: string, updates: Partial<User>) => {
    const updated = await updateUser(id, updates);
    setUsers(prev => prev.map(u => u.id === id ? updated : u));
  };

  const handleDeleteQcm = async (id: string) => {
    await deleteQcm(id);
    setQcms(prev => prev.filter(q => q.id !== id));
  };

  // Sort by most recent first, take preview slice
  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, PREVIEW_COUNT);

  const recentQcms = [...qcms]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, PREVIEW_COUNT);

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col gap-12">

        {/* Users section */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="memphis-heading text-2xl flex-1">{t('admin.recentUsers')}</h2>
            <Link href="/admin/users">
              <Button variant="ghost" size="sm">{t('admin.seeAll')} &rarr;</Button>
            </Link>
          </div>
          {isLoading ? (
            <p className="font-bold">{t('common.loading')}</p>
          ) : (
            <UserTable
              users={recentUsers}
              onDelete={(id) => { void handleDeleteUser(id); }}
              onUpdate={(id, updates) => { void handleUpdateUser(id, updates); }}
            />
          )}
        </section>

        {/* Achievements shortcut */}
        <section>
          <div className="flex items-center gap-4 mb-4">
            <h2 className="memphis-heading text-2xl flex-1">{t('achievements.adminTitle')}</h2>
            <Link href="/admin/achievements">
              <Button variant="ghost" size="sm">{t('admin.seeAll')} &rarr;</Button>
            </Link>
          </div>
        </section>

        {/* QCMs section */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="memphis-heading text-2xl flex-1">{t('admin.recentQcms')}</h2>
            <Link href="/admin/qcms">
              <Button variant="ghost" size="sm">{t('admin.seeAll')} &rarr;</Button>
            </Link>
          </div>
          {isLoading ? (
            <p className="font-bold">{t('common.loading')}</p>
          ) : (
            <QcmTable
              qcms={recentQcms}
              users={users}
              avgRatings={avgRatings}
              onDelete={(id) => { void handleDeleteQcm(id); }}
            />
          )}
        </section>

      </div>
    </RoleGuard>
  );
}
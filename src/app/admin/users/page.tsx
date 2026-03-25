'use client';

import React, { useEffect, useState } from 'react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { UserTable } from '@/components/admin/UserTable';
import { useTranslation } from '@/hooks/useTranslation';
import { fetchUsers, updateUser, deleteUser } from '@/services/userService';
import type { User } from '@/types';

export default function AdminUsersPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    await deleteUser(id);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const handleUpdate = async (id: string, updates: Partial<User>) => {
    const updated = await updateUser(id, updates);
    setUsers(prev => prev.map(u => u.id === id ? updated : u));
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="memphis-heading text-3xl mb-8">{t('admin.users')}</h1>
        {isLoading ? (
          <p className="font-bold">{t('common.loading')}</p>
        ) : (
          <UserTable
            users={users}
            onDelete={(id) => { void handleDelete(id); }}
            onUpdate={(id, updates) => { void handleUpdate(id, updates); }}
          />
        )}
      </div>
    </RoleGuard>
  );
}

'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import type { User, Role } from '@/types';

interface UserTableProps {
  users: User[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<User>) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onDelete, onUpdate }) => {
  const { t } = useTranslation();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<Role>('user');

  const handleEditOpen = (user: User) => {
    setEditingUser(user);
    setEditRole(user.role);
  };

  const handleEditSave = () => {
    if (!editingUser) return;
    onUpdate(editingUser.id, { role: editRole });
    setEditingUser(null);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="memphis-table">
          <thead>
            <tr>
              <th>{t('admin.username')}</th>
              <th>{t('admin.email')}</th>
              <th>{t('admin.role')}</th>
              <th>{t('admin.createdAt')}</th>
              <th>{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="font-black">{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <Badge variant={user.role}>{user.role}</Badge>
                </td>
                <td className="text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEditOpen(user)}
                    >
                      {t('admin.editUser')}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setDeleteConfirm(user.id)}
                    >
                      {t('admin.deleteUser')}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title={t('admin.editUser')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditingUser(null)}>
              {t('common.cancel')}
            </Button>
            <Button variant="primary" onClick={handleEditSave}>
              {t('common.save')}
            </Button>
          </>
        }
      >
        {editingUser && (
          <div className="flex flex-col gap-4">
            <p className="font-bold">{editingUser.username} — {editingUser.email}</p>
            <div className="flex flex-col gap-1">
              <label htmlFor="edit-role" className="font-black text-sm uppercase">
                {t('admin.role')}
              </label>
              <select
                id="edit-role"
                value={editRole}
                onChange={e => setEditRole(e.target.value as Role)}
                className="memphis-input"
              >
                <option value="user">user</option>
                <option value="contributor">contributor</option>
                <option value="admin">admin</option>
              </select>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title={t('common.delete')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (deleteConfirm) onDelete(deleteConfirm);
                setDeleteConfirm(null);
              }}
            >
              {t('common.confirm')}
            </Button>
          </>
        }
      >
        <p className="font-bold">{t('admin.confirmDelete')}</p>
      </Modal>
    </>
  );
};

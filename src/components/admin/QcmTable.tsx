'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { resolveText } from '@/lib/localizedText';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { StarRating } from '@/components/ui/StarRating';
import type { Qcm, User } from '@/types';

interface QcmTableProps {
  qcms: Qcm[];
  users: User[];
  avgRatings: Record<string, { avg: number; count: number }>;
  onDelete: (id: string) => void;
}

export const QcmTable: React.FC<QcmTableProps> = ({ qcms, users, avgRatings, onDelete }) => {
  const { t, i18n } = useTranslation();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const getUsername = (userId: string) =>
    users.find(u => u.id === userId)?.username ?? userId;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="memphis-table">
          <thead>
            <tr>
              <th>{t('admin.title')}</th>
              <th>{t('admin.topic')}</th>
              <th>{t('admin.creator')}</th>
              <th>{t('admin.avgRating')}</th>
              <th>{t('admin.createdAt')}</th>
              <th>{t('admin.lastModified')}</th>
              <th>{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {qcms.map(qcm => {
              const rating = avgRatings[qcm.id];
              return (
                <tr key={qcm.id}>
                  <td className="font-black">{resolveText(qcm.title, i18n.language)}</td>
                  <td><span className="uppercase font-black text-xs">{qcm.topic}</span></td>
                  <td className="font-bold">{getUsername(qcm.createdBy)}</td>
                  <td>
                    {rating ? (
                      <div className="flex items-center gap-1">
                        <StarRating value={Math.round(rating.avg)} size={13} />
                        <span className="text-xs font-bold opacity-70">{rating.avg} ({rating.count})</span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold opacity-40">{t('admin.noRating')}</span>
                    )}
                  </td>
                  <td className="text-sm">{new Date(qcm.createdAt).toLocaleDateString()}</td>
                  <td className="text-sm">{new Date(qcm.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <div className="flex gap-2">
                      <Link href={`/contributor/qcm/${qcm.id}/edit`}>
                        <Button variant="secondary" size="sm">{t('common.edit')}</Button>
                      </Link>
                      <Button variant="danger" size="sm" onClick={() => setDeleteConfirm(qcm.id)}>
                        {t('common.delete')}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title={t('common.delete')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>{t('common.cancel')}</Button>
            <Button
              variant="danger"
              onClick={() => {
                if (deleteConfirm) { onDelete(deleteConfirm); setDeleteConfirm(null); }
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
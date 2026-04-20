'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { resolveText } from '@/lib/localizedText';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { StarRating } from '@/components/ui/StarRating';
import { PencilSimpleIcon, TrashIcon, DownloadSimpleIcon } from '@phosphor-icons/react';
import { exportQcmJson, exportQcmCsv } from '@/lib/qcmExport';
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
  const [openExport, setOpenExport] = useState<string | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setOpenExport(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

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
                    <div className="flex gap-1 items-center">
                      <Link href={`/contributor/qcm/${qcm.id}/edit`}>
                        <button
                          title={t('common.edit')}
                          className="p-1.5 border-2 border-black hover:bg-black hover:text-white transition-colors"
                        >
                          <PencilSimpleIcon size={15} weight="bold" />
                        </button>
                      </Link>
                      <button
                        title={t('common.delete')}
                        className="p-1.5 border-2 border-black hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
                        style={{ height: 'fit-content' }}
                        onClick={() => setDeleteConfirm(qcm.id)}
                      >
                        <TrashIcon size={15} weight="bold" />
                      </button>
                      <div className="relative" ref={openExport === qcm.id ? exportRef : undefined}>
                        <button
                          title={t('common.export')}
                          className="p-1.5 border-2 border-black hover:bg-[var(--memphis-blue)] hover:text-white hover:border-[var(--memphis-blue)] transition-colors"
                          onClick={() => setOpenExport(openExport === qcm.id ? null : qcm.id)}
                        >
                          <DownloadSimpleIcon size={15} weight="bold" />
                        </button>
                        {openExport === qcm.id && (
                          <div className="absolute right-0 top-full mt-1 bg-white border-2 border-black z-10 min-w-[120px]">
                            <button
                              className="w-full text-left px-3 py-2 text-sm font-black hover:bg-[var(--memphis-yellow)] border-b-2 border-black"
                              onClick={() => { exportQcmJson(qcm); setOpenExport(null); }}
                            >
                              {t('common.exportJson')}
                            </button>
                            <button
                              className="w-full text-left px-3 py-2 text-sm font-black hover:bg-[var(--memphis-yellow)]"
                              onClick={() => { exportQcmCsv(qcm); setOpenExport(null); }}
                            >
                              {t('common.exportCsv')}
                            </button>
                          </div>
                        )}
                      </div>
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
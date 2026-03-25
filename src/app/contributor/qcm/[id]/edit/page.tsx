'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { QcmForm } from '@/components/qcm/QcmForm';
import { useQcm } from '@/hooks/useQcm';
import type { Qcm } from '@/types';

export default function EditQcmPage() {
  const params = useParams();
  const id = params.id as string;
  const { loadQcmById } = useQcm();
  const [qcm, setQcm] = useState<Qcm | null>(null);

  useEffect(() => {
    if (id) {
      loadQcmById(id).then(setQcm).catch(console.error);
    }
  }, [id, loadQcmById]);

  return (
    <RoleGuard allowedRoles={['contributor', 'admin']}>
      <div className="max-w-3xl mx-auto px-4 py-12">
        {qcm ? (
          <QcmForm mode="edit" initialQcm={qcm} />
        ) : (
          <p className="font-bold">Chargement...</p>
        )}
      </div>
    </RoleGuard>
  );
}

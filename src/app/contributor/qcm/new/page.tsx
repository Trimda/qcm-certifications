'use client';

import React from 'react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { QcmForm } from '@/components/qcm/QcmForm';

export default function NewQcmPage() {
  return (
    <RoleGuard allowedRoles={['contributor', 'admin']}>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <QcmForm mode="create" />
      </div>
    </RoleGuard>
  );
}

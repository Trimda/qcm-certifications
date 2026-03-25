'use client';

import React from 'react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { TopicSelector } from '@/components/qcm/TopicSelector';

export default function PracticePage() {
  return (
    <RoleGuard allowedRoles={['user', 'contributor', 'admin']}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <TopicSelector />
      </div>
    </RoleGuard>
  );
}

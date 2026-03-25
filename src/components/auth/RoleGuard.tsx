'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { Role } from '@/types';

interface RoleGuardProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!currentUser) {
      router.replace('/login');
      return;
    }
    if (!allowedRoles.includes(currentUser.role)) {
      router.replace('/dashboard');
    }
  }, [currentUser, isLoading, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="memphis-heading text-xl animate-pulse">Chargement…</p>
      </div>
    );
  }

  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    return null;
  }

  return <>{children}</>;
};

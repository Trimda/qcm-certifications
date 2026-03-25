'use client';

import React from 'react';
import type { Role, Topic } from '@/types';

type BadgeVariant = Role | Topic | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className = '',
}) => {
  const variantClass: Record<BadgeVariant, string> = {
    scrum: 'memphis-badge-scrum',
    devops: 'memphis-badge-devops',
    safe: 'memphis-badge-safe',
    admin: 'memphis-badge-admin',
    contributor: 'memphis-badge-contributor',
    user: 'memphis-badge-user',
    default: 'bg-gray-200 text-black border-2 border-black',
  };

  return (
    <span className={`memphis-badge ${variantClass[variant] ?? variantClass.default} ${className}`}>
      {children}
    </span>
  );
};

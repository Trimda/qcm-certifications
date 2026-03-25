'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'yellow' | 'blue' | 'red';
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  onClick,
}) => {
  const variantClass = {
    default: 'memphis-card',
    yellow: 'memphis-card-yellow',
    blue: 'memphis-card-blue',
    red: 'memphis-card-red',
  }[variant];

  return (
    <div
      className={`${variantClass} p-6 ${onClick ? 'cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

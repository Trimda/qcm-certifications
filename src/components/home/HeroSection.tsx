'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/Button';

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-[var(--memphis-yellow)] border-b-2 border-black py-20 px-4">
      {/* Decorative geometric shapes */}
      <div className="absolute top-8 right-12 w-16 h-16 bg-[var(--memphis-blue)] border-2 border-black rounded-full opacity-80" />
      <div className="absolute bottom-8 left-16 w-12 h-12 bg-[var(--memphis-red)] border-2 border-black rotate-45" />
      <div className="absolute top-16 left-1/4 w-6 h-6 bg-black rounded-full" />
      <div className="absolute bottom-12 right-1/3 w-8 h-8 bg-[var(--memphis-white)] border-2 border-black" />

      <div className="relative max-w-4xl mx-auto text-center">
        <h1 className="memphis-heading text-4xl md:text-6xl mb-6">
          {t('home.heroTitle')}
        </h1>
        <p className="text-lg md:text-xl font-bold mb-8 max-w-2xl mx-auto">
          {t('home.heroSubtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/practice">
            <Button variant="secondary" size="lg">
              {t('home.startButton')}
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="ghost" size="lg">
              {t('home.learnMore')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export const FeatureSection: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: '🎯',
      title: t('home.feature1Title'),
      description: t('home.feature1Desc'),
    },
    {
      icon: '📊',
      title: t('home.feature2Title'),
      description: t('home.feature2Desc'),
    },
    {
      icon: '🔀',
      title: t('home.feature3Title'),
      description: t('home.feature3Desc'),
    },
  ];

  return (
    <section id="features" className="py-16 px-4 memphis-stripe-bg border-t-2 border-black">
      <div className="max-w-6xl mx-auto">
        <h2 className="memphis-heading text-3xl mb-12 text-center">
          {t('home.featureTitle')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="memphis-card p-6 flex flex-col gap-3 hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform"
            >
              <div className="text-4xl">{feature.icon}</div>
              <h3 className="memphis-heading text-xl">{feature.title}</h3>
              <p className="font-semibold text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

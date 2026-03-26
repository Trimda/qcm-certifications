'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { UsersFourIcon, CpuIcon, RocketIcon, ArrowRightIcon } from '@phosphor-icons/react';

export const CertificationCards: React.FC = () => {
  const { t } = useTranslation();

  const certifications = [
    {
      topic: 'scrum' as const,
      title: t('home.scrumTitle'),
      description: t('home.scrumDesc'),
      color: 'yellow' as const,
      icon: <UsersFourIcon size={36} weight="bold" />,
    },
    {
      topic: 'devops' as const,
      title: t('home.devopsTitle'),
      description: t('home.devopsDesc'),
      color: 'blue' as const,
      icon: <CpuIcon size={36} weight="bold" />,
    },
    {
      topic: 'safe' as const,
      title: t('home.safeTitle'),
      description: t('home.safeDesc'),
      color: 'red' as const,
      icon: <RocketIcon size={36} weight="bold" />,
    },
  ];

  return (
    <section className="py-16 px-4 bg-[var(--memphis-bg)]">
      <div className="max-w-6xl mx-auto">
        <h2 className="memphis-heading text-3xl mb-10 text-center">
          {t('home.certifications')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certifications.map(cert => (
            <Card key={cert.topic} variant={cert.color} className="flex flex-col gap-3">
              <div>{cert.icon}</div>
              <div className="flex items-center gap-2">
                <h3 className="memphis-heading text-2xl">{cert.title}</h3>
                <Badge variant={cert.topic}>{cert.topic.toUpperCase()}</Badge>
              </div>
              <p className="font-bold flex-1">{cert.description}</p>
              <Link href={`/practice/${cert.topic}`}>
                <Button variant="ghost" size="sm" className="w-full">
                  {t('practice.startButton')} <ArrowRightIcon size={14} weight="bold" className="inline ml-1" />
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { CertificationCards } from '@/components/home/CertificationCards';
import { FeatureSection } from '@/components/home/FeatureSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CertificationCards />
      <FeatureSection />
    </>
  );
}

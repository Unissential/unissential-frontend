'use client';

import {
  HeroSection,
  FeaturesSection,
  CategoriesSection,
  StatsSection,
  CTASection,
} from '@/components/sections';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />
      <StatsSection />
      <CTASection />
    </main>
  );
}

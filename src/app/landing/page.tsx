/**
 * Landing Page
 * Main marketing page showcasing Unissential platform
 */

'use client';

import React from 'react';
import {
  HeroSection,
  SearchSection,
  FeaturedRoomsSection,
  RoommateMatchingSection,
  MarketplaceSection,
  HowItWorksSection,
  TestimonialsSection,
  CTASection,
  Footer,
} from '@/components/sections';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Hero Section */}
      <HeroSection />

      {/* Search Section */}
      <SearchSection />

      {/* Featured Rooms Section */}
      <section className="border-t border-neutral-200 dark:border-neutral-800">
        <FeaturedRoomsSection />
      </section>

      {/* Roommate Matching Section */}
      <section className="border-t border-neutral-200 dark:border-neutral-800">
        <RoommateMatchingSection />
      </section>

      {/* Marketplace Section */}
      <section className="border-t border-neutral-200 dark:border-neutral-800">
        <MarketplaceSection />
      </section>

      {/* How It Works Section */}
      <section className="border-t border-neutral-200 dark:border-neutral-800">
        <HowItWorksSection />
      </section>

      {/* Testimonials Section */}
      <section className="border-t border-neutral-200 dark:border-neutral-800">
        <TestimonialsSection />
      </section>

      {/* CTA Section */}
      <section className="border-t border-neutral-200 dark:border-neutral-800">
        <CTASection />
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}

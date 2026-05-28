/**
 * CTA (Call to Action) Section
 */

import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Button, Badge } from '@/components/common';

export const CTASection: React.FC = () => {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      {/* Background Decorations */}
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-gradient-to-br from-primary-200/30 to-transparent blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-gradient-to-tl from-secondary-200/30 to-transparent blur-3xl" />

      <div className="relative mx-auto max-w-5xl">
        <div className="rounded-3xl bg-gradient-to-br from-neutral-900 via-primary-900 to-neutral-900 p-8 text-white shadow-2xl sm:p-12 lg:p-16">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex mb-4">
              <Badge variant="primary">Limited Time Offer</Badge>
            </div>
            <h2 className="text-4xl font-bold leading-tight sm:text-5xl">
              Ready to Find Your Perfect
              <span className="block text-transparent bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text">
                Student Home?
              </span>
            </h2>
            <p className="mt-6 text-lg text-white/80">
              Join thousands of students who have already found their perfect living situation on Unissential
            </p>
          </div>

          {/* Features */}
          <div className="mb-12 grid gap-4 sm:grid-cols-2">
            {[
              'Free to join and list',
              'Find matches in minutes',
              'Secure verified transactions',
              '24/7 customer support',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-400/20">
                  <Check className="h-4 w-4 text-primary-400" />
                </div>
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
            <Button
              size="lg"
              className="gap-2 bg-white text-neutral-900 hover:bg-white/90"
            >
              Get Started Now
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Learn More
            </Button>
          </div>

          {/* Bottom Text */}
          <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-white/70">
            <p>✨ No credit card required • Sign up takes less than 5 minutes</p>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-12 text-center">
          <p className="mb-4 font-medium text-neutral-600">
            Featured in
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 opacity-50">
            {['TechCrunch', 'Forbes', 'The Verge', 'Y Combinator'].map((name) => (
              <div key={name} className="font-semibold text-neutral-900 dark:text-white">
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

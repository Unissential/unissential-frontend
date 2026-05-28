/**
 * Roommate Matching Section
 */

import React from 'react';
import { ArrowRight, Zap, Users, Heart } from 'lucide-react';
import { RoommateCard, Button, Badge } from '@/components/common';
import { roommateMatches } from '@/data/landing-mock';

export const RoommateMatchingSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      {/* Background Decoration */}
      <div className="absolute right-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-gradient-to-l from-primary-200/30 to-transparent blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 max-w-2xl">
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="primary">
              <Zap className="h-4 w-4" />
              Smart Matching
            </Badge>
          </div>
          <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
            Find Your Perfect Roommate
          </h2>
          <p className="mt-4 text-lg text-neutral-600">
            Our AI-powered algorithm matches you with compatible roommates based on lifestyle, budget, and interests. Get matched with people you&apos;ll love living with.
          </p>
        </div>

        {/* Features */}
        <div className="mb-12 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Users, title: 'Profile Matching', desc: 'Match with compatible students' },
            { icon: Heart, title: 'Compatibility Score', desc: 'See your match percentage' },
            { icon: Zap, title: 'Instant Connection', desc: 'Chat directly with matches' },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-lg border-2 border-neutral-200 bg-white p-4"
            >
              <Icon className="h-6 w-6 text-primary-600" />
              <h3 className="mt-3 font-semibold text-neutral-900">{title}</h3>
              <p className="mt-1 text-sm text-neutral-600">{desc}</p>
            </div>
          ))}
        </div>

        {/* Roommates Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {roommateMatches.map((roommate) => (
            <RoommateCard
              key={roommate.id}
              roommate={roommate}
              onConnect={() => console.log('Connect with:', roommate.id)}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-primary-600 to-secondary-600 p-8 text-center text-white sm:p-12">
          <h3 className="text-2xl font-bold">Ready to Find Your Match?</h3>
          <p className="mt-3 text-lg opacity-90">
            Take our quick quiz to get matched with your perfect roommate instantly
          </p>
          <Button
            size="lg"
            className="mt-6 gap-2 bg-white text-primary-600 hover:bg-white/90"
          >
            Start Matching
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

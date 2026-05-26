/**
 * How It Works Section
 */

import React from 'react';
import {
  UserPlus,
  Zap,
  MessageSquare,
  Home,
  ArrowRight,
} from 'lucide-react';
import { Badge, Button } from '@/components/common';
import { howItWorks } from '@/data/landing-mock';

const iconMap: Record<string, React.ReactNode> = {
  UserPlus: <UserPlus className="h-8 w-8" />,
  Zap: <Zap className="h-8 w-8" />,
  MessageSquare: <MessageSquare className="h-8 w-8" />,
  Home: <Home className="h-8 w-8" />,
};

export const HowItWorksSection: React.FC = () => {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8"
    >
      {/* Background Decoration */}
      <div className="absolute left-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary-200/30 to-transparent blur-3xl dark:from-primary-900/20" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex mb-4">
            <Badge variant="primary">How It Works</Badge>
          </div>
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">
            Get Started in 4 Simple Steps
          </h2>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
            Find your perfect home and connect with the right roommates in minutes
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-8 lg:grid-cols-4 mb-12">
          {howItWorks.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Card */}
              <div className="group flex h-full flex-col rounded-2xl border-2 border-neutral-200 bg-white p-8 transition-all duration-300 hover:border-primary-300 hover:shadow-xl dark:border-neutral-700 dark:bg-neutral-800 hover:dark:border-primary-600">
                {/* Number Badge */}
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 font-bold text-white">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600 transition-transform duration-300 group-hover:scale-110 dark:bg-primary-900/30">
                  {iconMap[step.icon] || step.icon}
                </div>

                {/* Content */}
                <h3 className="mb-3 text-xl font-bold text-neutral-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="flex-1 text-neutral-600 dark:text-neutral-400">
                  {step.description}
                </p>

                {/* Arrow */}
                {index < howItWorks.length - 1 && (
                  <ArrowRight className="absolute -right-4 top-1/2 hidden h-8 w-8 -translate-y-1/2 text-primary-500 lg:block" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Timeline */}
        <div className="relative lg:hidden">
          <div className="absolute left-5 top-0 h-full w-1 bg-gradient-to-b from-primary-500 to-secondary-500" />
          <div className="space-y-8">
            {howItWorks.map((step) => (
              <div key={step.id} className="relative pl-16">
                <div className="absolute -left-4 top-2 h-9 w-9 rounded-full bg-white ring-4 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-700" />
                <div className="rounded-lg bg-neutral-50 p-4 dark:bg-neutral-900/50">
                  <h3 className="font-bold text-neutral-900 dark:text-white">{step.title}</h3>
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Button size="lg" className="gap-2">
            Start Your Journey
            <ArrowRight className="h-5 w-5" />
          </Button>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">
            Takes less than 5 minutes to create your profile
          </p>
        </div>
      </div>
    </section>
  );
};

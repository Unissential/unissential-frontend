/**
 * Marketplace Section
 */

import React from 'react';
import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';
import { MarketplaceCard, Button, Badge } from '@/components/common';
import { marketplaceItems } from '@/data/landing-mock';

export const MarketplaceSection: React.FC = () => {
  return (
    <section className="relative px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 max-w-2xl">
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="primary">
              <TrendingUp className="h-4 w-4" />
              Student Marketplace
            </Badge>
          </div>
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">
            Buy & Sell Student Essentials
          </h2>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
            Connect with other students to buy and sell textbooks, furniture, electronics, and more. Save money and find great deals.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-12 grid gap-4 sm:grid-cols-3">
          {[
            { number: '5,000+', label: 'Items Listed' },
            { number: '50K+', label: 'Active Buyers' },
            { number: '95%', label: 'Positive Reviews' },
          ].map(({ number, label }) => (
            <div key={label} className="rounded-lg bg-neutral-50 p-6 dark:bg-neutral-900/50">
              <p className="text-3xl font-bold text-primary-600">{number}</p>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Marketplace Items Grid */}
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {marketplaceItems.map((item) => (
            <MarketplaceCard
              key={item.id}
              item={item}
              onViewItem={() => console.log('View item:', item.id)}
            />
          ))}
        </div>

        {/* Features */}
        <div className="rounded-2xl bg-white p-8 shadow-lg dark:bg-neutral-800 sm:p-12">
          <h3 className="mb-8 text-2xl font-bold text-neutral-900 dark:text-white">
            Why Use Our Marketplace?
          </h3>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Shield,
                title: 'Secure Transactions',
                desc: 'Built-in buyer & seller protection for peace of mind',
              },
              {
                icon: Zap,
                title: 'Quick Sales',
                desc: 'Average item sells within 3 days',
              },
              {
                icon: TrendingUp,
                title: 'Best Prices',
                desc: 'Student-friendly pricing by students',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col gap-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
                <h4 className="font-semibold text-neutral-900 dark:text-white">{title}</h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-gradient-to-r from-orange-50 to-yellow-50 p-8 dark:from-orange-950/20 dark:to-yellow-950/20">
          <div>
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Have Items to Sell?
            </h3>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              List your items for free and start earning today
            </p>
          </div>
          <Button className="gap-2 whitespace-nowrap">
            List an Item
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

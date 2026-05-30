/**
 * Hero Section Component
 */

import React from 'react';
import { ArrowRight, Users, Home, ShoppingBag, MessageSquare } from 'lucide-react';
import { Button } from '@/components/common';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-neutral-50 via-primary-50 to-neutral-50 px-4 py-24 sm:px-6 lg:px-8">
      {/* Decorative Background Elements */}
      <div className="absolute -left-40 top-0 h-80 w-80 rounded-full bg-primary-200/30 blur-3xl" />
      <div className="absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-secondary-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div className="flex flex-col gap-8">
            {/* Badge */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/50 px-4 py-2 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-500" />
              </span>
              <span className="text-sm font-medium text-neutral-700">
                Trusted by 50,000+ students
              </span>
            </div>

            {/* Headline */}
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl font-bold leading-tight text-neutral-950 sm:text-5xl lg:text-6xl">
                Find Your Perfect
                <span className="relative ml-2">
                  <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    Student Living
                  </span>
                </span>
              </h1>
              <p className="text-lg text-neutral-600 sm:text-xl">
                Discover rooms, connect with roommates, buy/sell textbooks, and chat securely.
                Everything you need for student housing in one platform.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                className="gap-2"
                onClick={() =>
                  document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() =>
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Learn More
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-4">
              {[
                { icon: Home, label: 'Verified Rooms', value: '10K+' },
                { icon: Users, label: 'Roommates', value: '50K+' },
                { icon: ShoppingBag, label: 'Listings', value: '5K+' },
                { icon: MessageSquare, label: 'Chats Daily', value: '100K+' },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex flex-col gap-1 rounded-lg bg-white/40 p-3 backdrop-blur-sm"
                >
                  <Icon className="h-5 w-5 text-primary-600" />
                  <p className="text-xs text-neutral-600">{label}</p>
                  <p className="font-bold text-neutral-900">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-96 overflow-hidden rounded-3xl lg:h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-400 via-primary-500 to-secondary-600 opacity-20" />
            <img
              src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=600&fit=crop"
              alt="Student Living"
              className="h-full w-full object-cover"
            />
            {/* Floating Card */}
            <div className="absolute bottom-6 left-6 right-6 flex gap-3 rounded-2xl bg-white/95 p-4 shadow-2xl backdrop-blur-sm">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500" />
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-neutral-900">Perfect Match Found!</p>
                <p className="text-sm text-neutral-600">You&apos;re 92% compatible with Sarah</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

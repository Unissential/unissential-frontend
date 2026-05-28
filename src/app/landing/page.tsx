'use client';

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const [email, setEmail] = useState('');

  const handleSignup = () => {
    console.log('Signup with email:', email);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative px-4 py-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-10 inline-flex items-center gap-2 rounded-full bg-secondary-50 px-4 py-2">
            <span className="text-sm font-medium text-secondary-600">✨ Simplifying Student Living</span>
          </div>
          
          <h1 className="mb-10 text-5xl font-bold text-neutral-900 sm:text-6xl">
            Your Complete
            <br />
            <span className="text-primary-600">Student Living</span>
            <br />
            Platform
          </h1>

          <p className="mb-12 text-lg text-neutral-600">
            Find temporary housing, connect with roommates, and buy or sell student essentials—all in one place designed for university students.
          </p>

          {/* Trust Indicators */}
          <div className="mb-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-sm text-neutral-600">No hidden fees</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-sm text-neutral-600">Verified students</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-sm text-neutral-600">Secure platform</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="rounded-lg bg-primary-600 px-10 py-4 font-semibold text-white hover:bg-primary-700 flex items-center gap-2 transition-colors">
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </button>
            <button className="rounded-lg border-2 border-primary-600 px-10 py-4 font-semibold text-primary-600 hover:bg-primary-50 transition-colors">
              Browse Listings
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-neutral-200 px-4 py-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-3">
            {/* Short-Term Leasing */}
            <div className="rounded-2xl bg-white p-10 shadow-md transition-all hover:shadow-lg">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white font-bold text-lg">
                🏢
              </div>
              <h3 className="mb-4 text-lg font-bold text-neutral-900">Short-Term Leasing</h3>
              <p className="mb-8 text-neutral-700">
                Lease your room for flexible durations—1 month, semester, or custom periods
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-neutral-700">
                  📍 Near campus locations
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-700">
                  📅 Flexible lease terms
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-700">
                  💰 Affordable rates
                </li>
              </ul>
            </div>

            {/* Roommate Finder */}
            <div className="rounded-2xl bg-white p-10 shadow-md transition-all hover:shadow-lg">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white font-bold text-lg">
                👥
              </div>
              <h3 className="mb-4 text-lg font-bold text-neutral-900">Roommate Finder</h3>
              <p className="mb-8 text-neutral-700">
                Connect with compatible roommates based on lifestyle and preferences
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-neutral-700">
                  ✓ Verified profiles
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-700">
                  💚 Smart matching
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-700">
                  🔒 Safe connections
                </li>
              </ul>
            </div>

            {/* Student Marketplace */}
            <div className="rounded-2xl bg-white p-10 shadow-md transition-all hover:shadow-lg">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-secondary-600 text-white font-bold text-lg">
                🛍️
              </div>
              <h3 className="mb-4 text-lg font-bold text-neutral-900">Student Marketplace</h3>
              <p className="mb-8 text-neutral-700">
                Buy and sell furniture, electronics, and student essentials affordably
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-neutral-700">
                  💎 Great deals
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-700">
                  📍 Local pickup
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-700">
                  ⭐ Trusted sellers
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-neutral-200 bg-blue-50 px-4 py-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 text-center sm:grid-cols-4">
            <div>
              <p className="text-5xl font-bold text-primary-600">10,000+</p>
              <p className="mt-4 text-neutral-700">Active Students</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-primary-600">500+</p>
              <p className="mt-4 text-neutral-700">Available Rooms</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-primary-600">2,000+</p>
              <p className="mt-4 text-neutral-700">Items Listed</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-primary-600">50+</p>
              <p className="mt-4 text-neutral-700">Universities</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-neutral-200 px-4 py-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-3xl bg-gradient-to-r from-primary-600 to-purple-600 p-16 text-center text-white">
            <h2 className="mb-6 text-4xl font-bold">Ready to simplify your student living?</h2>
            <p className="mb-12 text-lg opacity-90">Join thousands of students already using Unissential</p>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg bg-white/20 px-5 py-3 text-white placeholder:text-white/60 outline-none focus:bg-white/30 transition-colors"
              />
              <button
                onClick={handleSignup}
                className="rounded-lg bg-secondary-500 px-10 py-3 font-semibold text-white hover:bg-secondary-600 transition-colors whitespace-nowrap"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

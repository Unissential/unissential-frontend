/**
 * Featured Rooms Section
 */

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { RoomCard, Button } from '@/components/common';
import { featuredRooms } from '@/data/landing-mock';

export const FeaturedRoomsSection: React.FC = () => {
  return (
    <section className="relative px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
              Featured Rooms
            </h2>
            <p className="mt-3 text-lg text-neutral-600">
              Discover top-rated student housing options in your area
            </p>
          </div>
          <Button variant="outline" className="hidden gap-2 sm:inline-flex">
            View All Rooms
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Rooms Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onViewDetails={() => console.log('View room:', room.id)}
            />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 flex sm:hidden">
          <Button size="lg" fullWidth className="gap-2">
            View All Rooms
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-primary-50 to-secondary-50 p-8">
          <div className="grid gap-8 text-center sm:grid-cols-3">
            {[
              { number: '10,000+', label: 'Verified Rooms' },
              { number: '$500-2000', label: 'Price Range' },
              { number: '98%', label: 'Tenant Satisfaction' },
            ].map(({ number, label }) => (
              <div key={label}>
                <p className="text-4xl font-bold text-primary-600">{number}</p>
                <p className="mt-2 text-neutral-600">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

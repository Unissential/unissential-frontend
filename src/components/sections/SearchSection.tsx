/**
 * Search Section Component
 */

import React, { useState } from 'react';
import { Search, MapPin, DollarSign } from 'lucide-react';
import { Button, Badge } from '@/components/common';

export const SearchSection: React.FC = () => {
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [roomType, setRoomType] = useState('');

  const handleSearch = () => {
    console.log('Search:', { location, budget, roomType });
  };

  const popularSearches = [
    { label: 'Near Campus', value: 'near-campus' },
    { label: 'Downtown', value: 'downtown' },
    { label: 'Shared Housing', value: 'shared' },
    { label: 'Under $1000', value: 'budget' },
  ];

  return (
    <section id="search-section" className="relative px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl">Find Your New Home</h2>
          <p className="mt-4 text-lg text-neutral-600">
            Search from thousands of verified student housing options
          </p>
        </div>

        {/* Search Box */}
        <div className="rounded-2xl bg-white p-6 shadow-xl sm:p-8">
          <div className="grid gap-4 md:grid-cols-4 md:gap-3">
            {/* Location */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-semibold text-neutral-700">Location</label>
              <div className="flex items-center gap-2 rounded-lg border-2 border-neutral-200 px-4 py-3 focus-within:border-primary-500">
                <MapPin className="h-5 w-5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="City or neighborhood"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 bg-transparent outline-none placeholder:text-neutral-500"
                />
              </div>
            </div>

            {/* Budget */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-neutral-700">Max Budget</label>
              <div className="flex items-center gap-2 rounded-lg border-2 border-neutral-200 px-4 py-3 focus-within:border-primary-500">
                <DollarSign className="h-5 w-5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="$1500"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-transparent outline-none placeholder:text-neutral-500"
                />
              </div>
            </div>

            {/* Room Type */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-neutral-700">Room Type</label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="rounded-lg border-2 border-neutral-200 bg-white px-4 py-3 outline-none focus:border-primary-500"
              >
                <option value="">All types</option>
                <option value="studio">Studio</option>
                <option value="1bed">1 Bedroom</option>
                <option value="2bed">2 Bedrooms</option>
                <option value="shared">Shared Room</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <Button size="lg" className="w-full gap-2" onClick={handleSearch}>
                <Search className="h-5 w-5" />
                <span className="hidden sm:inline">Search</span>
              </Button>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="mt-6 border-t border-neutral-200 pt-6">
            <p className="mb-3 text-sm font-semibold text-neutral-700">Popular searches</p>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => {
                    setLocation(label);
                    handleSearch();
                  }}
                  className="inline-flex items-center rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-primary-100 hover:text-primary-700"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 grid gap-4 text-center sm:grid-cols-3">
          {[
            { icon: '🔒', title: 'Secure & Verified', desc: 'All listings verified' },
            { icon: '⚡', title: 'Quick Matches', desc: '1000s of options' },
            { icon: '💬', title: 'Direct Chat', desc: 'Connect instantly' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="rounded-xl bg-neutral-50 p-4">
              <p className="text-2xl">{icon}</p>
              <p className="mt-2 font-semibold text-neutral-900">{title}</p>
              <p className="text-sm text-neutral-600">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

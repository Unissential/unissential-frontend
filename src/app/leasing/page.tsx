'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui';
import { ListingCard } from '@/components/features/leasing/ListingCard';
import { SearchSection } from '@/components/features/leasing/SearchSection';
import { mockListings } from '@/data/mockListings';
import { FilterOptions, Listing } from '@/types/listing';

export default function LeasingPage() {
  const [filters, setFilters] = useState<FilterOptions>({
    duration: 'all',
    priceRange: 'all',
    petFriendly: false,
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Filter listings based on current filters
  const filteredListings = useMemo(() => {
    return mockListings.filter((listing) => {
      // Duration filter - case insensitive substring match
      if (filters.duration !== 'all') {
        const listingDuration = listing.duration.toLowerCase();
        const filterDuration = filters.duration.toLowerCase();
        
        // Check if filter duration is contained in or matches listing duration
        if (!listingDuration.includes(filterDuration)) {
          return false;
        }
      }

      // Price filter
      if (filters.priceRange !== 'all') {
        const priceThresholds: Record<string, number> = {
          under800: 800,
          under1000: 1000,
          under1500: 1500,
        };
        const threshold = priceThresholds[filters.priceRange];
        if (threshold && listing.price > threshold) {
          return false;
        }
      }

      // Pet friendly filter
      if (filters.petFriendly && !listing.amenities.includes('Pet Friendly')) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          listing.title.toLowerCase().includes(query) ||
          listing.location.toLowerCase().includes(query) ||
          listing.amenities.some((a) => a.toLowerCase().includes(query))
        );
      }

      return true;
    });
  }, [filters, searchQuery]);

  return (
    <main className="min-h-screen bg-white">
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="pt-20 md:pt-24 pb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-3">
            Find Your Perfect Place
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl">
            Browse thousands of verified listings near your campus. Simple, transparent, and designed for students.
          </p>
        </motion.div>

        {/* Search & Filters */}
        <SearchSection
          onFilterChange={(newFilters) => {
            setFilters(newFilters);
          }}
        />

        {/* Results Header */}
        <div className="flex items-center justify-between mb-8 pb-8 border-b border-neutral-100">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">
              Listings
            </h2>
            <p className="text-neutral-600 mt-1">
              {filteredListings.length} {filteredListings.length !== 1 ? 'places' : 'place'} available
            </p>
          </div>

          {/* Sort Options */}
          <motion.select
            whileHover={{ scale: 1.02 }}
            className="px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/10"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="distance">Distance</option>
          </motion.select>
        </div>

        {/* Listings Grid */}
        {filteredListings.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20"
          >
            {filteredListings.map((listing, index) => (
              <ListingCard key={listing.id} listing={listing} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="py-20 text-center"
          >
            <div className="text-neutral-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto mb-4 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              No listings found
            </h3>
            <p className="text-neutral-600">
              Try adjusting your filters or search terms to find what you&apos;re looking for.
            </p>
          </motion.div>
        )}
      </Container>
    </main>
  );
}

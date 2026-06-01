'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui';
import { ListingCard } from '@/components/features/leasing/ListingCard';
import { SearchSection } from '@/components/features/leasing/SearchSection';
import { mockListings } from '@/data/mockListings';
import { FilterOptions, Listing, SortOption } from '@/types/listing';

interface FilterState extends FilterOptions {
  searchQuery?: string;
}

export default function LeasingPage() {
  const [filters, setFilters] = useState<FilterState>({
    duration: 'all',
    priceRange: 'all',
    petFriendly: false,
    sortBy: 'newest',
    searchQuery: '',
  });

  // Comprehensive filtering and sorting logic
  const filteredListings = useMemo(() => {
    let results = mockListings.filter((listing) => {
      // Duration filter - case insensitive substring match
      if (filters.duration !== 'all') {
        const listingDuration = listing.duration.toLowerCase();
        const filterDuration = (filters.duration as string).toLowerCase();

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

      // Search query filter - case insensitive, multi-field search
      if (filters.searchQuery && filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch =
          listing.title.toLowerCase().includes(query) ||
          listing.location.toLowerCase().includes(query) ||
          listing.amenities.some((a) => a.toLowerCase().includes(query));

        if (!matchesSearch) {
          return false;
        }
      }

      return true;
    });

    // Apply sorting
    const sortBy = filters.sortBy || 'newest';
    results.sort((a, b) => {
      switch (sortBy) {
        case 'priceLow':
          return a.price - b.price;
        case 'priceHigh':
          return b.price - a.price;
        case 'distance':
          // Mock distance sorting - in production, calculate real distance
          return a.location.localeCompare(b.location);
        case 'newest':
        default:
          // Keep original order (newest first)
          return 0;
      }
    });

    return results;
  }, [filters]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-neutral-50 to-white">
      <Container>
        {/* Header */}
        <div
          className="pt-20 md:pt-24 pb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-3">
            Find Your Perfect Place
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl">
            Browse thousands of verified listings near your campus. Simple, transparent, and designed for students.
          </p>
        </div>

        {/* Search & Filters */}
        <SearchSection
          onFilterChange={(newFilters) => {
            setFilters((prev) => ({
              ...prev,
              duration: newFilters.duration,
              priceRange: newFilters.priceRange,
              petFriendly: newFilters.petFriendly,
              sortBy: newFilters.sortBy || 'newest',
              searchQuery: newFilters.searchQuery || '',
            }));
          }}
        />

        {/* Results Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-8 border-b border-neutral-200">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">
              Listings
            </h2>
            <p
              className="text-neutral-600 mt-1"
            >
              {filteredListings.length} {filteredListings.length !== 1 ? 'places' : 'place'} available
            </p>
          </div>
        </div>

        {/* Listings Grid with Empty State */}
        {filteredListings.length > 0 ? (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20"
          >
            {filteredListings.map((listing, index) => (
              <div
                key={listing.id}
              >
                <ListingCard listing={listing} index={index} />
              </div>
            ))}
          </div>
        ) : (
          <div
            className="py-24 text-center"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center"
            >
              <svg
                className="w-10 h-10 text-primary-600"
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
            </motion.div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">
              No listings found
            </h3>
            <p className="text-neutral-600 max-w-md mx-auto mb-8">
              {filters.searchQuery && filters.searchQuery.trim()
                ? `No listings match "${filters.searchQuery}". Try adjusting your search terms.`
                : 'Try adjusting your filters or search terms to find what you\'re looking for.'}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                setFilters({
                  duration: 'all',
                  priceRange: 'all',
                  petFriendly: false,
                  sortBy: 'newest',
                  searchQuery: '',
                })
              }
              className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Clear All Filters
            </motion.button>
          </div>
        )}
      </Container>
    </main>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui';
import { ListingCard } from '@/components/features/leasing/ListingCard';
import { SearchSection } from '@/components/features/leasing/SearchSection';
import { listingService } from '@/services/api/listing.service';
import { ListingDTO } from '@/types/api';
import { useToast } from '@/contexts/ToastContext';
import { Loader } from 'lucide-react';

export default function LeasingPage() {
  const { addToast } = useToast();
  const [listings, setListings] = useState<ListingDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    searchQuery: '',
    minPrice: 0,
    maxPrice: 5000,
    bedrooms: 0,
    petFriendly: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch listings on mount and when filters change
  useEffect(() => {
    const loadListings = async () => {
      setIsLoading(true);
      try {
        const response = await listingService.getAllListings(currentPage, 12, {
          minPrice: filters.minPrice || undefined,
          maxPrice: filters.maxPrice || undefined,
          bedrooms: filters.bedrooms || undefined,
          petFriendly: filters.petFriendly || undefined,
        });
        setListings(response.data);
        setTotalPages(response.pagination.pages);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load listings';
        addToast(message, 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadListings();
  }, [filters, currentPage, addToast]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <Container>
      <div className="py-12">
        <SearchSection onFilterChange={handleFilterChange} />

        {isLoading ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <Loader className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading listings...</p>
            </div>
          </div>
        ) : listings.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {listings.map((listing, index) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ListingCard listing={listing} />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No listings found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </Container>
  );
}
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

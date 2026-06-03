'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui';
import { ListingCard } from '@/components/features/leasing/ListingCard';
import { SearchSection } from '@/components/features/leasing/SearchSection';
import { listingService } from '@/services/api/listing.service';
import { useToast } from '@/contexts/ToastContext';
import { Loader } from 'lucide-react';
import { FilterOptions } from '@/types/listing';

export default function LeasingPage() {
  const { addToast } = useToast();
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions & { search?: string }>({
    sort: 'newest',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch listings on mount and when filters change
  useEffect(() => {
    const loadListings = async () => {
      setIsLoading(true);
      try {
        const response = await listingService.getAllListings(currentPage, 12, filters);
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

  const handleFilterChange = (newFilters: FilterOptions & { search?: string }) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
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
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <p className="text-gray-600 text-lg">No listings found</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}

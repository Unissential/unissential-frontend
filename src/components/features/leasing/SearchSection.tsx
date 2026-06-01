'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Filter, Plus } from 'lucide-react';
import { FilterOptions } from '@/types/listing';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchSectionProps {
  onFilterChange?: (filters: FilterOptions & { searchQuery: string }) => void;
}

const durationOptions = [
  { id: 'all', label: 'All Durations', value: 'all' },
  { id: '1-2', label: '1-2 months', value: '1-2 months' },
  { id: 'semester', label: 'Semester', value: 'Semester' },
  { id: 'summer', label: 'Summer', value: 'Summer' },
];

const priceOptions = [
  { id: 'all', label: 'All Prices', value: 'all' },
  { id: 'under800', label: 'Under $800', value: 'under800' },
  { id: 'under1000', label: 'Under $1000', value: 'under1000' },
  { id: 'under1500', label: 'Under $1500', value: 'under1500' },
];

const sortOptions = [
  { id: 'newest', label: 'Newest First', value: 'newest' },
  { id: 'priceLow', label: 'Price: Low to High', value: 'priceLow' },
  { id: 'priceHigh', label: 'Price: High to Low', value: 'priceHigh' },
  { id: 'distance', label: 'Distance', value: 'distance' },
];

export const SearchSection: React.FC<SearchSectionProps> = ({ onFilterChange }) => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [isPetFriendly, setIsPetFriendly] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'priceLow' | 'priceHigh' | 'distance'>('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search input for better performance
  const debouncedSearchQuery = useDebounce(searchInput, 300);

  // Notify parent when filters or search changes
  React.useEffect(() => {
    onFilterChange?.({
      duration: selectedDuration as any,
      priceRange: selectedPrice as any,
      petFriendly: isPetFriendly,
      sortBy,
      searchQuery: debouncedSearchQuery,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDuration, selectedPrice, isPetFriendly, sortBy, debouncedSearchQuery]);

  return (
    <div className="py-8 md:py-12 relative z-10">
      {/* Search Bar */}
      <div
        className="mb-8"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none" size={20} />
          <input
            type="text"
            placeholder="Search by location, university, or keywords..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all text-neutral-900 placeholder-neutral-500"
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div
        className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8"
      >
        {/* Duration Pills */}
        <div className="flex items-center gap-3 flex-wrap">
          {durationOptions.map((option) => (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDuration(option.value as any)}
              className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
                selectedDuration === option.value
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {option.label}
            </motion.button>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 rounded-lg border border-neutral-200 bg-white text-neutral-700 font-medium text-sm hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500/10 transition-all cursor-pointer"
        >
          {sortOptions.map((option) => (
            <option key={option.id} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors text-sm font-medium"
          >
            <Filter size={18} />
            <span>Filters</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/leasing/create')}
            className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium text-sm transition-colors shadow-md hover:shadow-lg"
          >
            <Plus size={18} />
            <span>Post Room</span>
          </motion.button>
        </div>
      </div>

      {/* Expanded Filters */}
      <motion.div
        initial={false}
        animate={{
          height: showFilters ? 'auto' : 0,
          opacity: showFilters ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden relative z-20"
      >
        <div className="bg-gradient-to-br from-neutral-50 to-white border border-neutral-200 rounded-xl p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Price Filter */}
            <div className="relative z-0">
              <label className="block text-sm font-semibold text-neutral-900 mb-3">
                Price Range
              </label>
              <div className="space-y-2">
                {priceOptions.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white transition-colors cursor-pointer relative z-0"
                  >
                    <input
                      type="radio"
                      name="price"
                      value={option.value}
                      checked={selectedPrice === option.value}
                      onChange={(e) => setSelectedPrice(e.target.value as any)}
                      className="w-4 h-4 accent-primary-600 cursor-pointer"
                    />
                    <span className="text-sm text-neutral-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pet Friendly */}
            <div className="relative z-0">
              <label className="block text-sm font-semibold text-neutral-900 mb-3">
                Amenities
              </label>
              <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-white transition-colors cursor-pointer relative z-0">
                <input
                  type="checkbox"
                  checked={isPetFriendly}
                  onChange={(e) => setIsPetFriendly(e.target.checked)}
                  className="w-4 h-4 accent-primary-600 rounded cursor-pointer"
                />
                <span className="text-sm text-neutral-700">Pet Friendly</span>
              </label>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end relative z-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedDuration('all');
                  setSelectedPrice('all');
                  setIsPetFriendly(false);
                  setSearchInput('');
                  setSortBy('newest');
                }}
                className="w-full px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg font-medium text-sm hover:bg-white transition-colors"
              >
                Clear All
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

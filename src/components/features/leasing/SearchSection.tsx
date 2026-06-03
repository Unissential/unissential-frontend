'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Filter, Plus } from 'lucide-react';
import { FilterOptions } from '@/types/listing';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchSectionProps {
  onFilterChange?: (filters: FilterOptions & { search?: string }) => void;
}

const leaseDurationOptions = [
  { id: 'all', label: 'All Durations', value: '' },
  { id: 'flexible', label: 'Flexible', value: 'flexible' },
  { id: '3-months', label: '3 Months', value: '3-months' },
  { id: '6-months', label: '6 Months', value: '6-months' },
  { id: '12-months', label: '12 Months', value: '12-months' },
];

const sortOptions = [
  { id: 'newest', label: 'Newest First', value: 'newest' },
  { id: 'price-asc', label: 'Price: Low to High', value: 'price-asc' },
  { id: 'price-desc', label: 'Price: High to Low', value: 'price-desc' },
];

export const SearchSection: React.FC<SearchSectionProps> = ({ onFilterChange }) => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [isPetFriendly, setIsPetFriendly] = useState(false);
  const [isFurnished, setIsFurnished] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search input for better performance
  const debouncedSearchQuery = useDebounce(searchInput, 300);

  // Notify parent when filters or search changes
  React.useEffect(() => {
    const filters: FilterOptions & { search?: string } = {
      search: debouncedSearchQuery || undefined,
      leaseDuration: selectedDuration ? (selectedDuration as any) : undefined,
      minPrice: minPrice !== undefined && minPrice > 0 ? minPrice : undefined,
      maxPrice: maxPrice !== undefined && maxPrice > 0 ? maxPrice : undefined,
      petFriendly: isPetFriendly || undefined,
      furnished: isFurnished || undefined,
      sort: sortBy,
    };
    onFilterChange?.(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDuration, minPrice, maxPrice, isPetFriendly, isFurnished, sortBy, debouncedSearchQuery]);

  return (
    <div className="py-8 md:py-12 relative z-10">
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none"
            size={20}
          />
          <input
            type="text"
            placeholder="Search listings, location, university..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all text-neutral-900 placeholder-neutral-500"
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
        {/* Lease Duration Pills */}
        <div className="flex items-center gap-3 flex-wrap">
          {leaseDurationOptions.map((option) => (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDuration(option.value)}
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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-3">Price Range</label>
              <div className="space-y-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice || ''}
                  onChange={(e) => setMinPrice(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 outline-none"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice || ''}
                  onChange={(e) => setMaxPrice(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 outline-none"
                />
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-3">Amenities</label>
              <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-white transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPetFriendly}
                  onChange={(e) => setIsPetFriendly(e.target.checked)}
                  className="w-4 h-4 accent-primary-600 rounded cursor-pointer"
                />
                <span className="text-sm text-neutral-700">Pet Friendly</span>
              </label>
              <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-white transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFurnished}
                  onChange={(e) => setIsFurnished(e.target.checked)}
                  className="w-4 h-4 accent-primary-600 rounded cursor-pointer"
                />
                <span className="text-sm text-neutral-700">Furnished</span>
              </label>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-3">Availability</label>
              <div className="text-sm text-neutral-600">
                <p>Filter by lease duration above</p>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedDuration('');
                  setMinPrice(undefined);
                  setMaxPrice(undefined);
                  setIsPetFriendly(false);
                  setIsFurnished(false);
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

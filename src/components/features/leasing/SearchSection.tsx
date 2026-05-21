'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus } from 'lucide-react';
import { FilterOptions } from '@/types/listing';

interface SearchSectionProps {
  onFilterChange?: (filters: FilterOptions) => void;
}

const durationOptions = [
  { id: 'all', label: 'All Durations', value: 'all' },
  { id: '1-2', label: '1-2 months', value: '1-2' },
  { id: 'semester', label: 'Semester', value: 'semester' },
  { id: 'summer', label: 'Summer', value: 'summer' },
];

const priceOptions = [
  { id: 'all', label: 'All Prices', value: 'all' },
  { id: 'under800', label: 'Under $800', value: 'under800' },
  { id: 'under1000', label: 'Under $1000', value: 'under1000' },
  { id: 'under1500', label: 'Under $1500', value: 'under1500' },
];

export const SearchSection: React.FC<SearchSectionProps> = ({ onFilterChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [isPetFriendly, setIsPetFriendly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Notify parent when filters change
  // Note: onFilterChange is intentionally excluded from dependencies to prevent infinite loops
  React.useEffect(() => {
    onFilterChange?.({
      duration: selectedDuration as FilterOptions['duration'],
      priceRange: selectedPrice as FilterOptions['priceRange'],
      petFriendly: isPetFriendly,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDuration, selectedPrice, isPetFriendly]);

  return (
    <div className="py-12 md:py-16">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
          <input
            type="text"
            placeholder="Search by location, university, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all text-neutral-900 placeholder-neutral-500"
          />
        </div>
      </motion.div>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8"
      >
        {/* Duration Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
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

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
          >
            <Filter size={18} />
            <span className="font-medium text-sm">Filters</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium text-sm transition-colors"
          >
            <Plus size={18} />
            <span>Post Room</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Expanded Filters */}
      <motion.div
        initial={false}
        animate={{
          height: showFilters ? 'auto' : 0,
          opacity: showFilters ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Price Filter */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-3">
                Price Range
              </label>
              <div className="space-y-2">
                {priceOptions.map((option) => (
                  <motion.label
                    key={option.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white transition-colors cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="price"
                      value={option.value}
                      checked={selectedPrice === option.value}
                      onChange={(e) => setSelectedPrice(e.target.value as any)}
                      className="w-4 h-4 accent-primary-600"
                    />
                    <span className="text-sm text-neutral-700">{option.label}</span>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Pet Friendly */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-3">
                Amenities
              </label>
              <motion.label className="flex items-center gap-3 p-2 rounded-lg hover:bg-white transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPetFriendly}
                  onChange={(e) => setIsPetFriendly(e.target.checked)}
                  className="w-4 h-4 accent-primary-600 rounded"
                />
                <span className="text-sm text-neutral-700">Pet Friendly</span>
              </motion.label>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedDuration('all');
                  setSelectedPrice('all');
                  setIsPetFriendly(false);
                  setSearchQuery('');
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

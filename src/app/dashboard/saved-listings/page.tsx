'use client';

import { motion } from 'framer-motion';
import { SavedItemCard, EmptyState } from '@/components/dashboard';
import { useState } from 'react';

const mockSavedListings = [];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function SavedListingsPage() {
  const [savedItems, setSavedItems] = useState(mockSavedListings);
  const [filter, setFilter] = useState<'all' | 'lease' | 'roommate' | 'product'>('all');

  const filtered =
    filter === 'all' ? savedItems : savedItems.filter((item) => item.type === filter);

  const handleRemove = (id: string) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const types = [
    { label: 'All', value: 'all' as const },
    { label: 'Leases', value: 'lease' as const },
    { label: 'Roommates', value: 'roommate' as const },
    { label: 'Products', value: 'product' as const },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Header */}
      <motion.div variants={item} className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">Saved Listings</h1>
        <p className="text-neutral-600">
          {filtered.length} saved item{filtered.length !== 1 ? 's' : ''}
        </p>
      </motion.div>

      {/* Filter Tabs */}
      {savedItems.length > 0 && (
        <motion.div variants={item} className="flex gap-2 flex-wrap">
          {types.map((type) => (
            <button
              key={type.value}
              onClick={() => setFilter(type.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === type.value
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              {type.label}
            </button>
          ))}
        </motion.div>
      )}

      {/* Grid or Empty State */}
      {filtered.length > 0 ? (
        <motion.div
          variants={container}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {filtered.map((listing) => (
            <motion.div key={listing.id} variants={item}>
              <SavedItemCard item={listing} onRemove={handleRemove} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyState
          icon="❤️"
          title={`No saved ${filter === 'all' ? 'listings' : filter + 's'}`}
          description={`Browse and save ${filter === 'all' ? 'listings' : filter + 's'} you're interested in`}
          ctaText={`Explore ${filter === 'all' ? 'listings' : filter + 's'}`}
          ctaHref={
            filter === 'lease' ? '/leasing' : filter === 'roommate' ? '/roommates' : '/marketplace'
          }
        />
      )}
    </motion.div>
  );
}

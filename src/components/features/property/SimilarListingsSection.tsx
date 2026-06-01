'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ListingCard } from '@/components/features/leasing/ListingCard';
import { Listing } from '@/types/listing';

interface SimilarListingsSectionProps {
  listings: Listing[];
}

export const SimilarListingsSection: React.FC<SimilarListingsSectionProps> = ({ listings }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Similar Listings</h2>
        <p className="text-neutral-600">Explore other great properties in the area</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {listings.map((listing, index) => (
          <ListingCard key={listing.id} listing={listing} index={index} />
        ))}
      </div>
    </motion.div>
  );
};

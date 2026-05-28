'use client';

import { motion } from 'framer-motion';
import { Edit, Trash2, Eye, Heart, MessageCircle, MoreVertical } from 'lucide-react';
import { mockMyListings } from '@/data/mockDashboard';
import { useState } from 'react';
import Image from 'next/image';

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

export default function MyListingsPage() {
  const [listings, setListings] = useState(mockMyListings);
  const [selectedListing, setSelectedListing] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setListings((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">My Listings</h1>
          <p className="text-neutral-600">{listings.length} active listing{listings.length !== 1 ? 's' : ''}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 whitespace-nowrap"
        >
          + New Listing
        </motion.button>
      </motion.div>

      {/* Listings Table/Cards */}
      {listings.length > 0 ? (
        <motion.div variants={container} className="space-y-4">
          {listings.map((listing) => (
            <motion.div
              key={listing.id}
              variants={item}
              whileHover={{ x: 4, backgroundColor: '#f9fafb' }}
              className="bg-white rounded-xl border border-neutral-200 overflow-hidden transition-all"
            >
              <div className="flex flex-col sm:flex-row gap-4 p-4">
                {/* Image */}
                <div className="relative w-full sm:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-200">
                  <Image
                    src={listing.image}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-neutral-900 line-clamp-2">{listing.title}</h3>
                    <p className="text-sm text-neutral-600 mt-1">Posted 2 weeks ago</p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 mt-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Eye size={16} className="text-neutral-600" />
                      <span className="text-neutral-700 font-medium">{listing.views} views</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Heart size={16} className="text-red-500" />
                      <span className="text-neutral-700 font-medium">{listing.interested} saved</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MessageCircle size={16} className="text-blue-500" />
                      <span className="text-neutral-700 font-medium">3 messages</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-2 sm:justify-between flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    title="Edit listing"
                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <Edit size={18} className="text-neutral-700" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleDelete(listing.id)}
                    title="Delete listing"
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} className="text-red-600" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setSelectedListing(selectedListing === listing.id ? null : listing.id)}
                    title="More options"
                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <MoreVertical size={18} className="text-neutral-700" />
                  </motion.button>
                </div>
              </div>

              {/* Expanded Options */}
              {selectedListing === listing.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-neutral-200 px-4 py-3 bg-neutral-50 space-y-2"
                >
                  <button className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-white rounded-lg transition-colors">
                    Mark as sold
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-white rounded-lg transition-colors">
                    Update price
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-white rounded-lg transition-colors">
                    Boost listing
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-white rounded-lg transition-colors">
                    Mark unavailable
                  </button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div variants={item} className="text-center py-16">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-2xl font-bold text-neutral-900 mb-2">No listings yet</h3>
          <p className="text-neutral-600 mb-6">Start selling by creating your first listing</p>
          <motion.button
            whileHover={{ scale: 1.05, x: 4 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700"
          >
            Create First Listing →
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}

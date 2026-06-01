'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Share2, MessageCircle, Download } from 'lucide-react';
import { PropertyDetail } from '@/types/property';

interface BookingSidebarProps {
  property: PropertyDetail;
}

export const BookingSidebar: React.FC<BookingSidebarProps> = ({ property }) => {
  const [isFavorite, setIsFavorite] = useState(property.isFavorite || false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="sticky top-24 p-6 rounded-2xl border border-neutral-200 bg-white shadow-lg space-y-4"
    >
      {/* Price */}
      <div className="border-b border-neutral-200 pb-4">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-neutral-900">${property.price}</span>
          <span className="text-neutral-600">/month</span>
        </div>
        <p className="text-sm text-neutral-600 mt-1">{property.duration}</p>
      </div>

      {/* Contact Buttons */}
      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 px-4 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <MessageCircle size={18} />
          Contact Host
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 px-4 rounded-lg border-2 border-primary-600 hover:bg-primary-50 text-primary-600 font-semibold transition-colors"
        >
          Schedule Tour
        </motion.button>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-4 border-t border-neutral-200">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFavorite(!isFavorite)}
          className={`p-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${
            isFavorite
              ? 'bg-red-50 border-red-200 text-red-600'
              : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
          }`}
        >
          <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          <span className="text-sm font-medium">Save</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-lg border border-neutral-200 hover:border-neutral-300 text-neutral-700 transition-all flex items-center justify-center gap-2"
        >
          <Share2 size={18} />
          <span className="text-sm font-medium">Share</span>
        </motion.button>
      </div>

      {/* Key Info */}
      <div className="space-y-3 pt-4 border-t border-neutral-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-600">Available</span>
          <span className="text-sm font-semibold text-neutral-900">{property.availability}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-600">Lease Period</span>
          <span className="text-sm font-semibold text-neutral-900">{property.duration}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-600">Furnished</span>
          <span className="text-sm font-semibold text-neutral-900 capitalize">
            {property.furnished.split('-').join(' ')}
          </span>
        </div>
      </div>

      {/* Info Box */}
      <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
        <p className="text-xs text-blue-900">
          <strong>Tip:</strong> Contact the host to ask questions and schedule a tour before committing.
        </p>
      </div>
    </motion.div>
  );
};

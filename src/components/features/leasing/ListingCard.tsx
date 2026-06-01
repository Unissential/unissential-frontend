'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, MapPin, Bed, Bath, Calendar, Wifi, UtensilsCrossed, Car } from 'lucide-react';
import { Listing } from '@/types/listing';

interface ListingCardProps {
  listing: Listing;
  index?: number;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, index = 0 }) => {
  const [isFavorite, setIsFavorite] = useState(listing.isFavorite || false);

  return (
    <Link href={`/leasing/${listing.id}`} className="group h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        viewport={{ once: true, margin: '-50px' }}
        className="group h-full"
      >
        <div className="h-full rounded-xl overflow-hidden bg-white border border-neutral-100 hover:border-neutral-200 transition-all duration-300 hover:shadow-2xl flex flex-col">
        {/* Image Section with Badges */}
        <div className="relative overflow-hidden aspect-video bg-neutral-100 w-full">
          <Image
            src={listing.image}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Duration Badge - Left */}
          <div className="absolute top-3 left-3 bg-lime-400 px-2.5 py-1 rounded-md text-xs font-bold text-neutral-900">
            {listing.duration}
          </div>

          {/* Favorite Button - Right */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-3 right-3 p-2 rounded-full bg-white hover:bg-neutral-50 transition-colors shadow-md"
          >
            <Heart
              size={20}
              className={`transition-colors ${
                isFavorite
                  ? 'fill-red-500 text-red-500'
                  : 'text-neutral-300 hover:text-red-500'
              }`}
            />
          </motion.button>
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-1 p-5">
          {/* Top Row: Title and Price */}
          <div className="flex justify-between items-start gap-3 mb-2">
            <h3 className="text-base font-semibold text-neutral-900 flex-1 leading-tight">
              {listing.title}
            </h3>
            <div className="text-right flex-shrink-0">
              <p className="text-xl font-bold text-neutral-900">${listing.price}</p>
              <p className="text-xs text-neutral-500">/month</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-sm text-neutral-600 mb-3">
            <MapPin size={14} className="flex-shrink-0 text-neutral-400" />
            <span>{listing.location}</span>
          </div>

          {/* Info Row 1: Beds and Baths */}
          <div className="flex gap-4 text-sm text-neutral-600 mb-2">
            <div className="flex items-center gap-1.5">
              <Bed size={14} className="text-neutral-400" />
              <span>{listing.beds} bed{listing.beds !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath size={14} className="text-neutral-400" />
              <span>{listing.baths} bath{listing.baths !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Info Row 2: Date Range */}
          <div className="flex items-center gap-1.5 text-sm text-neutral-600 mb-4 pb-4 border-b border-neutral-100">
            <Calendar size={14} className="text-neutral-400" />
            <span>{listing.dateRange}</span>
          </div>

          {/* Amenities with Icons */}
          <div className="mb-4 flex-1">
            <div className="flex flex-wrap gap-3">
              {listing.amenities.map((amenity, idx) => {
                // Map amenity names to icons
                const getAmenityIcon = (name: string) => {
                  if (name.includes('WiFi')) return <Wifi size={14} />;
                  if (name.includes('Kitchen')) return <UtensilsCrossed size={14} />;
                  if (name.includes('Parking')) return <Car size={14} />;
                  return null;
                };

                return idx < 3 ? (
                  <div key={amenity} className="flex items-center gap-1.5 text-xs text-neutral-600">
                    {getAmenityIcon(amenity)}
                    <span>{amenity}</span>
                  </div>
                ) : null;
              })}
              {listing.amenities.length > 3 && (
                <span className="text-xs text-neutral-500 font-medium">+{listing.amenities.length - 3}</span>
              )}
            </div>
          </div>

          {/* View Details Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2.5 border border-neutral-200 hover:bg-neutral-50 text-neutral-900 font-medium text-sm rounded-lg transition-colors"
          >
            View Details
          </motion.button>
        </div>
        </div>
      </motion.div>
    </Link>
  );
};

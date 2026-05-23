'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Bed, Bath, Check } from 'lucide-react';
import { PropertyDetail } from '@/types/property';

interface PropertyInfoProps {
  property: PropertyDetail;
}

export const PropertyInfo: React.FC<PropertyInfoProps> = ({ property }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Title and Price */}
      <motion.div variants={itemVariants} className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">{property.title}</h1>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-neutral-900">${property.price}</span>
          <span className="text-lg text-neutral-600">/month</span>
        </div>
      </motion.div>

      {/* Location and Key Info */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-2 text-neutral-700">
          <MapPin size={18} className="text-primary-500 flex-shrink-0" />
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wide">Location</p>
            <p className="font-medium">{property.location.city}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-neutral-700">
          <Calendar size={18} className="text-primary-500 flex-shrink-0" />
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wide">Duration</p>
            <p className="font-medium">{property.duration}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-neutral-700">
          <Bed size={18} className="text-primary-500 flex-shrink-0" />
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wide">Bedrooms</p>
            <p className="font-medium">{property.beds} bed{property.beds !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-neutral-700">
          <Bath size={18} className="text-primary-500 flex-shrink-0" />
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wide">Bathrooms</p>
            <p className="font-medium">{property.baths} bath{property.baths !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </motion.div>

      {/* Property Details Grid */}
      <motion.div variants={itemVariants} className="border-t border-neutral-200 pt-6">
        <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide mb-4">
          Property Details
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-neutral-500 uppercase tracking-wide">Lease Period</p>
            <p className="font-medium text-neutral-900">{property.dateRange}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-neutral-500 uppercase tracking-wide">Available</p>
            <p className="font-medium text-neutral-900">{property.availability}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-neutral-500 uppercase tracking-wide">Furnished</p>
            <p className="font-medium text-neutral-900 capitalize">
              {property.furnished.replace('-', ' ')}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-neutral-500 uppercase tracking-wide">Roommate Preference</p>
            <p className="font-medium text-neutral-900">{property.roommatePreference}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-neutral-500 uppercase tracking-wide">Address</p>
            <p className="font-medium text-neutral-900">{property.location.address}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-neutral-500 uppercase tracking-wide">Zip Code</p>
            <p className="font-medium text-neutral-900">{property.location.zipCode}</p>
          </div>
        </div>
      </motion.div>

      {/* Nearby Universities */}
      <motion.div variants={itemVariants} className="border-t border-neutral-200 pt-6">
        <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide mb-4">
          Nearby Universities
        </h3>

        <div className="space-y-2">
          {property.location.nearbyUniversities.map((university, idx) => (
            <div key={idx} className="flex items-center gap-2 text-neutral-700">
              <Check size={16} className="text-green-500 flex-shrink-0" />
              <span>{university}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

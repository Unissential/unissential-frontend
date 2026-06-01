'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { PropertyLocation } from '@/types/property';

interface PropertyLocationSectionProps {
  location: PropertyLocation;
}

export const PropertyLocationSection: React.FC<PropertyLocationSectionProps> = ({
  location,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Location</h2>
        <p className="text-neutral-600">
          {location.address}, {location.city}, {location.state} {location.zipCode}
        </p>
      </div>

      {/* Map Placeholder */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="relative w-full h-96 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200"
      >
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100">
          <div className="text-center space-y-2">
            <MapPin size={48} className="mx-auto text-primary-600 opacity-50" />
            <p className="text-neutral-600 font-medium">Map integration coming soon</p>
            <p className="text-sm text-neutral-500">
              Coordinates: {location.latitude}, {location.longitude}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Location Features */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="p-4 rounded-lg border border-neutral-200 hover:border-primary-200 hover:bg-primary-50 transition-all">
          <h4 className="font-semibold text-neutral-900 mb-2">Latitude</h4>
          <p className="text-neutral-600 font-mono text-sm">{location.latitude}</p>
        </div>

        <div className="p-4 rounded-lg border border-neutral-200 hover:border-primary-200 hover:bg-primary-50 transition-all">
          <h4 className="font-semibold text-neutral-900 mb-2">Longitude</h4>
          <p className="text-neutral-600 font-mono text-sm">{location.longitude}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import { PropertyDetail } from '@/types/property';

interface PropertyDescriptionProps {
  property: PropertyDetail;
}

export const PropertyDescription: React.FC<PropertyDescriptionProps> = ({ property }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">About This Property</h2>
        <div className="prose prose-sm max-w-none text-neutral-700 space-y-4">
          {property.fullDescription.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Neighborhood Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        viewport={{ once: true }}
        className="border-t border-neutral-200 pt-6"
      >
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Neighborhood Highlights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {property.neighborhood.highlights.map((highlight, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 p-3 rounded-lg bg-primary-50 border border-primary-100"
            >
              <MapPin size={18} className="text-primary-600 flex-shrink-0" />
              <span className="text-sm text-neutral-700">{highlight}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Commute Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        viewport={{ once: true }}
        className="border-t border-neutral-200 pt-6"
      >
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Commute Times</h3>
        <div className="space-y-3">
          {property.neighborhood.commute.map((commute, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 hover:border-primary-200 hover:bg-neutral-50 transition-all"
            >
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-primary-600 flex-shrink-0" />
                <span className="font-medium text-neutral-900">{commute.destination}</span>
              </div>
              <span className="text-sm text-neutral-600 font-medium">{commute.duration}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* House Rules */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        viewport={{ once: true }}
        className="border-t border-neutral-200 pt-6"
      >
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">House Rules</h3>
        <ul className="space-y-2">
          {property.rules.map((rule, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="flex items-start gap-3 text-neutral-700"
            >
              <span className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 text-primary-600 text-xs font-bold">
                •
              </span>
              {rule}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Cancellation Policy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        viewport={{ once: true }}
        className="border-t border-neutral-200 pt-6"
      >
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Cancellation Policy</h3>
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
          <p className="text-sm text-blue-900">{property.cancellationPolicy}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

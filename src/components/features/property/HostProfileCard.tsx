'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircle, Star, MessageCircle } from 'lucide-react';
import { PropertyHost } from '@/types/property';

interface HostProfileCardProps {
  host: PropertyHost;
}

export const HostProfileCard: React.FC<HostProfileCardProps> = ({ host }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="p-6 rounded-2xl border border-neutral-200 bg-white"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          {/* Host Avatar */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative w-16 h-16 flex-shrink-0 rounded-full overflow-hidden"
          >
            <Image src={host.avatar} alt={host.name} fill className="object-cover" />
          </motion.div>

          {/* Host Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-neutral-900">{host.name}</h3>
              {host.verified && (
                <CheckCircle size={18} className="text-blue-600 flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-neutral-600">{host.joinedDate}</p>
          </div>
        </div>
      </div>

      {/* Bio */}
      <p className="text-neutral-700 text-sm leading-relaxed mb-4">{host.bio}</p>

      {/* Host Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4 p-4 rounded-lg bg-neutral-50 border border-neutral-100">
        <div className="text-center">
          <p className="text-lg font-bold text-neutral-900">{host.rating}</p>
          <div className="flex items-center justify-center gap-0.5 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.floor(host.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-neutral-300'
                }
              />
            ))}
          </div>
          <p className="text-xs text-neutral-600 mt-1">{host.reviews} reviews</p>
        </div>

        <div className="text-center border-l border-r border-neutral-200">
          <p className="text-lg font-bold text-neutral-900">{host.responseRate}%</p>
          <p className="text-xs text-neutral-600 mt-2">Response Rate</p>
        </div>

        <div className="text-center">
          <p className="text-lg font-bold text-neutral-900">{host.totalListings}</p>
          <p className="text-xs text-neutral-600 mt-2">Listings</p>
        </div>
      </div>

      {/* Response Time */}
      <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-100">
        <p className="text-sm text-green-900">
          <strong>Responds within {host.responseDays} day{host.responseDays !== 1 ? 's' : ''}</strong>
        </p>
      </div>

      {/* Contact Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 px-4 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors flex items-center justify-center gap-2"
      >
        <MessageCircle size={18} />
        Message Host
      </motion.button>
    </motion.div>
  );
};

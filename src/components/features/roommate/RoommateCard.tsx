'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, MapPin, BookOpen } from 'lucide-react';
import { RoommateProfile, CompatibilityScore } from '@/types/roommate';
import { CompatibilityBadge } from './CompatibilityBadge';
import Link from 'next/link';

interface RoommateCardProps {
  roommate: RoommateProfile;
  compatibility: CompatibilityScore;
  onConnect?: () => void;
  onSave?: () => void;
  isSaved?: boolean;
  index?: number;
}

/**
 * Roommate Profile Card Component
 * Displays roommate info with compatibility score and action buttons
 */
export const RoommateCard: React.FC<RoommateCardProps> = ({
  roommate,
  compatibility,
  onConnect,
  onSave,
  isSaved = false,
  index = 0,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group rounded-2xl bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-neutral-200"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-neutral-100">
        <Image
          src={roommate.photo}
          alt={roommate.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Compatibility Badge - Top Right */}
        <div className="absolute top-3 right-3">
          <div className="bg-white/90 backdrop-blur-md rounded-full p-2">
            <CompatibilityBadge
              score={compatibility.overall}
              label={compatibility.label}
              size="sm"
              showLabel={false}
              animated={false}
            />
          </div>
        </div>

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSave}
          className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md hover:bg-white transition-colors z-10"
        >
          <Heart
            size={20}
            className={isSaved ? 'fill-red-500 text-red-500' : 'text-neutral-600'}
          />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Name & Basic Info */}
        <div>
          <h3 className="text-lg font-bold text-neutral-900">{roommate.name}</h3>
          <div className="flex items-center gap-1 text-sm text-neutral-600 mt-1">
            <MapPin size={14} />
            <span>{roommate.location}</span>
          </div>
        </div>

        {/* University & Major */}
        <div className="text-sm space-y-1">
          <div className="text-neutral-700">
            <span className="font-semibold">{roommate.university}</span>
          </div>
          <div className="flex items-center gap-1 text-neutral-600">
            <BookOpen size={14} />
            <span>{roommate.major}</span>
          </div>
        </div>

        {/* Quick Info Pills */}
        <div className="flex flex-wrap gap-2">
          <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
            ${roommate.budget.min} - ${roommate.budget.max}
          </div>
          <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
            {roommate.sleepSchedule === 'early-bird'
              ? '🌅 Early Bird'
              : roommate.sleepSchedule === 'night-owl'
                ? '🌙 Night Owl'
                : '⏰ Flexible'}
          </div>
        </div>

        {/* Bio Preview */}
        <p className="text-sm text-neutral-600 line-clamp-2">{roommate.bio}</p>

        {/* Interests Preview */}
        <div className="flex flex-wrap gap-1">
          {roommate.interests.slice(0, 3).map((interest, idx) => (
            <span key={idx} className="text-xs text-neutral-500 bg-neutral-100 rounded-full px-2 py-1">
              #{interest}
            </span>
          ))}
          {roommate.interests.length > 3 && (
            <span className="text-xs text-neutral-500 bg-neutral-100 rounded-full px-2 py-1">
              +{roommate.interests.length - 3}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Link href={`/roommates/${roommate.id}`} className="flex-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 px-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-colors"
            >
              View Profile
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onConnect}
            className="flex-1 py-2 px-3 rounded-lg border-2 border-primary-600 hover:bg-primary-50 text-primary-600 font-semibold text-sm transition-colors flex items-center justify-center gap-1"
          >
            <MessageCircle size={16} />
            <span>Connect</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

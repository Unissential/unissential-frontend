/**
 * Roommate Card Component
 */

import React from 'react';
import { Star, Sparkles } from 'lucide-react';
import type { Roommate } from '@/types/landing';
import { Button } from './Button';

interface RoommateCardProps {
  roommate: Roommate;
  onConnect?: (id: string) => void;
}

export const RoommateCard: React.FC<RoommateCardProps> = ({ roommate, onConnect }) => {
  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 dark:bg-neutral-800">
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary-400 to-primary-600">
        <img
          src={roommate.image}
          alt={roommate.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {roommate.compatibility && (
          <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-primary-600" />
            <span className="text-sm font-bold text-neutral-900">{roommate.compatibility}% Match</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-4">
        {/* Name & Major */}
        <div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{roommate.name}</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {roommate.major} • {roommate.year}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold text-neutral-900 dark:text-white">{roommate.rating}</span>
          <span className="text-sm text-neutral-600 dark:text-neutral-400">• ${roommate.budget}/mo budget</span>
        </div>

        {/* About */}
        <p className="line-clamp-2 text-sm text-neutral-600 dark:text-neutral-300">{roommate.about}</p>

        {/* Interests */}
        <div className="flex flex-wrap gap-1.5">
          {roommate.interests.slice(0, 3).map((interest) => (
            <span
              key={interest}
              className="inline-flex rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
            >
              {interest}
            </span>
          ))}
        </div>

        {/* CTA */}
        <Button size="sm" className="mt-2 w-full" onClick={() => onConnect?.(roommate.id)}>
          Connect
        </Button>
      </div>
    </div>
  );
};

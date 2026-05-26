/**
 * Room Card Component
 */

import React from 'react';
import { MapPin, Star, Wifi, Home, Users, Sofa } from 'lucide-react';
import type { Room } from '@/types/landing';
import { Button } from './Button';

interface RoomCardProps {
  room: Room;
  onViewDetails?: (id: string) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onViewDetails }) => {
  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 dark:bg-neutral-800">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-neutral-200 dark:bg-neutral-700">
        <img
          src={room.image}
          alt={room.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-lg bg-white/90 px-3 py-1.5 backdrop-blur-sm">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold text-neutral-900">{room.rating}</span>
          <span className="text-xs text-neutral-600">({room.reviews})</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-4">
        {/* Title & Location */}
        <div>
          <h3 className="font-bold text-neutral-900 dark:text-white truncate">{room.title}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400">
            <MapPin className="h-4 w-4" />
            {room.location}
          </p>
        </div>

        {/* Room Details */}
        <div className="flex gap-4 border-y border-neutral-200 py-3 dark:border-neutral-700">
          <div className="flex flex-col items-center gap-1">
            <Users className="h-4 w-4 text-primary-600" />
            <span className="text-xs text-neutral-600 dark:text-neutral-400">{room.beds} bed</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Home className="h-4 w-4 text-primary-600" />
            <span className="text-xs text-neutral-600 dark:text-neutral-400">{room.baths} bath</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Sofa className="h-4 w-4 text-primary-600" />
            <span className="text-xs text-neutral-600 dark:text-neutral-400">{room.area} sqft</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5">
          {room.amenities.slice(0, 2).map((amenity) => (
            <span
              key={amenity}
              className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
            >
              <Wifi className="h-3 w-3" />
              {amenity}
            </span>
          ))}
          {room.amenities.length > 2 && (
            <span className="text-xs text-neutral-600 dark:text-neutral-400">+{room.amenities.length - 2} more</span>
          )}
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Starting from</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              ${room.price}
              <span className="text-sm text-neutral-600 dark:text-neutral-400">/mo</span>
            </p>
          </div>
          <Button size="sm" onClick={() => onViewDetails?.(room.id)}>
            View Room
          </Button>
        </div>
      </div>
    </div>
  );
};

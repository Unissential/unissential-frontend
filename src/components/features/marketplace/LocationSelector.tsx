'use client';

import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { UserLocation } from '@/types/marketplace';
import { cn } from '@/lib/utils';

interface LocationSelectorProps {
  userLocation: UserLocation | null;
  onLocationChange: (location: UserLocation) => void;
  isLoading?: boolean;
}

const PRESET_LOCATIONS: UserLocation[] = [
  { name: 'UT Campus Center', latitude: 30.2842, longitude: -97.7405 },
  { name: 'West Campus', latitude: 30.2816, longitude: -97.738 },
  { name: 'Downtown Austin', latitude: 30.2672, longitude: -97.7431 },
  { name: 'Zilker Park', latitude: 30.2644, longitude: -97.776 },
];

export function LocationSelector({
  userLocation,
  onLocationChange,
  isLoading = false,
}: LocationSelectorProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleGetCurrentLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onLocationChange({
            name: 'Your Location',
            latitude,
            longitude,
          });
          setIsGettingLocation(false);
          setShowDropdown(false);
        },
        () => {
          setIsGettingLocation(false);
          // Fallback to UT Campus if geolocation fails
          onLocationChange(PRESET_LOCATIONS[0]);
          setShowDropdown(false);
        }
      );
    } else {
      // Fallback if geolocation not available
      onLocationChange(PRESET_LOCATIONS[0]);
      setIsGettingLocation(false);
      setShowDropdown(false);
    }
  };

  const handleSelectPreset = (location: UserLocation) => {
    onLocationChange(location);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      {/* Location Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isLoading || isGettingLocation}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-neutral-700',
          userLocation && 'border-primary-300 bg-primary-50'
        )}
      >
        <MapPin size={16} className={userLocation ? 'text-primary-600' : 'text-neutral-500'} />
        <span className="truncate max-w-[120px]">
          {userLocation ? userLocation.name : 'Set Location'}
        </span>
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-neutral-200 rounded-lg shadow-lg z-50">
          {/* Get Current Location Button */}
          <button
            onClick={handleGetCurrentLocation}
            disabled={isGettingLocation}
            className="w-full px-4 py-3 text-left hover:bg-primary-50 transition-colors flex items-center gap-2 text-sm font-medium border-b border-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MapPin size={16} className="text-primary-600 flex-shrink-0" />
            {isGettingLocation ? 'Getting location...' : 'Use Current Location'}
          </button>

          {/* Preset Locations */}
          <div className="p-2">
            <p className="px-2 py-1.5 text-xs font-semibold text-neutral-500 uppercase">Presets</p>
            {PRESET_LOCATIONS.map((location) => (
              <button
                key={location.name}
                onClick={() => handleSelectPreset(location)}
                className={cn(
                  'w-full text-left px-3 py-2.5 rounded text-sm transition-colors hover:bg-neutral-100',
                  userLocation?.name === location.name &&
                    'bg-primary-100 text-primary-700 font-medium'
                )}
              >
                {location.name}
              </button>
            ))}
          </div>

          {/* Custom Location Input */}
          <div className="border-t border-neutral-200 p-3">
            <p className="text-xs font-semibold text-neutral-500 uppercase mb-2">Or search</p>
            <input
              type="text"
              placeholder="Enter location..."
              className="w-full px-3 py-2 border border-neutral-200 rounded text-sm focus:outline-none focus:border-primary-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  // For demo, just use the input value as the name
                  const value = (e.target as HTMLInputElement).value;
                  if (value.trim()) {
                    // Use UT Campus as fallback coordinates
                    onLocationChange({
                      name: value,
                      latitude: 30.2842,
                      longitude: -97.7405,
                    });
                    setShowDropdown(false);
                  }
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

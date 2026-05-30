'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import { RoommateFilterState } from '@/types/roommate';

const UNIVERSITIES = [
  'UT Austin',
  'Rice University',
  'Baylor University',
  'Texas A&M',
  'SMU',
  'University of Houston',
];

interface FilterPanelProps {
  filters: RoommateFilterState;
  onFiltersChange: (filters: RoommateFilterState) => void;
  onResetFilters: () => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

/**
 * Filter Panel Component
 * Comprehensive filtering interface for roommate discovery
 */
export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  onResetFilters,
  isOpen = true,
  onToggle,
}) => {
  const [universityOpen, setUniversityOpen] = useState(false);
  const [universitySearch, setUniversitySearch] = useState(filters.university);

  const handleInputChange = (key: keyof RoommateFilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const filteredUniversities = UNIVERSITIES.filter((uni) =>
    uni.toLowerCase().includes(universitySearch.toLowerCase())
  );

  const handleUniversitySelect = (university: string) => {
    handleInputChange('university', university);
    setUniversitySearch(university);
    setUniversityOpen(false);
  };

  const handleUniversityClear = () => {
    handleInputChange('university', '');
    setUniversitySearch('');
    setUniversityOpen(false);
  };

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) =>
      value !== '' &&
      value !== 'any' &&
      (Array.isArray(value) ? value.length > 0 : true) &&
      (typeof value === 'object' && 'min' in value ? value.min !== 0 || value.max !== 0 : true) &&
      key !== 'searchQuery'
  ).length;

  return (
    <motion.div
      initial={false}
      animate={{ height: isOpen ? 'auto' : 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <div className="p-6 bg-gradient-to-br from-neutral-50 to-white border-b border-neutral-200 rounded-b-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* University - Searchable */}
          <div className="relative z-10">
            <label className="block text-sm font-semibold text-neutral-900 mb-2">University</label>
            <div className="relative">
              <input
                type="text"
                value={universitySearch}
                onChange={(e) => {
                  setUniversitySearch(e.target.value);
                  setUniversityOpen(true);
                }}
                onFocus={() => setUniversityOpen(true)}
                placeholder="Search university..."
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all"
              />
              {universitySearch && (
                <button
                  onClick={handleUniversityClear}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 rounded transition-colors"
                >
                  <X size={16} className="text-neutral-400" />
                </button>
              )}

              {/* Dropdown Options */}
              <AnimatePresence>
                {universityOpen && filteredUniversities.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-20"
                  >
                    {filteredUniversities.map((university) => (
                      <button
                        key={university}
                        onClick={() => handleUniversitySelect(university)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-primary-50 transition-colors first:rounded-t-lg last:rounded-b-lg border-b border-neutral-100 last:border-b-0"
                      >
                        <span className="font-medium text-neutral-900">{university}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* No results message */}
              {universityOpen && filteredUniversities.length === 0 && universitySearch && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg p-3 z-20"
                >
                  <p className="text-sm text-neutral-500">No universities found</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Budget Range - Full Width */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Budget Range
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                value={filters.budgetRange[0]}
                onChange={(e) =>
                  handleInputChange('budgetRange', [
                    parseInt(e.target.value) || 0,
                    filters.budgetRange[1],
                  ])
                }
                placeholder="600"
                className="w-20 px-3 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all text-sm font-medium"
              />
              <span className="text-neutral-400 text-sm font-semibold">–</span>
              <input
                type="number"
                min="0"
                value={filters.budgetRange[1]}
                onChange={(e) =>
                  handleInputChange('budgetRange', [
                    filters.budgetRange[0],
                    parseInt(e.target.value) || 1500,
                  ])
                }
                placeholder="1500"
                className="w-20 px-3 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all text-sm font-medium"
              />
            </div>
          </div>

          {/* Gender Preference */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Gender Preference
            </label>
            <select
              value={filters.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all"
            >
              <option value="">Any Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
            </select>
          </div>

          {/* Sleep Schedule */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Sleep Schedule
            </label>
            <select
              value={filters.sleepSchedule}
              onChange={(e) => handleInputChange('sleepSchedule', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all"
            >
              <option value="">Any Schedule</option>
              <option value="early-bird">🌅 Early Bird</option>
              <option value="flexible">⏰ Flexible</option>
              <option value="night-owl">🌙 Night Owl</option>
            </select>
          </div>

          {/* Cleanliness */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Cleanliness Level
            </label>
            <select
              value={filters.cleanlinessLevel}
              onChange={(e) => handleInputChange('cleanlinessLevel', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all"
            >
              <option value="">Any Level</option>
              <option value="very-clean">✨ Very Clean</option>
              <option value="clean">🧹 Clean</option>
              <option value="moderate">👌 Moderate</option>
              <option value="relaxed">😎 Relaxed</option>
            </select>
          </div>

          {/* Smoking */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">Smoking</label>
            <select
              value={filters.smoking}
              onChange={(e) => handleInputChange('smoking', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all"
            >
              <option value="">Any Preference</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          {/* Pets */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Pets Allowed
            </label>
            <select
              value={filters.pets}
              onChange={(e) => handleInputChange('pets', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all"
            >
              <option value="">Any Preference</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          {/* Move-in Date */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Move-in Date
            </label>
            <input
              type="date"
              value={filters.moveInDate}
              onChange={(e) => handleInputChange('moveInDate', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-neutral-200">
          <div className="text-sm text-neutral-600">
            {activeFilterCount > 0 && (
              <span className="font-semibold">{activeFilterCount} filter(s) active</span>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              onResetFilters();
              setUniversitySearch('');
              setUniversityOpen(false);
            }}
            className="px-4 py-2 rounded-lg text-neutral-700 hover:bg-neutral-100 font-semibold transition-colors text-sm"
          >
            Reset Filters
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

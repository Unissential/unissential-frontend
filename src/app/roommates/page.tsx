'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Sliders, Sparkles, Users, Plus } from 'lucide-react';
import { RoommateCard } from '@/components/features/roommate/RoommateCard';
import { FilterPanel } from '@/components/features/roommate/FilterPanel';
import { CompatibilityBadge } from '@/components/features/roommate/CompatibilityBadge';
import { mockRoommates } from '@/data/mockRoommates';
import { RoommateFilterState, RoommateProfile } from '@/types/roommate';
import { calculateCompatibility, sortByCompatibility } from '@/lib/compatibility';

// Mock user preferences - in production, this would come from authenticated user
const mockUserPreferences = {
  budget: { min: 800, max: 1200 },
  sleepSchedule: 'flexible' as const,
  cleanlinessLevel: 'clean' as const,
  interests: ['coding', 'fitness', 'travel', 'music', 'coffee'],
  location: 'Austin',
};

export default function RoommatesPage() {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<RoommateFilterState>({
    searchQuery: '',
    university: '',
    budgetRange: [600, 1500],
    gender: '',
    sleepSchedule: '',
    cleanlinessLevel: '',
    smoking: '',
    pets: '',
    moveInDate: '',
    interests: [],
    location: '',
    socialLevel: '',
  });

  const [savedProfiles, setSavedProfiles] = useState<Set<string>>(new Set());
  const [connectModal, setConnectModal] = useState<{
    isOpen: boolean;
    roommateId?: string;
  }>({ isOpen: false });

  // Filter and sort roommates
  const filteredRoommates = useMemo(() => {
    let results = mockRoommates.filter((roommate) => {
      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch =
          roommate.name.toLowerCase().includes(query) ||
          roommate.university.toLowerCase().includes(query) ||
          roommate.major.toLowerCase().includes(query) ||
          roommate.location.toLowerCase().includes(query) ||
          roommate.interests.some((i) => i.toLowerCase().includes(query));

        if (!matchesSearch) return false;
      }

      // University
      if (filters.university && roommate.university !== filters.university) return false;

      // Budget range
      const roommateBudget = (roommate.budget.min + roommate.budget.max) / 2;
      if (
        roommateBudget < filters.budgetRange[0] ||
        roommateBudget > filters.budgetRange[1]
      ) {
        return false;
      }

      // Gender
      if (filters.gender && roommate.gender !== filters.gender) return false;

      // Sleep schedule
      if (filters.sleepSchedule && roommate.sleepSchedule !== filters.sleepSchedule) {
        return false;
      }

      // Cleanliness
      if (filters.cleanlinessLevel && roommate.cleanlinessLevel !== filters.cleanlinessLevel) {
        return false;
      }

      // Smoking
      if (filters.smoking && roommate.smoking !== filters.smoking) return false;

      // Pets
      if (filters.pets === 'yes' && !roommate.pets.allowed) return false;
      if (filters.pets === 'no' && roommate.pets.allowed) return false;

      // Location
      if (filters.location && !roommate.location.includes(filters.location)) {
        return false;
      }

      return true;
    });

    // Sort by compatibility
    const scoredResults = results.map((roommate) => ({
      roommate,
      compatibility: calculateCompatibility(roommate, mockUserPreferences),
    }));

    return scoredResults.sort((a, b) => b.compatibility.overall - a.compatibility.overall);
  }, [filters]);

  const handleSaveProfile = (roommateId: string) => {
    const newSaved = new Set(savedProfiles);
    if (newSaved.has(roommateId)) {
      newSaved.delete(roommateId);
    } else {
      newSaved.add(roommateId);
    }
    setSavedProfiles(newSaved);
  };

  const handleConnect = (roommateId: string) => {
    setConnectModal({ isOpen: true, roommateId });
  };

  const handleConnectSubmit = () => {
    setConnectModal({ isOpen: false });
    // In production, this would send message to backend
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      university: '',
      budgetRange: [600, 1500],
      gender: '',
      sleepSchedule: '',
      cleanlinessLevel: '',
      smoking: '',
      pets: '',
      moveInDate: '',
      interests: [],
      location: '',
      socialLevel: '',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-primary-600 to-primary-800 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles size={32} />
            <h1 className="text-4xl font-bold">Find Your Perfect Roommate</h1>
          </div>
          <p className="text-primary-100 text-lg max-w-2xl">
            Discover compatible roommates based on lifestyle, interests, and preferences. Connect with students who match your living style.
          </p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative mb-6 flex gap-2 items-center"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, university, major, interests..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all text-lg"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              isFilterOpen
                ? 'bg-primary-600 text-white'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900'
            }`}
          >
            <Sliders size={20} />
            Filters
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/roommates/create')}
            className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white transition-all shadow-lg whitespace-nowrap"
          >
            <Plus size={20} />
            Create Profile
          </motion.button>
        </motion.div>

        {/* Filter Panel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            onResetFilters={handleResetFilters}
            isOpen={isFilterOpen}
            onToggle={() => setIsFilterOpen(!isFilterOpen)}
          />
        </motion.div>

        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-between mb-4"
        >
          <div className="flex items-center gap-2">
            <Users size={24} className="text-primary-600" />
            <h2 className="text-2xl font-bold text-neutral-900">
              {filteredRoommates.length} Compatible Roommates Found
            </h2>
          </div>
        </motion.div>

        {/* Create Profile CTA Card */}
        
        {filteredRoommates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16 px-4"
          >
            <div className="w-24 h-24 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-6">
              <Users size={48} className="text-neutral-400" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">No matches found</h3>
            <p className="text-neutral-600 mb-8 max-w-md mx-auto">
              We couldn&apos;t find any roommates matching your filters. Try adjusting your preferences to see more results.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleResetFilters}
              className="px-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors inline-flex items-center gap-2"
            >
              <Sliders size={18} />
              Reset Filters
            </motion.button>
          </motion.div>
        ) : (
          /* Roommate Grid */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredRoommates.map(({ roommate, compatibility }, idx) => (
              <RoommateCard
                key={roommate.id}
                roommate={roommate}
                compatibility={compatibility}
                onConnect={() => handleConnect(roommate.id)}
                onSave={() => handleSaveProfile(roommate.id)}
                isSaved={savedProfiles.has(roommate.id)}
                index={idx}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Connect Modal */}
      {connectModal.isOpen && connectModal.roommateId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setConnectModal({ isOpen: false })}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200 bg-gradient-to-r from-primary-50 to-primary-100">
              <h3 className="text-lg font-bold text-neutral-900">Connect with {
                mockRoommates.find((r) => r.id === connectModal.roommateId)?.name
              }</h3>
              <button
                onClick={() => setConnectModal({ isOpen: false })}
                className="p-1 hover:bg-neutral-200 rounded-lg transition-colors"
              >
                <span>✕</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Your Message
                </label>
                <textarea
                  placeholder="Tell them about yourself and why you'd be a great roommate..."
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all resize-none"
                />
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setConnectModal({ isOpen: false })}
                  className="flex-1 py-2 px-4 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-semibold transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConnectSubmit}
                  className="flex-1 py-2 px-4 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  Send Connection
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

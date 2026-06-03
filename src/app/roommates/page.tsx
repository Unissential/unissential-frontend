'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader, Plus, Heart } from 'lucide-react';
import { Container } from '@/components/ui';
import { roommateService } from '@/services/api/roommate.service';
import { RoommateProfileDTO } from '@/types/api';
import { useToast } from '@/contexts/ToastContext';
import Link from 'next/link';

interface Filters {
  searchQuery: string;
  university: string;
  minBudget: number;
  maxBudget: number;
  sleepSchedule: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const universities = ['MIT', 'Harvard', 'Stanford', 'UCB', 'UCLA', 'UT Austin', 'Other'];
const sleepSchedules = ['Early Bird', 'Night Owl', 'Flexible'];

export default function RoommatesPage() {
  const { addToast } = useToast();
  const [profiles, setProfiles] = useState<RoommateProfileDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    searchQuery: '',
    university: '',
    minBudget: 500,
    maxBudget: 2000,
    sleepSchedule: '',
  });

  useEffect(() => {
    const loadProfiles = async () => {
      setIsLoading(true);
      try {
        const response = await roommateService.getAllProfiles(currentPage, 12, {
          search: filters.searchQuery,
          university: filters.university,
          minBudget: filters.minBudget,
          maxBudget: filters.maxBudget,
          sleepSchedule: filters.sleepSchedule,
        });
        setProfiles(response.data);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load profiles';
        addToast(message, 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfiles();
  }, [filters, currentPage, addToast]);

  const handleFilterChange = (key: keyof Filters, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  return (
    <Container>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-4"
        >
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">Find Your Roommate</h1>
            <p className="text-gray-600">Connect with students looking for housing</p>
          </div>
          <Link
            href="/roommates/create"
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 whitespace-nowrap flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Profile
          </Link>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl border border-gray-200 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by name..."
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* University */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">University</label>
              <select
                value={filters.university}
                onChange={(e) => handleFilterChange('university', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Universities</option>
                {universities.map((uni) => (
                  <option key={uni} value={uni}>
                    {uni}
                  </option>
                ))}
              </select>
            </div>

            {/* Sleep Schedule */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Sleep Schedule</label>
              <select
                value={filters.sleepSchedule}
                onChange={(e) => handleFilterChange('sleepSchedule', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Any Schedule</option>
                {sleepSchedules.map((schedule) => (
                  <option key={schedule} value={schedule}>
                    {schedule}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Budget */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Min Budget</label>
              <div className="relative">
                <span className="absolute left-4 top-2 text-gray-600">$</span>
                <input
                  type="number"
                  min="0"
                  value={filters.minBudget}
                  onChange={(e) => handleFilterChange('minBudget', parseInt(e.target.value))}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Max Budget */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Max Budget</label>
              <div className="relative">
                <span className="absolute left-4 top-2 text-gray-600">$</span>
                <input
                  type="number"
                  min="0"
                  value={filters.maxBudget}
                  onChange={(e) => handleFilterChange('maxBudget', parseInt(e.target.value))}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profiles Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <Loader className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading profiles...</p>
            </div>
          </div>
        ) : profiles.length > 0 ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {profiles.map((profile) => (

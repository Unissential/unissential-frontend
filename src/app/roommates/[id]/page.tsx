'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Heart,
  Share2,
  MessageCircle,
  ArrowLeft,
  MapPin,
  Briefcase,
  Users,
  DollarSign,
  Calendar,
  Zap,
  CheckCircle,
  Target,
  BookOpen,
  Loader,
} from 'lucide-react';
import { roommateService } from '@/services/api/roommate.service';
import { CompatibilityBadge } from '@/components/features/roommate/CompatibilityBadge';

// Mock user preferences
const mockUserPreferences = {
  budget: { min: 800, max: 1200 },
  sleepSchedule: 'flexible' as const,
  cleanlinessLevel: 'clean' as const,
  interests: ['coding', 'fitness', 'travel', 'music', 'coffee'],
  location: 'Austin',
};

export default function RoommateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roommateId = params.id as string;

  const [roommate, setRoommate] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRoommate = async () => {
      try {
        const data = await roommateService.getProfileById(roommateId);
        setRoommate(data);
      } catch (error) {
        console.error('Failed to load roommate:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRoommate();
  }, [roommateId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!roommate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Roommate not found</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/roommates')}
            className="px-6 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors"
          >
            Back to Discovery
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Back Button */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/roommates')}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Roommates
          </motion.button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Profile Image & Basic Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={roommate.photo}
                alt={roommate.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {/* Photo Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {roommate.photos.map((photo, idx) => (
                <div key={idx} className="relative h-24 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-opacity">
                  <Image
                    src={photo}
                    alt={`Gallery ${idx}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Compatibility Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="sticky top-20 h-fit space-y-6"
          >
            {/* Compatibility Badge */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-200">
              <div className="flex justify-center mb-4">
                <CompatibilityBadge
                  score={compatibility.overall}
                  label={compatibility.label}
                  size="lg"
                  animated
                />
              </div>

              {/* Compatibility Breakdown */}
              <div className="space-y-3 pt-4 border-t border-neutral-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Budget</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${Math.min(compatibility.budget, 25) * 4}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-neutral-600 w-8 text-right">
                      {Math.round((compatibility.budget / 25) * 100)}%
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Schedule</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${Math.min(compatibility.schedule, 25) * 4}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-neutral-600 w-8 text-right">
                      {Math.round((compatibility.schedule / 25) * 100)}%
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Cleanliness</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${Math.min(compatibility.cleanliness, 20) * 5}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-neutral-600 w-8 text-right">
                      {Math.round((compatibility.cleanliness / 20) * 100)}%
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Interests</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full"
                        style={{ width: `${Math.min(compatibility.interests, 20) * 5}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-neutral-600 w-8 text-right">
                      {Math.round((compatibility.interests / 20) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsConnecting(!isConnecting)}
                className="w-full py-3 px-4 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle size={20} />
                Connect & Message
              </motion.button>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsSaved(!isSaved)}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                    isSaved
                      ? 'bg-red-50 border-2 border-red-200 text-red-600'
                      : 'border-2 border-neutral-200 hover:border-neutral-300 text-neutral-700'
                  }`}
                >
                  <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 px-4 rounded-lg border-2 border-neutral-200 hover:border-neutral-300 text-neutral-700 font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 size={20} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2 space-y-8">
            {/* Header Info */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-neutral-900">{roommate.name}</h1>
                  <p className="text-lg text-neutral-600 mt-1">
                    {roommate.age} years old • {roommate.university}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-neutral-200">
                <div className="flex items-center gap-3">
                  <Briefcase className="text-primary-600" size={20} />
                  <div>
                    <p className="text-xs text-neutral-600">Major</p>
                    <p className="font-semibold text-neutral-900">{roommate.major}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-primary-600" size={20} />
                  <div>
                    <p className="text-xs text-neutral-600">Location</p>
                    <p className="font-semibold text-neutral-900">{roommate.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="text-primary-600" size={20} />
                  <div>
                    <p className="text-xs text-neutral-600">Move-in</p>
                    <p className="font-semibold text-neutral-900">{roommate.moveInDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="text-primary-600" size={20} />
                  <div>
                    <p className="text-xs text-neutral-600">Budget</p>
                    <p className="font-semibold text-neutral-900">
                      ${roommate.budget.min} - ${roommate.budget.max}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-200">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">About</h2>
              <p className="text-neutral-700 leading-relaxed">{roommate.bio}</p>
            </div>

            {/* Lifestyle Preferences */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-200">
              <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Zap size={24} className="text-primary-600" />
                Lifestyle Preferences
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                  <p className="text-xs text-neutral-600 font-semibold mb-1">Sleep Schedule</p>
                  <p className="font-semibold text-neutral-900 capitalize">
                    {roommate.sleepSchedule.replace('-', ' ')}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                  <p className="text-xs text-neutral-600 font-semibold mb-1">Cleanliness</p>
                  <p className="font-semibold text-neutral-900 capitalize">
                    {roommate.cleanlinessLevel.replace('-', ' ')}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                  <p className="text-xs text-neutral-600 font-semibold mb-1">Smoking</p>
                  <p className="font-semibold text-neutral-900 capitalize">{roommate.smoking}</p>
                </div>
                <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                  <p className="text-xs text-neutral-600 font-semibold mb-1">Pets</p>
                  <p className="font-semibold text-neutral-900">
                    {roommate.pets.allowed ? 'Allowed' : 'Not Allowed'}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                  <p className="text-xs text-neutral-600 font-semibold mb-1">Social Level</p>
                  <p className="font-semibold text-neutral-900 capitalize">
                    {roommate.socialLevel.replace('-', ' ')}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                  <p className="text-xs text-neutral-600 font-semibold mb-1">Guest Policy</p>
                  <p className="font-semibold text-neutral-900 capitalize">
                    {roommate.guestPolicy}
                  </p>
                </div>
              </div>
            </div>

            {/* Interests & Hobbies */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-200">
              <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Target size={24} className="text-primary-600" />
                Interests & Hobbies
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-neutral-600 mb-2">Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {roommate.interests.map((interest, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium"
                      >
                        #{interest}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-600 mb-2">Hobbies</p>
                  <div className="flex flex-wrap gap-2">
                    {roommate.hobbies.map((hobby, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium"
                      >
                        {hobby}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Study & Work */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-200">
              <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <BookOpen size={24} className="text-primary-600" />
                Study & Work
              </h2>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                  <p className="text-sm font-semibold text-neutral-600 mb-1">Study Habits</p>
                  <p className="text-neutral-900">{roommate.studyHabits}</p>
                </div>
                <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                  <p className="text-sm font-semibold text-neutral-600 mb-1">Work Schedule</p>
                  <p className="text-neutral-900">{roommate.workSchedule}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="sticky top-20 bg-white rounded-2xl p-6 shadow-lg border border-neutral-200 space-y-4"
            >
              <h3 className="text-lg font-bold text-neutral-900 mb-4">Quick Info</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-emerald-500 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-xs text-neutral-600">Lease Length</p>
                    <p className="font-semibold text-neutral-900">{roommate.leaseLength}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="text-blue-500 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-xs text-neutral-600">Response Rate</p>
                    <p className="font-semibold text-neutral-900">{roommate.responseRate}%</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="text-purple-500 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-xs text-neutral-600">Joined</p>
                    <p className="font-semibold text-neutral-900">{roommate.joinedDate}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200">
                <p className="text-xs text-neutral-600 text-center">
                  ✨ Verified Student • 5★ Profile
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Connect Modal */}
      {isConnecting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setIsConnecting(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-neutral-200 bg-gradient-to-r from-primary-50 to-primary-100">
              <h3 className="text-lg font-bold text-neutral-900">Connect with {roommate.name}</h3>
              <button
                onClick={() => setIsConnecting(false)}
                className="text-neutral-600 hover:text-neutral-900"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <textarea
                placeholder="Tell them about yourself and why you'd be a great roommate..."
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all resize-none"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setIsConnecting(false)}
                  className="flex-1 py-2 px-4 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsConnecting(false);
                    // Show success message
                  }}
                  className="flex-1 py-2 px-4 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors"
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

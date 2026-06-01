'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { StatsCard, SavedItemCard, EmptyState } from '@/components/dashboard';
import { mockCurrentUser, mockDashboardStats, mockSavedListings, mockConversations, mockNotifications, mockMyListings } from '@/data/mockDashboard';
import Link from 'next/link';
import { initDemoAuth } from '@/lib/auth';
import { ArrowRight } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  useEffect(() => {
    // Initialize demo auth for development
    initDemoAuth();
  }, []);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Welcome Header */}
      <motion.div variants={item} className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">
          Welcome back, {mockCurrentUser.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-neutral-600">
          Here's what's happening with your student living experience.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          label="My Listings"
          value={mockDashboardStats.totalListings}
          icon="📋"
          description="Active listings you're managing"
          href="/dashboard/my-listings"
          change={1}
        />
        <StatsCard
          label="Saved Items"
          value={mockDashboardStats.savedListings}
          icon="❤️"
          description="Listings, products & roommates"
          href="/dashboard/saved-listings"
        />
        <StatsCard
          label="Messages"
          value={mockDashboardStats.activeMessages}
          icon="💬"
          description="Active conversations"
          href="/dashboard/messages"
          change={2}
        />
        <StatsCard
          label="Notifications"
          value={mockDashboardStats.unreadNotifications}
          icon="🔔"
          description="Unread notifications"
          href="/dashboard/notifications"
        />
        <StatsCard
          label="Upcoming Tours"
          value={mockDashboardStats.upcomingTours}
          icon="🏠"
          description="Scheduled property tours"
        />
        <StatsCard
          label="Roommate Matches"
          value={mockDashboardStats.savedRoommates}
          icon="👥"
          description="Compatible roommates"
          href="/dashboard/saved-roommates"
        />
      </motion.div>

      {/* Recently Viewed Listings */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-900">Saved Listings</h2>
          <Link href="/dashboard/saved-listings">
            <motion.button
              whileHover={{ x: 4 }}
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
            >
              View all <ArrowRight size={18} />
            </motion.button>
          </Link>
        </div>

        {mockSavedListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockSavedListings.slice(0, 4).map((listing, index) => (
              <motion.div key={listing.id} variants={item} custom={index}>
                <SavedItemCard item={listing} />
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="❤️"
            title="No saved listings yet"
            description="Browse and save listings you're interested in"
            ctaText="Explore listings"
            ctaHref="/leasing"
          />
        )}
      </motion.div>

      {/* Active Conversations */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-900">Active Conversations</h2>
          <Link href="/dashboard/messages">
            <motion.button
              whileHover={{ x: 4 }}
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
            >
              View all <ArrowRight size={18} />
            </motion.button>
          </Link>
        </div>

        {mockConversations.length > 0 ? (
          <div className="space-y-2">
            {mockConversations.slice(0, 3).map((conv) => (
              <motion.div
                key={conv.id}
                whileHover={{ x: 4, backgroundColor: '#f3f4f6' }}
                className="p-4 bg-white rounded-lg border border-neutral-200 hover:border-neutral-300 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={conv.participantAvatar}
                    alt={conv.participantName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-neutral-900">{conv.participantName}</h3>
                      {conv.online && (
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      )}
                      {conv.unread && (
                        <span className="ml-auto w-2 h-2 bg-primary-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-600 truncate">{conv.lastMessage}</p>
                    <p className="text-xs text-neutral-500 mt-1">{conv.timestamp}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="💬"
            title="No active conversations"
            description="Start a conversation when you're interested in a listing"
          />
        )}
      </motion.div>

      {/* Quick Stats Section */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Notifications */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-neutral-900 mb-4">Recent Notifications</h3>
          <div className="space-y-3">
            {mockNotifications.slice(0, 3).map((notif) => (
              <div key={notif.id} className="flex gap-3 pb-3 border-b border-neutral-200 last:border-0">
                <span className="text-2xl">{notif.icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-neutral-900 text-sm">{notif.title}</p>
                  <p className="text-xs text-neutral-600">{notif.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Listings Summary */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-neutral-900 mb-4">Your Listings</h3>
          <div className="space-y-3">
            {mockMyListings.map((listing) => (
              <div key={listing.id} className="flex gap-3 pb-3 border-b border-neutral-200 last:border-0">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-neutral-900 text-sm line-clamp-1">{listing.title}</p>
                  <p className="text-xs text-neutral-600">
                    {listing.views} views • {listing.interested} interested
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

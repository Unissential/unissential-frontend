'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { StatsCard, SavedItemCard, EmptyState } from '@/components/dashboard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { dashboardService, DashboardStats } from '@/services/api/dashboard.service';
import { ListingDTO, MarketplaceProductDTO } from '@/types/api';
import { ArrowRight, Loader } from 'lucide-react';

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

function DashboardContent() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentListings, setRecentListings] = useState<ListingDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const dashboardStats = await dashboardService.getDashboardStats();
        setStats(dashboardStats);

        // Fetch recent listings
        const listingsResponse = await dashboardService.getUserListings(1, 3);
        setRecentListings(listingsResponse.data);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load dashboard';
        addToast(message, 'error');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user, addToast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Welcome Header */}
      <motion.div variants={item} className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">
          Welcome back, {user?.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-neutral-600">
          Here's what's happening with your student living experience.
        </p>
      </motion.div>

      {/* Stats Grid */}
      {stats && (
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard
            label="My Listings"
            value={stats.totalListings}
            icon="📋"
            description="Active listings you're managing"
          />
          <StatsCard
            label="Marketplace Items"
            value={stats.totalProducts}
            icon="🛍️"
            description="Products you're selling"
          />
          <StatsCard
            label="Active Messages"
            value={stats.activeMessages}
            icon="💬"
            description="Conversations with others"
          />
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/leasing/create"
          className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
        >
          <div className="relative z-10">
            <h3 className="text-lg font-semibold mb-2">Post a Listing</h3>
            <p className="text-indigo-100 text-sm mb-4">Share your apartment and find the perfect roommates</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        <Link
          href="/marketplace/create"
          className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-6 text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
        >
          <div className="relative z-10">
            <h3 className="text-lg font-semibold mb-2">Sell an Item</h3>
            <p className="text-orange-100 text-sm mb-4">List your items for sale on our marketplace</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Start Selling</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Recent Listings */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900">Your Recent Listings</h2>
          <Link href="/dashboard/my-listings" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            View All →
          </Link>
        </div>

        {recentListings.length > 0 ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {recentListings.map((listing) => (
              <motion.div
                key={listing.id}
                variants={item}
                className="rounded-lg border border-gray-200 hover:shadow-lg transition-shadow p-4"
              >
                <div className="aspect-video bg-gray-200 rounded-lg mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">{listing.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{listing.location}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-indigo-600">${listing.price}/mo</span>
                  <Link
                    href={`/leasing/${listing.id}`}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    View →
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyState
            title="No Listings Yet"
            description="Start by posting your first listing to connect with other students"
            action={{
              label: 'Post a Listing',
              href: '/leasing/create',
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

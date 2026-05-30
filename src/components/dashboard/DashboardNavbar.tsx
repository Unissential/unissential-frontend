'use client';

import Link from 'next/link';
import { Menu, Bell, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useCurrentUser } from '@/hooks/useDashboard';
import { clearAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface DashboardNavbarProps {
  onMenuClick: () => void;
  unreadCount: number;
}

export function DashboardNavbar({ onMenuClick, unreadCount }: DashboardNavbarProps) {
  const { user } = useCurrentUser();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    router.push('/');
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-200 backdrop-blur-sm bg-white/95"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Logo + Menu Button */}
          <div className="flex items-center gap-4">
            {/* Menu Button (Mobile) */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <Menu size={20} className="text-neutral-700" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">U</span>
              </div>
              <span className="hidden sm:block font-bold text-neutral-900">Unissential</span>
            </Link>
          </div>

          {/* Right: Notifications + Profile */}
          <div className="flex items-center gap-4">
            {/* Notifications Button */}
            <Link href="/dashboard/notifications">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="relative p-2.5 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <Bell size={20} className="text-neutral-700" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </motion.button>
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <img
                  src={
                    user?.avatar ||
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop'
                  }
                  alt={user?.name || 'User'}
                  className="w-8 h-8 rounded-full"
                />
                <span className="hidden sm:block text-sm font-medium text-neutral-700 truncate">
                  {user?.name || 'User'}
                </span>
              </motion.button>

              {/* Dropdown Menu */}
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 overflow-hidden"
                >
                  <Link href="/dashboard/settings">
                    <motion.button className="w-full px-4 py-3 text-left text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                      Settings
                    </motion.button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 border-t border-neutral-200"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

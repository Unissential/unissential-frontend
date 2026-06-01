'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { DashboardNavbar } from './DashboardNavbar';
import { useDashboard } from '@/hooks/useDashboard';
import { motion } from 'framer-motion';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { sidebarOpen, toggleSidebar, unreadCount } = useDashboard();

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <DashboardNavbar onMenuClick={toggleSidebar} unreadCount={unreadCount} />

      {/* Sidebar + Content */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />

        {/* Main Content */}
        <main className="flex-1 pt-20 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}
    </div>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { dashboardNavItems } from '@/data/mockDashboard';
import { motion } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: isOpen ? 0 : -280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        'fixed left-0 top-0 z-40 h-screen w-72 bg-white border-r border-neutral-200 overflow-y-auto pt-20',
        'lg:static lg:translate-x-0 lg:w-64'
      )}
    >
      {/* Logo/Branding */}
      <div className="px-6 py-4 border-b border-neutral-200 lg:hidden">
        <h2 className="text-lg font-bold text-neutral-900">Menu</h2>
      </div>

      {/* Navigation Items */}
      <nav className="px-4 py-6 space-y-2">
        {dashboardNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-semibold'
                    : 'text-neutral-700 hover:bg-neutral-50'
                )}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200 bg-neutral-50">
        <p className="text-xs text-neutral-600">
          Need help? Visit our{' '}
          <Link href="#" className="text-primary-600 hover:underline font-medium">
            support center
          </Link>
        </p>
      </div>
    </motion.aside>
  );
}

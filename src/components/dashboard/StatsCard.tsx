'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface StatsCardProps {
  label: string;
  value: number;
  icon: string;
  change?: number;
  href?: string;
  description?: string;
}

export function StatsCard({ label, value, icon, change, href, description }: StatsCardProps) {
  const content = (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className="p-6 bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-all h-full"
    >
      {/* Icon */}
      <div className="text-4xl mb-4">{icon}</div>

      {/* Content */}
      <div>
        <p className="text-sm text-neutral-600 mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-bold text-neutral-900">{value}</h3>
          {change !== undefined && change > 0 && (
            <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
              <ArrowUpRight size={14} />
              {change}%
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-neutral-500 mt-2">{description}</p>
        )}
      </div>
    </motion.div>
  );

  return href ? (
    <Link href={href}>
      {content}
    </Link>
  ) : (
    content
  );
}

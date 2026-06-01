'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  ctaText?: string;
  ctaHref?: string;
  suggestions?: string[];
}

export function EmptyState({
  icon,
  title,
  description,
  ctaText,
  ctaHref,
  suggestions,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-96 text-center px-4"
    >
      {/* Icon */}
      <div className="text-7xl mb-6">{icon}</div>

      {/* Content */}
      <h3 className="text-2xl font-bold text-neutral-900 mb-2">{title}</h3>
      <p className="text-neutral-600 mb-6 max-w-md">{description}</p>

      {/* CTA Button */}
      {ctaText && ctaHref && (
        <Link href={ctaHref}>
          <motion.button
            whileHover={{ scale: 1.05, x: 4 }}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors mb-8"
          >
            {ctaText}
            <ArrowRight size={18} />
          </motion.button>
        </Link>
      )}

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="mt-8 pt-8 border-t border-neutral-200 w-full">
          <p className="text-sm font-semibold text-neutral-700 mb-4">Suggestions:</p>
          <ul className="space-y-2 text-sm text-neutral-600">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary-400 rounded-full"></span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}

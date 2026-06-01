'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { getCompatibilityColor, getCompatibilityText } from '@/lib/compatibility';

interface CompatibilityBadgeProps {
  score: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

/**
 * Compatibility Badge Component
 * Displays compatibility score with color-coded visual indicators
 */
export const CompatibilityBadge: React.FC<CompatibilityBadgeProps> = ({
  score,
  label,
  size = 'md',
  showLabel = true,
  animated = true,
}) => {
  const sizeClasses = {
    sm: 'w-14 h-14 text-sm',
    md: 'w-20 h-20 text-lg',
    lg: 'w-28 h-28 text-2xl',
  };

  const colorGradient = getCompatibilityColor(score);
  const labelText = getCompatibilityText(label);

  return (
    <motion.div
      initial={animated ? { scale: 0, opacity: 0 } : undefined}
      animate={animated ? { scale: 1, opacity: 1 } : undefined}
      transition={animated ? { duration: 0.4, delay: 0.1 } : undefined}
      className="flex flex-col items-center gap-2"
    >
      {/* Circular Score */}
      <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden`}>
        {/* Gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colorGradient} opacity-20`} />

        {/* Outer ring */}
        <div
          className={`absolute inset-0 rounded-full border-4 border-gradient-to-r ${colorGradient}`}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${colorGradient} opacity-10 rounded-full`}
          />
        </div>

        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div
              className={`font-bold ${size === 'sm' ? 'text-base' : size === 'md' ? 'text-xl' : 'text-3xl'}`}
            >
              {score}%
            </div>
            {size === 'lg' && <div className="text-xs font-medium opacity-75">match</div>}
          </div>
        </div>

        {/* Progress ring */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            opacity="0.2"
            className={`text-${
              score >= 85 ? 'emerald' : score >= 70 ? 'blue' : score >= 55 ? 'amber' : 'red'
            }-500`}
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="3"
            strokeDasharray={`${(score / 100) * 282.7} 282.7`}
            strokeLinecap="round"
            className={`text-${
              score >= 85 ? 'emerald' : score >= 70 ? 'blue' : score >= 55 ? 'amber' : 'red'
            }-500 transform -rotate-90 origin-center`}
            initial={animated ? { strokeDasharray: '0 282.7' } : undefined}
            animate={animated ? { strokeDasharray: `${(score / 100) * 282.7} 282.7` } : undefined}
            transition={animated ? { duration: 1.2, delay: 0.3, ease: 'easeOut' } : undefined}
          />
        </svg>
      </div>

      {/* Label */}
      {showLabel && <div className="text-sm font-semibold text-center">{labelText}</div>}
    </motion.div>
  );
};

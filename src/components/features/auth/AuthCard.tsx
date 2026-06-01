'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

/**
 * Premium auth form card with animations
 */
export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <motion.div
      className="w-full max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          {description && <p className="text-gray-600 text-sm leading-relaxed">{description}</p>}
        </motion.div>

        {/* Form content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {children}
        </motion.div>
      </div>

      {/* Footer text */}
      <motion.p
        className="text-center text-gray-600 text-xs mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        We protect your privacy. See our{' '}
        <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
          Privacy Policy
        </a>
      </motion.p>
    </motion.div>
  );
}

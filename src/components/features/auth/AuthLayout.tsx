'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * Premium split-screen auth layout
 * Left: Branding/gradient, Right: Form card
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side - Branding */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-12 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <motion.div
          className="relative z-10 max-w-md text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-indigo-700">
              U
            </div>
            <span className="text-2xl font-bold text-white">Unissential</span>
          </div>

          {/* Tagline */}
          <h1 className="text-4xl font-bold text-white mb-4">
            Your Complete Student Living Platform
          </h1>

          {/* Description */}
          <p className="text-lg text-white/80 mb-12">
            Find housing, connect with roommates, and discover student essentials all in one place.
          </p>

          {/* Illustration placeholder */}
          <div className="relative w-full aspect-square rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center overflow-hidden border border-white/20">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: 'loop',
              }}
              className="text-6xl opacity-50"
            >
              🎓
            </motion.div>
          </div>

          {/* Benefits list */}
          <div className="mt-12 space-y-4 text-left">
            {[
              'Find & lease student housing',
              'Connect with compatible roommates',
              'Buy & sell student essentials',
            ].map((benefit, i) => (
              <motion.div
                key={benefit}
                className="flex items-center gap-3 text-white/90"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              >
                <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                {benefit}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Right side - Form */}
      <motion.div
        className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

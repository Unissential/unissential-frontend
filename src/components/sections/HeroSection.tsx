'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui';
import { PremiumButton, PremiumBadge } from '@/components/ui';
import { ArrowRight } from 'lucide-react';

export const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-20">
      {/* Gradient Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/3 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl" />
      </div>

      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-8 max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <PremiumBadge variant="primary" size="md" className="px-4 py-2 gap-2">
              <span className="text-xl">✨</span>
              Simplifying Student Living
            </PremiumBadge>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={itemVariants} className="text-7xl md:text-8xl font-bold text-neutral-900 leading-tight">
            Your Complete
            <br />
            <span className="gradient-text">Student Living</span>
            <br />
            Platform
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-neutral-600 font-light leading-relaxed max-w-3xl mx-auto"
          >
            Find temporary housing, connect with roommates, and buy or sell student essentials—all in one place designed for university students.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-neutral-900 text-white font-bold rounded-2xl hover:bg-neutral-800 transition-smooth inline-flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight size={20} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-neutral-300 text-neutral-900 font-bold rounded-2xl hover:bg-neutral-50 transition-smooth"
            >
              Browse Listings
            </motion.button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center pt-8 pb-4"
          >
            {[
              { icon: '✓', label: 'No hidden fees' },
              { icon: '✓', label: 'Verified students' },
              { icon: '✓', label: 'Secure platform' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2 text-neutral-600 font-medium"
              >
                <span className="text-primary-600 font-bold text-lg">{item.icon}</span>
                {item.label}
              </motion.div>
            ))}
          </motion.div>

          {/* Stats Row */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-8 pt-8 border-t border-neutral-200"
          >
            {[
              { number: '10K+', label: 'Active Students' },
              { number: '500+', label: 'Available Rooms' },
              { number: '2K+', label: 'Items Listed' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="space-y-2"
                whileHover={{ y: -4 }}
              >
                <p className="text-3xl md:text-4xl font-bold text-primary-600">{stat.number}</p>
                <p className="text-sm md:text-base text-neutral-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};

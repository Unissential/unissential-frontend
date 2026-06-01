'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui';
import { PremiumCard, PremiumBadge } from '@/components/ui';
import {
  Home,
  Users,
  ShoppingBag,
  TrendingUp,
  MapPin,
  DollarSign,
} from 'lucide-react';

export const CategoriesSection = () => {
  const categories = [
    {
      icon: Home,
      title: 'Lease',
      description: 'Short-term and long-term housing solutions for students',
      gradient: 'from-primary-500 to-primary-600',
      badge: '2,400+',
    },
    {
      icon: Users,
      title: 'Roommates',
      description: 'Find your perfect living partners with smart matching',
      gradient: 'from-secondary-500 to-secondary-600',
      badge: '5,600+',
    },
    {
      icon: ShoppingBag,
      title: 'Marketplace',
      description: 'Buy and sell student essentials at great prices',
      gradient: 'from-amber-500 to-orange-600',
      badge: '10K+',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="categories" className="relative py-24 md:py-32 bg-neutral-50">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold">
            Explore Categories
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Everything students need in one ecosystem.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {categories.map((category, i) => {
            const Icon = category.icon;
            return (
              <motion.div key={i} variants={itemVariants}>
                <PremiumCard hoverable glowing className="relative overflow-hidden h-full group">
                  <div className="relative z-10 flex flex-col gap-6">
                    <div className="flex items-start justify-between">
                      <div
                        className={`w-16 h-16 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-white shadow-lg`}
                      >
                        <Icon size={32} />
                      </div>
                      <PremiumBadge variant="primary" size="sm">
                        {category.badge}
                      </PremiumBadge>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-neutral-900">
                        {category.title}
                      </h3>
                      <p className="text-neutral-600 mt-3 leading-relaxed">
                        {category.description}
                      </p>
                    </div>

                    <motion.div
                      className="inline-flex items-center gap-2 text-primary-600 font-semibold text-sm mt-auto"
                      whileHover={{ x: 4 }}
                    >
                      Explore →
                    </motion.div>
                  </div>
                </PremiumCard>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
};

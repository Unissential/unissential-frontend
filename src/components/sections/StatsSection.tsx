'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui';

export const StatsSection = () => {
  const stats = [
    {
      number: '10K+',
      label: 'Active Students',
      sublabel: 'On the platform',
    },
    {
      number: '500+',
      label: 'Available Rooms',
      sublabel: 'To choose from',
    },
    {
      number: '2K+',
      label: 'Items Listed',
      sublabel: 'In marketplace',
    },
    {
      number: '50+',
      label: 'Universities',
      sublabel: 'We serve',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="relative py-24 md:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-gradient-to-r from-primary-50 via-transparent to-secondary-50 rounded-full blur-3xl" />
      </div>

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold">
            By The Numbers
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Making a real impact in student housing.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="text-center space-y-3 p-8 rounded-2xl border border-neutral-200 bg-white/50 backdrop-blur hover:bg-white transition-smooth"
            >
              <motion.p
                className="text-5xl md:text-6xl font-bold gradient-text"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                {stat.number}
              </motion.p>
              <p className="text-lg font-bold text-neutral-900">{stat.label}</p>
              <p className="text-sm text-neutral-500">{stat.sublabel}</p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

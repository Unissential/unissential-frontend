'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui';
import { PremiumCard } from '@/components/ui';
import {
  Home,
  Users,
  Zap,
  Shield,
  Clock,
  Smartphone,
} from 'lucide-react';

export const FeaturesSection = () => {
  const features = [
    {
      icon: Home,
      title: 'Verified Listings',
      description: 'All properties verified and checked for safety and quality.',
    },
    {
      icon: Users,
      title: 'Smart Matching',
      description: 'Find roommates with compatible lifestyles and interests.',
    },
    {
      icon: Zap,
      title: 'Instant Messaging',
      description: 'Connect with landlords and roommates in real-time.',
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Your data is protected with industry-leading encryption.',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Get help anytime with our responsive support team.',
    },
    {
      icon: Smartphone,
      title: 'Mobile App',
      description: 'Browse listings and message on iOS and Android.',
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
    <section id="features" className="relative py-24 md:py-32">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold">
            Everything You Need
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Powerful features designed to make student housing effortless.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div key={i} variants={itemVariants}>
                <PremiumCard hoverable className="h-full">
                  <div className="flex flex-col gap-4">
                    <motion.div
                      className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center text-white"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Icon size={28} />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-neutral-900">
                        {feature.title}
                      </h3>
                      <p className="text-neutral-600 mt-2 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
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

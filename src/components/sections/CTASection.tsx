'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui';
import { PremiumButton } from '@/components/ui';
import { ArrowRight } from 'lucide-react';

export const CTASection = () => {
  const router = useRouter();
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 gradient-primary rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 gradient-secondary rounded-full blur-3xl opacity-20" />
      </div>

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
          className="relative rounded-3xl bg-gradient-to-r from-primary-600 to-secondary-600 p-12 md:p-20 text-center overflow-hidden"
        >
          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0 -z-10 opacity-30"
            animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)',
              backgroundSize: '200% 200%',
            }}
          />

          <motion.div
            className="space-y-8 relative z-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ready to simplify your student living?
            </h2>

            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Join thousands of students already using Unissential
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 justify-center pt-8 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 rounded-2xl font-medium focus:outline-none focus:ring-2 focus:ring-white/50 transition-smooth"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/signup')}
                className="px-8 py-4 bg-white text-primary-600 font-bold rounded-2xl hover:bg-neutral-100 transition-smooth whitespace-nowrap"
              >
                Get Started
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui';
import { PremiumButton } from '@/components/ui';
import { ArrowRight } from 'lucide-react';

export const CTASection = () => {
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
            <h2 className="text-5xl md:text-6xl font-bold text-white">
              Ready to Simplify Your Student Life?
            </h2>

            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Join thousands of students already using Unissential to find housing, roommates, and essentials.
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <PremiumButton
                  variant="primary"
                  size="lg"
                  className="bg-white text-primary-600 hover:bg-neutral-100 gap-2"
                >
                  Get Started Now
                  <motion.div
                    className="inline-block"
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                  >
                    <ArrowRight size={20} />
                  </motion.div>
                </PremiumButton>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <PremiumButton
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white/10"
                >
                  Learn More
                </PremiumButton>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};

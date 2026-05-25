'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { PremiumButton } from '@/components/ui';
import { Container } from '@/components/ui';
import { Logo } from '@/components/ui';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Lease', href: '/leasing' },
  { label: 'Roommates', href: '/roommates' },
  { label: 'Marketplace', href: '/marketplace' },
];

export const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-neutral-100/50"
      >
        <Container>
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="group hover:opacity-80 transition-smooth">
              <Logo size="md" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className="text-neutral-600 font-medium hover:text-primary-600 transition-smooth"
                  whileHover={{ y: -2 }}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <motion.div whileHover={{ scale: 1.05 }}>
                <PremiumButton 
                  variant="outline" 
                  size="md"
                  onClick={() => router.push('/login')}
                >
                  Login
                </PremiumButton>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <PremiumButton 
                  variant="primary" 
                  size="md"
                  onClick={() => router.push('/signup')}
                >
                  Sign Up
                </PremiumButton>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2 hover:bg-neutral-100 rounded-lg transition-smooth"
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </Container>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-20 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="relative bg-white shadow-xl m-4 rounded-2xl border border-neutral-200 p-6 space-y-4"
            >
              {navItems.map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  variants={itemVariants}
                  className="block px-4 py-3 text-neutral-900 font-semibold hover:bg-primary-50 rounded-lg transition-smooth"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </motion.a>
              ))}

              <div className="border-t border-neutral-100 pt-4 space-y-3">
                <PremiumButton 
                  variant="outline" 
                  size="md" 
                  className="w-full"
                  onClick={() => {
                    router.push('/login');
                    setIsOpen(false);
                  }}
                >
                  Login
                </PremiumButton>
                <PremiumButton 
                  variant="primary" 
                  size="md" 
                  className="w-full"
                  onClick={() => {
                    router.push('/signup');
                    setIsOpen(false);
                  }}
                >
                  Sign Up
                </PremiumButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

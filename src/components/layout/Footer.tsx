'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui';
import { Mail } from 'lucide-react';

const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'Lease', href: '#lease' },
      { label: 'Roommates', href: '#roommates' },
      { label: 'Marketplace', href: '#marketplace' },
      { label: 'Features', href: '#features' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Cookies', href: '/cookies' },
      { label: 'License', href: '/license' },
    ],
  },
];

const socialLinks = [
  { label: 'Twitter', href: 'https://twitter.com' },
  { label: 'GitHub', href: 'https://github.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'Email', href: 'mailto:hello@unissential.com' },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="relative border-t border-neutral-200 bg-white">
      <Container>
        <div className="py-16 md:py-20">
          {/* Main Footer Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12"
          >
            {/* Brand Section */}
            <motion.div variants={itemVariants} className="md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-6 group">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <span className="text-white font-bold text-lg">U</span>
                </div>
                <span className="text-lg font-bold text-neutral-900 group-hover:gradient-text transition-smooth">
                  Unissential
                </span>
              </Link>
              <p className="text-neutral-600 leading-relaxed text-sm">
                Making student housing easier, one listing at a time.
              </p>

              {/* Social Links */}
              <motion.div
                className="flex items-center gap-4 mt-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-neutral-600 hover:text-primary-600 transition-smooth"
                  >
                    {social.label}
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            {/* Footer Links */}
            {footerLinks.map((column) => (
              <motion.div key={column.title} variants={itemVariants}>
                <h4 className="text-sm font-semibold text-neutral-900 mb-6 uppercase tracking-wider">
                  {column.title}
                </h4>
                <ul className="space-y-4">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <motion.a
                        href={link.href}
                        className="text-sm text-neutral-600 hover:text-primary-600 transition-smooth font-medium"
                        whileHover={{ x: 4 }}
                      >
                        {link.label}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          {/* Divider */}
          <motion.div
            className="h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent my-12"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          />

          {/* Bottom Bar */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-neutral-600"
          >
            <motion.p variants={itemVariants}>
              (c) {currentYear} Unissential. All rights reserved.
            </motion.p>
            <motion.div
              className="flex items-center gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.a
                href="/privacy"
                variants={itemVariants}
                className="hover:text-primary-600 transition-smooth"
              >
                Privacy Policy
              </motion.a>
              <span className="text-neutral-300">|</span>
              <motion.a
                href="/terms"
                variants={itemVariants}
                className="hover:text-primary-600 transition-smooth"
              >
                Terms of Service
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </footer>
  );
};
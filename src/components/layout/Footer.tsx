'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui';

const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'Lease', href: '#lease' },
      { label: 'Roommates', href: '#roommates' },
      { label: 'Marketplace', href: '#marketplace' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
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
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12"
          >
            <motion.div variants={itemVariants} className="md:col-span-1">
              <Image
                src="/U_logo.png"
                alt="Unissential"
                width={40}
                height={40}
                className="mb-4 object-contain"
              />
              <p className="text-neutral-600 leading-relaxed text-sm">
                Making student housing easier, one listing at a time.
              </p>
            </motion.div>

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
                        className="text-sm text-neutral-600 hover:text-primary-600 transition-smooth"
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

          <motion.div
            className="h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent my-12"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-neutral-600"
          >
            <motion.p variants={itemVariants}>
              Copyright {currentYear} Unissential. All rights reserved.
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
                Privacy
              </motion.a>
              <motion.a
                href="/terms"
                variants={itemVariants}
                className="hover:text-primary-600 transition-smooth"
              >
                Terms
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </footer>
  );
};

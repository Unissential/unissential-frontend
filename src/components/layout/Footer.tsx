'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from '@/ui/Container';

const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#' },
      { label: 'Pricing', href: '#' },
      { label: 'Security', href: '#' },
      { label: 'Status', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'Cookies', href: '#' },
      { label: 'License', href: '#' },
    ],
  },
  {
    title: 'Social',
    links: [
      { label: 'Twitter', href: '#' },
      { label: 'GitHub', href: '#' },
      { label: 'LinkedIn', href: '#' },
      { label: 'Discord', href: '#' },
    ],
  },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <Container>
        <div className="py-12 md:py-16">
          {/* Footer Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center">
                  <span className="text-white font-bold">U</span>
                </div>
                <span className="text-lg font-bold text-neutral-900">Unissential</span>
              </div>
              <p className="text-sm text-neutral-600">
                Building the future of productivity and innovation.
              </p>
            </div>

            {/* Links */}
            {footerLinks.map((column) => (
              <div key={column.title}>
                <h4 className="text-sm font-semibold text-neutral-900 mb-4">{column.title}</h4>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-neutral-600 hover:text-neutral-900 transition-smooth"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-neutral-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-neutral-600">
              © {currentYear} Unissential. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-sm text-neutral-600 hover:text-neutral-900 transition-smooth">
                Privacy Policy
              </Link>
              <span className="text-neutral-300">•</span>
              <Link href="#" className="text-sm text-neutral-600 hover:text-neutral-900 transition-smooth">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

/**
 * Footer Component
 */

import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Main Footer Grid */}
          <div className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-5">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-neutral-900">Unissential</h3>
                <p className="mt-2 text-neutral-600">
                  The complete platform for student housing, roommate matching, and marketplace.
                </p>
              </div>
              {/* Social Links */}
              <div className="flex gap-3">
                {[
                  { name: 'Facebook', icon: '🔵' },
                  { name: 'Twitter', icon: '𝕏' },
                  { name: 'Instagram', icon: '📷' },
                  { name: 'LinkedIn', icon: '💼' },
                ].map(({ name, icon }) => (
                  <a
                    key={name}
                    href="#"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-lg transition-all hover:bg-primary-600 hover:text-white"
                    title={name}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-semibold text-neutral-900">Product</h4>
              <nav className="mt-4 space-y-2">
                {['Find Rooms', 'Roommate Matching', 'Marketplace', 'For Landlords'].map(
                  (link) => (
                    <a
                      key={link}
                      href="#"
                      className="block text-sm text-neutral-600 transition-colors hover:text-primary-600"
                    >
                      {link}
                    </a>
                  ),
                )}
              </nav>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold text-neutral-900">Company</h4>
              <nav className="mt-4 space-y-2">
                {['About Us', 'Blog', 'Careers', 'Contact'].map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="block text-sm text-neutral-600 transition-colors hover:text-primary-600"
                  >
                    {link}
                  </a>
                ))}
              </nav>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-semibold text-neutral-900">Legal</h4>
              <nav className="mt-4 space-y-2">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Accessibility'].map(
                  (link) => (
                    <a
                      key={link}
                      href="#"
                      className="block text-sm text-neutral-600 transition-colors hover:text-primary-600"
                    >
                      {link}
                    </a>
                  ),
                )}
              </nav>
            </div>
          </div>

          {/* Newsletter */}
          <div className="mb-12 rounded-2xl bg-neutral-50 p-6 sm:p-8">
            <div className="grid gap-6 md:grid-cols-2 md:items-center">
              <div>
                <h3 className="text-xl font-bold text-neutral-900">
                  Stay Updated
                </h3>
                <p className="mt-2 text-neutral-600">
                  Get tips, listings, and matching updates delivered to your inbox
                </p>
              </div>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-neutral-900 placeholder:text-neutral-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
                <button className="rounded-lg bg-primary-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-700">
                  📧
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col gap-4 border-t border-neutral-200 pt-8 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-neutral-600">
              © {currentYear} Unissential. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-sm text-neutral-600 transition-colors hover:text-primary-600"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-sm text-neutral-600 transition-colors hover:text-primary-600"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-sm text-neutral-600 transition-colors hover:text-primary-600"
              >
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

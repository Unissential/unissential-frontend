'use client';

import Link from 'next/link';
import { categoryConfig } from '@/data/mockMarketplace';

interface EmptyStateProps {
  onReset: () => void;
}

export function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="w-full py-16 px-4 text-center">
      {/* Empty Icon */}
      <div className="flex justify-center mb-6">
        <div className="text-6xl">📭</div>
      </div>

      {/* Heading */}
      <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
        No products found
      </h3>

      {/* Description */}
      <p className="text-neutral-600 mb-8 max-w-md mx-auto">
        We couldn't find any products matching your filters. Try adjusting your search or browse our popular categories.
      </p>

      {/* Reset Filters Button */}
      <button
        onClick={onReset}
        className="inline-block mb-12 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
      >
        Reset Filters
      </button>

      {/* Popular Categories */}
      <div className="mt-12">
        <p className="text-neutral-600 font-medium mb-4">Popular categories:</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-md mx-auto">
          {categoryConfig.map((cat) => (
            <Link key={cat.name} href={`/marketplace?category=${cat.name}`}>
              <div className="p-4 rounded-lg border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-all cursor-pointer">
                <div className="text-2xl mb-1">{cat.icon}</div>
                <p className="text-xs text-neutral-700 font-medium">{cat.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Browse All Button */}
      <div className="mt-8">
        <Link href="/marketplace">
          <button className="px-6 py-2.5 text-neutral-700 font-medium border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-colors">
            Browse All Products
          </button>
        </Link>
      </div>
    </div>
  );
}

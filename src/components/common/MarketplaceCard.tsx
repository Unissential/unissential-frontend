/**
 * Marketplace Card Component
 */

import React from 'react';
import { Star, ShoppingBag } from 'lucide-react';
import type { MarketplaceItem } from '@/types/landing';
import { Button } from './Button';

interface MarketplaceCardProps {
  item: MarketplaceItem;
  onViewItem?: (id: string) => void;
}

export const MarketplaceCard: React.FC<MarketplaceCardProps> = ({ item, onViewItem }) => {
  const conditionColors = {
    'Like New': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    Good: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    Fair: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  };

  return (
    <div className="group overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 dark:bg-neutral-800">
      {/* Image */}
      <div className="relative h-40 overflow-hidden bg-neutral-200 dark:bg-neutral-700">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute right-2 top-2">
          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${conditionColors[item.condition]}`}>
            {item.condition}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-3">
        <div>
          <p className="text-xs font-medium text-primary-600 dark:text-primary-400">{item.category}</p>
          <h4 className="line-clamp-2 font-semibold text-neutral-900 dark:text-white">{item.title}</h4>
        </div>

        {/* Rating & Seller */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">{item.rating}</span>
          </div>
          <span className="text-xs text-neutral-600 dark:text-neutral-400">by {item.seller}</span>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between gap-2 border-t border-neutral-200 pt-2 dark:border-neutral-700">
          <p className="text-lg font-bold text-neutral-900 dark:text-white">${item.price}</p>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onViewItem?.(item.id)}
            className="h-8 px-2 text-xs"
          >
            <ShoppingBag className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

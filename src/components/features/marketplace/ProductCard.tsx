'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, Calendar } from 'lucide-react';
import { MarketplaceProduct } from '@/types/marketplace';
import { cn } from '@/lib/utils';
import { formatDistance } from '@/lib/distance';
import { useState } from 'react';

interface ProductCardProps {
  product: MarketplaceProduct;
  onFavorite?: (productId: string) => void;
  isFavorited?: boolean;
}

export function ProductCard({ product, onFavorite, isFavorited = false }: ProductCardProps) {
  const [isFav, setIsFav] = useState(isFavorited);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFav(!isFav);
    onFavorite?.(product.id);
  };

  const conditionColor = {
    'new': 'bg-green-100 text-green-800',
    'like-new': 'bg-blue-100 text-blue-800',
    'good': 'bg-amber-100 text-amber-800',
    'fair': 'bg-orange-100 text-orange-800',
  }[product.condition];

  const conditionLabel = {
    'new': 'New',
    'like-new': 'Like New',
    'good': 'Good',
    'fair': 'Fair',
  }[product.condition];

  const postedDaysAgo = Math.floor(
    (new Date().getTime() - new Date(product.postedDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const timeLabel = postedDaysAgo === 0 ? 'Today' : postedDaysAgo === 1 ? 'Yesterday' : `${postedDaysAgo}d ago`;

  return (
    <Link href={`/marketplace/${product.id}`}>
      <div className="group cursor-pointer h-full">
        {/* Card Container */}
        <div className="rounded-xl overflow-hidden bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
          {/* Image Container */}
          <div className="relative overflow-hidden bg-neutral-100 aspect-square">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            {/* Condition Badge */}
            <div className={cn('absolute top-2.5 left-2.5 px-3 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm', conditionColor)}>
              {conditionLabel}
            </div>

            {/* Favorite Button */}
            <button
              onClick={handleFavorite}
              className="absolute top-2.5 right-2.5 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all hover:scale-110"
            >
              <Heart
                size={18}
                className={cn('transition-colors', isFav ? 'fill-red-500 text-red-500' : 'text-neutral-400 hover:text-red-400')}
              />
            </button>

            {/* View Count Badge */}
            {product.views && (
              <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-lg">
                👁 {product.views}
              </div>
            )}
          </div>

          {/* Product Info - Scrollable Container */}
          <div className="flex-1 flex flex-col p-3.5 space-y-3">
            {/* Title */}
            <div>
              <h3 className="font-semibold text-neutral-900 line-clamp-2 text-sm leading-snug group-hover:text-primary-600 transition-colors">
                {product.title}
              </h3>
            </div>

            {/* Price and Distance */}
            <div className="space-y-1.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-neutral-900">${product.price}</span>
                {product.distance !== undefined && (
                  <span className="text-xs text-neutral-500">{formatDistance(product.distance)}</span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-neutral-600">
                <MapPin size={14} className="flex-shrink-0" />
                <span className="truncate">{product.location}</span>
              </div>
            </div>

            {/* University & Time */}
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="inline-block px-2 py-1 bg-primary-50 text-primary-700 font-medium rounded-md">
                {product.university}
              </div>
              <div className="flex items-center gap-1 text-neutral-500">
                <Calendar size={12} />
                <span>{timeLabel}</span>
              </div>
            </div>

            {/* Divider */}
            <div className="flex-1"></div>

            {/* Seller Info */}
            <div className="border-t border-neutral-100 pt-3 mt-2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 relative rounded-full overflow-hidden flex-shrink-0 ring-1 ring-neutral-200">
                  <Image
                    src={product.seller.avatar}
                    alt={product.seller.name}
                    fill
                    className="object-cover"
                    sizes="28px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-neutral-800 truncate">{product.seller.name}</p>
                  <p className="text-xs text-neutral-500">★ {product.seller.rating}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

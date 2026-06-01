'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { SavedListing } from '@/types/dashboard';
import { useState } from 'react';

interface SavedItemCardProps {
  item: SavedListing;
  onRemove?: (id: string) => void;
}

export function SavedItemCard({ item, onRemove }: SavedItemCardProps) {
  const [isSaved, setIsSaved] = useState(true);

  const handleRemove = () => {
    setIsSaved(false);
    onRemove?.(item.id);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lease':
        return 'bg-blue-100 text-blue-800';
      case 'roommate':
        return 'bg-purple-100 text-purple-800';
      case 'product':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'lease':
        return 'Lease';
      case 'roommate':
        return 'Roommate';
      case 'product':
        return 'Product';
      default:
        return type;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-all"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-neutral-100 aspect-video">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {/* Type Badge */}
        <div
          className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-semibold ${getTypeColor(item.type)}`}
        >
          {getTypeLabel(item.type)}
        </div>
        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={handleRemove}
          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all"
        >
          <Heart size={18} className="text-red-500 fill-red-500" />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-neutral-900 line-clamp-2 mb-2">{item.title}</h3>

        {/* Price and Location */}
        <div className="space-y-2 mb-3">
          {item.price && <p className="text-lg font-bold text-neutral-900">${item.price}</p>}
          <div className="flex items-center gap-1 text-sm text-neutral-600">
            <MapPin size={14} />
            <span className="truncate">{item.location}</span>
          </div>
          {item.detail && <p className="text-xs text-neutral-600">{item.detail}</p>}
        </div>

        {/* Saved Date */}
        <p className="text-xs text-neutral-500">Saved {item.savedAt}</p>
      </div>
    </motion.div>
  );
}

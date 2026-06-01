'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Wifi,
  UtensilsCrossed,
  Car,
  Dumbbell,
  PawPrint,
  BookOpen,
  Wind,
  Shirt,
} from 'lucide-react';
import { PropertyAmenity } from '@/types/property';

interface PropertyAmenitiesProps {
  amenities: PropertyAmenity[];
}

const iconMap: Record<string, React.ReactNode> = {
  Wifi: <Wifi size={20} />,
  UtensilsCrossed: <UtensilsCrossed size={20} />,
  Car: <Car size={20} />,
  Shirt: <Shirt size={20} />,
  Dumbbell: <Dumbbell size={20} />,
  PawPrint: <PawPrint size={20} />,
  BookOpen: <BookOpen size={20} />,
  Wind: <Wind size={20} />,
};

export const PropertyAmenities: React.FC<PropertyAmenitiesProps> = ({ amenities }) => {
  const groupedAmenities = {
    utilities: amenities.filter((a) => a.category === 'utilities'),
    lifestyle: amenities.filter((a) => a.category === 'lifestyle'),
    facilities: amenities.filter((a) => a.category === 'facilities'),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  const renderAmenityCategory = (title: string, items: PropertyAmenity[]) => (
    <div key={title} className="space-y-3">
      <h4 className="text-sm font-semibold text-neutral-900 capitalize">{title}</h4>
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-2 sm:grid-cols-3 gap-3"
      >
        {items.map((amenity) => (
          <motion.div
            key={amenity.id}
            variants={itemVariants}
            whileHover={{ y: -2 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 border border-neutral-100 hover:border-primary-200 hover:bg-primary-50 transition-all"
          >
            <div className="text-primary-600 flex-shrink-0">{iconMap[amenity.icon]}</div>
            <span className="text-sm font-medium text-neutral-700">{amenity.name}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Amenities</h2>
        <p className="text-neutral-600">Everything you need for comfortable student living</p>
      </div>

      <div className="space-y-6">
        {groupedAmenities.utilities.length > 0 &&
          renderAmenityCategory('utilities', groupedAmenities.utilities)}
        {groupedAmenities.lifestyle.length > 0 &&
          renderAmenityCategory('lifestyle', groupedAmenities.lifestyle)}
        {groupedAmenities.facilities.length > 0 &&
          renderAmenityCategory('facilities', groupedAmenities.facilities)}
      </div>
    </motion.div>
  );
};

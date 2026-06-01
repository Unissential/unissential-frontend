'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface PropertyImageGalleryProps {
  images: Array<{
    id: string;
    url: string;
    alt: string;
    order: number;
  }>;
}

export const PropertyImageGallery: React.FC<PropertyImageGalleryProps> = ({ images }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const currentImage = images[selectedImageIndex];

  const handleNext = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="w-full">
      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full rounded-2xl overflow-hidden bg-neutral-100 aspect-video md:aspect-[16/9]"
      >
        <Image
          src={currentImage.url}
          alt={currentImage.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
          className="object-cover"
          priority
        />

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} className="text-neutral-900" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
          aria-label="Next image"
        >
          <ChevronRight size={24} className="text-neutral-900" />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-neutral-900/70 text-white text-sm font-medium">
          {selectedImageIndex + 1} / {images.length}
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={() => setShowFullscreen(true)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
          aria-label="Fullscreen"
        >
          <Maximize2 size={20} className="text-neutral-900" />
        </button>
      </motion.div>

      {/* Thumbnail Gallery */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-4"
      >
        {images.map((image, index) => (
          <motion.button
            key={image.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedImageIndex(index)}
            className={`relative rounded-lg overflow-hidden aspect-square transition-all ${
              selectedImageIndex === index
                ? 'ring-2 ring-primary-500 ring-offset-2'
                : 'ring-1 ring-neutral-200 hover:ring-neutral-300'
            }`}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="150px"
              className="object-cover"
            />
          </motion.button>
        ))}
      </motion.div>

      {/* Image Info */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="text-sm text-neutral-600 mt-3"
      >
        {currentImage.alt}
      </motion.p>
    </div>
  );
};

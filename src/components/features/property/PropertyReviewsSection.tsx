'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { PropertyReview } from '@/types/property';

interface PropertyReviewsSectionProps {
  reviews: PropertyReview[];
  averageRating: number;
}

export const PropertyReviewsSection: React.FC<PropertyReviewsSectionProps> = ({
  reviews,
  averageRating,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Student Reviews</h2>
        <p className="text-neutral-600">What students are saying about this property</p>
      </div>

      {/* Rating Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        viewport={{ once: true }}
        className="p-6 rounded-lg bg-neutral-50 border border-neutral-200"
      >
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-4xl font-bold text-neutral-900">{averageRating.toFixed(1)}</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < Math.floor(averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-neutral-300'
                  }
                />
              ))}
            </div>
          </div>

          <div className="border-l border-neutral-200 pl-6">
            <p className="text-lg font-semibold text-neutral-900">
              {reviews.length} verified reviews
            </p>
            <p className="text-sm text-neutral-600">from students who lived here</p>
          </div>
        </div>
      </motion.div>

      {/* Reviews List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="space-y-4"
      >
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            variants={itemVariants}
            className="p-5 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-all"
          >
            {/* Reviewer Info */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={review.avatar}
                    alt={review.studentName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">{review.studentName}</p>
                  <p className="text-xs text-neutral-600">{review.date}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'
                    }
                  />
                ))}
              </div>
            </div>

            {/* Review Text */}
            <p className="text-neutral-700 text-sm leading-relaxed">{review.review}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

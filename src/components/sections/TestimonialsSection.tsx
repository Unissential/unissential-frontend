/**
 * Testimonials Section
 */

import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Badge } from '@/components/common';
import { testimonials } from '@/data/landing-mock';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="relative px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex mb-4">
            <Badge variant="success">
              <Star className="h-4 w-4" />
              Love from Students
            </Badge>
          </div>
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">
            Trusted by 50,000+ Students
          </h2>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
            Real feedback from real students who found their perfect living situation
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="group rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:bg-neutral-800"
            >
              {/* Quote Icon */}
              <Quote className="h-5 w-5 text-primary-200 dark:text-primary-900" />

              {/* Content */}
              <p className="mt-4 line-clamp-3 text-neutral-700 dark:text-neutral-300">
                {testimonial.content}
              </p>

              {/* Rating */}
              <div className="mt-4 flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Author Info */}
              <div className="mt-6 border-t border-neutral-200 pt-4 dark:border-neutral-700">
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-white">
                      {testimonial.author}
                    </p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      {testimonial.role} • {testimonial.school}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Section */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-neutral-50 to-primary-50 p-8 dark:from-neutral-900/50 dark:to-primary-950/30">
          <div className="grid gap-8 text-center sm:grid-cols-3">
            {[
              { metric: '4.9/5', label: 'Average Rating', icon: '⭐' },
              { metric: '50K+', label: 'Happy Students', icon: '😊' },
              { metric: '98%', label: 'Would Recommend', icon: '👍' },
            ].map(({ metric, label, icon }) => (
              <div key={label}>
                <p className="text-3xl">{icon}</p>
                <p className="mt-2 text-3xl font-bold text-neutral-900 dark:text-white">
                  {metric}
                </p>
                <p className="mt-1 text-neutral-600 dark:text-neutral-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

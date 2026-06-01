'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui';
import {
  PropertyImageGallery,
  PropertyInfo,
  PropertyAmenities,
  PropertyDescription,
  BookingSidebar,
  HostProfileCard,
  PropertyLocationSection,
  PropertyReviewsSection,
  SimilarListingsSection,
} from '@/components/features/property';
import { getPropertyById, getSimilarProperties } from '@/data/mockPropertyDetails';
import { mockListings } from '@/data/mockListings';

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;

  // Fetch property data
  const property = getPropertyById(propertyId);
  const similarProperties = getSimilarProperties(propertyId, 4);

  // Get actual similar listings from mock data
  const similarListings = mockListings.slice(0, 4);

  return (
    <main className="min-h-screen bg-white pt-20 md:pt-24">
      <Container>
        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 md:mb-12"
        >
          <PropertyImageGallery images={property.images} />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 md:mb-16">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Property Info */}
            <PropertyInfo property={property} />

            {/* Divider */}
            <div className="border-t border-neutral-200" />

            {/* Amenities */}
            <PropertyAmenities amenities={property.amenities} />

            {/* Divider */}
            <div className="border-t border-neutral-200" />

            {/* Description */}
            <PropertyDescription property={property} />

            {/* Divider */}
            <div className="border-t border-neutral-200" />

            {/* Location */}
            <PropertyLocationSection location={property.location} />

            {/* Host Profile Card - Full Width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              <HostProfileCard host={property.host} />
            </motion.div>

            {/* Divider */}
            <div className="border-t border-neutral-200" />

            {/* Reviews */}
            <PropertyReviewsSection
              reviews={property.reviews}
              averageRating={property.host.rating}
            />
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <BookingSidebar property={property} />
          </div>
        </div>

        {/* Similar Listings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-neutral-200 pt-12 md:pt-16 mb-12 md:mb-20"
        >
          <SimilarListingsSection listings={similarListings} />
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="py-12 px-6 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">
            Ready to Schedule a Tour?
          </h2>
          <p className="text-neutral-700 mb-6 max-w-2xl mx-auto">
            Connect with the host today to ask questions, request a virtual tour, or schedule an
            in-person visit.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors"
          >
            Get in Touch
          </motion.button>
        </motion.div>
      </Container>
    </main>
  );
}

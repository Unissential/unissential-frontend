'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui';
import { Loader } from 'lucide-react';
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
import { listingService } from '@/services/api/listing.service';
import { mockListings } from '@/data/mockMarketplace';

interface PropertyData {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  amenities: string[];
  host: { id: string; name: string; avatar: string; rating: number; reviews: number };
  createdAt: string;
  views: number;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const data = await listingService.getListingById(propertyId);
        // Transform ListingDTO to PropertyData
        const transformed: PropertyData = {
          id: data.id,
          title: data.title,
          description: data.description,
          price: data.price,
          location: data.location,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          images: data.images,
          amenities: data.amenities,
          host: {
            id: data.owner.id,
            name: data.owner.name,
            avatar: data.owner.avatar || '',
            rating: 4.5,
            reviews: 12,
          },
          createdAt: data.createdAt.toString(),
          views: data.views || 0,
        };
        setProperty(transformed);
      } catch (error) {
        console.error('Failed to load property from API, using mock data:', error);
        // Fallback to mock data
        const mockProperty = mockListings.find((p) => p.id === propertyId);
        if (mockProperty) {
          // Ensure mock data matches PropertyData format
          const transformed: PropertyData = {
            id: mockProperty.id,
            title: mockProperty.title,
            description: mockProperty.description,
            price: mockProperty.price,
            location: mockProperty.location,
            bedrooms: mockProperty.bedrooms,
            bathrooms: mockProperty.bathrooms,
            images: mockProperty.images,
            amenities: mockProperty.amenities || [],
            host: {
              id: 'host-1',
              name: 'Property Owner',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner',
              rating: 4.5,
              reviews: 12,
            },
            createdAt: new Date().toISOString(),
            views: mockProperty.views || 0,
          };
          setProperty(transformed);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProperty();
  }, [propertyId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Property not found</p>
      </div>
    );
  }

  // Use empty arrays for related data until API is implemented
  const similarListings: PropertyData[] = [];
  const similarProperties: PropertyData[] = [];

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
          <PropertyImageGallery
            images={property.images.map((img, idx) => ({
              id: `img-${idx}`,
              url: img,
              alt: `Property image ${idx + 1}`,
              order: idx,
            }))}
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 md:mb-16">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Property Info */}
            <PropertyInfo property={property as any} />

            {/* Divider */}
            <div className="border-t border-neutral-200" />

            {/* Amenities */}
            <PropertyAmenities amenities={property.amenities as any} />

            {/* Divider */}
            <div className="border-t border-neutral-200" />

            {/* Description */}
            <PropertyDescription property={property as any} />

            {/* Divider */}
            <div className="border-t border-neutral-200" />

            {/* Location */}
            <PropertyLocationSection location={property.location as any} />

            {/* Host Profile Card - Full Width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              <HostProfileCard host={property.host as any} />
            </motion.div>

            {/* Divider */}
            <div className="border-t border-neutral-200" />

            {/* Reviews */}
            <PropertyReviewsSection reviews={[] as any} averageRating={property.host.rating} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <BookingSidebar property={property as any} />
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
          <SimilarListingsSection listings={similarListings as any} />
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

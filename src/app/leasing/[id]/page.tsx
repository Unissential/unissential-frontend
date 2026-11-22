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
import { PropertyDetail, PropertyHost } from '@/types/property';

interface PropertySource {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  amenities: string[];
  furnished?: boolean;
  latitude?: number | null;
  longitude?: number | null;
  university?: string | null;
  availableFrom?: string | Date | null;
  availableTo?: string | Date | null;
  leaseDuration?: string | null;
  isAvailable?: boolean;
}

function toPropertyDetail(source: PropertySource, host: PropertyHost): PropertyDetail {
  const start = source.availableFrom ? new Date(source.availableFrom) : undefined;
  const end = source.availableTo ? new Date(source.availableTo) : undefined;
  const furnished = source.furnished ?? (source.amenities.includes('Furnished') ? true : undefined);

  return {
    id: source.id,
    title: source.title,
    description: source.description,
    fullDescription: source.description,
    price: source.price,
    beds: source.bedrooms,
    baths: source.bathrooms,
    images: source.images.map((url, index) => ({
      id: `${source.id}-${index}`,
      url,
      alt: `Property image ${index + 1}`,
      order: index,
    })),
    amenities: source.amenities.map((name, index) => ({
      id: `${source.id}-${index}`,
      name,
      icon:
        name === 'WiFi' ? 'Wifi' : name === 'Parking' ? 'Car' : name === 'Laundry' ? 'Shirt' : '',
      category: 'facilities',
    })),
    furnished: furnished === undefined ? 'not specified' : furnished ? 'furnished' : 'unfurnished',
    duration: source.leaseDuration?.replace(/-/g, ' ') || 'Not specified',
    availability:
      source.isAvailable == null
        ? 'Not specified'
        : source.isAvailable
          ? 'Available'
          : 'Unavailable',
    dateRange:
      start && end && !isNaN(start.getTime()) && !isNaN(end.getTime()) ? { start, end } : undefined,
    roommatePreference: 'Not specified',
    host,
    location: {
      address: '',
      city: source.location,
      state: '',
      zipCode: '',
      latitude: source.latitude ?? undefined,
      longitude: source.longitude ?? undefined,
      nearbyUniversities: source.university ? [source.university] : [],
    },
    neighborhood: { highlights: [], commute: [] },
    rules: [],
    cancellationPolicy: 'Not specified',
    reviews: [],
  };
}

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadProperty = async () => {
      setIsLoading(true);
      setProperty(null);
      setIsDemo(false);
      setLoadError(null);
      try {
        const data = await listingService.getListingById(propertyId);
        if (active) {
          setProperty(
            toPropertyDetail(data, {
              id: data.owner.id,
              name: data.owner.name,
              avatar:
                data.owner.profilePicture ||
                data.owner.avatar ||
                'https://api.dicebear.com/7.x/avataaars/svg?seed=owner',
              verified: data.owner.isVerified,
              bio: data.owner.bio,
            })
          );
        }
      } catch (error) {
        if (!active) return;
        console.error('Failed to load property from API, using mock data:', error);
        const mockProperty = mockListings.find((p) => p.id === propertyId);
        if (mockProperty) {
          setProperty(toPropertyDetail(mockProperty, mockProperty.host));
          setIsDemo(true);
        } else {
          setLoadError(error instanceof Error ? error.message : 'Failed to load property');
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadProperty();
    return () => {
      active = false;
    };
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
        <p>{loadError ? `Unable to load property: ${loadError}` : 'Property not found'}</p>
      </div>
    );
  }

  // Use empty arrays for related data until API is implemented
  return (
    <main className="min-h-screen bg-white pt-20 md:pt-24">
      <Container>
        {isDemo && (
          <p className="mb-4 text-sm text-neutral-600">
            Demo listing: the live listing could not be loaded.
          </p>
        )}
        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 md:mb-12"
        >
          <PropertyImageGallery key={property.id} images={property.images} />
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
            <PropertyReviewsSection reviews={property.reviews} />
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
          <SimilarListingsSection listings={[]} />
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

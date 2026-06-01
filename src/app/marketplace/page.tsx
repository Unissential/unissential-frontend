'use client';

import { useState, useMemo, useEffect } from 'react';
import { mockMarketplaceProducts } from '@/data/mockMarketplace';
import { MarketplaceFilterState, UserLocation } from '@/types/marketplace';
import { ProductCard, MarketplaceFilters, EmptyState } from '@/components/features/marketplace';
import { LocationSelector } from '@/components/features/marketplace/LocationSelector';
import { calculateDistance } from '@/lib/distance';

const DEFAULT_FILTERS: MarketplaceFilterState = {
  searchQuery: '',
  category: '',
  priceRange: [0, 10000],
  condition: '',
  university: '',
  delivery: '',
  distance: '',
  sortBy: 'newest',
};

const DEFAULT_USER_LOCATION: UserLocation = {
  name: 'UT Campus Center',
  latitude: 30.2842,
  longitude: -97.7405,
};

export default function MarketplacePage() {
  const [filters, setFilters] = useState<MarketplaceFilterState>(DEFAULT_FILTERS);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  // Initialize user location on mount
  useEffect(() => {
    setUserLocation(DEFAULT_USER_LOCATION);
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!userLocation) return [];

    let filtered = mockMarketplaceProducts.map((product) => ({
      ...product,
      // Calculate distance for each product
      distance: calculateDistance(
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        { latitude: product.latitude, longitude: product.longitude }
      ),
    }));

    // Apply filters
    filtered = filtered.filter((product) => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch =
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category && product.category !== filters.category) return false;

      // Condition filter
      if (filters.condition && product.condition !== filters.condition) return false;

      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // University filter
      if (
        filters.university &&
        !product.university.toLowerCase().includes(filters.university.toLowerCase())
      ) {
        return false;
      }

      // Delivery filter
      if (filters.delivery && product.delivery !== filters.delivery) return false;

      return true;
    });

    // Sort products
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'most-relevant':
        // If there's a search query, prioritize matches
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          filtered.sort((a, b) => {
            const aIndex = a.title.toLowerCase().indexOf(query);
            const bIndex = b.title.toLowerCase().indexOf(query);
            return aIndex - bIndex;
          });
        }
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    }

    return filtered;
  }, [filters, userLocation]);

  const handleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-2 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900">
              Student Marketplace
            </h1>
            <p className="text-lg text-neutral-600">
              Buy and sell student essentials at great prices
            </p>
          </div>

          {/* Location Selector */}
          <div className="mb-6 flex items-center gap-2 flex-wrap">
            <LocationSelector
              userLocation={userLocation}
              onLocationChange={setUserLocation}
            />
            {userLocation && (
              <span className="text-sm text-neutral-600">
                Distances from {userLocation.name}
              </span>
            )}
          </div>

          {/* Filters */}
          <MarketplaceFilters
            filters={filters}
            onFilterChange={setFilters}
            onReset={handleReset}
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Count */}
        {filteredProducts.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-neutral-600">
              Showing <span className="font-semibold text-neutral-900">{filteredProducts.length}</span>{' '}
              {filteredProducts.length === 1 ? 'product' : 'products'}
            </p>
          </div>
        )}

        {/* Products Grid or Empty State */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onFavorite={handleFavorite}
                isFavorited={favorites.includes(product.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState onReset={handleReset} />
        )}
      </div>

      {/* Sell Button - Floating */}
      <div className="fixed bottom-8 right-8">
        <a
          href="/marketplace/create"
          className="inline-flex items-center gap-2 px-6 py-3 bg-secondary-600 hover:bg-secondary-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          <span className="text-xl">➕</span>
          Sell Item
        </a>
      </div>
    </main>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader, Plus, Heart } from 'lucide-react';
import { Container } from '@/components/ui';
import { marketplaceService } from '@/services/api/marketplace.service';
import { MarketplaceProduct, MarketplaceFilters } from '@/types/marketplace';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const categories = [
  'electronics',
  'textbooks',
  'furniture',
  'appliances',
  'bikes',
  'clothing',
  'other',
];
const conditions = ['like_new', 'excellent', 'good', 'fair'];
const deliveryTypes = ['pickup', 'delivery', 'both'];
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'views', label: 'Most Viewed' },
];

interface PageFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  location?: string;
  university?: string;
  deliveryType?: string;
  sort?: string;
}

export default function MarketplacePage() {
  const { addToast } = useToast();
  const { user } = useAuth();
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [savedProducts, setSavedProducts] = useState<Set<string>>(new Set());
  const [savedStatusLoading, setSavedStatusLoading] = useState(true);
  const [savingProducts, setSavingProducts] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<PageFilters>({
    sort: 'newest',
  });

  useEffect(() => {
    let active = true;
    const loadProducts = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const response = await marketplaceService.getAllProducts(currentPage, 12, {
          search: filters.search,
          category: filters.category as any,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          condition: filters.condition as any,
          location: filters.location,
          university: filters.university,
          deliveryType: filters.deliveryType as any,
          sort: filters.sort as any,
        });
        if (active) {
          setProducts(response.data);
          setTotalPages(response.pagination.pages);
        }
      } catch (error) {
        if (!active) return;
        const message = error instanceof Error ? error.message : 'Failed to load products';
        setLoadError(message);
        addToast(message, 'error');
        setProducts([]);
        setTotalPages(1);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadProducts();
    return () => {
      active = false;
    };
  }, [filters, currentPage, addToast]);

  useEffect(() => {
    let active = true;
    setSavedStatusLoading(true);
    if (!user || products.length === 0) {
      setSavedProducts(new Set());
      return () => {
        active = false;
      };
    }

    Promise.all(
      products.map(async (product) => ({
        id: product.id,
        saved: await marketplaceService.isProductSaved(product.id),
      }))
    )
      .then((results) => {
        if (active) {
          setSavedProducts(new Set(results.filter((item) => item.saved).map((item) => item.id)));
          setSavedStatusLoading(false);
        }
      })
      .catch((error: unknown) => {
        if (active)
          addToast(error instanceof Error ? error.message : 'Failed to load saved status', 'error');
      });

    return () => {
      active = false;
    };
  }, [user, products, addToast]);

  const handleFilterChange = (key: keyof PageFilters, value: string | number | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
    setCurrentPage(1);
  };

  const handleSaveProduct = async (productId: string, isSaved: boolean) => {
    if (!user) {
      addToast('Please log in to save products', 'error');
      return;
    }

    setSavingProducts((prev) => new Set(prev).add(productId));
    try {
      if (isSaved) {
        await marketplaceService.unsaveProduct(productId);
        setSavedProducts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        addToast('Product unsaved', 'success');
      } else {
        await marketplaceService.saveProduct(productId);
        setSavedProducts((prev) => new Set(prev).add(productId));
        addToast('Product saved', 'success');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save product';
      addToast(message, 'error');
    } finally {
      setSavingProducts((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  return (
    <Container>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-4"
        >
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">Student Marketplace</h1>
            <p className="text-gray-600">Buy and sell student essentials at great prices</p>
          </div>
          {user && (
            <Link
              href="/marketplace/create"
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 whitespace-nowrap flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Sell Item
            </Link>
          )}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl border border-gray-200 space-y-4"
        >
          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search for items..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
              <select
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Condition</label>
              <select
                value={filters.condition || ''}
                onChange={(e) => handleFilterChange('condition', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Conditions</option>
                {conditions.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond.replace('_', ' ').charAt(0).toUpperCase() +
                      cond.slice(1).replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Delivery Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Delivery</label>
              <select
                value={filters.deliveryType || ''}
                onChange={(e) => handleFilterChange('deliveryType', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Any Method</option>
                {deliveryTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Sort By</label>
              <select
                value={filters.sort || 'newest'}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Min Price</label>
              <div className="relative">
                <span className="absolute left-4 top-2 text-gray-600">$</span>
                <input
                  type="number"
                  min="0"
                  value={filters.minPrice || ''}
                  onChange={(e) =>
                    handleFilterChange(
                      'minPrice',
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Min"
                />
              </div>
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Max Price</label>
              <div className="relative">
                <span className="absolute left-4 top-2 text-gray-600">$</span>
                <input
                  type="number"
                  min="0"
                  value={filters.maxPrice || ''}
                  onChange={(e) =>
                    handleFilterChange(
                      'maxPrice',
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Max"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Location</label>
              <input
                type="text"
                placeholder="City or area..."
                value={filters.location || ''}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* University */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">University</label>
              <input
                type="text"
                placeholder="University..."
                value={filters.university || ''}
                onChange={(e) => handleFilterChange('university', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <Loader className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : products.length > 0 ? (
          <>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  variants={item}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow relative group"
                >
                  {/* Save Button */}
                  {user && (
                    <button
                      onClick={() => handleSaveProduct(product.id, savedProducts.has(product.id))}
                      disabled={savedStatusLoading || savingProducts.has(product.id)}
                      aria-label={savedProducts.has(product.id) ? 'Unsave product' : 'Save product'}
                      className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    >
                      <Heart
                        className={`w-5 h-5 ${savedProducts.has(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                      />
                    </button>
                  )}

                  {/* Availability Badge */}
                  {!product.isAvailable && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-xl">
                      <span className="text-white font-semibold">Sold</span>
                    </div>
                  )}

                  {/* Image */}
                  <div className="relative w-full h-48 bg-gray-200">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium text-indigo-600">{product.category}</p>
                      <p className="text-xs text-gray-500">{product.condition}</p>
                    </div>
                    <h3 className="font-semibold text-gray-900 line-clamp-2">{product.title}</h3>
                    <p className="text-xs text-gray-500">{product.location}</p>
                    {product.university && (
                      <p className="text-xs text-gray-500">{product.university}</p>
                    )}

                    {/* Footer */}
                    <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                      <span className="text-lg font-bold text-indigo-600">${product.price}</span>
                      <Link
                        href={`/marketplace/${product.id}`}
                        className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-4"
              >
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </motion.div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {loadError ? 'Unable to load products' : 'No products found'}
            </h3>
            <p className="text-gray-600">{loadError || 'Try adjusting your filters'}</p>
          </div>
        )}
      </motion.div>
    </Container>
  );
}

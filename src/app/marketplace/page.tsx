'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader, Plus } from 'lucide-react';
import { Container } from '@/components/ui';
import { marketplaceService } from '@/services/api/marketplace.service';
import { MarketplaceProductDTO } from '@/types/api';
import { useToast } from '@/contexts/ToastContext';
import Link from 'next/link';
import Image from 'next/image';

interface Filters {
  searchQuery: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  condition: string;
}

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

const categories = ['Electronics', 'Books', 'Furniture', 'Clothing', 'Sports', 'Other'];
const conditions = ['New', 'Like New', 'Good', 'Fair'];

export default function MarketplacePage() {
  const { addToast } = useToast();
  const [products, setProducts] = useState<MarketplaceProductDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    searchQuery: '',
    category: '',
    minPrice: 0,
    maxPrice: 5000,
    condition: '',
  });

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const response = await marketplaceService.getAllProducts(currentPage, 12, {
          search: filters.searchQuery,
          category: filters.category,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          condition: filters.condition,
        });
        setProducts(response.data);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load products';
        addToast(message, 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [filters, currentPage, addToast]);

  const handleFilterChange = (key: keyof Filters, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
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
          <Link
            href="/marketplace/create"
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 whitespace-nowrap flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Sell Item
          </Link>
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
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Condition</label>
              <select
                value={filters.condition}
                onChange={(e) => handleFilterChange('condition', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Conditions</option>
                {conditions.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
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
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value))}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
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
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="relative w-full h-48 bg-gray-200">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
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
                  <p className="text-xs font-medium text-indigo-600">{product.category}</p>
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{product.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-1">{product.description}</p>

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
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters</p>
          </div>
        )}

        {/* Pagination */}
        {products.length > 0 && (
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
            <span className="text-sm text-gray-600">Page {currentPage}</span>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Next
            </button>
          </motion.div>
        )}
      </motion.div>
    </Container>
  );
}

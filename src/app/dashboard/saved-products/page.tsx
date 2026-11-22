'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui';
import { marketplaceService } from '@/services/api/marketplace.service';
import { MarketplaceProduct } from '@/types/marketplace';
import { useToast } from '@/contexts/ToastContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

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

function SavedProductsContent() {
  const { addToast } = useToast();
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const response = await marketplaceService.getSavedProducts(currentPage, 12);
        setProducts(response.data);
        setTotalPages(response.pagination.pages);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load saved products';
        addToast(message, 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [currentPage, addToast]);

  const handleUnsave = async (productId: string) => {
    try {
      await marketplaceService.unsaveProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addToast('Product removed from saved', 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to unsave product';
      addToast(message, 'error');
    }
  };

  return (
    <Container>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-gray-900">Saved Products</h1>
            <p className="text-gray-600 mt-2">View and manage your saved marketplace items</p>
          </div>
        </motion.div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <Loader className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading saved products...</p>
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
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* Image */}
                <div className="relative w-full h-48 bg-gray-200">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      unoptimized
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={() => handleUnsave(product.id)}
                    className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Sold Badge */}
                  {!product.isAvailable && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold">Sold</span>
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
                      className={`text-indigo-600 hover:text-indigo-700 font-medium text-sm ${!product.isAvailable ? 'opacity-50 pointer-events-none' : ''}`}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved products</h3>
            <p className="text-gray-600 mb-4">
              Start saving items from the marketplace to see them here
            </p>
            <Link
              href="/marketplace"
              className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg"
            >
              Browse Marketplace
            </Link>
          </div>
        )}

        {/* Pagination */}
        {products.length > 0 && totalPages > 1 && (
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
      </motion.div>
    </Container>
  );
}

export default function SavedProductsPage() {
  return (
    <ProtectedRoute>
      <SavedProductsContent />
    </ProtectedRoute>
  );
}

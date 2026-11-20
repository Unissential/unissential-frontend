'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader, Trash2, Edit2, CheckCircle, Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui';
import { marketplaceService } from '@/services/api/marketplace.service';
import { MarketplaceProduct } from '@/types/marketplace';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
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

function MyProductsContent() {
  const { addToast } = useToast();
  const { user } = useAuth();
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [markingSoldId, setMarkingSoldId] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const response = await marketplaceService.getUserProducts(user.id, currentPage, 12);
        setProducts(response.data);
        setTotalPages(response.pagination.pages);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load products';
        addToast(message, 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [user, currentPage, addToast]);

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setDeletingId(productId);
    try {
      await marketplaceService.deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addToast('Product deleted successfully', 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete product';
      addToast(message, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleMarkSold = async (productId: string) => {
    setMarkingSoldId(productId);
    try {
      await marketplaceService.markProductSold(productId);
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, isAvailable: false } : p))
      );
      addToast('Product marked as sold', 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to mark product as sold';
      addToast(message, 'error');
    } finally {
      setMarkingSoldId(null);
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
            <h1 className="text-4xl font-bold text-gray-900">My Products</h1>
            <p className="text-gray-600 mt-2">Manage your marketplace listings</p>
          </div>
          <Link
            href="/marketplace/create"
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 whitespace-nowrap flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Sell Item
          </Link>
        </motion.div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <Loader className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading your products...</p>
            </div>
          </div>
        ) : products.length > 0 ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-4"
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                variants={item}
                className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <Link href={`/marketplace/${product.id}`} className="flex-shrink-0">
                  <div className="relative w-32 h-32 bg-gray-200 rounded-lg overflow-hidden">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <span className="text-gray-400 text-sm">No image</span>
                      </div>
                    )}
                    {!product.isAvailable && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">Sold</span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{product.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-lg text-sm font-semibold flex-shrink-0 ${
                          product.isAvailable
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.isAvailable ? 'Available' : 'Sold'}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span>{product.category}</span>
                      <span>•</span>
                      <span>{product.condition}</span>
                      <span>•</span>
                      <span>{product.location}</span>
                      {product.university && (
                        <>
                          <span>•</span>
                          <span>{product.university}</span>
                        </>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{product.views} views</span>
                      <span>•</span>
                      <span>{product.interested} interested</span>
                    </div>
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="flex flex-col items-end justify-between gap-2">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-indigo-600">${product.price}</p>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/marketplace/${product.id}`}
                      className="px-3 py-2 text-indigo-600 hover:text-indigo-700 border border-indigo-200 hover:bg-indigo-50 rounded-lg transition-colors font-medium text-sm"
                    >
                      View
                    </Link>

                    {product.isAvailable && (
                      <button
                        onClick={() => handleMarkSold(product.id)}
                        disabled={markingSoldId === product.id}
                        className="px-3 py-2 text-green-600 hover:text-green-700 border border-green-200 hover:bg-green-50 rounded-lg transition-colors font-medium text-sm disabled:opacity-50 flex items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        {markingSoldId === product.id ? 'Marking...' : 'Mark Sold'}
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(product.id)}
                      disabled={deletingId === product.id}
                      className="px-3 py-2 text-red-600 hover:text-red-700 border border-red-200 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-600 mb-4">Start selling by creating your first listing</p>
            <Link
              href="/marketplace/create"
              className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg"
            >
              Create Listing
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

export default function MyProductsPage() {
  return (
    <ProtectedRoute>
      <MyProductsContent />
    </ProtectedRoute>
  );
}

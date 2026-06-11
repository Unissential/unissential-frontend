'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Heart, Share2, MessageCircle, MapPin, Truck, AlertCircle, ArrowLeft, Loader } from 'lucide-react';
import { marketplaceService } from '@/services/api/marketplace.service';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import { MarketplaceProduct } from '@/types/marketplace';
import { Container } from '@/components/ui';
import { motion } from 'framer-motion';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const { user } = useAuth();
  const productId = params.id as string;

  const [product, setProduct] = useState<MarketplaceProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await marketplaceService.getProductById(productId);
        setProduct(data);

        if (user) {
          const saved = await marketplaceService.isProductSaved(productId);
          setIsSaved(saved);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load product';
        setError(message);
        addToast(message, 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId, user, addToast]);

  const handleSaveProduct = async () => {
    if (!user) {
      addToast('Please log in to save products', 'error');
      return;
    }

    try {
      if (isSaved) {
        await marketplaceService.unsaveProduct(productId);
        setIsSaved(false);
        addToast('Product unsaved', 'success');
      } else {
        await marketplaceService.saveProduct(productId);
        setIsSaved(true);
        addToast('Product saved', 'success');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save product';
      addToast(message, 'error');
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Posted today';
    if (diffDays === 1) return 'Posted yesterday';
    return `Posted ${diffDays} days ago`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <Container>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
            <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
            <p className="text-gray-600">{error || "The product you're looking for doesn't exist."}</p>
            <Link
              href="/marketplace"
              className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg"
            >
              Back to Marketplace
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  const conditionColors: Record<string, string> = {
    like_new: 'bg-green-100 text-green-800',
    excellent: 'bg-blue-100 text-blue-800',
    good: 'bg-amber-100 text-amber-800',
    fair: 'bg-orange-100 text-orange-800',
  };

  const conditionLabels: Record<string, string> = {
    like_new: 'Like New',
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
  };

  return (
    <Container>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/marketplace" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </Link>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left: Image Gallery */}
          <div className="lg:col-span-2 space-y-4">
            {/* Availability Badge */}
            {!product.isAvailable && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700 font-medium">This item has been sold</p>
              </div>
            )}

            {/* Main Image */}
            <div className="relative w-full bg-gray-200 rounded-xl overflow-hidden" style={{ aspectRatio: '1' }}>
              {product.images?.[selectedImage] ? (
                <Image src={product.images[selectedImage]} alt={product.title} fill className="object-cover" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">No image</span>
                </div>
              )}

              {/* Navigation Arrows */}
              {product.images && product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev === 0 ? product.images!.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev === product.images!.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all"
                  >
                    →
                  </button>

                  <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 text-white text-sm rounded-full">
                    {selectedImage + 1} / {product.images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-indigo-600' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <Image src={image} alt={`Product ${index + 1}`} fill className="object-cover" sizes="100px" />
                  </button>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">About this item</h2>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Condition</p>
                  <p className="font-semibold text-gray-900">{conditionLabels[product.condition] || product.condition}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Category</p>
                  <p className="font-semibold text-gray-900">{product.category}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Views</p>
                  <p className="font-semibold text-gray-900">{product.views}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Interested</p>
                  <p className="font-semibold text-gray-900">{product.interested}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-4">
            {/* Price Card */}
            <motion.div
              className="bg-white rounded-xl border border-gray-200 p-6 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="space-y-3">
                <div className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${conditionColors[product.condition] || 'bg-gray-100 text-gray-800'}`}>
                  {conditionLabels[product.condition] || product.condition}
                </div>
                <h1 className="text-3xl font-bold text-gray-900">${product.price}</h1>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                {user && user.id !== product.seller.id && (
                  <button
                    disabled={!product.isAvailable}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Contact Seller
                  </button>
                )}

                <button
                  onClick={handleSaveProduct}
                  className={`w-full py-3 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 border ${
                    isSaved
                      ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  disabled={!user}
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                  {isSaved ? 'Saved' : 'Save'}
                </button>
              </div>
            </motion.div>

            {/* Location & Delivery */}
            <motion.div
              className="bg-white rounded-xl border border-gray-200 p-6 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Location</p>
                    <p className="font-semibold text-gray-900">{product.location}</p>
                  </div>
                </div>

                {product.university && (
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5" />
                    <div>
                      <p className="text-xs text-gray-600 mb-1">University</p>
                      <p className="font-semibold text-gray-900">{product.university}</p>
                    </div>
                  </div>
                )}

                {product.deliveryType && (
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Delivery</p>
                      <p className="font-semibold text-gray-900">{product.deliveryType}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5" />
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Posted</p>
                    <p className="font-semibold text-gray-900">{formatDate(product.createdAt)}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Seller Card */}
            <motion.div
              className="bg-white rounded-xl border border-gray-200 p-6 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Seller</p>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  {product.seller.profilePicture ? (
                    <Image src={product.seller.profilePicture} alt={product.seller.name} width={48} height={48} className="rounded-full" />
                  ) : (
                    <span className="text-lg font-semibold text-indigo-600">{product.seller.name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{product.seller.name}</p>
                  {product.seller.university && <p className="text-sm text-gray-600">{product.seller.university}</p>}
                  {product.seller.isVerified && <p className="text-xs text-green-600 font-medium">✓ Verified</p>}
                </div>
              </div>

              {product.seller.bio && <p className="text-sm text-gray-700 italic">"{product.seller.bio}"</p>}

              <Link
                href={`/profile/${product.seller.id}`}
                className="block w-full py-2 text-center text-indigo-600 font-semibold hover:text-indigo-700 border border-indigo-200 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                View Profile
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </Container>
  );
}

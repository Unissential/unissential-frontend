'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Heart, Share2, MessageCircle, MapPin, Calendar, Truck, Package, Star, Check, ArrowLeft } from 'lucide-react';
import { mockMarketplaceProducts } from '@/data/mockMarketplace';
import { cn } from '@/lib/utils';

interface ProductDetailPageProps {
  params: { id: string };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = mockMarketplaceProducts.find((p) => p.id === params.id);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="text-6xl">🔍</div>
          <h1 className="text-2xl font-bold text-neutral-900">Product not found</h1>
          <p className="text-neutral-600">The product you're looking for doesn't exist.</p>
          <Link href="/marketplace">
            <button className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors">
              Back to Marketplace
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = mockMarketplaceProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const conditionColor = {
    'new': 'bg-green-100 text-green-800',
    'like-new': 'bg-blue-100 text-blue-800',
    'good': 'bg-amber-100 text-amber-800',
    'fair': 'bg-orange-100 text-orange-800',
  }[product.condition];

  const conditionLabel = {
    'new': 'New',
    'like-new': 'Like New',
    'good': 'Good',
    'fair': 'Fair',
  }[product.condition];

  const postedDaysAgo = Math.floor(
    (new Date().getTime() - new Date(product.postedDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const timeLabel = postedDaysAgo === 0 ? 'Posted today' : postedDaysAgo === 1 ? 'Posted yesterday' : `Posted ${postedDaysAgo} days ago`;

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <Link href="/marketplace">
            <button className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors font-medium">
              <ArrowLeft size={20} />
              Back to Marketplace
            </button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main Image */}
            <div className="relative bg-neutral-100 rounded-lg overflow-hidden aspect-square lg:h-96">
              <Image
                src={product.images[selectedImage]}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === 0 ? product.images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all"
                  >
                    ←
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === product.images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all"
                  >
                    →
                  </button>
                </>
              )}

              {/* Image Counter */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 text-white text-sm rounded-full">
                  {selectedImage + 1} / {product.images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      'relative aspect-square rounded-lg overflow-hidden border-2 transition-all',
                      selectedImage === index
                        ? 'border-primary-600'
                        : 'border-transparent hover:border-neutral-300'
                    )}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Price & Title */}
            <div className="bg-white rounded-lg p-6 space-y-4">
              <div className="space-y-2">
                <div className={cn('inline-block px-3 py-1 rounded-md text-xs font-semibold', conditionColor)}>
                  {conditionLabel}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">{product.title}</h1>
              </div>

              {/* Price */}
              <div className="pt-4 border-t border-neutral-200">
                <p className="text-sm text-neutral-600">Price</p>
                <p className="text-4xl font-bold text-neutral-900">${product.price}</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4">
                <button
                  onClick={() => setShowContactModal(true)}
                  className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} />
                  Message Seller
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="py-3 border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 text-neutral-700 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Heart
                      size={20}
                      className={cn(
                        'transition-colors',
                        isFavorite ? 'fill-red-500 text-red-500' : ''
                      )}
                    />
                    Save
                  </button>

                  <button
                    onClick={() => setShowShareModal(true)}
                    className="py-3 border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 text-neutral-700 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Share2 size={20} />
                    Share
                  </button>
                </div>
              </div>
            </div>

            {/* Location & Delivery */}
            <div className="bg-white rounded-lg p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm text-neutral-600">Location</p>
                    <p className="font-semibold text-neutral-900">{product.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Truck className="flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm text-neutral-600">Delivery</p>
                    <p className="font-semibold text-neutral-900 capitalize">
                      {product.delivery === 'both' ? 'Pickup & Delivery' : product.delivery}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm text-neutral-600">{timeLabel}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Card */}
            <div className="bg-white rounded-lg p-6 space-y-4">
              <p className="text-sm font-semibold text-neutral-600 uppercase tracking-wide">Seller</p>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 relative rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={product.seller.avatar}
                    alt={product.seller.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-neutral-900">{product.seller.name}</p>
                  <p className="text-sm text-neutral-600">{product.seller.university}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 py-3 border-y border-neutral-200">
                <div>
                  <p className="text-xs text-neutral-600 mb-0.5">Rating</p>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-neutral-900">{product.seller.rating}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 mb-0.5">Response Time</p>
                  <p className="font-semibold text-neutral-900">{product.seller.responseTime}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 mb-0.5">Sold</p>
                  <p className="font-semibold text-neutral-900">{product.seller.soldCount} items</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 mb-0.5">Member Since</p>
                  <p className="font-semibold text-neutral-900">
                    {new Date(product.seller.joinedDate).toLocaleDateString('en-US', {
                      year: '2-digit',
                      month: 'short',
                    })}
                  </p>
                </div>
              </div>

              <button className="w-full py-2.5 text-primary-600 font-semibold hover:text-primary-700 border border-primary-200 hover:bg-primary-50 rounded-lg transition-colors">
                View Profile
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-12 bg-white rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Product Description</h2>
          <p className="text-neutral-700 leading-relaxed">{product.description}</p>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <Link key={relProduct.id} href={`/marketplace/${relProduct.id}`}>
                  <div className="group cursor-pointer bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative bg-neutral-100 aspect-square">
                      <Image
                        src={relProduct.image}
                        alt={relProduct.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="(max-width: 640px) 100vw, 25vw"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-neutral-900 line-clamp-2 group-hover:text-primary-600 transition-colors mb-2">
                        {relProduct.title}
                      </h3>
                      <p className="text-lg font-bold text-neutral-900">${relProduct.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-neutral-900">Message {product.seller.name}</h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <textarea
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Hello, I'm interested in this product..."
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none h-32"
              />

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="px-4 py-2.5 text-neutral-700 border border-neutral-200 hover:bg-neutral-50 font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowContactModal(false);
                    setContactMessage('');
                  }}
                  className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-neutral-900">Share Product</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setShowShareModal(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-neutral-50 rounded-lg transition-colors"
              >
                <p className="font-medium text-neutral-900">📋 Copy Link</p>
                <p className="text-sm text-neutral-600">Copy link to clipboard</p>
              </button>

              <button className="w-full text-left px-4 py-3 hover:bg-neutral-50 rounded-lg transition-colors">
                <p className="font-medium text-neutral-900">🔗 Share on Facebook</p>
                <p className="text-sm text-neutral-600">Share to your Facebook</p>
              </button>

              <button className="w-full text-left px-4 py-3 hover:bg-neutral-50 rounded-lg transition-colors">
                <p className="font-medium text-neutral-900">💬 Share on Messages</p>
                <p className="text-sm text-neutral-600">Send to a friend</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

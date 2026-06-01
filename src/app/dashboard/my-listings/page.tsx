'use client';

import { motion } from 'framer-motion';
import { Edit, Trash2, Eye, MessageCircle, Loader, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { dashboardService } from '@/services/api/dashboard.service';
import { listingService } from '@/services/api/listing.service';
import { ListingDTO } from '@/types/api';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

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

export default function MyListingsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [listings, setListings] = useState<ListingDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadListings = async () => {
      try {
        const response = await dashboardService.getUserListings(1, 50);
        setListings(response.data);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load listings';
        addToast(message, 'error');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadListings();
    }
  }, [user, addToast]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      await listingService.deleteListing(id);
      setListings((prev) => prev.filter((item) => item.id !== id));
      addToast('Listing deleted successfully', 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete listing';
      addToast(message, 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading listings...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">My Listings</h1>
          <p className="text-neutral-600">{listings.length} active listing{listings.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/leasing/create"
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 whitespace-nowrap flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Listing
        </Link>
      </motion.div>

      {/* Listings Table/Cards */}
      {listings.length > 0 ? (
        <motion.div variants={container} className="space-y-4">
          {listings.map((listing) => (
            <motion.div
              key={listing.id}
              variants={item}
              whileHover={{ x: 4, backgroundColor: '#f9fafb' }}
              className="bg-white rounded-xl border border-neutral-200 overflow-hidden transition-all"
            >
              <div className="flex flex-col sm:flex-row gap-4 p-4">
                {/* Image */}
                <div className="relative w-full sm:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-200">
                  {listing.images?.[0] ? (
                    <Image
                      src={listing.images[0]}
                      alt={listing.title}
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
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-neutral-900 line-clamp-2">{listing.title}</h3>
                    <p className="text-sm text-neutral-600 mt-1">{listing.location}</p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 mt-3">
                    <div className="text-lg font-bold text-indigo-600">${listing.price}/mo</div>
                    <div className="flex items-center gap-2 text-sm">
                      <Eye size={16} className="text-neutral-600" />
                      <span className="text-neutral-700 font-medium">0 views</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 sm:flex-col">
                  <Link
                    href={`/leasing/${listing.id}`}
                    className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <Eye size={20} />
                  </Link>
                  <Link
                    href={`/leasing/${listing.id}/edit`}
                    className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <Edit size={20} />
                  </Link>
                  <button
                    onClick={() => handleDelete(listing.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12 bg-neutral-50 rounded-xl border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No listings yet</h3>
          <p className="text-neutral-600 mb-4">Start by creating your first listing</p>
          <Link
            href="/leasing/create"
            className="inline-block px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
          >
            Create Listing
          </Link>
        </div>
      )}
    </motion.div>
  );
}
                </div>
              </div>

              {/* Expanded Options */}
              {selectedListing === listing.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-neutral-200 px-4 py-3 bg-neutral-50 space-y-2"
                >
                  <button className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-white rounded-lg transition-colors">
                    Mark as sold
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-white rounded-lg transition-colors">
                    Update price
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-white rounded-lg transition-colors">
                    Boost listing
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-white rounded-lg transition-colors">
                    Mark unavailable
                  </button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div variants={item} className="text-center py-16">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-2xl font-bold text-neutral-900 mb-2">No listings yet</h3>
          <p className="text-neutral-600 mb-6">Start selling by creating your first listing</p>
          <motion.button
            whileHover={{ scale: 1.05, x: 4 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700"
          >
            Create First Listing →
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}

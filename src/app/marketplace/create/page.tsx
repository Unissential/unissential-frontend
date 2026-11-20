'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Loader, AlertCircle } from 'lucide-react';
import { Container } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { marketplaceService } from '@/services/api/marketplace.service';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { CreateMarketplaceProductPayload } from '@/types/marketplace';

// Validation schema matching backend
const productSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title too long'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description too long'),
  price: z.number().positive('Price must be positive'),
  location: z.string().min(3, 'Location is required'),
  university: z.string().optional(),
  category: z.string().min(1, 'Select a category'),
  condition: z.enum(['like_new', 'excellent', 'good', 'fair']),
  deliveryType: z.enum(['pickup', 'delivery', 'both']).optional(),
  images: z
    .array(z.string().url())
    .min(1, 'At least one image is required')
    .max(10, 'Maximum 10 images'),
  isAvailable: z.boolean().optional().default(true),
});

type ProductFormData = z.infer<typeof productSchema>;

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

function CreateProductContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      isAvailable: true,
    },
  });

  const handleAddImage = () => {
    if (imageInput && imageUrls.length < 10) {
      setImageUrls([...imageUrls, imageInput]);
      setImageInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    if (imageUrls.length === 0) {
      setError('At least one image is required');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const payload: CreateMarketplaceProductPayload = {
        title: data.title,
        description: data.description,
        price: data.price,
        location: data.location,
        university: data.university,
        category: data.category as any,
        condition: data.condition,
        deliveryType: data.deliveryType,
        images: imageUrls,
        isAvailable: data.isAvailable,
      };

      const product = await marketplaceService.createProduct(payload);

      addToast('Product posted successfully!', 'success');
      router.push(`/marketplace/${product.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create product';
      setError(message);
      addToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <div className="py-12 max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/marketplace"
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Sell an Item</h1>
          <p className="text-gray-600">Post your item and connect with buyers</p>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </motion.div>
        )}

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-white p-6 rounded-xl border border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Title *</label>
            <input
              {...register('title')}
              type="text"
              placeholder="e.g., Gently Used MacBook Pro 2022"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Category *</label>
              <select
                {...register('category')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Condition *</label>
              <select
                {...register('condition')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select condition</option>
                {conditions.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond.replace('_', ' ').charAt(0).toUpperCase() +
                      cond.slice(1).replace('_', ' ')}
                  </option>
                ))}
              </select>
              {errors.condition && (
                <p className="mt-1 text-sm text-red-600">{errors.condition.message}</p>
              )}
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Price *</label>
            <div className="relative">
              <span className="absolute left-4 top-2.5 text-gray-600">$</span>
              <input
                {...register('price', { valueAsNumber: true })}
                type="number"
                placeholder="0.00"
                step="0.01"
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
          </div>

          {/* Location & University */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Location *</label>
              <input
                {...register('location')}
                type="text"
                placeholder="e.g., Campus Library, Main Street"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">University</label>
              <input
                {...register('university')}
                type="text"
                placeholder="Your university (optional)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Delivery Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Delivery Type</label>
            <select
              {...register('deliveryType')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select delivery option</option>
              {deliveryTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Description *</label>
            <textarea
              {...register('description')}
              placeholder="Describe the item, its condition, features, and reason for selling..."
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Images * (Min 1, Max 10)
            </label>
            <div className="flex gap-2 mb-4">
              <input
                type="url"
                placeholder="Image URL (e.g., https://example.com/image.jpg)"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddImage}
                disabled={!imageInput || imageUrls.length >= 10}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold rounded-lg"
              >
                Add
              </button>
            </div>

            {/* Image Preview */}
            {imageUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={url}
                      alt={`Product ${index + 1}`}
                      width={128}
                      height={128}
                      className="w-full h-32 object-cover rounded-lg"
                      style={{ objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity"
                    >
                      <span className="text-white text-sm font-semibold">Remove</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-600">{imageUrls.length}/10 images added</p>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Posting...
              </>
            ) : (
              'Post Item'
            )}
          </motion.button>
        </motion.form>
      </div>
    </Container>
  );
}

export default function CreateProductPage() {
  return (
    <ProtectedRoute>
      <CreateProductContent />
    </ProtectedRoute>
  );
}

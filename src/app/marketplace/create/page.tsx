'use client';

import { useState } from 'react';
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

// Validation schema
const productSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description too long'),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Select a category'),
  condition: z.string().min(1, 'Select condition'),
});

type ProductFormData = z.infer<typeof productSchema>;

const categories = ['Electronics', 'Books', 'Furniture', 'Clothing', 'Sports', 'Other'];
const conditions = ['New', 'Like New', 'Good', 'Fair'];

function CreateProductContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const product = await marketplaceService.createProduct({
        ...data,
        images: [], // Image upload to be implemented
      });

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
      <div className="py-12 max-w-2xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link href="/marketplace" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4">
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
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
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
                    {cond}
                  </option>
                ))}
              </select>
              {errors.condition && <p className="mt-1 text-sm text-red-600">{errors.condition.message}</p>}
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

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Description *</label>
            <textarea
              {...register('description')}
              placeholder="Describe the item, its condition, features, and reason for selling..."
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
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

        {/* Note */}
        <p className="mt-6 text-xs text-gray-600 text-center">
          💡 Image upload will be available in the next update
        </p>
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

    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="max-w-md w-full text-center space-y-6 p-6">
          <div className="text-6xl">✨</div>
          <h1 className="text-3xl font-bold text-neutral-900">Listing Created!</h1>
          <p className="text-neutral-600">
            Your product has been successfully listed. You can now share it or wait for interested buyers to reach out.
          </p>

          <div className="space-y-2">
            <Link href="/marketplace">
              <button className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors">
                View Marketplace
              </button>
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  title: '',
                  description: '',
                  category: '',
                  condition: '',
                  price: '',
                  images: [],
                  delivery: 'both',
                  location: '',
                  university: 'UT Austin',
                });
                setImagePreview([]);
              }}
              className="w-full py-3 text-neutral-700 border border-neutral-200 hover:bg-neutral-50 font-semibold rounded-lg transition-colors"
            >
              Create Another Listing
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <Link href="/marketplace">
            <button className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors font-medium mb-6">
              <ArrowLeft size={20} />
              Back to Marketplace
            </button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">Sell Your Item</h1>
          <p className="text-neutral-600 mt-2">List your product and connect with interested buyers</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Images Section */}
          <div className="bg-white rounded-lg p-6 md:p-8 space-y-4">
            <h2 className="text-xl font-bold text-neutral-900">Product Photos</h2>
            <p className="text-sm text-neutral-600">Upload up to 5 photos. High-quality images sell better!</p>

            <div className="space-y-4">
              {/* Upload Box */}
              <label className="flex items-center justify-center w-full px-6 py-10 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-all">
                <div className="text-center space-y-2">
                  <Upload size={32} className="mx-auto text-neutral-400" />
                  <p className="font-medium text-neutral-700">Click to upload photos</p>
                  <p className="text-sm text-neutral-500">or drag and drop (PNG, JPG up to 5MB)</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {/* Image Preview Grid */}
              {imagePreview.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {imagePreview.map((preview, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100 group"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <X size={24} className="text-white" />
                      </button>
                      {index === 0 && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-primary-600 text-white text-xs font-semibold rounded">
                          Primary
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-neutral-500">
                {imagePreview.length} / 5 photos uploaded
              </p>
            </div>
          </div>

          {/* Basic Info Section */}
          <div className="bg-white rounded-lg p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-bold text-neutral-900">Basic Information</h2>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-neutral-900 mb-2">
                Product Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., IKEA Twin Bed Frame - Barely Used"
                required
                maxLength={80}
                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
              <p className="text-xs text-neutral-500 mt-1">{formData.title.length} / 80</p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-neutral-900 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the condition, dimensions, and any notable features..."
                required
                maxLength={2000}
                rows={5}
                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
              />
              <p className="text-xs text-neutral-500 mt-1">{formData.description.length} / 2000</p>
            </div>

            {/* Grid: Category, Condition, Price */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-neutral-900 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all appearance-none"
                >
                  <option value="">Select category</option>
                  {categoryConfig.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Condition */}
              <div>
                <label htmlFor="condition" className="block text-sm font-semibold text-neutral-900 mb-2">
                  Condition *
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all appearance-none"
                >
                  <option value="">Select condition</option>
                  {conditionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-semibold text-neutral-900 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="bg-white rounded-lg p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-bold text-neutral-900">Location & Delivery</h2>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-semibold text-neutral-900 mb-2">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., West Campus, Austin"
                required
                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>

            {/* University */}
            <div>
              <label htmlFor="university" className="block text-sm font-semibold text-neutral-900 mb-2">
                University
              </label>
              <select
                id="university"
                name="university"
                value={formData.university}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all appearance-none"
              >
                <option value="UT Austin">UT Austin</option>
                <option value="Rice University">Rice University</option>
                <option value="Texas Tech">Texas Tech</option>
                <option value="UT Dallas">UT Dallas</option>
              </select>
            </div>

            {/* Delivery */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-3">
                Delivery Options *
              </label>
              <div className="space-y-2">
                {[
                  { value: 'pickup', label: '🚪 Pickup Only' },
                  { value: 'delivery', label: '🚚 Delivery Only' },
                  { value: 'both', label: '🔄 Both Pickup & Delivery' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value={option.value}
                      checked={formData.delivery === option.value}
                      onChange={handleInputChange}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="font-medium text-neutral-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div className="bg-white rounded-lg p-6 md:p-8 space-y-4">
            <p className="text-sm text-neutral-600">
              By listing this item, you agree to our Terms of Service and privacy policy. Items typically appear within 1 hour.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <Link href="/marketplace">
                <button
                  type="button"
                  className="w-full py-3 text-neutral-700 border border-neutral-200 hover:bg-neutral-50 font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                disabled={
                  loading ||
                  !formData.title ||
                  !formData.description ||
                  !formData.category ||
                  !formData.condition ||
                  !formData.price ||
                  !formData.location ||
                  imagePreview.length === 0
                }
                className={cn(
                  'w-full py-3 font-semibold rounded-lg transition-colors',
                  loading || !formData.title || !formData.description
                    ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                    : 'bg-secondary-600 hover:bg-secondary-700 text-white'
                )}
              >
                {loading ? 'Publishing...' : '✨ Publish Listing'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

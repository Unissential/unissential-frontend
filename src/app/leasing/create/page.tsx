'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui';
import { ArrowLeft, Upload, Check, AlertCircle, Loader } from 'lucide-react';

interface FormData {
  title: string;
  description: string;
  location: string;
  beds: number;
  baths: number;
  price: number;
  duration: string;
  availableFrom: string;
  availableTo: string;
  amenities: string[];
  images: string[];
}

const amenitiesOptions = [
  'WiFi',
  'Kitchen',
  'Parking',
  'Pet Friendly',
  'Furnished',
  'AC',
  'Laundry',
  'Gym',
];

const durationOptions = [
  { value: '1-2 months', label: '1-2 months' },
  { value: 'Semester', label: 'Full Semester' },
  { value: 'Summer', label: 'Summer' },
  { value: '1-6 months', label: '1-6 months' },
];

export default function CreateListingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    location: '',
    beds: 1,
    baths: 1,
    price: 0,
    duration: '1-2 months',
    availableFrom: '',
    availableTo: '',
    amenities: [],
    images: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.availableFrom) newErrors.availableFrom = 'Start date is required';
    if (!formData.availableTo) newErrors.availableTo = 'End date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'beds' || name === 'baths' || name === 'price' ? Number(value) || 0 : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleFileSelect = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File size must be less than 5MB');
      setSubmitStatus('error');
      return;
    }

    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      setErrorMessage('Only PNG and JPG files are allowed');
      setSubmitStatus('error');
      return;
    }

    if (formData.images.length >= 10) {
      setErrorMessage('Maximum 10 images allowed');
      setSubmitStatus('error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, e.target?.result as string],
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        handleFileSelect(file);
      });
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach((file) => {
        handleFileSelect(file);
      });
      // Reset input so same file can be selected again
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitStatus('error');
      setErrorMessage('Please fill in all required fields correctly');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSubmitStatus('success');
      setTimeout(() => {
        router.push('/leasing');
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-neutral-50 to-white py-12">
      <Container>
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 font-medium mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Listings
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-3">
            Post Your Room
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl">
            List your student housing and connect with thousands of potential tenants.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title Section */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold text-neutral-900 mb-6">Property Details</h2>

                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                      Room Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Spacious 2BR Near Campus"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.title ? 'border-red-500' : 'border-neutral-200'
                      } focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all`}
                    />
                    {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., Austin, TX"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.location ? 'border-red-500' : 'border-neutral-200'
                      } focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all`}
                    />
                    {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your property, location, and what makes it special..."
                      rows={4}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.description ? 'border-red-500' : 'border-neutral-200'
                      } focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all resize-none`}
                    />
                    {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
                  </div>

                  {/* Beds & Baths */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">
                        Bedrooms
                      </label>
                      <input
                        type="number"
                        name="beds"
                        value={formData.beds}
                        onChange={handleInputChange}
                        min="1"
                        max="10"
                        className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">
                        Bathrooms
                      </label>
                      <input
                        type="number"
                        name="baths"
                        value={formData.baths}
                        onChange={handleInputChange}
                        min="1"
                        max="10"
                        className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold text-neutral-900 mb-6">Pricing & Availability</h2>

                <div className="space-y-6">
                  {/* Price */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                      Monthly Price ($) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500 font-medium">
                        $
                      </span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price || ''}
                        onChange={handleInputChange}
                        placeholder="0"
                        min="0"
                        className={`w-full pl-8 pr-4 py-3 rounded-lg border ${
                          errors.price ? 'border-red-500' : 'border-neutral-200'
                        } focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all`}
                      />
                    </div>
                    {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                      Lease Duration
                    </label>
                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all"
                    >
                      {durationOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Availability Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">
                        Available From *
                      </label>
                      <input
                        type="date"
                        name="availableFrom"
                        value={formData.availableFrom}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.availableFrom ? 'border-red-500' : 'border-neutral-200'
                        } focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all`}
                      />
                      {errors.availableFrom && (
                        <p className="text-red-600 text-sm mt-1">{errors.availableFrom}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">
                        Available Until *
                      </label>
                      <input
                        type="date"
                        name="availableTo"
                        value={formData.availableTo}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.availableTo ? 'border-red-500' : 'border-neutral-200'
                        } focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all`}
                      />
                      {errors.availableTo && (
                        <p className="text-red-600 text-sm mt-1">{errors.availableTo}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities Section */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold text-neutral-900 mb-6">Amenities</h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {amenitiesOptions.map((amenity) => (
                    <motion.button
                      key={amenity}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleAmenity(amenity)}
                      className={`p-4 rounded-lg border-2 font-medium transition-all text-center ${
                        formData.amenities.includes(amenity)
                          ? 'border-primary-600 bg-primary-50 text-primary-900'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {formData.amenities.includes(amenity) && <Check size={16} />}
                        <span className="text-sm">{amenity}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold text-neutral-900 mb-6">Property Photos</h2>
                <p className="text-sm text-neutral-600 mb-4">Upload up to 10 photos of your property</p>
                
                {/* Image Gallery */}
                {formData.images.length > 0 && (
                  <div className="mb-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative rounded-lg overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-50 h-40">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                          {index === 0 && (
                            <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
                              Primary
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index),
                            }));
                          }}
                          className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={handleFileInputChange}
                  className="hidden"
                  multiple
                />
                
                {formData.images.length < 10 && (
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                      isDragActive
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 hover:border-primary-500 bg-gradient-to-br from-neutral-50 to-white'
                    }`}
                  >
                    <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                    <p className="text-neutral-900 font-medium mb-1">Drag and drop images here</p>
                    <p className="text-neutral-600 text-sm">or click to browse</p>
                    <p className="text-neutral-500 text-xs mt-2">PNG, JPG up to 5MB each ({formData.images.length}/10)</p>
                  </div>
                )}

                {formData.images.length === 10 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <p className="text-blue-900 font-medium">Maximum photos reached</p>
                    <p className="text-blue-700 text-sm">You can delete photos to add more</p>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
                >
                  <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-red-900 font-medium">{errorMessage}</p>
                  </div>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                type="submit"
                disabled={isSubmitting || submitStatus === 'success'}
                className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Creating Listing...
                  </>
                ) : submitStatus === 'success' ? (
                  <>
                    <Check size={20} />
                    Listing Created!
                  </>
                ) : (
                  'Create Listing'
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Sidebar Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Tips Card */}
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl border border-primary-200 p-8 sticky top-8">
              <h3 className="text-lg font-bold text-primary-900 mb-4">Pro Tips</h3>
              <ul className="space-y-3 text-sm text-primary-800">
                <li className="flex gap-3">
                  <span className="text-lg">✨</span>
                  <span>Use clear, descriptive titles to attract more students</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-lg">📸</span>
                  <span>Add high-quality images of your room and common areas</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-lg">💰</span>
                  <span>Set competitive pricing by checking similar listings</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-lg">🏷️</span>
                  <span>Highlight amenities that matter to students</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-lg">📅</span>
                  <span>Be flexible with your availability dates</span>
                </li>
              </ul>
            </div>

            {/* Success Message */}
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Check size={32} className="text-green-600" />
                </motion.div>
                <h3 className="font-bold text-green-900 mb-2">Success!</h3>
                <p className="text-green-800 text-sm">Your listing has been created. Redirecting...</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </Container>
    </main>
  );
}

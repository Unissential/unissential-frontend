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
import { roommateService } from '@/services/api/roommate.service';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Validation schema
const profileSchema = z.object({
  budget: z.number().positive('Budget must be positive'),
  sleepSchedule: z.string().min(1, 'Select sleep schedule'),
  smoker: z.boolean().default(false),
  dietary: z.string().optional(),
  interests: z.array(z.string()).default([]),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const sleepSchedules = ['Early Bird', 'Night Owl', 'Flexible'];
const interestOptions = [
  'Gaming',
  'Fitness',
  'Travel',
  'Music',
  'Cooking',
  'Sports',
  'Reading',
  'Art',
  'Technology',
  'Coffee',
];

function CreateProfileContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      smoker: false,
      interests: [],
    },
  });

  const selectedInterests = watch('interests');

  const toggleInterest = (interest: string) => {
    const current = selectedInterests || [];
    const updated = current.includes(interest)
      ? current.filter((i) => i !== interest)
      : [...current, interest];
    setValue('interests', updated);
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const profile = await roommateService.createProfile({
        ...data,
        preferences: {
          interests: data.interests,
        },
      });

      addToast('Profile created successfully!', 'success');
      router.push(`/roommates/${profile.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create profile';
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
          <Link href="/roommates" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Roommates
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Your Profile</h1>
          <p className="text-gray-600">Help other students find the perfect roommate match</p>
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
          {/* Your Info (Display Only) */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Name:</strong> {user?.name}
              <br />
              <strong>University:</strong> {user?.university}
            </p>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Monthly Budget *</label>
            <div className="relative">
              <span className="absolute left-4 top-2.5 text-gray-600">$</span>
              <input
                {...register('budget', { valueAsNumber: true })}
                type="number"
                placeholder="1200"
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {errors.budget && <p className="mt-1 text-sm text-red-600">{errors.budget.message}</p>}
          </div>

          {/* Sleep Schedule */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Sleep Schedule *</label>
            <select
              {...register('sleepSchedule')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select sleep schedule</option>
              {sleepSchedules.map((schedule) => (
                <option key={schedule} value={schedule}>
                  {schedule}
                </option>
              ))}
            </select>
            {errors.sleepSchedule && <p className="mt-1 text-sm text-red-600">{errors.sleepSchedule.message}</p>}
          </div>

          {/* Dietary Preferences */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Dietary Preferences</label>
            <input
              {...register('dietary')}
              type="text"
              placeholder="e.g., Vegetarian, Vegan, Halal, Kosher"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Smoker */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                {...register('smoker')}
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-indigo-600"
              />
              <span className="text-sm font-medium text-gray-700">I smoke</span>
            </label>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Interests</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedInterests?.includes(interest)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
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
                Creating...
              </>
            ) : (
              'Create Profile'
            )}
          </motion.button>
        </motion.form>
      </div>
    </Container>
  );
}

export default function CreateProfilePage() {
  return (
    <ProtectedRoute>
      <CreateProfileContent />
    </ProtectedRoute>
  );
}
  'gaming',
  'anime',
  'music',
  'art',
  'cooking',
  'sports',
  'reading',
];

const HOBBIES = [
  'gaming',
  'reading',
  'cooking',
  'photography',
  'gym',
  'basketball',
  'board games',
  'movies',
  'streaming',
  'drawing',
  'music production',
  'yoga',
  'hiking',
  'painting',
  'dancing',
];

const PET_TYPES = ['dogs', 'cats', 'rabbits', 'hamsters', 'birds'];

export default function CreateRoommateProfilePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: 18,
    university: '',
    major: '',
    location: '',
    bio: '',
    budget: { min: 800, max: 1200 },
    moveInDate: '',
    leaseLength: '12 months',
    sleepSchedule: 'flexible',
    cleanlinessLevel: 'clean',
    gender: 'male',
    interests: [],
    hobbies: [],
    pets: { allowed: false, types: [] },
    smoking: 'no',
    workSchedule: '',
    socialLevel: 'social',
    guestPolicy: 'occasional',
    noise: 'moderate',
    photos: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (formData.age < 18 || formData.age > 65) newErrors.age = 'Age must be between 18 and 65';
    if (!formData.university) newErrors.university = 'University is required';
    if (!formData.major.trim()) newErrors.major = 'Major is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required (minimum 20 characters)';
    if (formData.bio.length < 20) newErrors.bio = 'Bio must be at least 20 characters';
    if (formData.budget.min <= 0) newErrors.budget = 'Budget must be greater than $0';
    if (formData.budget.max < formData.budget.min) newErrors.budget = 'Max budget must be greater than min';
    if (!formData.moveInDate) newErrors.moveInDate = 'Move-in date is required';
    if (formData.photos.length === 0) newErrors.photos = 'At least one photo is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('budget.')) {
      const key = name.split('.')[1] as 'min' | 'max';
      setFormData((prev) => ({
        ...prev,
        budget: {
          ...prev.budget,
          [key]: Number(value) || 0,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'age' ? Number(value) || 18 : value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const toggleHobby = (hobby: string) => {
    setFormData((prev) => ({
      ...prev,
      hobbies: prev.hobbies.includes(hobby)
        ? prev.hobbies.filter((h) => h !== hobby)
        : [...prev.hobbies, hobby],
    }));
  };

  const togglePetType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      pets: {
        ...prev.pets,
        types: prev.pets.types.includes(type)
          ? prev.pets.types.filter((t) => t !== type)
          : [...prev.pets.types, type],
      },
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

    if (formData.photos.length >= 5) {
      setErrorMessage('Maximum 5 photos allowed');
      setSubmitStatus('error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, e.target?.result as string],
      }));
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
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
        router.push('/roommates');
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Failed to create profile. Please try again.');
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
          Back to Roommates
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-3">
            Create Your Profile
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl">
            Build your roommate profile to match with compatible living partners. Complete and honest information helps find the right fit.
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
              {/* Personal Details */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold text-neutral-900 mb-6">Personal Details</h2>

                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Alex Chen"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.name ? 'border-red-500' : 'border-neutral-200'
                      } focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all`}
                    />
                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                  </div>

                  {/* Age and Gender */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">
                        Age *
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        min="18"
                        max="65"
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.age ? 'border-red-500' : 'border-neutral-200'
                        } focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all`}
                      />
                      {errors.age && <p className="text-red-600 text-sm mt-1">{errors.age}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="non-binary">Non-binary</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  {/* University and Major */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">
                        University *
                      </label>
                      <select
                        name="university"
                        value={formData.university}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.university ? 'border-red-500' : 'border-neutral-200'
                        } focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all`}
                      >
                        <option value="">Select a university...</option>
                        {UNIVERSITIES.map((uni) => (
                          <option key={uni} value={uni}>
                            {uni}
                          </option>
                        ))}
                      </select>
                      {errors.university && <p className="text-red-600 text-sm mt-1">{errors.university}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">
                        Major *
                      </label>
                      <input
                        type="text"
                        name="major"
                        value={formData.major}
                        onChange={handleInputChange}
                        placeholder="e.g., Computer Science"
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.major ? 'border-red-500' : 'border-neutral-200'
                        } focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all`}
                      />
                      {errors.major && <p className="text-red-600 text-sm mt-1">{errors.major}</p>}
                    </div>
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

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                      About You *
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself, your lifestyle, and what you're looking for in a roommate..."
                      rows={4}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.bio ? 'border-red-500' : 'border-neutral-200'
                      } focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all resize-none`}
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                      {formData.bio.length}/300 characters
                    </p>
                    {errors.bio && <p className="text-red-600 text-sm mt-1">{errors.bio}</p>}
                  </div>
                </div>
              </div>

              {/* Housing Preferences */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold text-neutral-900 mb-6">Housing Preferences</h2>

                <div className="space-y-6">
                  {/* Budget */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-3">
                      Budget Range (Monthly) *
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <input
                          type="number"
                          name="budget.min"
                          value={formData.budget.min}
                          onChange={handleInputChange}
                          placeholder="Min"
                          min="0"
                          className={`w-full px-3 py-2 rounded-lg border ${
                            errors.budget ? 'border-red-500' : 'border-neutral-200'
                          } focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all text-sm`}
                        />
                      </div>
                      <span className="text-neutral-400 text-lg font-light">–</span>
                      <div className="flex-1">
                        <input
                          type="number"
                          name="budget.max"
                          value={formData.budget.max}
                          onChange={handleInputChange}
                          placeholder="Max"
                          min="0"
                          className={`w-full px-3 py-2 rounded-lg border ${
                            errors.budget ? 'border-red-500' : 'border-neutral-200'
                          } focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all text-sm`}
                        />
                      </div>
                    </div>
                    {errors.budget && <p className="text-red-600 text-sm mt-1">{errors.budget}</p>}
                  </div>

                  {/* Move-in Date and Lease Length */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">
                        Move-in Date *
                      </label>
                      <input
                        type="date"
                        name="moveInDate"
                        value={formData.moveInDate}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.moveInDate ? 'border-red-500' : 'border-neutral-200'
                        } focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all`}
                      />
                      {errors.moveInDate && (
                        <p className="text-red-600 text-sm mt-1">{errors.moveInDate}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">
                        Lease Length
                      </label>
                      <select
                        name="leaseLength"
                        value={formData.leaseLength}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all"
                      >
                        <option value="6 months">6 months</option>
                        <option value="12 months">12 months</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>
                  </div>

                  {/* Lifestyle Preferences */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">
                        Sleep Schedule
                      </label>
                      <select
                        name="sleepSchedule"
                        value={formData.sleepSchedule}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all"
                      >
                        <option value="early-bird">Early Bird</option>
                        <option value="flexible">Flexible</option>
                        <option value="night-owl">Night Owl</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">
                        Cleanliness Level
                      </label>
                      <select
                        name="cleanlinessLevel"
                        value={formData.cleanlinessLevel}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all"
                      >
                        <option value="very-clean">Very Clean</option>
                        <option value="clean">Clean</option>
                        <option value="moderate">Moderate</option>
                        <option value="relaxed">Relaxed</option>
                      </select>
                    </div>
                  </div>

                  {/* Lifestyle Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">
                        Social Level
                      </label>
                      <select
                        name="socialLevel"
                        value={formData.socialLevel}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all"
                      >
                        <option value="introverted">Introverted</option>
                        <option value="social">Social</option>
                        <option value="very-social">Very Social</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">
                        Smoking
                      </label>
                      <select
                        name="smoking"
                        value={formData.smoking}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interests & Hobbies */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold text-neutral-900 mb-6">Interests & Hobbies</h2>

                <div className="space-y-6">
                  {/* Interests */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-3">
                      Interests
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {INTERESTS.map((interest) => (
                        <motion.button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            formData.interests.includes(interest)
                              ? 'bg-primary-500 text-white'
                              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                          }`}
                        >
                          {interest}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Hobbies */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-3">
                      Hobbies
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {HOBBIES.map((hobby) => (
                        <motion.button
                          key={hobby}
                          type="button"
                          onClick={() => toggleHobby(hobby)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            formData.hobbies.includes(hobby)
                              ? 'bg-secondary-500 text-white'
                              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                          }`}
                        >
                          {hobby}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pets */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold text-neutral-900 mb-6">Pets</h2>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="petsAllowed"
                      checked={formData.pets.allowed}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          pets: { ...prev.pets, allowed: e.target.checked },
                        }))
                      }
                      className="w-4 h-4 rounded border-neutral-300"
                    />
                    <label htmlFor="petsAllowed" className="text-sm font-medium text-neutral-900">
                      I have or would like to have pets
                    </label>
                  </div>

                  {formData.pets.allowed && (
                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-neutral-900 mb-3">
                        Pet Types
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {PET_TYPES.map((type) => (
                          <motion.button
                            key={type}
                            type="button"
                            onClick={() => togglePetType(type)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                              formData.pets.types.includes(type)
                                ? 'bg-accent-500 text-white'
                                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                            }`}
                          >
                            {type}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Photo Upload */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold text-neutral-900 mb-6">Profile Photos *</h2>

                {/* Drag and Drop Area */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                    isDragActive
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/png,image/jpeg"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-3">
                    <Upload
                      size={40}
                      className={isDragActive ? 'text-primary-500' : 'text-neutral-400'}
                    />
                    <div>
                      <p className="text-neutral-900 font-semibold">
                        {isDragActive ? 'Drop your photos here' : 'Drag photos here or click to browse'}
                      </p>
                      <p className="text-neutral-500 text-sm mt-1">
                        PNG or JPG, up to 5MB each, max 5 photos
                      </p>
                    </div>
                  </div>
                </div>

                {/* Photo Gallery */}
                {formData.photos.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-semibold text-neutral-900 mb-3">
                      Photos ({formData.photos.length}/5)
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {formData.photos.map((photo, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="relative group"
                        >
                          <img
                            src={photo}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <motion.button
                            type="button"
                            onClick={() => removePhoto(index)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={16} />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {errors.photos && <p className="text-red-600 text-sm mt-3">{errors.photos}</p>}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-300 text-white py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    Create Profile
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Side Panel - Status Messages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Success Message */}
            <AnimatePresence>
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-green-50 border border-green-200 rounded-xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <Check size={24} className="text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-green-900 mb-1">Profile Created!</h3>
                      <p className="text-green-800 text-sm">
                        Your profile is live. Redirecting to discover matches...
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-red-50 border border-red-200 rounded-xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <AlertCircle size={24} className="text-red-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-red-900 mb-1">Error</h3>
                      <p className="text-red-800 text-sm">{errorMessage}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Info Panel */}
            <div className="bg-white border border-neutral-200 rounded-xl p-6 sticky top-24">
              <h3 className="font-bold text-neutral-900 mb-4">Profile Tips</h3>
              <ul className="space-y-3 text-sm text-neutral-600">
                <li className="flex gap-2">
                  <span className="text-primary-500 font-bold">✓</span>
                  <span>Use a clear, recent profile photo</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary-500 font-bold">✓</span>
                  <span>Be honest about your lifestyle</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary-500 font-bold">✓</span>
                  <span>Write a descriptive bio</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary-500 font-bold">✓</span>
                  <span>Complete all sections</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary-500 font-bold">✓</span>
                  <span>Select interests you truly enjoy</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Success Toast */}
      <AnimatePresence>
        {submitStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-full font-medium shadow-lg flex items-center gap-2"
          >
            <Check size={20} />
            Profile created successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

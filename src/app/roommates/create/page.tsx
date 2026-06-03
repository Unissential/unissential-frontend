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

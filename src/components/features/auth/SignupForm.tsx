'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { signupSchema, SignupFormData } from '@/lib/validation/auth';
import { AuthInput, PasswordInput, AuthCard, VerificationPending } from './index';
import { Mail, Lock, User, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isWaitingVerification, setIsWaitingVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationName, setVerificationName] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
  });

  const password = watch('password');

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    
    try {
      // Call the signup API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Signup error:', result);
        return;
      }

      // Show verification pending screen
      setVerificationEmail(data.email);
      setVerificationName(data.fullName);
      setIsWaitingVerification(true);
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isWaitingVerification) {
    return (
      <AuthCard
        title="Check Your Email"
        description="We sent a verification link to verify your account"
      >
        <VerificationPending
          email={verificationEmail}
          fullName={verificationName}
        />
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Create Account"
      description="Join our exclusive student housing community"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
        {/* Full Name */}
        <AuthInput
          {...register('fullName')}
          id="fullName"
          label="Full Name"
          placeholder="John Doe"
          error={errors.fullName}
          icon={<User className="w-5 h-5" />}
          disabled={isLoading}
        />

        {/* Email */}
        <AuthInput
          {...register('email')}
          id="email"
          label="University Email"
          type="email"
          placeholder="john@university.edu"
          error={errors.email}
          icon={<Mail className="w-5 h-5" />}
          disabled={isLoading}
        />

        {/* Password */}
        <PasswordInput
          {...register('password')}
          id="password"
          label="Password"
          placeholder="Create a strong password"
          error={errors.password}
          showStrength
          password={password}
          disabled={isLoading}
        />

        {/* Confirm Password */}
        <PasswordInput
          {...register('confirmPassword')}
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Re-enter your password"
          error={errors.confirmPassword}
          disabled={isLoading}
        />

        {/* Terms Checkbox */}
        <motion.div
          className="mt-6 mb-6 flex items-start gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <input
            {...register('termsAccepted')}
            id="terms"
            type="checkbox"
            className="mt-1 w-5 h-5 rounded border-2 border-gray-200 text-indigo-600 focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-all"
            disabled={isLoading}
          />
          <label
            htmlFor="terms"
            className="text-sm text-gray-700 leading-relaxed cursor-pointer"
          >
            I agree to the{' '}
            <a
              href="#"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href="#"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Privacy Policy
            </a>
          </label>
        </motion.div>

        {errors.termsAccepted && (
          <motion.p
            className="text-red-500 text-sm font-medium flex items-center gap-1 -mt-4"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {errors.termsAccepted.message}
          </motion.p>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading}
          className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group"
          whileHover={!isLoading ? { scale: 1.01 } : {}}
          whileTap={!isLoading ? { scale: 0.99 } : {}}
        >
          {isLoading ? (
            <>
              <motion.div
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <motion.svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </motion.svg>
            </>
          )}
        </motion.button>

        {/* Login Link */}
        <motion.p
          className="text-center text-gray-600 text-sm mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
          >
            Log in
          </Link>
        </motion.p>
      </form>
    </AuthCard>
  );
}

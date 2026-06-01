'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { loginSchema, LoginFormData } from '@/lib/validation/auth';
import { AuthInput, PasswordInput, AuthCard } from './index';
import { Mail, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSuccess(true);
      console.log('Login data:', data);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <AuthCard
        title="Welcome Back!"
        description="You have been successfully logged in."
      >
        <motion.div
          className="flex flex-col items-center justify-center py-8 gap-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 0.5,
              repeat: 1,
            }}
          >
            <CheckCircle className="w-16 h-16 text-green-500" />
          </motion.div>

          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Login Successful
            </h3>
            <p className="text-gray-600 text-sm">
              Redirecting to your dashboard...
            </p>
          </div>

          <motion.a
            href="/leasing"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Go to Dashboard
          </motion.a>
        </motion.div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Welcome Back"
      description="Sign in to your Unissential account"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
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
          placeholder="Enter your password"
          error={errors.password}
          disabled={isLoading}
        />

        {/* Remember Me & Forgot Password */}
        <motion.div
          className="flex items-center justify-between mt-6 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              {...register('rememberMe')}
              id="rememberMe"
              type="checkbox"
              className="w-5 h-5 rounded border-2 border-gray-200 text-indigo-600 focus:ring-2 focus:ring-indigo-500 transition-all"
              disabled={isLoading}
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
              Remember me
            </span>
          </label>

          <Link
            href="/forgot-password"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            Forgot password?
          </Link>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
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
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
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

        {/* Signup Link */}
        <motion.p
          className="text-center text-gray-600 text-sm mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
          >
            Sign up
          </Link>
        </motion.p>
      </form>
    </AuthCard>
  );
}

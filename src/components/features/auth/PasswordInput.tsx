'use client';

import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { FieldError } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  showStrength?: boolean;
  password?: string;
}

/**
 * Premium password input with show/hide toggle and strength indicator
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, showStrength = false, password, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    // Calculate password strength
    const getPasswordStrength = (): {
      level: number;
      label: string;
      color: string;
    } => {
      if (!password) return { level: 0, label: '', color: '' };

      let strength = 0;
      if (password.length >= 8) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[!@#$%^&*]/.test(password)) strength++;

      if (strength <= 1)
        return { level: 1, label: 'Weak', color: 'bg-red-500' };
      if (strength <= 2)
        return { level: 2, label: 'Fair', color: 'bg-yellow-500' };
      if (strength <= 3)
        return { level: 3, label: 'Good', color: 'bg-blue-500' };
      return { level: 4, label: 'Strong', color: 'bg-green-500' };
    };

    const strength = getPasswordStrength();

    return (
      <motion.div
        className="mb-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-900"
          >
            {label}
          </label>
          {showStrength && password && (
            <motion.span
              className="text-xs font-medium text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Strength:{' '}
              <span className={strength.color.replace('bg-', 'text-')}>
                {strength.label}
              </span>
            </motion.span>
          )}
        </div>

        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            {...props}
            className={`
              w-full px-4 py-3 pr-12 rounded-lg
              border-2 border-gray-200 bg-white
              text-gray-900 placeholder-gray-400
              transition-all duration-200
              focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100
              hover:border-gray-300
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''}
            `}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Password strength indicator */}
        {showStrength && password && (
          <motion.div
            className="mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i < strength.level ? strength.color : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            {/* Password requirements */}
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] ${
                    password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  {password.length >= 8 && '✓'}
                </div>
                <span
                  className={
                    password.length >= 8 ? 'text-gray-700' : 'text-gray-400'
                  }
                >
                  At least 8 characters
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] ${
                    /[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  {/[A-Z]/.test(password) && '✓'}
                </div>
                <span
                  className={
                    /[A-Z]/.test(password) ? 'text-gray-700' : 'text-gray-400'
                  }
                >
                  One uppercase letter
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] ${
                    /[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  {/[0-9]/.test(password) && '✓'}
                </div>
                <span
                  className={
                    /[0-9]/.test(password) ? 'text-gray-700' : 'text-gray-400'
                  }
                >
                  One number
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error message */}
        {error && (
          <motion.p
            className="text-red-500 text-sm font-medium mt-2 flex items-center gap-1"
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
            {error.message}
          </motion.p>
        )}
      </motion.div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

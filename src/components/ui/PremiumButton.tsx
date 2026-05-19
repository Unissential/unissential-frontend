import React from 'react';
import { cn } from '@/lib/utils';

interface PremiumButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const variantStyles = {
  primary: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:shadow-lg hover:-translate-y-0.5',
  secondary: 'bg-gradient-to-r from-secondary-600 to-secondary-700 text-white hover:shadow-lg hover:-translate-y-0.5',
  outline: 'border-2 border-neutral-200 text-neutral-900 hover:border-primary-600 hover:bg-primary-50',
  ghost: 'text-neutral-900 hover:bg-neutral-100',
};

const sizeStyles = {
  sm: 'px-3 py-2 text-sm font-medium rounded-lg',
  md: 'px-4 py-2.5 text-base font-semibold rounded-xl',
  lg: 'px-6 py-3.5 text-lg font-semibold rounded-2xl',
};

export const PremiumButton = React.forwardRef<
  HTMLButtonElement,
  PremiumButtonProps
>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-smooth',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <svg
            className="w-4 h-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          icon
        )}
        {children}
      </button>
    );
  }
);

PremiumButton.displayName = 'PremiumButton';

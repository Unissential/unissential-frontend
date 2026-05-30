import React from 'react';
import { cn } from '@/lib/utils';

interface PremiumBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  primary: 'bg-primary-100 text-primary-700 border-primary-200',
  secondary: 'bg-secondary-100 text-secondary-700 border-secondary-200',
  success: 'bg-success-50 text-success-700 border-success-200',
  warning: 'bg-warning-50 text-warning-700 border-warning-200',
  error: 'bg-error-50 text-error-700 border-error-200',
  neutral: 'bg-neutral-100 text-neutral-700 border-neutral-200',
};

const sizeStyles = {
  sm: 'px-2 py-1 text-xs font-semibold rounded-md',
  md: 'px-3 py-1.5 text-sm font-semibold rounded-lg',
  lg: 'px-4 py-2 text-base font-semibold rounded-xl',
};

export const PremiumBadge = React.forwardRef<HTMLDivElement, PremiumBadgeProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center border',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

PremiumBadge.displayName = 'PremiumBadge';

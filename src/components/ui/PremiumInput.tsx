import React from 'react';
import { cn } from '@/lib/utils';

interface PremiumInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
}

export const PremiumInput = React.forwardRef<HTMLInputElement, PremiumInputProps>(
  ({ className, icon, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">{icon}</div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full rounded-xl border-2 border-neutral-200 bg-white',
              'px-4 py-3 text-base font-medium',
              'placeholder:text-neutral-400',
              'transition-smooth focus-ring',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              icon && 'pl-12',
              error && 'border-error-500 focus:ring-error-500',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm font-medium text-error-600">{error}</p>}
      </div>
    );
  }
);

PremiumInput.displayName = 'PremiumInput';

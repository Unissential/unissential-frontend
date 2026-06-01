import React from 'react';
import { cn } from '@/lib/utils';

interface PremiumCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  glowing?: boolean;
}

export const PremiumCard = React.forwardRef<
  HTMLDivElement,
  PremiumCardProps
>(
  (
    { className, hoverable = false, glowing = false, children, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl border border-neutral-200 bg-white p-6',
          'transition-smooth',
          hoverable && 'hover:shadow-lg hover:-translate-y-1 hover:border-primary-200',
          glowing && 'shadow-lg border-primary-200 bg-gradient-to-br from-white to-primary-50/30',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

PremiumCard.displayName = 'PremiumCard';

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const maxWidthClasses = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  '2xl': 'max-w-7xl',
  full: 'max-w-full',
};

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ maxWidth = 'xl', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mx-auto px-4 sm:px-6 lg:px-8', maxWidthClasses[maxWidth], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';

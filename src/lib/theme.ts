/**
 * Theme Configuration
 * Centralized theme settings for the application
 */

export const theme = {
  colors: {
    primary: '#a855ff',
    secondary: '#8b5cf6',
    success: '#22c55e',
    warning: '#eab308',
    error: '#ef4444',
    neutral: '#737373',
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '2.5rem',
    '2xl': '3rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  animation: {
    duration: {
      fast: '150ms',
      base: '300ms',
      slow: '500ms',
    },
  },
};

export type Theme = typeof theme;

// src/config/constants.ts
// Global application constants

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
  ROOMMATES_PAGE_SIZE: 12,
  LISTINGS_PAGE_SIZE: 20,
  MARKETPLACE_PAGE_SIZE: 20,
  CHAT_MESSAGES_PAGE_SIZE: 50,
} as const;

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 10000, // ms
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // ms
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILES: 5,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
} as const;

// Form Validation
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  BIO_MAX_LENGTH: 500,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// UI/UX Constants
export const UI = {
  TOAST_DURATION: 3000, // ms
  ANIMATION_DURATION: 300, // ms
  DEBOUNCE_DELAY: 300, // ms
  SEARCH_DEBOUNCE_DELAY: 500, // ms
  INFINITE_SCROLL_THRESHOLD: 0.8, // 80% of viewport
} as const;

// Age limits
export const AGE_LIMITS = {
  MIN: 16,
  MAX: 100,
} as const;

// Budget ranges (in USD/month)
export const BUDGET_RANGE = {
  MIN: 300,
  MAX: 5000,
  STEP: 50,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  AUTH_REQUIRED: 'Please log in to continue.',
  UNAUTHORIZED: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  FILE_TOO_LARGE: `File size must be less than ${FILE_UPLOAD.MAX_FILE_SIZE / 1024 / 1024}MB`,
  FILE_TYPE_INVALID: 'File type not supported. Please use JPG, PNG, or WebP.',
  UPLOAD_FAILED: 'File upload failed. Please try again.',
  LOGIN_FAILED: 'Invalid email or password.',
  EMAIL_TAKEN: 'This email is already in use.',
  EMAIL_NOT_VERIFIED: 'Please verify your email address.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully.',
  PROFILE_CREATED: 'Profile created successfully.',
  LISTING_CREATED: 'Listing created successfully.',
  MESSAGE_SENT: 'Message sent successfully.',
  SAVED: 'Saved successfully.',
} as const;

// Cache keys
export const CACHE_KEYS = {
  ROOMMATES: 'roommates',
  ROOMMATE_DETAIL: (id: string) => `roommate_${id}`,
  USER_PROFILE: 'user_profile',
  CONVERSATIONS: 'conversations',
  CONVERSATION_MESSAGES: (id: string) => `messages_${id}`,
} as const;

// Cache durations (in minutes)
export const CACHE_DURATIONS = {
  ROOMMATES: 15,
  ROOMMATE_DETAIL: 30,
  USER_PROFILE: 60,
  CONVERSATIONS: 10,
} as const;

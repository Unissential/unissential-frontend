import { z } from 'zod';

// Auth Validations
export const signupSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .endsWith('.edu', 'Must use a .edu email address')
    .toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*]/, 'Password must contain at least one special character (!@#$%^&*)'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  university: z
    .string()
    .min(3, 'University name must be at least 3 characters')
    .max(255, 'University name must be less than 255 characters'),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .toLowerCase(),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export const verifyEmailSchema = z.object({
  token: z
    .string()
    .min(1, 'Verification token is required')
    .regex(/^[a-f0-9]{64}$/, 'Invalid token format'),
});

export const resendVerificationSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .endsWith('.edu', 'Must use a .edu email address')
    .toLowerCase(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  bio: z.string().max(500).optional(),
  profilePicture: z.string().url().optional(),
});

// Listing Validations
export const createListingSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description must be less than 2000 characters'),
  price: z.number().positive('Price must be positive'),
  location: z.string().min(5, 'Location must be at least 5 characters'),
  university: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  images: z.array(z.string().url()).min(1, 'At least one image is required').max(10, 'Maximum 10 images'),
  amenities: z.array(z.string()).default([]),
  bedrooms: z.number().int().positive(),
  bathrooms: z.number().int().positive(),
  furnished: z.boolean().optional().default(false),
  availableFrom: z.string().datetime().optional(),
  availableTo: z.string().datetime().optional(),
  leaseDuration: z.enum(['flexible', '3-months', '6-months', '12-months']).optional(),
  isAvailable: z.boolean().optional().default(true),
  petFriendly: z.boolean().optional().default(false),
});

export const updateListingSchema = createListingSchema.partial();

// Marketplace Product Validations
export const createMarketplaceProductSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  price: z.number().positive('Price must be positive'),
  location: z.string().min(3, 'Location is required'),
  university: z.string().optional(),
  condition: z.enum(['like_new', 'excellent', 'good', 'fair'], {
    errorMap: () => ({ message: 'Invalid condition. Must be: like_new, excellent, good, or fair' })
  }),
  category: z.string().min(1, 'Category is required'),
  deliveryType: z.enum(['pickup', 'delivery', 'both']).optional(),
  images: z.array(z.string().url()).min(1, 'At least one image is required').max(10),
  isAvailable: z.boolean().optional().default(true),
});

export const updateMarketplaceProductSchema = createMarketplaceProductSchema.partial();

// Roommate Profile Validations
export const createRoommateProfileSchema = z.object({
  age: z.number().int().min(18, 'Must be at least 18').max(100),
  major: z.string().optional(),
  budget: z.number().positive('Budget must be positive'),
  interests: z.array(z.string()).default([]),
  sleepSchedule: z.enum(['early_bird', 'night_owl', 'flexible']),
  cleanliness: z.enum(['very_clean', 'somewhat_clean', 'flexible']),
  smoking: z.boolean().optional().default(false),
  partying: z.boolean().optional().default(false),
  bio: z.string().max(1000, 'Bio must be less than 1000 characters').optional(),
});

export const updateRoommateProfileSchema = createRoommateProfileSchema.partial();

// Message Validations
export const createMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required').max(5000),
  conversationId: z.string().cuid('Invalid conversation ID'),
});

// Notification Validations
export const createNotificationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  type: z.enum(['message', 'tour', 'listing', 'roommate', 'product']),
});

// Saved Item Validations
export const createSavedItemSchema = z.object({
  itemType: z.enum(['listing', 'roommate', 'product']),
  itemId: z.string().cuid('Invalid item ID'),
});

// Pagination
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

export type SignupPayload = z.infer<typeof signupSchema>;
export type LoginPayload = z.infer<typeof loginSchema>;
export type CreateListingPayload = z.infer<typeof createListingSchema>;
export type UpdateListingPayload = z.infer<typeof updateListingSchema>;
export type CreateMarketplaceProductPayload = z.infer<typeof createMarketplaceProductSchema>;
export type CreateRoommateProfilePayload = z.infer<typeof createRoommateProfileSchema>;
export type CreateMessagePayload = z.infer<typeof createMessageSchema>;
export type CreateNotificationPayload = z.infer<typeof createNotificationSchema>;
export type CreateSavedItemPayload = z.infer<typeof createSavedItemSchema>;
export type PaginationParams = z.infer<typeof paginationSchema>;

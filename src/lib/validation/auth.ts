import { z } from 'zod';

// Regex for .edu email validation
const EDU_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.edu$/i;

/**
 * Validates that email is a university email (.edu domain)
 */
const eduEmailSchema = z
  .string()
  .email('Please enter a valid email address')
  .refine(
    (email) => EDU_EMAIL_REGEX.test(email),
    'Only university email addresses (.edu) are allowed'
  );

/**
 * Validates password strength
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one number
 */
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(
    /[A-Z]/,
    'Password must contain at least one uppercase letter'
  )
  .regex(
    /[0-9]/,
    'Password must contain at least one number'
  );

/**
 * Signup form validation schema
 */
export const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name must be less than 100 characters'),
    email: eduEmailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    termsAccepted: z
      .boolean()
      .refine(
        (value) => value === true,
        'You must accept the terms and conditions'
      ),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  );

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: eduEmailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

/**
 * Password reset request schema
 */
export const passwordResetSchema = z.object({
  email: eduEmailSchema,
});

/**
 * Password reset form schema
 */
export const passwordResetFormSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  );

// TypeScript types inferred from schemas
export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type PasswordResetData = z.infer<typeof passwordResetSchema>;
export type PasswordResetFormData = z.infer<typeof passwordResetFormSchema>;

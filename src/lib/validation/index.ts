/**
 * Authentication validation utilities
 * Backend-ready validation functions for email and password strength
 */

const EDU_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.edu$/i;

/**
 * Validates that an email is a university email (.edu domain)
 * @param email - Email address to validate
 * @returns Object with isValid boolean and error message if invalid
 */
export function validateEduEmail(email: string): {
  isValid: boolean;
  error?: string;
} {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  // .edu domain check
  if (!EDU_EMAIL_REGEX.test(email)) {
    return {
      isValid: false,
      error: 'Only university email addresses (.edu) are allowed',
    };
  }

  return { isValid: true };
}

/**
 * Validates password strength
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one number
 * @param password - Password to validate
 * @returns Object with isValid boolean and error message if invalid
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  error?: string;
  strength?: 'weak' | 'medium' | 'strong';
} {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      error: 'Password must be at least 8 characters',
      strength: 'weak',
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one uppercase letter',
      strength: 'weak',
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one number',
      strength: 'weak',
    };
  }

  // Calculate strength
  let strength: 'weak' | 'medium' | 'strong' = 'medium';
  if (password.length >= 12 && /[a-z]/.test(password) && /[!@#$%^&*]/.test(password)) {
    strength = 'strong';
  }

  return { isValid: true, strength };
}

/**
 * Validates that two passwords match
 * @param password - First password
 * @param confirmPassword - Confirmation password
 * @returns Object with isValid boolean and error message if invalid
 */
export function validatePasswordMatch(
  password: string,
  confirmPassword: string
): { isValid: boolean; error?: string } {
  if (!password || !confirmPassword) {
    return { isValid: false, error: 'Both passwords are required' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }

  return { isValid: true };
}

/**
 * Validates full name
 * @param fullName - Full name to validate
 * @returns Object with isValid boolean and error message if invalid
 */
export function validateFullName(fullName: string): {
  isValid: boolean;
  error?: string;
} {
  if (!fullName) {
    return { isValid: false, error: 'Full name is required' };
  }

  if (fullName.trim().length < 2) {
    return {
      isValid: false,
      error: 'Full name must be at least 2 characters',
    };
  }

  if (fullName.length > 100) {
    return {
      isValid: false,
      error: 'Full name must be less than 100 characters',
    };
  }

  return { isValid: true };
}

/**
 * User Model Types
 * Core user-related TypeScript interfaces
 */

/**
 * Authentication tokens
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

/**
 * User profile information
 */
export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  university: string;
  major?: string;
  year?: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'Graduate';
  budget?: number;
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
  role: 'student' | 'landlord' | 'admin';
}

/**
 * User preferences for roommate matching
 */
export interface UserPreferences {
  roomType?: 'shared' | 'private' | 'studio';
  quietHours?: boolean;
  petFriendly?: boolean;
  smokingAllowed?: boolean;
  cleanlinessLevel?: 'very clean' | 'clean' | 'moderate' | 'relaxed';
  interests?: string[];
  dealbreakers?: string[];
}

/**
 * Login request DTO
 */
export interface LoginDTO {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Signup request DTO
 */
export interface SignupDTO {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  university: string;
  termsAccepted: boolean;
}

/**
 * Password reset request
 */
export interface PasswordResetRequestDTO {
  email: string;
}

/**
 * Password reset form
 */
export interface PasswordResetDTO {
  token: string;
  password: string;
  confirmPassword: string;
}

/**
 * User profile update
 */
export interface UpdateUserDTO {
  fullName?: string;
  avatar?: string;
  bio?: string;
  major?: string;
  year?: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'Graduate';
  budget?: number;
  preferences?: UserPreferences;
}

/**
 * Minimal user info (for public profiles)
 */
export interface UserPublic {
  id: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  university: string;
  major?: string;
  year?: string;
}

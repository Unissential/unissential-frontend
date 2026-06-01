/**
 * Authentication service for frontend
 * Handles signup, login, and auth state
 */

import { apiCall } from './client';
import { UserDTO } from '@/types';

export interface LoginResponse {
  token: string;
  user: UserDTO;
}

export const authService = {
  /**
   * Sign up new user
   */
  async signup(email: string, password: string, name: string, university: string) {
    const result = await apiCall<LoginResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, university }),
    });

    if (result.success && result.data) {
      localStorage.setItem('auth_token', result.data.token);
      localStorage.setItem('current_user', JSON.stringify(result.data.user));
      return result.data;
    }

    throw new Error(result.error);
  },

  /**
   * Login user
   */
  async login(email: string, password: string) {
    const result = await apiCall<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (result.success && result.data) {
      localStorage.setItem('auth_token', result.data.token);
      localStorage.setItem('current_user', JSON.stringify(result.data.user));
      return result.data;
    }

    throw new Error(result.error);
  },

  /**
   * Verify email
   */
  async verifyEmail(token: string) {
    const result = await apiCall<UserDTO>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });

    if (result.success && result.data) {
      return result.data;
    }

    throw new Error(result.error);
  },

  /**
   * Resend verification email
   */
  async resendVerification(email: string) {
    const result = await apiCall<{ message: string }>('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    if (result.success) {
      return result.data;
    }

    throw new Error(result.error);
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    const result = await apiCall<UserDTO>('/auth/me', {
      method: 'GET',
    });

    if (result.success && result.data) {
      return result.data;
    }

    throw new Error(result.error);
  },

  /**
   * Update profile
   */
  async updateProfile(name?: string, bio?: string, profilePicture?: string) {
    const result = await apiCall<UserDTO>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ name, bio, profilePicture }),
    });

    if (result.success && result.data) {
      localStorage.setItem('current_user', JSON.stringify(result.data));
      return result.data;
    }

    throw new Error(result.error);
  },

  /**
   * Logout
   */
  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('auth_token');
  },

  /**
   * Get stored user
   */
  getStoredUser(): UserDTO | null {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('current_user');
    return user ? JSON.parse(user) : null;
  },
};

// src/services/auth.service.ts
// Authentication service for handling auth operations

import api from './api';
import type { User, LoginDTO, SignupDTO, AuthTokens } from '@/types/models/user';

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export interface SignupResponse {
  user: User;
  tokens: AuthTokens;
}

/**
 * Authentication Service
 * Centralized auth operations with token management
 */
export const authService = {
  /**
   * Login with email and password
   */
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', {
      email,
      password,
    });

    // Store tokens
    if (response.data.tokens) {
      localStorage.setItem('auth_token', response.data.tokens.accessToken);
      localStorage.setItem('refresh_token', response.data.tokens.refreshToken);
    }

    return response.data;
  },

  /**
   * Sign up with email and password
   */
  signup: async (data: SignupDTO): Promise<SignupResponse> => {
    const response = await api.post<SignupResponse>('/auth/signup', data);

    // Store tokens
    if (response.data.tokens) {
      localStorage.setItem('auth_token', response.data.tokens.accessToken);
      localStorage.setItem('refresh_token', response.data.tokens.refreshToken);
    }

    return response.data;
  },

  /**
   * Logout - clear tokens
   */
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout', {});
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
  },

  /**
   * Refresh access token
   */
  refreshToken: async (): Promise<AuthTokens> => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post<AuthTokens>('/auth/refresh', {
      refreshToken,
    });

    if (response.data) {
      localStorage.setItem('auth_token', response.data.accessToken);
      if (response.data.refreshToken) {
        localStorage.setItem('refresh_token', response.data.refreshToken);
      }
    }

    return response.data;
  },

  /**
   * Verify email with token
   */
  verifyEmail: async (token: string): Promise<void> => {
    await api.post('/auth/verify-email', { token });
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (email: string): Promise<void> => {
    await api.post('/auth/forgot-password', { email });
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, password: string): Promise<void> => {
    await api.post('/auth/reset-password', { token, password });
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/users/profile');
    return response.data;
  },
};

export default authService;

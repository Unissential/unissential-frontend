// src/services/api.ts
// Production-ready API client with interceptors and error handling

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { config } from '@/config/env';

/**
 * Global API error type
 */
export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: Record<string, any>;
}

/**
 * Create and configure API client instance
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: config.api.baseUrl,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  /**
   * Request interceptor
   * - Add auth token if available
   * - Add custom headers
   * - Add request ID for tracking
   */
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add request ID for tracking
      config.headers['X-Request-ID'] = `${Date.now()}-${Math.random()}`;

      return config;
    },
    (error) => {
      console.error('Request error:', error);
      return Promise.reject(error);
    }
  );

  /**
   * Response interceptor
   * - Handle 401 (token expiration)
   * - Format errors consistently
   * - Log errors
   */
  client.interceptors.response.use(
    (response) => response.data,
    (error: AxiosError) => {
      // Handle 401 - Token expired
      if (error.response?.status === 401) {
        localStorage.removeItem('auth_token');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }

      // Format error consistently
      const apiError: ApiError = {
        status: error.response?.status || 500,
        message: (error.response?.data as any)?.message || error.message || 'An error occurred',
        code: (error.response?.data as any)?.code,
        details: (error.response?.data as any)?.details,
      };

      return Promise.reject(apiError);
    }
  );

  return client;
};

export const apiClient = createApiClient();

/**
 * Type-safe API wrapper
 */
export const api = {
  get: <T>(endpoint: string, config?: any) => apiClient.get<T>(endpoint, config),
  post: <T>(endpoint: string, data?: any, config?: any) =>
    apiClient.post<T>(endpoint, data, config),
  put: <T>(endpoint: string, data?: any, config?: any) => apiClient.put<T>(endpoint, data, config),
  patch: <T>(endpoint: string, data?: any, config?: any) =>
    apiClient.patch<T>(endpoint, data, config),
  delete: <T>(endpoint: string, config?: any) => apiClient.delete<T>(endpoint, config),
};

export default api;

/**
 * Roommate service for frontend
 * Handles fetching and managing roommate profiles
 */

import { apiCall } from './client';
import { RoommateProfileDTO } from '@/types';

export interface RoommatesResponse {
  data: RoommateProfileDTO[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const roommateService = {
  /**
   * Get all roommate profiles with optional filters
   */
  async getAllProfiles(page = 1, limit = 10, filters?: Record<string, any>) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    const result = await apiCall<RoommatesResponse>(`/roommates?${params}`, {
      method: 'GET',
    });

    if (result.success && result.data) {
      return result.data;
    }

    throw new Error(result.error);
  },

  /**
   * Get profile by ID
   */
  async getProfileById(id: string) {
    const result = await apiCall<RoommateProfileDTO>(`/roommates/${id}`, {
      method: 'GET',
    });

    if (result.success && result.data) {
      return result.data;
    }

    throw new Error(result.error);
  },

  /**
   * Get user's profile
   */
  async getUserProfile(userId: string) {
    const result = await apiCall<RoommateProfileDTO>(`/roommates/user/${userId}`, {
      method: 'GET',
    });

    if (result.success && result.data) {
      return result.data;
    }

    throw new Error(result.error);
  },

  /**
   * Create profile
   */
  async createProfile(data: any) {
    const result = await apiCall<RoommateProfileDTO>('/roommates', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (result.success && result.data) {
      return result.data;
    }

    throw new Error(result.error);
  },

  /**
   * Update profile
   */
  async updateProfile(data: any) {
    const result = await apiCall<RoommateProfileDTO>('/roommates', {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (result.success && result.data) {
      return result.data;
    }

    throw new Error(result.error);
  },

  /**
   * Delete profile
   */
  async deleteProfile() {
    const result = await apiCall<void>('/roommates', {
      method: 'DELETE',
    });

    if (result.success) {
      return;
    }

    throw new Error(result.error);
  },

  /**
   * Find compatible roommates
   */
  async findCompatible(page = 1, limit = 10) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const result = await apiCall<RoommatesResponse>(`/roommates/compatible?${params}`, {
      method: 'GET',
    });

    if (result.success && result.data) {
      return result.data;
    }

    throw new Error(result.error);
  },
};

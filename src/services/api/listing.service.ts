/**
 * Listing service for frontend
 * Handles fetching and managing leasing listings
 */

import { apiCall } from './client';
import { ListingDTO } from '@/types';

export interface ListingsResponse {
  data: ListingDTO[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const listingService = {
  /**
   * Get all listings with optional filters
   */
  async getAllListings(page = 1, limit = 10, filters?: Record<string, any>) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    const result = await apiCall<ListingsResponse>(`/listings?${params}`, {
      method: 'GET',
    });

    if (result.success && result.data) {
      return result.data;
    }

    throw new Error(result.error);
  },

  /**
   * Get listing by ID
   */
  async getListingById(id: string) {
    const result = await apiCall<ListingDTO>(`/listings/${id}`, {
      method: 'GET',
    });

    if (result.success && result.data) {
      return result.data;
    }

    throw new Error(result.error);
  },

  /**
   * Create listing
   */
  async createListing(data: any) {
    const result = await apiCall<ListingDTO>('/listings', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (result.success && result.data) {
      return result.data;
    }

    throw new Error(result.error);
  },

  /**
   * Update listing
   */
  async updateListing(id: string, data: any) {
    const result = await apiCall<ListingDTO>(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (result.success && result.data) {
      return result.data;
    }

    throw new Error(result.error);
  },

  /**
   * Delete listing
   */
  async deleteListing(id: string) {
    const result = await apiCall<void>(`/listings/${id}`, {
      method: 'DELETE',
    });

    if (result.success) {
      return;
    }

    throw new Error(result.error);
  },

  /**
   * Get user's listings
   */
  async getUserListings(userId: string, page = 1, limit = 10) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const result = await apiCall<ListingsResponse>(`/listings/user/${userId}?${params}`, {
      method: 'GET',
    });

    if (result.success && result.data) {
      return result.data;
    }

    throw new Error(result.error);
  },
};

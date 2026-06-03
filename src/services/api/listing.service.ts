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

export interface ListingFilters {
  search?: string;
  location?: string;
  university?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  petFriendly?: boolean;
  furnished?: boolean;
  leaseDuration?: 'flexible' | '3-months' | '6-months' | '12-months';
  isAvailable?: boolean;
  sort?: 'newest' | 'price-asc' | 'price-desc';
}

export const listingService = {
  /**
   * Get all listings with optional filters
   * Filters: search, location, university, minPrice, maxPrice, bedrooms, bathrooms,
   *          petFriendly, furnished, leaseDuration, isAvailable, sort
   */
  async getAllListings(page = 1, limit = 12, filters?: ListingFilters) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

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

  /**
   * Toggle listing availability
   */
  async toggleAvailability(id: string, isAvailable: boolean) {
    const result = await apiCall<ListingDTO>(`/listings/${id}/availability`, {
      method: 'PATCH',
      body: JSON.stringify({ isAvailable }),
    });

    if (result.success && result.data) {
      return result.data;
    }

    throw new Error(result.error);
  },
};

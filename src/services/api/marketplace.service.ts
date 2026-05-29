/**
 * Marketplace service for frontend
 * Handles fetching and managing marketplace products
 */

import { apiCall } from './client';
import { MarketplaceProductDTO } from '@/types';

export interface ProductsResponse {
  data: MarketplaceProductDTO[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const marketplaceService = {
  /**
   * Get all products with optional filters
   */
  async getAllProducts(page = 1, limit = 10, filters?: Record<string, any>) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    const result = await apiCall<ProductsResponse>(`/marketplace?${params}`, {
      method: 'GET',
    });

    if (result.success && result.data) {
      return result.data;
    }

    throw new Error(result.error);
  },

  /**
   * Get product by ID
   */
  async getProductById(id: string) {
    const result = await apiCall<MarketplaceProductDTO>(`/marketplace/${id}`, {
      method: 'GET',
    });

    if (result.success && result.data) {
      return result.data;
    }

    throw new Error(result.error);
  },

  /**
   * Create product
   */
  async createProduct(data: any) {
    const result = await apiCall<MarketplaceProductDTO>('/marketplace', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (result.success && result.data) {
      return result.data;
    }

    throw new Error(result.error);
  },

  /**
   * Update product
   */
  async updateProduct(id: string, data: any) {
    const result = await apiCall<MarketplaceProductDTO>(`/marketplace/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (result.success && result.data) {
      return result.data;
    }

    throw new Error(result.error);
  },

  /**
   * Delete product
   */
  async deleteProduct(id: string) {
    const result = await apiCall<void>(`/marketplace/${id}`, {
      method: 'DELETE',
    });

    if (result.success) {
      return;
    }

    throw new Error(result.error);
  },

  /**
   * Get user's products
   */
  async getUserProducts(userId: string, page = 1, limit = 10) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const result = await apiCall<ProductsResponse>(`/marketplace/user/${userId}?${params}`, {
      method: 'GET',
    });

    if (result.success && result.data) {
      return result.data;
    }

    throw new Error(result.error);
  },
};

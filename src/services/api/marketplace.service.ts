/**
 * Marketplace service for frontend
 * Handles fetching and managing marketplace products
 */

import { apiCall, Pagination } from './client';
import {
  MarketplaceProduct,
  MarketplaceFilters,
  CreateMarketplaceProductPayload,
} from '@/types/marketplace';

export interface ProductsResponse {
  data: MarketplaceProduct[];
  pagination: Pagination;
}

async function getProducts(endpoint: string): Promise<ProductsResponse> {
  const result = await apiCall<MarketplaceProduct[]>(endpoint, { method: 'GET' });
  if (result.success && Array.isArray(result.data) && result.pagination) {
    return { data: result.data, pagination: result.pagination };
  }
  throw new Error(result.error || 'Invalid product response');
}

export const marketplaceService = {
  /**
   * Get all products with optional filters
   */
  async getAllProducts(page = 1, limit = 10, filters?: MarketplaceFilters) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.condition) params.append('condition', filters.condition);
    if (filters?.location) params.append('location', filters.location);
    if (filters?.university) params.append('university', filters.university);
    if (filters?.deliveryType) params.append('deliveryType', filters.deliveryType);
    if (filters?.sort) params.append('sort', filters.sort);

    return getProducts(`/marketplace?${params}`);
  },

  /**
   * Get product by ID
   */
  async getProductById(id: string) {
    const result = await apiCall<MarketplaceProduct>(`/marketplace/${id}`, {
      method: 'GET',
    });

    if (result.success && result.data) {
      return result.data;
    }

    throw new Error(result.error || 'Failed to fetch product');
  },

  /**
   * Create product
   */
  async createProduct(data: CreateMarketplaceProductPayload) {
    const result = await apiCall<MarketplaceProduct>('/marketplace', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (result.success && result.data) {
      return result.data;
    }

    throw new Error(result.error || 'Failed to create product');
  },

  /**
   * Update product
   */
  async updateProduct(id: string, data: Partial<CreateMarketplaceProductPayload>) {
    const result = await apiCall<MarketplaceProduct>(`/marketplace/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (result.success && result.data) {
      return result.data;
    }

    throw new Error(result.error || 'Failed to update product');
  },

  /**
   * Mark product as sold
   */
  async markProductSold(id: string) {
    const result = await apiCall<MarketplaceProduct>(`/marketplace/${id}/sold`, {
      method: 'PATCH',
      body: JSON.stringify({}),
    });

    if (result.success && result.data) {
      return result.data;
    }

    throw new Error(result.error || 'Failed to mark product as sold');
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

    throw new Error(result.error || 'Failed to delete product');
  },

  /**
   * Get user's products
   */
  async getUserProducts(userId: string, page = 1, limit = 10) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return getProducts(`/marketplace/user/${userId}?${params}`);
  },

  /**
   * Save product
   */
  async saveProduct(productId: string) {
    const result = await apiCall<void>(`/marketplace/${productId}/save`, {
      method: 'POST',
    });

    if (result.success) {
      return;
    }

    throw new Error(result.error || 'Failed to save product');
  },

  /**
   * Unsave product
   */
  async unsaveProduct(productId: string) {
    const result = await apiCall<void>(`/marketplace/${productId}/save`, {
      method: 'DELETE',
    });

    if (result.success) {
      return;
    }

    throw new Error(result.error || 'Failed to unsave product');
  },

  /**
   * Get saved products
   */
  async getSavedProducts(page = 1, limit = 10) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return getProducts(`/marketplace/saved?${params}`);
  },

  /**
   * Check if product is saved
   */
  async isProductSaved(productId: string) {
    const result = await apiCall<{ isSaved: boolean }>(`/marketplace/${productId}/saved`, {
      method: 'GET',
    });

    if (result.success && result.data) {
      return result.data.isSaved;
    }

    throw new Error(result.error || 'Failed to check saved status');
  },
};

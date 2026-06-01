/**
 * Dashboard service for frontend
 * Aggregates data from multiple services for dashboard view
 */

import { authService } from './auth.service';
import { listingService } from './listing.service';
import { marketplaceService } from './marketplace.service';
import { roommateService } from './roommate.service';

export interface DashboardStats {
  totalListings: number;
  totalProducts: number;
  totalRoommates: number;
  activeMessages: number;
  unreadNotifications: number;
}

export const dashboardService = {
  /**
   * Get dashboard stats for current user
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const user = authService.getStoredUser();
      if (!user) throw new Error('User not authenticated');

      // Fetch user's listings
      const listingsResponse = await listingService.getUserListings(user.id, 1, 100);
      const totalListings = listingsResponse.pagination.total;

      // Fetch user's products
      const productsResponse = await marketplaceService.getUserProducts(user.id, 1, 100);
      const totalProducts = productsResponse.pagination.total;

      // For now, return hardcoded values for messages and notifications
      // These would need WebSocket integration for real-time updates
      return {
        totalListings,
        totalProducts,
        totalRoommates: 0,
        activeMessages: 0,
        unreadNotifications: 0,
      };
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      return {
        totalListings: 0,
        totalProducts: 0,
        totalRoommates: 0,
        activeMessages: 0,
        unreadNotifications: 0,
      };
    }
  },

  /**
   * Get user's listings with full details
   */
  async getUserListings(page = 1, limit = 10) {
    const user = authService.getStoredUser();
    if (!user) throw new Error('User not authenticated');

    return listingService.getUserListings(user.id, page, limit);
  },

  /**
   * Get user's marketplace products
   */
  async getUserProducts(page = 1, limit = 10) {
    const user = authService.getStoredUser();
    if (!user) throw new Error('User not authenticated');

    return marketplaceService.getUserProducts(user.id, page, limit);
  },

  /**
   * Get user's roommate profile
   */
  async getUserRoommateProfile() {
    const user = authService.getStoredUser();
    if (!user) throw new Error('User not authenticated');

    try {
      return await roommateService.getUserProfile(user.id);
    } catch (error) {
      // Profile might not exist yet
      return null;
    }
  },
};

import { Response } from 'express';
import { AuthRequest } from '@/middleware';
import { ListingService } from '@/services/listing.service';
import { CreateListingPayload } from '@/validations';

export class ListingController {
  /**
   * GET /api/listings
   * Query params: page, limit, search, location, university, minPrice, maxPrice, bedrooms, bathrooms,
   *               petFriendly, furnished, leaseDuration, isAvailable, sort
   */
  static async getAll(req: AuthRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      const sort = (req.query.sort as 'newest' | 'price-asc' | 'price-desc') || 'newest';

      const filters = {
        search: req.query.search as string,
        location: req.query.location as string,
        university: req.query.university as string,
        minPrice: req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined,
        bedrooms: req.query.bedrooms ? parseInt(req.query.bedrooms as string) : undefined,
        bathrooms: req.query.bathrooms ? parseInt(req.query.bathrooms as string) : undefined,
        petFriendly: req.query.petFriendly === 'true',
        furnished: req.query.furnished === 'true',
        leaseDuration: req.query.leaseDuration as string,
        isAvailable: req.query.isAvailable !== 'false', // Default to true
      };

      const result = await ListingService.getAllListings(page, limit, filters, sort);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch listings';
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * GET /api/listings/:id
   */
  static async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const listing = await ListingService.getListingById(id);

      res.status(200).json({
        success: true,
        data: listing,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch listing';
      const status = message === 'Listing not found' ? 404 : 400;
      res.status(status).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * POST /api/listings
   */
  static async create(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const payload = req.body as any;
      const listing = await ListingService.createListing(req.userId, payload);

      res.status(201).json({
        success: true,
        data: listing,
        message: 'Listing created successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create listing';
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * PUT /api/listings/:id
   */
  static async update(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { id } = req.params;
      const payload = req.body as any;
      const listing = await ListingService.updateListing(id, req.userId, payload);

      res.status(200).json({
        success: true,
        data: listing,
        message: 'Listing updated successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update listing';
      const status = message.includes('Unauthorized') ? 403 : 400;
      res.status(status).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * DELETE /api/listings/:id
   */
  static async delete(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { id } = req.params;
      await ListingService.deleteListing(id, req.userId);

      res.status(200).json({
        success: true,
        message: 'Listing deleted successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete listing';
      const status = message === 'Unauthorized to delete this listing' ? 403 : 400;
      res.status(status).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * GET /api/listings/user/:userId
   */
  static async getUserListings(req: AuthRequest, res: Response) {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await ListingService.getUserListings(userId, page, limit);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch user listings';
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * PATCH /api/listings/:id/availability
   * Toggle listing availability
   */
  static async toggleAvailability(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized - authentication required',
        });
      }

      const { id } = req.params;
      const { isAvailable } = req.body;

      if (typeof isAvailable !== 'boolean') {
        return res.status(400).json({
          success: false,
          error: 'isAvailable must be a boolean value',
        });
      }

      const listing = await ListingService.toggleAvailability(id, req.userId, isAvailable);

      res.status(200).json({
        success: true,
        data: listing,
        message: `Listing marked as ${isAvailable ? 'available' : 'unavailable'}`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update listing availability';
      const status = message.includes('Unauthorized') ? 403 : message === 'Listing not found' ? 404 : 400;
      res.status(status).json({
        success: false,
        error: message,
      });
    }
  }
}

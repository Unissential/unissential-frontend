import { Response } from 'express';
import { AuthRequest } from '@/middleware';
import { MarketplaceService } from '@/services/marketplace.service';
import { CreateMarketplaceProductPayload } from '@/validations';

export class MarketplaceController {
  /**
   * GET /api/marketplace
   */
  static async getAll(req: AuthRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const filters = {
        category: req.query.category as string,
        minPrice: req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined,
        condition: req.query.condition as string,
        search: req.query.search as string,
      };

      const result = await MarketplaceService.getAllProducts(page, limit, filters);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch products';
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * GET /api/marketplace/:id
   */
  static async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const product = await MarketplaceService.getProductById(id);

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch product';
      const status = message === 'Product not found' ? 404 : 400;
      res.status(status).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * POST /api/marketplace
   */
  static async create(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const payload = req.body as CreateMarketplaceProductPayload;
      const product = await MarketplaceService.createProduct(req.userId, payload);

      res.status(201).json({
        success: true,
        data: product,
        message: 'Product created successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create product';
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * PUT /api/marketplace/:id
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
      const payload = req.body as Partial<CreateMarketplaceProductPayload>;
      const product = await MarketplaceService.updateProduct(id, req.userId, payload);

      res.status(200).json({
        success: true,
        data: product,
        message: 'Product updated successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update product';
      const status = message === 'Unauthorized to update this product' ? 403 : 400;
      res.status(status).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * DELETE /api/marketplace/:id
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
      await MarketplaceService.deleteProduct(id, req.userId);

      res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete product';
      const status = message === 'Unauthorized to delete this product' ? 403 : 400;
      res.status(status).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * GET /api/marketplace/user/:userId
   */
  static async getUserProducts(req: AuthRequest, res: Response) {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await MarketplaceService.getUserProducts(userId, page, limit);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch user products';
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }
}

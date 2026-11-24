import { Response } from 'express';
import { AuthRequest } from '@/middleware';
import { MarketplaceService } from '@/services/marketplace.service';
import { CreateMarketplaceProductPayload } from '@/validations';

const marketplaceFilterOptions = {
  category: ['electronics', 'textbooks', 'furniture', 'appliances', 'bikes', 'clothing', 'other'],
  condition: ['like_new', 'excellent', 'good', 'fair'],
  deliveryType: ['pickup', 'delivery', 'both'],
  sort: ['newest', 'price-asc', 'price-desc', 'views'],
} as const;

function getPagination(req: AuthRequest, res: Response): { page: number; limit: number } | null {
  const page = req.query.page ?? '1';
  const limit = req.query.limit ?? '10';
  if (
    typeof page !== 'string' ||
    typeof limit !== 'string' ||
    !/^[1-9]\d*$/.test(page) ||
    !/^[1-9]\d*$/.test(limit) ||
    !Number.isSafeInteger(Number(page)) ||
    Number(page) > 1000000 ||
    Number(limit) > 100
  ) {
    res.status(400).json({ success: false, error: 'Invalid pagination parameters' });
    return null;
  }
  return { page: Number(page), limit: Number(limit) };
}

function getMarketplaceFilters(
  req: AuthRequest,
  res: Response
): Parameters<typeof MarketplaceService.getAllProducts>[2] | null {
  const filters: Record<string, string | number | undefined> = {};

  for (const key of ['search', 'location', 'university'] as const) {
    const value = req.query[key];
    if (value !== undefined && (typeof value !== 'string' || value.length > 200)) {
      res.status(400).json({ success: false, error: 'Invalid marketplace filter parameters' });
      return null;
    }
    if (typeof value === 'string' && value) filters[key] = value;
  }

  for (const key of Object.keys(marketplaceFilterOptions) as Array<
    keyof typeof marketplaceFilterOptions
  >) {
    const value = req.query[key];
    const allowedValues: readonly string[] = marketplaceFilterOptions[key];
    if (
      value !== undefined &&
      (typeof value !== 'string' || (value !== '' && !allowedValues.includes(value)))
    ) {
      res.status(400).json({ success: false, error: 'Invalid marketplace filter parameters' });
      return null;
    }
    if (typeof value === 'string' && value) filters[key] = value;
  }

  for (const key of ['minPrice', 'maxPrice'] as const) {
    const value = req.query[key];
    if (value === undefined || value === '') continue;
    if (
      typeof value !== 'string' ||
      !/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(value) ||
      !Number.isFinite(Number(value))
    ) {
      res.status(400).json({ success: false, error: 'Invalid marketplace filter parameters' });
      return null;
    }
    filters[key] = Number(value);
  }

  if (
    typeof filters.minPrice === 'number' &&
    typeof filters.maxPrice === 'number' &&
    filters.minPrice > filters.maxPrice
  ) {
    res.status(400).json({ success: false, error: 'Invalid marketplace filter parameters' });
    return null;
  }

  return filters;
}

export class MarketplaceController {
  /**
   * GET /api/marketplace
   */
  static async getAll(req: AuthRequest, res: Response) {
    try {
      const pagination = getPagination(req, res);
      if (!pagination) return;
      const { page, limit } = pagination;
      const filters = getMarketplaceFilters(req, res);
      if (!filters) return;

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
      const status = message.includes('Unauthorized')
        ? 403
        : message === 'Product not found'
          ? 404
          : 400;
      res.status(status).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * PATCH /api/marketplace/:id/sold
   */
  static async markSold(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { id } = req.params;
      const product = await MarketplaceService.markProductSold(id, req.userId);

      res.status(200).json({
        success: true,
        data: product,
        message: 'Product marked as sold',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to mark product as sold';
      const status = message.includes('Unauthorized')
        ? 403
        : message === 'Product not found'
          ? 404
          : 400;
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
      const status = message.includes('Unauthorized')
        ? 403
        : message === 'Product not found'
          ? 404
          : 400;
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
      const pagination = getPagination(req, res);
      if (!pagination) return;
      const { page, limit } = pagination;

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

  /**
   * POST /api/marketplace/:id/save
   */
  static async saveProduct(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { id } = req.params;
      await MarketplaceService.saveProduct(req.userId, id);

      res.status(200).json({
        success: true,
        message: 'Product saved',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save product';
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * DELETE /api/marketplace/:id/save
   */
  static async unsaveProduct(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { id } = req.params;
      await MarketplaceService.unsaveProduct(req.userId, id);

      res.status(200).json({
        success: true,
        message: 'Product unsaved',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to unsave product';
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * GET /api/marketplace/saved
   */
  static async getSavedProducts(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const pagination = getPagination(req, res);
      if (!pagination) return;
      const { page, limit } = pagination;

      const result = await MarketplaceService.getSavedProducts(req.userId, page, limit);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch saved products';
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * GET /api/marketplace/:id/saved
   */
  static async isProductSaved(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { id } = req.params;
      const isSaved = await MarketplaceService.isProductSaved(req.userId, id);

      res.status(200).json({
        success: true,
        data: { isSaved },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to check saved status';
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }
}

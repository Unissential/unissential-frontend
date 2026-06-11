import prisma from '@/config/database';
import { MarketplaceProductDTO, CreateMarketplaceProductPayload } from '@/types';
import { calculatePagination, formatPaginatedResponse } from '@/utils/auth';

export class MarketplaceService {
  /**
   * Get all marketplace products with advanced filtering and sorting
   */
  static async getAllProducts(
    page: number = 1,
    limit: number = 10,
    filters?: {
      category?: string;
      minPrice?: number;
      maxPrice?: number;
      condition?: string;
      location?: string;
      university?: string;
      deliveryType?: string;
      search?: string;
      sort?: string;
    }
  ) {
    const { skip, take } = calculatePagination(page, limit);

    const where: any = {
      isAvailable: true, // Only show available products by default
    };

    if (filters?.category) {
      where.category = filters.category;
    }
    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      where.price = {};
      if (filters?.minPrice !== undefined) where.price.gte = filters.minPrice;
      if (filters?.maxPrice !== undefined) where.price.lte = filters.maxPrice;
    }
    if (filters?.condition) {
      where.condition = filters.condition;
    }
    if (filters?.location) {
      where.location = { contains: filters.location, mode: 'insensitive' };
    }
    if (filters?.university) {
      where.university = { contains: filters.university, mode: 'insensitive' };
    }
    if (filters?.deliveryType) {
      where.deliveryType = filters.deliveryType;
    }
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Determine sorting
    let orderBy: any = { createdAt: 'desc' }; // Default: newest first
    if (filters?.sort === 'price-asc') {
      orderBy = { price: 'asc' };
    } else if (filters?.sort === 'price-desc') {
      orderBy = { price: 'desc' };
    } else if (filters?.sort === 'views') {
      orderBy = { views: 'desc' };
    }

    const [products, total] = await Promise.all([
      prisma.marketplaceProduct.findMany({
        where,
        skip,
        take,
        include: { seller: true },
        orderBy,
      }),
      prisma.marketplaceProduct.count({ where }),
    ]);

    return formatPaginatedResponse(
      products.map((p: any) => this.formatProductDTO(p)),
      page,
      limit,
      total
    );
  }

  /**
   * Get product by ID
   */
  static async getProductById(id: string): Promise<MarketplaceProductDTO> {
    const product = await prisma.marketplaceProduct.findUnique({
      where: { id },
      include: { seller: true },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Increment views
    await prisma.marketplaceProduct.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return this.formatProductDTO(product);
  }

  /**
   * Create new product
   */
  static async createProduct(
    userId: string,
    payload: CreateMarketplaceProductPayload
  ): Promise<MarketplaceProductDTO> {
    const product = await prisma.marketplaceProduct.create({
      data: {
        ...payload,
        sellerId: userId,
      },
      include: { seller: true },
    });

    return this.formatProductDTO(product);
  }

  /**
   * Update product
   */
  static async updateProduct(
    id: string,
    userId: string,
    payload: Partial<CreateMarketplaceProductPayload>
  ): Promise<MarketplaceProductDTO> {
    // Verify ownership
    const product = await prisma.marketplaceProduct.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.sellerId !== userId) {
      throw new Error('Unauthorized to update this product');
    }

    const updated = await prisma.marketplaceProduct.update({
      where: { id },
      data: payload,
      include: { seller: true },
    });

    return this.formatProductDTO(updated);
  }

  /**
   * Mark product as sold
   */
  static async markProductSold(id: string, userId: string): Promise<MarketplaceProductDTO> {
    const product = await prisma.marketplaceProduct.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.sellerId !== userId) {
      throw new Error('Unauthorized to update this product');
    }

    const updated = await prisma.marketplaceProduct.update({
      where: { id },
      data: { isAvailable: false },
      include: { seller: true },
    });

    return this.formatProductDTO(updated);
  }

  /**
   * Delete product
   */
  static async deleteProduct(id: string, userId: string): Promise<void> {
    // Verify ownership
    const product = await prisma.marketplaceProduct.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.sellerId !== userId) {
      throw new Error('Unauthorized to delete this product');
    }

    await prisma.marketplaceProduct.delete({
      where: { id },
    });
  }

  /**
   * Get user's products
   */
  static async getUserProducts(userId: string, page: number = 1, limit: number = 10) {
    const { skip, take } = calculatePagination(page, limit);

    const [products, total] = await Promise.all([
      prisma.marketplaceProduct.findMany({
        where: { sellerId: userId },
        skip,
        take,
        include: { seller: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.marketplaceProduct.count({ where: { sellerId: userId } }),
    ]);

    return formatPaginatedResponse(
      products.map((p: any) => this.formatProductDTO(p)),
      page,
      limit,
      total
    );
  }

  /**
   * Save product
   */
  static async saveProduct(userId: string, productId: string): Promise<void> {
    await prisma.savedProduct.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      update: {},
      create: {
        userId,
        productId,
      },
    });
  }

  /**
   * Unsave product
   */
  static async unsaveProduct(userId: string, productId: string): Promise<void> {
    await prisma.savedProduct.deleteMany({
      where: {
        userId,
        productId,
      },
    });
  }

  /**
   * Get saved products
   */
  static async getSavedProducts(userId: string, page: number = 1, limit: number = 10) {
    const { skip, take } = calculatePagination(page, limit);

    const [saved, total] = await Promise.all([
      prisma.savedProduct.findMany({
        where: { userId },
        skip,
        take,
        include: {
          product: {
            include: { seller: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.savedProduct.count({ where: { userId } }),
    ]);

    return formatPaginatedResponse(
      saved.map((s: any) => this.formatProductDTO(s.product)),
      page,
      limit,
      total
    );
  }

  /**
   * Check if product is saved by user
   */
  static async isProductSaved(userId: string, productId: string): Promise<boolean> {
    const saved = await prisma.savedProduct.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return !!saved;
  }

  /**
   * Increment interested count
   */
  static async incrementInterestedCount(id: string): Promise<void> {
    await prisma.marketplaceProduct.update({
      where: { id },
      data: { interested: { increment: 1 } },
    });
  }

  /**
   * Format product DTO
   */
  private static formatProductDTO(product: any): MarketplaceProductDTO {
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      location: product.location,
      university: product.university,
      condition: product.condition,
      category: product.category,
      deliveryType: product.deliveryType,
      images: product.images,
      isAvailable: product.isAvailable,
      seller: {
        id: product.seller.id,
        email: product.seller.email,
        name: product.seller.name,
        university: product.seller.university,
        isVerified: product.seller.isVerified,
        profilePicture: product.seller.profilePicture,
        bio: product.seller.bio,
        createdAt: product.seller.createdAt,
        updatedAt: product.seller.updatedAt,
      },
      views: product.views,
      interested: product.interested,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}

import prisma from '@/config/database';
import { ListingDTO, CreateListingPayload } from '@/types';
import { calculatePagination, formatPaginatedResponse } from '@/utils/auth';

export class ListingService {
  /**
   * Get all listings with pagination and filtering
   */
  static async getAllListings(
    page: number = 1,
    limit: number = 10,
    filters?: {
      location?: string;
      minPrice?: number;
      maxPrice?: number;
      bedrooms?: number;
      petFriendly?: boolean;
    }
  ) {
    const { skip, take } = calculatePagination(page, limit);

    const where: any = {};
    if (filters?.location) {
      where.location = { contains: filters.location, mode: 'insensitive' };
    }
    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      where.price = {};
      if (filters?.minPrice !== undefined) where.price.gte = filters.minPrice;
      if (filters?.maxPrice !== undefined) where.price.lte = filters.maxPrice;
    }
    if (filters?.bedrooms) {
      where.bedrooms = filters.bedrooms;
    }
    if (filters?.petFriendly !== undefined) {
      where.petFriendly = filters.petFriendly;
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        skip,
        take,
        include: { owner: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.listing.count({ where }),
    ]);

    return formatPaginatedResponse(
      listings.map((l) => this.formatListingDTO(l)),
      page,
      limit,
      total
    );
  }

  /**
   * Get listing by ID
   */
  static async getListingById(id: string): Promise<ListingDTO> {
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: { owner: true },
    });

    if (!listing) {
      throw new Error('Listing not found');
    }

    return this.formatListingDTO(listing);
  }

  /**
   * Create new listing
   */
  static async createListing(userId: string, payload: CreateListingPayload): Promise<ListingDTO> {
    const listing = await prisma.listing.create({
      data: {
        ...payload,
        ownerId: userId,
      },
      include: { owner: true },
    });

    return this.formatListingDTO(listing);
  }

  /**
   * Update listing
   */
  static async updateListing(
    id: string,
    userId: string,
    payload: Partial<CreateListingPayload>
  ): Promise<ListingDTO> {
    // Verify ownership
    const listing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      throw new Error('Listing not found');
    }

    if (listing.ownerId !== userId) {
      throw new Error('Unauthorized to update this listing');
    }

    const updated = await prisma.listing.update({
      where: { id },
      data: payload,
      include: { owner: true },
    });

    return this.formatListingDTO(updated);
  }

  /**
   * Delete listing
   */
  static async deleteListing(id: string, userId: string): Promise<void> {
    // Verify ownership
    const listing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      throw new Error('Listing not found');
    }

    if (listing.ownerId !== userId) {
      throw new Error('Unauthorized to delete this listing');
    }

    await prisma.listing.delete({
      where: { id },
    });
  }

  /**
   * Get user's listings
   */
  static async getUserListings(userId: string, page: number = 1, limit: number = 10) {
    const { skip, take } = calculatePagination(page, limit);

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where: { ownerId: userId },
        skip,
        take,
        include: { owner: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.listing.count({ where: { ownerId: userId } }),
    ]);

    return formatPaginatedResponse(
      listings.map((l) => this.formatListingDTO(l)),
      page,
      limit,
      total
    );
  }

  /**
   * Format listing DTO
   */
  private static formatListingDTO(listing: any): ListingDTO {
    return {
      id: listing.id,
      title: listing.title,
      description: listing.description,
      price: listing.price,
      location: listing.location,
      latitude: listing.latitude,
      longitude: listing.longitude,
      images: listing.images,
      amenities: listing.amenities,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      furnished: listing.furnished,
      leaseStart: listing.leaseStart,
      leaseEnd: listing.leaseEnd,
      petFriendly: listing.petFriendly,
      owner: {
        id: listing.owner.id,
        email: listing.owner.email,
        name: listing.owner.name,
        university: listing.owner.university,
        isVerified: listing.owner.isVerified,
        profilePicture: listing.owner.profilePicture,
        bio: listing.owner.bio,
        createdAt: listing.owner.createdAt,
        updatedAt: listing.owner.updatedAt,
      },
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt,
    };
  }
}

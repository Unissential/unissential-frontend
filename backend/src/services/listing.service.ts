import prisma from '@/config/database';
import { ListingDTO, CreateListingPayload } from '@/types';
import { calculatePagination, formatPaginatedResponse } from '@/utils/auth';

export class ListingService {
  /**
   * Get all listings with pagination, filtering, and search
   */
  static async getAllListings(
    page: number = 1,
    limit: number = 10,
    filters?: {
      search?: string; // Search in title and description
      location?: string;
      university?: string;
      minPrice?: number;
      maxPrice?: number;
      bedrooms?: number;
      bathrooms?: number;
      petFriendly?: boolean;
      furnished?: boolean;
      leaseDuration?: string;
      isAvailable?: boolean;
    },
    sort?: 'newest' | 'price-asc' | 'price-desc'
  ) {
    const { skip, take } = calculatePagination(page, limit);

    const where: any = {};

    // Search in title and description
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Location filter
    if (filters?.location) {
      where.location = { contains: filters.location, mode: 'insensitive' };
    }

    // University filter
    if (filters?.university) {
      where.university = { contains: filters.university, mode: 'insensitive' };
    }

    // Price range filter
    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      where.price = {};
      if (filters?.minPrice !== undefined) where.price.gte = filters.minPrice;
      if (filters?.maxPrice !== undefined) where.price.lte = filters.maxPrice;
    }

    // Bedrooms filter
    if (filters?.bedrooms) {
      where.bedrooms = filters.bedrooms;
    }

    // Bathrooms filter
    if (filters?.bathrooms) {
      where.bathrooms = filters.bathrooms;
    }

    // Lease duration filter
    if (filters?.leaseDuration) {
      where.leaseDuration = filters.leaseDuration;
    }

    // Pet friendly filter
    if (filters?.petFriendly !== undefined) {
      where.petFriendly = filters.petFriendly;
    }

    // Furnished filter
    if (filters?.furnished !== undefined) {
      where.furnished = filters.furnished;
    }

    // Availability filter
    if (filters?.isAvailable !== undefined) {
      where.isAvailable = filters.isAvailable;
    }

    // Determine sort order
    const orderBy: any = {};
    switch (sort) {
      case 'price-asc':
        orderBy.price = 'asc';
        break;
      case 'price-desc':
        orderBy.price = 'desc';
        break;
      case 'newest':
      default:
        orderBy.createdAt = 'desc';
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        skip,
        take,
        include: { owner: true },
        orderBy,
      }),
      prisma.listing.count({ where }),
    ]);

    // Increment views for each listing
    await Promise.all(
      listings.map((l: any) =>
        prisma.listing.update({
          where: { id: l.id },
          data: { views: { increment: 1 } },
        })
      )
    );

    return formatPaginatedResponse(
      listings.map((l: any) => this.formatListingDTO(l)),
      page,
      limit,
      total
    );
  }

  /**
   * Get listing by ID and increment views
   */
  static async getListingById(id: string): Promise<ListingDTO> {
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: { owner: true },
    });

    if (!listing) {
      throw new Error('Listing not found');
    }

    // Increment views
    await prisma.listing.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return this.formatListingDTO(listing);
  }

  /**
   * Create new listing
   */
  static async createListing(userId: string, payload: CreateListingPayload): Promise<ListingDTO> {
    // Convert datetime strings to Date objects if needed
    const data: any = { ...payload, ownerId: userId };
    if (data.availableFrom && typeof data.availableFrom === 'string') {
      data.availableFrom = new Date(data.availableFrom);
    }
    if (data.availableTo && typeof data.availableTo === 'string') {
      data.availableTo = new Date(data.availableTo);
    }

    const listing = await prisma.listing.create({
      data,
      include: { owner: true },
    });

    return this.formatListingDTO(listing);
  }

  /**
   * Update listing (owner only)
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
      throw new Error('Unauthorized - only the listing owner can update this listing');
    }

    // Convert datetime strings if needed
    const data: any = { ...payload };
    if (data.availableFrom && typeof data.availableFrom === 'string') {
      data.availableFrom = new Date(data.availableFrom);
    }
    if (data.availableTo && typeof data.availableTo === 'string') {
      data.availableTo = new Date(data.availableTo);
    }

    const updated = await prisma.listing.update({
      where: { id },
      data,
      include: { owner: true },
    });

    return this.formatListingDTO(updated);
  }

  /**
   * Delete listing (owner only)
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
      throw new Error('Unauthorized - only the listing owner can delete this listing');
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
      listings.map((l: any) => this.formatListingDTO(l)),
      page,
      limit,
      total
    );
  }

  /**
   * Toggle listing availability
   */
  static async toggleAvailability(id: string, userId: string, isAvailable: boolean): Promise<ListingDTO> {
    // Verify ownership
    const listing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      throw new Error('Listing not found');
    }

    if (listing.ownerId !== userId) {
      throw new Error('Unauthorized - only the listing owner can change availability');
    }

    const updated = await prisma.listing.update({
      where: { id },
      data: { isAvailable },
      include: { owner: true },
    });

    return this.formatListingDTO(updated);
  }

  /**
   * Format listing DTO with all fields
   */
  private static formatListingDTO(listing: any): ListingDTO {
    return {
      id: listing.id,
      title: listing.title,
      description: listing.description,
      price: listing.price,
      location: listing.location,
      university: listing.university,
      latitude: listing.latitude,
      longitude: listing.longitude,
      images: listing.images,
      amenities: listing.amenities,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      furnished: listing.furnished,
      availableFrom: listing.availableFrom,
      availableTo: listing.availableTo,
      leaseDuration: listing.leaseDuration,
      isAvailable: listing.isAvailable,
      petFriendly: listing.petFriendly,
      views: listing.views,
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

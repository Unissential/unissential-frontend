import prisma from '@/config/database';
import { RoommateProfileDTO, CreateRoommateProfilePayload } from '@/types';
import { calculatePagination, formatPaginatedResponse } from '@/utils/auth';

export class RoommateService {
  /**
   * Get all roommate profiles
   */
  static async getAllProfiles(
    page: number = 1,
    limit: number = 10,
    filters?: {
      university?: string;
      minBudget?: number;
      maxBudget?: number;
      sleepSchedule?: string;
      interests?: string[];
    }
  ) {
    const { skip, take } = calculatePagination(page, limit);

    const where: any = {};
    if (filters?.university) {
      where.university = { contains: filters.university, mode: 'insensitive' };
    }
    if (filters?.minBudget !== undefined || filters?.maxBudget !== undefined) {
      where.budget = {};
      if (filters?.minBudget !== undefined) where.budget.gte = filters.minBudget;
      if (filters?.maxBudget !== undefined) where.budget.lte = filters.maxBudget;
    }
    if (filters?.sleepSchedule) {
      where.sleepSchedule = filters.sleepSchedule;
    }

    const [profiles, total] = await Promise.all([
      prisma.roommateProfile.findMany({
        where,
        skip,
        take,
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.roommateProfile.count({ where }),
    ]);

    return formatPaginatedResponse(
      profiles.map((p) => this.formatProfileDTO(p)),
      page,
      limit,
      total
    );
  }

  /**
   * Get roommate profile by ID
   */
  static async getProfileById(id: string): Promise<RoommateProfileDTO> {
    const profile = await prisma.roommateProfile.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!profile) {
      throw new Error('Roommate profile not found');
    }

    return this.formatProfileDTO(profile);
  }

  /**
   * Get user's roommate profile
   */
  static async getUserProfile(userId: string): Promise<RoommateProfileDTO> {
    const profile = await prisma.roommateProfile.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!profile) {
      throw new Error('Roommate profile not found');
    }

    return this.formatProfileDTO(profile);
  }

  /**
   * Create roommate profile
   */
  static async createProfile(
    userId: string,
    payload: CreateRoommateProfilePayload
  ): Promise<RoommateProfileDTO> {
    // Check if profile already exists
    const existing = await prisma.roommateProfile.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new Error('You already have a roommate profile');
    }

    // Get user details for university
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const profile = await prisma.roommateProfile.create({
      data: {
        ...payload,
        university: user.university,
        userId,
      },
      include: { user: true },
    });

    return this.formatProfileDTO(profile);
  }

  /**
   * Update roommate profile
   */
  static async updateProfile(
    userId: string,
    payload: Partial<CreateRoommateProfilePayload>
  ): Promise<RoommateProfileDTO> {
    const profile = await prisma.roommateProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new Error('Roommate profile not found');
    }

    const updated = await prisma.roommateProfile.update({
      where: { userId },
      data: payload,
      include: { user: true },
    });

    return this.formatProfileDTO(updated);
  }

  /**
   * Delete roommate profile
   */
  static async deleteProfile(userId: string): Promise<void> {
    const profile = await prisma.roommateProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new Error('Roommate profile not found');
    }

    await prisma.roommateProfile.delete({
      where: { userId },
    });
  }

  /**
   * Find compatible roommates
   */
  static async findCompatible(
    userId: string,
    page: number = 1,
    limit: number = 10
  ) {
    // Get user's profile
    const userProfile = await prisma.roommateProfile.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!userProfile) {
      throw new Error('Create a roommate profile first');
    }

    const { skip, take } = calculatePagination(page, limit);

    // Find profiles with similar budget and university
    const compatibleProfiles = await prisma.roommateProfile.findMany({
      where: {
        NOT: { userId },
        university: userProfile.university,
        budget: {
          gte: userProfile.budget * 0.8,
          lte: userProfile.budget * 1.2,
        },
      },
      skip,
      take,
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.roommateProfile.count({
      where: {
        NOT: { userId },
        university: userProfile.university,
        budget: {
          gte: userProfile.budget * 0.8,
          lte: userProfile.budget * 1.2,
        },
      },
    });

    return formatPaginatedResponse(
      compatibleProfiles.map((p) => this.formatProfileDTO(p)),
      page,
      limit,
      total
    );
  }

  /**
   * Format profile DTO
   */
  private static formatProfileDTO(profile: any): RoommateProfileDTO {
    return {
      id: profile.id,
      age: profile.age,
      university: profile.university,
      major: profile.major,
      budget: profile.budget,
      interests: profile.interests,
      sleepSchedule: profile.sleepSchedule,
      cleanliness: profile.cleanliness,
      smoking: profile.smoking,
      partying: profile.partying,
      bio: profile.bio,
      user: {
        id: profile.user.id,
        email: profile.user.email,
        name: profile.user.name,
        university: profile.user.university,
        isVerified: profile.user.isVerified,
        profilePicture: profile.user.profilePicture,
        bio: profile.user.bio,
        createdAt: profile.user.createdAt,
        updatedAt: profile.user.updatedAt,
      },
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}

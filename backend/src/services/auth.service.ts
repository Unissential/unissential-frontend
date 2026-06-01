import prisma from '@/config/database';
import { hashPassword, comparePassword, generateToken, generateVerificationToken } from '@/utils/auth';
import { UserDTO, SignupPayload, LoginPayload } from '@/types';

export class AuthService {
  /**
   * Sign up a new user
   */
  static async signup(payload: SignupPayload) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(payload.password);

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        name: payload.name,
        university: payload.university,
        verificationToken,
        verificationExpires,
      },
    });

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    // TODO: Send verification email with verificationToken

    return {
      token,
      user: this.formatUserDTO(user),
    };
  }

  /**
   * Login a user
   */
  static async login(payload: LoginPayload) {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Compare password
    const isPasswordValid = await comparePassword(payload.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      token,
      user: this.formatUserDTO(user),
    };
  }

  /**
   * Verify email
   */
  static async verifyEmail(token: string) {
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new Error('Invalid verification token');
    }

    if (user.verificationExpires && user.verificationExpires < new Date()) {
      throw new Error('Verification token expired');
    }

    // Mark user as verified
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationExpires: null,
      },
    });

    return this.formatUserDTO(updatedUser);
  }

  /**
   * Resend verification email
   */
  static async resendVerificationEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.isVerified) {
      throw new Error('User is already verified');
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationExpires,
      },
    });

    // TODO: Send verification email with new token

    return { message: 'Verification email sent' };
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<UserDTO> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return this.formatUserDTO(user);
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId: string, data: { name?: string; bio?: string; profilePicture?: string }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });

    return this.formatUserDTO(user);
  }

  /**
   * Format user DTO (remove sensitive data)
   */
  private static formatUserDTO(user: any): UserDTO {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      university: user.university,
      isVerified: user.isVerified,
      profilePicture: user.profilePicture,
      bio: user.bio,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

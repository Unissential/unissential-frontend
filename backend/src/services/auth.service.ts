import prisma from '@/config/database';
import { hashPassword, comparePassword, generateToken, generateVerificationToken } from '@/utils/auth';
import { UserDTO, SignupPayload, LoginPayload } from '@/types';

export class AuthService {
  /**
   * Sign up a new user
   * 1. Validates user doesn't exist
   * 2. Hashes password with bcrypt (10 rounds)
   * 3. Generates verification token (32-byte crypto token)
   * 4. Saves user to database
   * 5. Returns JWT token and user info
   */
  static async signup(payload: SignupPayload) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (existingUser) {
      throw new Error('Email already registered. Please use a different email or log in.');
    }

    // Validate email format (should be enforced by validation schema, but double-check)
    if (!payload.email.endsWith('.edu')) {
      throw new Error('Only .edu email addresses are allowed');
    }

    // Hash password with bcrypt
    let hashedPassword: string;
    try {
      hashedPassword = await hashPassword(payload.password);
    } catch (error) {
      console.error('Password hashing error:', error);
      throw new Error('Failed to process password. Please try again.');
    }

    // Generate verification token (64-character hex string)
    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user in database
    let user;
    try {
      user = await prisma.user.create({
        data: {
          email: payload.email,
          password: hashedPassword,
          name: payload.name,
          university: payload.university,
          verificationToken,
          verificationExpires,
          isVerified: false,
        },
      });
    } catch (error) {
      console.error('User creation error:', error);
      throw new Error('Failed to create user account. Please try again.');
    }

    // Generate JWT token
    let token: string;
    try {
      token = generateToken({
        userId: user.id,
        email: user.email,
      });
    } catch (error) {
      console.error('Token generation error:', error);
      throw new Error('Failed to generate authentication token. Please try again.');
    }

    // TODO: Send verification email with verificationToken
    console.log(`[DEBUG] Verification token for ${user.email}: ${verificationToken}`);

    return {
      token,
      user: this.formatUserDTO(user),
      message: 'Signup successful. Please check your email to verify your account.',
    };
  }

  /**
   * Login a user
   * 1. Finds user by email
   * 2. Compares password with bcrypt hash
   * 3. Returns JWT token if credentials are valid
   */
  static async login(payload: LoginPayload) {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Compare password using bcrypt
    let isPasswordValid: boolean;
    try {
      isPasswordValid = await comparePassword(payload.password, user.password);
    } catch (error) {
      console.error('Password comparison error:', error);
      throw new Error('Authentication failed. Please try again.');
    }

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    let token: string;
    try {
      token = generateToken({
        userId: user.id,
        email: user.email,
      });
    } catch (error) {
      console.error('Token generation error:', error);
      throw new Error('Failed to generate authentication token. Please try again.');
    }

    return {
      token,
      user: this.formatUserDTO(user),
      message: 'Login successful',
    };
  }

  /**
   * Verify email
   * 1. Finds user by verification token
   * 2. Checks token hasn't expired
   * 3. Marks user as verified
   * 4. Clears verification token
   */
  static async verifyEmail(token: string) {
    // Find user with matching verification token
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new Error('Invalid verification token');
    }

    // Check token expiration
    if (user.verificationExpires && user.verificationExpires < new Date()) {
      throw new Error('Verification token has expired. Please request a new one.');
    }

    // Already verified check
    if (user.isVerified) {
      throw new Error('Email is already verified');
    }

    // Mark user as verified and clear token
    let updatedUser;
    try {
      updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          isVerified: true,
          verificationToken: null,
          verificationExpires: null,
        },
      });
    } catch (error) {
      console.error('Email verification error:', error);
      throw new Error('Failed to verify email. Please try again.');
    }

    return this.formatUserDTO(updatedUser);
  }

  /**
   * Resend verification email
   * 1. Finds user by email
   * 2. Generates new verification token
   * 3. Expires old token
   * 4. Saves new token with 24-hour expiration
   */
  static async resendVerificationEmail(email: string) {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('User not found with this email');
    }

    // Check if already verified
    if (user.isVerified) {
      throw new Error('Email is already verified');
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with new token
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          verificationToken,
          verificationExpires,
        },
      });
    } catch (error) {
      console.error('Token regeneration error:', error);
      throw new Error('Failed to resend verification email. Please try again.');
    }

    // TODO: Send verification email with new token
    console.log(`[DEBUG] New verification token for ${user.email}: ${verificationToken}`);

    return {
      message: 'Verification email sent. Please check your inbox.',
    };
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

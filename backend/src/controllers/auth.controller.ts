import { Response } from 'express';
import { AuthRequest } from '@/middleware';
import { AuthService } from '@/services/auth.service';
import { SignupPayload, LoginPayload } from '@/validations';

export class AuthController {
  /**
   * POST /api/auth/signup
   * Register a new user with email and password
   * Returns JWT token and user info on success
   */
  static async signup(req: AuthRequest, res: Response) {
    try {
      const payload = req.body as SignupPayload;
      const result = await AuthService.signup(payload);

      return res.status(201).json({
        success: true,
        data: result,
        message: result.message,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      console.error('Signup error:', message);

      // Determine appropriate status code
      const statusCode = message.includes('already') ? 409 : 400;

      return res.status(statusCode).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * POST /api/auth/login
   * Authenticate user with email and password
   * Returns JWT token and user info on success
   */
  static async login(req: AuthRequest, res: Response) {
    try {
      const payload = req.body as LoginPayload;
      const result = await AuthService.login(payload);

      return res.status(200).json({
        success: true,
        data: result,
        message: result.message,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      console.error('Login error:', message);

      return res.status(401).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * POST /api/auth/verify-email
   * Verify user email with verification token
   * Marks user as verified and clears verification token
   */
  static async verifyEmail(req: AuthRequest, res: Response) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          error: 'Verification token is required',
        });
      }

      const user = await AuthService.verifyEmail(token);

      return res.status(200).json({
        success: true,
        data: user,
        message: 'Email verified successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Verification failed';
      console.error('Email verification error:', message);

      // Determine appropriate status code
      const statusCode = message.includes('expired') ? 410 : 400;

      return res.status(statusCode).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * POST /api/auth/resend-verification
   * Resend verification email to user
   * Generates new verification token with 24-hour expiration
   */
  static async resendVerification(req: AuthRequest, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'Email is required',
        });
      }

      const result = await AuthService.resendVerificationEmail(email);

      return res.status(200).json({
        success: true,
        data: result,
        message: result.message,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Resend verification failed';
      console.error('Resend verification error:', message);

      return res.status(400).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * GET /api/auth/me
   * Get current authenticated user profile
   * Requires valid JWT token
   */
  static async getMe(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized - no user ID found in token',
        });
      }

      const user = await AuthService.getUserById(req.userId);

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get user';
      console.error('Get user error:', message);

      return res.status(404).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * PUT /api/auth/profile
   * Update authenticated user profile
   * Requires valid JWT token
   */
  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized - no user ID found in token',
        });
      }

      const { name, bio, profilePicture } = req.body;
      const user = await AuthService.updateProfile(req.userId, {
        name,
        bio,
        profilePicture,
      });

      return res.status(200).json({
        success: true,
        data: user,
        message: 'Profile updated successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile';
      console.error('Update profile error:', message);

      return res.status(400).json({
        success: false,
        error: message,
      });
    }
  }
}

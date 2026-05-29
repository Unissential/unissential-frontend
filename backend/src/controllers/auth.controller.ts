import { Response } from 'express';
import { AuthRequest } from '@/middleware';
import { AuthService } from '@/services/auth.service';
import { SignupPayload, LoginPayload } from '@/validations';

export class AuthController {
  /**
   * POST /api/auth/signup
   */
  static async signup(req: AuthRequest, res: Response) {
    try {
      const payload = req.body as SignupPayload;
      const result = await AuthService.signup(payload);

      res.status(201).json({
        success: true,
        data: result,
        message: 'Signup successful. Please check your email to verify your account.',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * POST /api/auth/login
   */
  static async login(req: AuthRequest, res: Response) {
    try {
      const payload = req.body as LoginPayload;
      const result = await AuthService.login(payload);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Login successful',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      res.status(401).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * POST /api/auth/verify-email
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

      res.status(200).json({
        success: true,
        data: user,
        message: 'Email verified successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Verification failed';
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * POST /api/auth/resend-verification
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

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Resend verification failed';
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * GET /api/auth/me
   */
  static async getMe(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const user = await AuthService.getUserById(req.userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get user';
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * PUT /api/auth/profile
   */
  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { name, bio, profilePicture } = req.body;
      const user = await AuthService.updateProfile(req.userId, {
        name,
        bio,
        profilePicture,
      });

      res.status(200).json({
        success: true,
        data: user,
        message: 'Profile updated successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile';
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }
}

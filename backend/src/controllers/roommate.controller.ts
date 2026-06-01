import { Response } from 'express';
import { AuthRequest } from '@/middleware';
import { RoommateService } from '@/services/roommate.service';
import { CreateRoommateProfilePayload } from '@/validations';

export class RoommateController {
  /**
   * GET /api/roommates
   */
  static async getAll(req: AuthRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const filters = {
        university: req.query.university as string,
        minBudget: req.query.minBudget ? parseInt(req.query.minBudget as string) : undefined,
        maxBudget: req.query.maxBudget ? parseInt(req.query.maxBudget as string) : undefined,
        sleepSchedule: req.query.sleepSchedule as string,
      };

      const result = await RoommateService.getAllProfiles(page, limit, filters);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch roommate profiles';
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * GET /api/roommates/:id
   */
  static async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const profile = await RoommateService.getProfileById(id);

      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch roommate profile';
      const status = message === 'Roommate profile not found' ? 404 : 400;
      res.status(status).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * GET /api/roommates/user/:userId
   */
  static async getUserProfile(req: AuthRequest, res: Response) {
    try {
      const { userId } = req.params;
      const profile = await RoommateService.getUserProfile(userId);

      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch roommate profile';
      const status = message === 'Roommate profile not found' ? 404 : 400;
      res.status(status).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * POST /api/roommates
   */
  static async create(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const payload = req.body as CreateRoommateProfilePayload;
      const profile = await RoommateService.createProfile(req.userId, payload);

      res.status(201).json({
        success: true,
        data: profile,
        message: 'Roommate profile created successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create roommate profile';
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * PUT /api/roommates
   */
  static async update(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const payload = req.body as Partial<CreateRoommateProfilePayload>;
      const profile = await RoommateService.updateProfile(req.userId, payload);

      res.status(200).json({
        success: true,
        data: profile,
        message: 'Roommate profile updated successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update roommate profile';
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * DELETE /api/roommates
   */
  static async delete(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      await RoommateService.deleteProfile(req.userId);

      res.status(200).json({
        success: true,
        message: 'Roommate profile deleted successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete roommate profile';
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * GET /api/roommates/compatible
   */
  static async findCompatible(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await RoommateService.findCompatible(req.userId, page, limit);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to find compatible roommates';
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }
}

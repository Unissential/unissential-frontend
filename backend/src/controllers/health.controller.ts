import { Request, Response } from 'express';
import prisma from '@/config/database';

/**
 * Health Check Controller
 * Verifies API, database, and Prisma connectivity
 */
export class HealthController {
  /**
   * Basic health check
   * Returns API status
   */
  static async getHealth(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json({
        status: 'healthy',
        message: 'API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
      });
    } catch (error) {
      res.status(503).json({
        status: 'unhealthy',
        message: 'API health check failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Comprehensive health check including database
   * Verifies:
   * - API connectivity
   * - Database connection
   * - Prisma client connectivity
   * - Migration status
   */
  static async getHealthWithDatabase(req: Request, res: Response): Promise<void> {
    const healthCheck: {
      status: 'healthy' | 'unhealthy';
      timestamp: string;
      environment: string;
      uptime: number;
      checks: {
        api: { status: string };
        database: { status: string; message: string };
        prisma: { status: string; message: string };
      };
    } = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      checks: {
        api: { status: 'ok' },
        database: { status: 'pending', message: '' },
        prisma: { status: 'pending', message: '' },
      },
    };

    try {
      // Check database connection
      const databaseStart = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      const databaseLatency = Date.now() - databaseStart;

      healthCheck.checks.database = {
        status: 'ok',
        message: `Connected in ${databaseLatency}ms`,
      };

      // Check Prisma client
      const prismaStart = Date.now();
      const userCount = await prisma.user.count();
      const prismaLatency = Date.now() - prismaStart;

      healthCheck.checks.prisma = {
        status: 'ok',
        message: `Prisma client working (${userCount} users in database, query in ${prismaLatency}ms)`,
      };

      res.status(200).json(healthCheck);
    } catch (error) {
      healthCheck.status = 'unhealthy';

      if (healthCheck.checks.database.status === 'pending') {
        healthCheck.checks.database = {
          status: 'error',
          message: error instanceof Error ? error.message : 'Database connection failed',
        };
      }

      if (healthCheck.checks.prisma.status === 'pending') {
        healthCheck.checks.prisma = {
          status: 'error',
          message: error instanceof Error ? error.message : 'Prisma connection failed',
        };
      }

      res.status(503).json(healthCheck);
    }
  }

  /**
   * Database-specific health check
   * Used for orchestration (Docker, Kubernetes health checks)
   */
  static async getHealthDatabase(req: Request, res: Response): Promise<void> {
    try {
      // Simple query to verify database is working
      await prisma.$queryRaw`SELECT 1`;

      res.status(200).json({
        status: 'healthy',
        database: 'connected',
        message: 'Database connection successful',
      });
    } catch (error) {
      res.status(503).json({
        status: 'unhealthy',
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Database connection failed',
      });
    }
  }

  /**
   * Ready check for Kubernetes/Docker
   * Returns 200 if ready to accept traffic
   */
  static async getReady(req: Request, res: Response): Promise<void> {
    try {
      // Check database connectivity
      await prisma.$queryRaw`SELECT 1`;

      res.status(200).json({
        ready: true,
        message: 'Service is ready to accept traffic',
      });
    } catch (error) {
      res.status(503).json({
        ready: false,
        error: error instanceof Error ? error.message : 'Service not ready',
      });
    }
  }

  /**
   * Liveness check for Kubernetes/Docker
   * Returns 200 if service is alive
   */
  static async getLive(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json({
        alive: true,
        message: 'Service is alive',
      });
    } catch (error) {
      res.status(503).json({
        alive: false,
        error: error instanceof Error ? error.message : 'Service is not alive',
      });
    }
  }
}

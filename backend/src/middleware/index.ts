import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '@/utils/auth';

// Extend Express Request to include user data
export interface AuthRequest extends Request {
  userId?: string;
  user?: {
    userId: string;
    email: string;
  };
}

/**
 * Authentication middleware - verify JWT token
 */
export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Missing or invalid authorization token',
      });
    }

    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unauthorized',
    });
  }
}

/**
 * Optional authentication middleware
 */
export function optionalAuthMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (token) {
      const decoded = verifyToken(token);
      req.userId = decoded.userId;
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
      };
    }

    next();
  } catch (error) {
    // Silently ignore auth errors for optional auth
    next();
  }
}

/**
 * Error handling middleware
 */
export function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error('Error:', err);

  if (err.message.includes('Invalid or expired token')) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }

  if (err.message.includes('Validation error')) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
}

/**
 * Validation middleware wrapper
 */
export function validateRequest(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }
      res.status(400).json({
        success: false,
        error: 'Validation failed',
      });
    }
  };
}

/**
 * Async handler wrapper to catch errors
 */
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Logging middleware
 */
export function loggingMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });

  next();
}

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
 * Extracts Bearer token from Authorization header and verifies signature
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
    const message = error instanceof Error ? error.message : 'Unauthorized';
    res.status(401).json({
      success: false,
      error: message,
    });
  }
}

/**
 * Optional authentication middleware
 * Attempts to authenticate but continues if token is missing or invalid
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
 * Request validation middleware wrapper
 * Validates request body against Zod schema
 */
export function validateRequest(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error: any) {
      const errors = error.errors?.map((e: any) => ({
        field: e.path.join('.'),
        message: e.message,
      })) || [];

      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors,
      });
    }
  };
}

/**
 * Async error handler wrapper
 * Wraps async route handlers to catch and forward errors to error middleware
 */
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Error handling middleware
 * Centralized error handling for all routes
 */
export function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error('Error:', err);

  if (err.message.includes('Invalid or expired token')) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }

  if (err.message.includes('Token has expired')) {
    return res.status(401).json({
      success: false,
      error: 'Token has expired',
    });
  }

  if (err.message.includes('Invalid token signature')) {
    return res.status(401).json({
      success: false,
      error: 'Invalid token signature',
    });
  }

  if (err.message.includes('Validation error')) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
}

/**
 * Request logging middleware
 * Logs incoming requests for debugging and monitoring
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const method = req.method;
  const path = req.path;

  // Log response when it finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    console.log(`[${new Date().toISOString()}] ${method} ${path} - ${status} (${duration}ms)`);
  });

  next();
}

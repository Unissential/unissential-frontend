import bcryptjs from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { JWTPayload } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
const BCRYPT_ROUNDS = 10;

/**
 * Hash password with bcrypt
 * Production-grade password hashing with proper salt rounds
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }

  const salt = await bcryptjs.genSalt(BCRYPT_ROUNDS);
  return bcryptjs.hash(password, salt);
}

/**
 * Compare password with hash
 * Safe comparison to prevent timing attacks
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) {
    return false;
  }

  try {
    return await bcryptjs.compare(password, hash);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
}

/**
 * Generate JWT token
 * Includes issued-at and expiration claims
 */
export function generateToken(payload: JWTPayload): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign(payload, JWT_SECRET as string, {
    expiresIn: JWT_EXPIRE,
    issuer: 'unissential-backend',
    subject: payload.userId,
  } as SignOptions);
}

/**
 * Verify JWT token
 * Validates signature and expiration
 */
export function verifyToken(token: string): JWTPayload {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string, {
      issuer: 'unissential-backend',
    });
    return decoded as JWTPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token signature');
    }
    throw new Error('Invalid or expired token');
  }
}

/**
 * Generate cryptographically secure verification token
 * Uses crypto instead of Math.random for better security
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
}

/**
 * Validate .edu email
 */
export function isEducationEmail(email: string): boolean {
  return email.endsWith('.edu');
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Format error response
 */
export function formatErrorResponse(error: unknown): { message: string; status: number } {
  if (error instanceof Error) {
    return {
      message: error.message,
      status: 400,
    };
  }
  
  return {
    message: 'An unknown error occurred',
    status: 500,
  };
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Pagination helper
 */
export function calculatePagination(page: number, limit: number) {
  const skip = (page - 1) * limit;
  return { skip, take: limit };
}

/**
 * Format response with pagination
 */
export function formatPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
) {
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

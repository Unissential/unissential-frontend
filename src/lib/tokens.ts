import crypto from 'crypto';

/**
 * Generate a secure verification token
 * @returns 32-character hex string token
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Verify token hasn't expired (24 hour validity)
 * @param createdAt - Token creation timestamp
 * @returns true if token is still valid
 */
export function isTokenValid(createdAt: number): boolean {
  const EXPIRY_HOURS = 24;
  const expiryTime = createdAt + EXPIRY_HOURS * 60 * 60 * 1000;
  return Date.now() < expiryTime;
}

/**
 * Mock storage for verification tokens
 * In production, this would be a database (PostgreSQL, MongoDB, etc.)
 * Format: { token: { email, createdAt, verified } }
 */
const verificationTokens = new Map<
  string,
  {
    email: string;
    createdAt: number;
    verified: boolean;
  }
>();

/**
 * Store a verification token
 */
export function storeVerificationToken(email: string): string {
  const token = generateVerificationToken();
  verificationTokens.set(token, {
    email,
    createdAt: Date.now(),
    verified: false,
  });
  return token;
}

/**
 * Verify and consume a token
 */
export function verifyToken(token: string): {
  success: boolean;
  email?: string;
  error?: string;
} {
  const record = verificationTokens.get(token);

  if (!record) {
    return { success: false, error: 'Invalid verification token' };
  }

  if (!isTokenValid(record.createdAt)) {
    verificationTokens.delete(token);
    return { success: false, error: 'Verification link has expired. Please sign up again.' };
  }

  if (record.verified) {
    return { success: false, error: 'This email has already been verified' };
  }

  // Mark as verified
  record.verified = true;
  verificationTokens.set(token, record);

  return { success: true, email: record.email };
}

/**
 * Check if email is already verified
 */
export function isEmailVerified(email: string): boolean {
  for (const record of verificationTokens.values()) {
    if (record.email === email && record.verified) {
      return true;
    }
  }
  return false;
}

/**
 * Get verification token for an email (for resending)
 */
export function getVerificationTokenForEmail(email: string): string | null {
  for (const [token, record] of verificationTokens.entries()) {
    if (record.email === email && !record.verified) {
      return token;
    }
  }
  return null;
}

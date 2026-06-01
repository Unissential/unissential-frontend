import { NextRequest, NextResponse } from 'next/server';
import {
  getVerificationTokenForEmail,
  storeVerificationToken,
  isEmailVerified,
} from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/email';

/**
 * POST /api/auth/resend-verification
 * Resend verification email for a given email address
 */
export async function POST(request: NextRequest) {
  try {
    const { email, fullName } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    // Check if already verified
    if (isEmailVerified(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'This email has already been verified',
        },
        { status: 400 }
      );
    }

    // Get existing token or create new one
    let token = getVerificationTokenForEmail(email);

    if (!token) {
      // Create new token if none exists
      token = storeVerificationToken(email);
    }

    // Send verification email
    const emailResult = await sendVerificationEmail(email, token, fullName || 'User');

    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Verification email sent. Check your inbox.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

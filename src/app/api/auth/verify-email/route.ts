import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, isEmailVerified } from '@/lib/tokens';
import { sendWelcomeEmail } from '@/lib/email';

/**
 * POST /api/auth/verify-email
 * Verify email token and activate account
 */
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid request: token is required' },
        { status: 400 }
      );
    }

    // Verify the token
    const verification = verifyToken(token);

    if (!verification.success) {
      return NextResponse.json(
        {
          success: false,
          error: verification.error || 'Verification failed',
        },
        { status: 400 }
      );
    }

    const email = verification.email!;

    // Send welcome email
    await sendWelcomeEmail(email, email.split('@')[0]);

    // TODO: In production, update user in database
    // Update: { verified: true, verifiedAt: now }

    return NextResponse.json(
      {
        success: true,
        message: 'Email verified successfully',
        email,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET /api/auth/verify-email?token=xyz
 * Verify email token via query parameter (for email links)
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json({ success: false, error: 'Token is required' }, { status: 400 });
    }

    // Verify the token
    const verification = verifyToken(token);

    if (!verification.success) {
      return NextResponse.json(
        {
          success: false,
          error: verification.error || 'Verification failed',
        },
        { status: 400 }
      );
    }

    const email = verification.email!;

    // Send welcome email
    await sendWelcomeEmail(email, email.split('@')[0]);

    return NextResponse.json(
      {
        success: true,
        message: 'Email verified successfully',
        email,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

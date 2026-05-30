import { NextRequest, NextResponse } from 'next/server';
import { signupSchema } from '@/lib/validation/auth';
import { storeVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/email';

/**
 * POST /api/auth/signup
 * Handle user signup and send verification email
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input using Zod schema
    const validationResult = signupSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          errors: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { fullName, email, password } = validationResult.data;

    // TODO: In production, check if user already exists in database
    // For demo, we'll just proceed

    // Generate verification token
    const token = storeVerificationToken(email);

    // Send verification email
    const emailResult = await sendVerificationEmail(email, token, fullName);

    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    // TODO: In production, save user to database with verified: false
    // Store: { fullName, email, password (hashed), verified: false, createdAt }

    return NextResponse.json(
      {
        success: true,
        message: 'Account created. Check your email to verify.',
        email,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

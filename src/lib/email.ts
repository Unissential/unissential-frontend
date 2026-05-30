/**
 * Email service utility
 * In production, integrate with Resend, SendGrid, AWS SES, etc.
 *
 * For development, emails are logged to console and stored in memory
 */

const sentEmails: Array<{
  to: string;
  subject: string;
  html: string;
  sentAt: Date;
}> = [];

/**
 * Send verification email
 * @param email - Recipient email address
 * @param token - Verification token
 * @param userName - User's full name
 */
export async function sendVerificationEmail(
  email: string,
  token: string,
  userName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; margin: 20px 0; font-weight: bold; }
            .footer { color: #999; font-size: 12px; margin-top: 20px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Unissential! 🎓</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              
              <p>Thank you for signing up for Unissential! We're excited to have you join our community of students finding premium housing near campus.</p>
              
              <p>To complete your registration, please verify your email address by clicking the button below:</p>
              
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
              
              <p>This link will expire in 24 hours.</p>
              
              <p style="color: #999; font-size: 14px;">Or copy and paste this link in your browser:<br><code>${verificationUrl}</code></p>
              
              <p>If you didn't sign up for Unissential, please ignore this email.</p>
              
              <p>Best regards,<br>The Unissential Team</p>
              
              <div class="footer">
                <p>© 2026 Unissential. All rights reserved.</p>
                <p>Making student housing easier, one listing at a time.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailRecord = {
      to: email,
      subject: 'Verify your Unissential email address',
      html,
      sentAt: new Date(),
    };

    sentEmails.push(emailRecord);

    // Log to console for development
    console.log('📧 [DEV] Verification email would be sent:');
    console.log(`   To: ${email}`);
    console.log(`   Verification Link: ${verificationUrl}`);
    console.log(`   Token: ${token}`);

    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: 'Failed to send verification email',
    };
  }
}

/**
 * Send welcome email after verification
 */
export async function sendWelcomeEmail(
  email: string,
  userName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; margin: 20px 0; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Email Verified! ✨</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              
              <p>Your email has been successfully verified!</p>
              
              <p>You can now start exploring premium student housing near your campus.</p>
              
              <a href="http://localhost:3000/leasing" class="button">Browse Listings</a>
              
              <p>Happy hunting!<br>The Unissential Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    sentEmails.push({
      to: email,
      subject: 'Welcome to Unissential!',
      html,
      sentAt: new Date(),
    });

    console.log(`📧 Welcome email sent to ${email}`);

    return { success: true };
  } catch (error) {
    console.error('Welcome email error:', error);
    return { success: false, error: 'Failed to send welcome email' };
  }
}

/**
 * Get all sent emails (for development/testing)
 */
export function getSentEmails() {
  return sentEmails;
}

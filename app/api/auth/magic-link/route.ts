import { NextRequest, NextResponse } from 'next/server';
import { generateMagicLinkToken, sendMagicLinkEmail, findOrCreateCustomer } from '@/lib/customer-auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, first_name, last_name } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Find or create customer
    const customer = await findOrCreateCustomer(email, {
      first_name,
      last_name,
    });

    // Generate magic link token
    const token = await generateMagicLinkToken(email);

    // Send magic link email
    const emailSent = await sendMagicLinkEmail(email, token);

    if (!emailSent) {
      // Email failed but we'll still return success (so attackers can't enumerate emails)
      console.error('Failed to send magic link email to:', email);
    }

    return NextResponse.json({
      success: true,
      message: 'Login link sent! Check your email.',
    });

  } catch (error) {
    console.error('Magic link error:', error);
    return NextResponse.json(
      { error: 'Failed to send login link' },
      { status: 500 }
    );
  }
}

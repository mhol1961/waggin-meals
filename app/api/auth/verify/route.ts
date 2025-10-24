import { NextRequest, NextResponse } from 'next/server';
import { verifyMagicLinkToken, findOrCreateCustomer, createSessionToken } from '@/lib/customer-auth';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/login?error=no_token', request.url));
    }

    // Verify the magic link token
    const result = await verifyMagicLinkToken(token);

    if (!result) {
      return NextResponse.redirect(new URL('/login?error=invalid_token', request.url));
    }

    // Find or create customer
    const customer = await findOrCreateCustomer(result.email);

    // Create session token
    const sessionToken = await createSessionToken(customer.id, customer.email);

    // Create response with redirect
    const response = NextResponse.redirect(new URL('/customer/account', request.url));

    // Set session cookie
    response.cookies.set('customer_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.redirect(new URL('/login?error=failed', request.url));
  }
}

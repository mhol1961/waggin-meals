/**
 * Customer Authentication Utilities
 *
 * Handles magic link authentication for customers
 * - Generate magic links
 * - Verify tokens
 * - Create/manage sessions
 */

import { createClient } from '@supabase/supabase-js';
import { SignJWT, jwtVerify } from 'jose';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const JWT_SECRET = new TextEncoder().encode(
  process.env.CUSTOMER_JWT_SECRET || 'your-secret-key-change-in-production'
);

/**
 * Generate a magic link token for customer login
 */
export async function generateMagicLinkToken(email: string): Promise<string> {
  // Create JWT token that expires in 15 minutes
  const token = await new SignJWT({ email, type: 'magic_link' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify a magic link token
 */
export async function verifyMagicLinkToken(token: string): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (payload.type !== 'magic_link' || typeof payload.email !== 'string') {
      return null;
    }

    return { email: payload.email };
  } catch (error) {
    return null;
  }
}

/**
 * Create a session token for authenticated customer
 */
export async function createSessionToken(customerId: string, email: string): Promise<string> {
  // Create session token that expires in 30 days
  const token = await new SignJWT({
    customerId,
    email,
    type: 'session'
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify a session token
 */
export async function verifySessionToken(token: string): Promise<{ customerId: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (payload.type !== 'session' ||
        typeof payload.customerId !== 'string' ||
        typeof payload.email !== 'string') {
      return null;
    }

    return {
      customerId: payload.customerId,
      email: payload.email
    };
  } catch (error) {
    return null;
  }
}

/**
 * Get customer from session token
 */
export async function getCustomerFromSession(sessionToken: string) {
  const session = await verifySessionToken(sessionToken);

  if (!session) {
    return null;
  }

  const { data: customer, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', session.customerId)
    .single();

  if (error || !customer) {
    return null;
  }

  return customer;
}

/**
 * Find or create customer by email
 */
export async function findOrCreateCustomer(email: string, data?: {
  first_name?: string;
  last_name?: string;
  phone?: string;
}) {
  // Try to find existing customer
  const { data: existingCustomer } = await supabase
    .from('customers')
    .select('*')
    .eq('email', email)
    .single();

  if (existingCustomer) {
    return existingCustomer;
  }

  // Create new customer
  const { data: newCustomer, error } = await supabase
    .from('customers')
    .insert({
      email,
      first_name: data?.first_name || '',
      last_name: data?.last_name || '',
      phone: data?.phone || null,
      total_orders: 0,
      total_spent: 0,
    })
    .select()
    .single();

  if (error) {
    throw new Error('Failed to create customer');
  }

  return newCustomer;
}

/**
 * Send magic link email
 */
export async function sendMagicLinkEmail(email: string, token: string) {
  const magicLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/verify?token=${token}`;

  // TODO: Replace with actual email service (Resend)
  // For now, we'll just log it
  console.log('Magic link for', email, ':', magicLink);

  // If Resend is configured, send email
  if (process.env.RESEND_API_KEY) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'noreply@wagginmeals.com',
          to: email,
          subject: 'Your Waggin\' Meals Login Link',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .button {
                  display: inline-block;
                  padding: 12px 24px;
                  background-color: #a5b5eb;
                  color: white;
                  text-decoration: none;
                  border-radius: 5px;
                  margin: 20px 0;
                }
                .footer { font-size: 12px; color: #666; margin-top: 30px; }
              </style>
            </head>
            <body>
              <div class="container">
                <h2>Welcome to Waggin' Meals! 🐾</h2>
                <p>Click the button below to log in to your account:</p>
                <a href="${magicLink}" class="button">Log In to Your Account</a>
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #666;">${magicLink}</p>
                <p><strong>This link expires in 15 minutes.</strong></p>
                <div class="footer">
                  <p>If you didn't request this login link, you can safely ignore this email.</p>
                  <p>Questions? Contact us at ${process.env.RESEND_FROM_EMAIL || 'info@wagginmeals.com'}</p>
                </div>
              </div>
            </body>
            </html>
          `,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      return true;
    } catch (error) {
      console.error('Error sending magic link email:', error);
      return false;
    }
  }

  // Email not configured - return true for development
  return true;
}

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Admin Authentication Utilities
 *
 * Simple password-based authentication for the admin panel
 * Uses JWT tokens stored in HTTP-only cookies
 */

const SESSION_COOKIE_NAME = 'admin-session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Verify admin credentials
 * TODO: Upgrade to bcrypt password hashing for production
 */
export async function verifyAdminCredentials(
  username: string,
  password: string
): Promise<boolean> {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    console.error('Admin credentials not configured in environment variables');
    return false;
  }

  // SECURITY WARNING: This is plain text comparison
  // For production, use bcrypt.compare() with hashed passwords
  return username === adminUsername && password === adminPassword;
}

/**
 * Create a JWT session token
 */
export async function createSessionToken(username: string): Promise<string> {
  const sessionSecret = process.env.SESSION_SECRET;

  if (!sessionSecret) {
    throw new Error('SESSION_SECRET is not configured. Please set it in your .env.local file.');
  }

  const secret = new TextEncoder().encode(sessionSecret);

  const token = await new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);

  return token;
}

/**
 * Verify a JWT session token
 */
export async function verifySessionToken(
  token: string
): Promise<{ username: string } | null> {
  try {
    const sessionSecret = process.env.SESSION_SECRET;

    if (!sessionSecret) {
      console.error('SESSION_SECRET is not configured');
      return null;
    }

    const secret = new TextEncoder().encode(sessionSecret);
    const { payload } = await jwtVerify(token, secret);

    return {
      username: payload.username as string,
    };
  } catch (error) {
    console.error('Invalid session token:', error);
    return null;
  }
}

/**
 * Set the admin session cookie
 */
export async function setAdminSession(username: string): Promise<void> {
  const token = await createSessionToken(username);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000, // Convert to seconds
    path: '/',
  });
}

/**
 * Get the current admin session
 */
export async function getAdminSession(): Promise<{
  username: string;
} | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME);

  if (!token) {
    return null;
  }

  return verifySessionToken(token.value);
}

/**
 * Clear the admin session (logout)
 */
export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Check if the current request is from an authenticated admin
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getAdminSession();
  return session !== null;
}

/**
 * Middleware helper to protect admin routes
 * Returns the session if authenticated, otherwise returns a redirect response
 */
export async function requireAdminAuth(
  request: NextRequest
): Promise<
  | { authenticated: true; session: { username: string } }
  | { authenticated: false; response: NextResponse }
> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME);

  if (!token) {
    return {
      authenticated: false,
      response: NextResponse.redirect(new URL('/admin/login', request.url)),
    };
  }

  const session = await verifySessionToken(token.value);

  if (!session) {
    return {
      authenticated: false,
      response: NextResponse.redirect(new URL('/admin/login', request.url)),
    };
  }

  return {
    authenticated: true,
    session,
  };
}

/**
 * Create a response that redirects to admin login
 */
export function redirectToLogin(request: NextRequest): NextResponse {
  return NextResponse.redirect(new URL('/admin/login', request.url));
}

/**
 * Create a response that redirects to admin dashboard
 */
export function redirectToDashboard(request: NextRequest): NextResponse {
  return NextResponse.redirect(new URL('/admin', request.url));
}

/**
 * Verify admin authentication for API routes
 * Alias for requireAdminAuth to match expected import name
 */
export async function verifyAdminAuth(
  request: NextRequest
): Promise<
  | { authenticated: true; session: { username: string } }
  | { authenticated: false; response: NextResponse }
> {
  return requireAdminAuth(request);
}

/**
 * Check admin authentication for API routes (simpler version)
 * Returns authentication status without requiring NextRequest
 */
export async function checkAdminAuth(): Promise<
  | { authenticated: true; session: { username: string } }
  | { authenticated: false }
> {
  const session = await getAdminSession();

  if (!session) {
    return { authenticated: false };
  }

  return {
    authenticated: true,
    session,
  };
}

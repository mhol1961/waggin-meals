import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession, createMiddlewareClient } from '@/lib/supabase/middleware';

/**
 * Next.js Middleware for Authentication
 *
 * Protects routes using Supabase auth:
 * - /account/* - Requires authentication
 * - /admin/* - Requires authentication + admin role
 * - /api/admin/* - Requires authentication + admin role
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Update session for all requests
  const response = await updateSession(request);

  // Public authentication pages - allow access
  if (pathname.startsWith('/auth/')) {
    return response;
  }

  // Create Supabase client for middleware
  const { supabase } = createMiddlewareClient(request);

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect /account/* routes
  if (pathname.startsWith('/account')) {
    if (!user) {
      const redirectUrl = new URL('/auth/login', request.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Admin routes use separate cookie-based authentication
  // Let admin pages/APIs handle their own auth checks via getAdminSession()
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

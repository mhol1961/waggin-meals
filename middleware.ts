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

  // Protect /admin/* routes and /api/admin/* routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (!user) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Unauthorized - Authentication required' },
          { status: 401 }
        );
      }

      const redirectUrl = new URL('/auth/login', request.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Check if user has admin role
    try {
      const { data: roleData, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error || !roleData || roleData.role !== 'admin') {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json(
            { error: 'Forbidden - Admin access required' },
            { status: 403 }
          );
        }

        // Not an admin - redirect to home
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      console.error('Error checking admin role:', error);

      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
        );
      }

      return NextResponse.redirect(new URL('/', request.url));
    }
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

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for admin routes (but not login or API routes)
  if (pathname.startsWith('/admin') &&
      !pathname.startsWith('/admin/login') &&
      !pathname.startsWith('/api/admin/auth')) {

    // Check for admin session cookie
    const session = request.cookies.get('admin_session');

    if (!session) {
      // Redirect to login page
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: '/admin/:path*',
};

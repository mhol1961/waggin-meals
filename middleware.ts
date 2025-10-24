import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken } from './lib/admin-auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Read cookie directly from request (can't use cookies() in middleware)
    const sessionCookie = request.cookies.get('admin-session');

    if (!sessionCookie) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Verify the session token
    const session = await verifySessionToken(sessionCookie.value);

    if (!session) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect all /api/admin routes except /api/admin/login
  if (pathname.startsWith('/api/admin') && pathname !== '/api/admin/login') {
    // Read cookie directly from request (can't use cookies() in middleware)
    const sessionCookie = request.cookies.get('admin-session');

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify the session token
    const session = await verifySessionToken(sessionCookie.value);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

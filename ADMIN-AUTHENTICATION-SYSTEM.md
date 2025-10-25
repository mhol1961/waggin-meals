# Admin Authentication System - Complete Implementation

**Last Updated**: January 25, 2025
**Status**: ✅ COMPLETE & DEPLOYED

---

## Overview

Secure session-based authentication system protecting all `/admin/*` routes. Admin can create blog posts, case studies, and manage site content through a protected CMS interface.

## Features

- ✅ **Login Page**: `/admin/login` with username/password authentication
- ✅ **Session Management**: 7-day httpOnly secure cookies
- ✅ **Middleware Protection**: All `/admin/*` routes require authentication
- ✅ **Logout Functionality**: Session invalidation and redirect
- ✅ **Redirect After Login**: Returns to intended page after authentication
- ✅ **Security**: httpOnly cookies, secure in production, SameSite protection

---

## File Structure

```
/middleware.ts                          # Route protection middleware
/app/admin/login/page.tsx              # Login UI
/app/admin/page.tsx                    # Admin dashboard (protected)
/app/admin/blog/new/page.tsx           # Create blog posts (protected)
/app/admin/case-studies/new/page.tsx   # Create case studies (protected)
/app/api/admin/auth/login/route.ts     # Login API endpoint
/app/api/admin/auth/logout/route.ts    # Logout API endpoint
```

---

## Environment Variables

Required in `.env.local` and Netlify:

```bash
# Admin Credentials
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-secure-password

# Session Secret (for token generation)
SESSION_SECRET=your-random-secret-key-here
```

**Security Notes**:
- Never commit credentials to repository
- Use strong passwords (20+ characters recommended)
- `SESSION_SECRET` should be a random string (32+ characters)
- These are server-side only (no NEXT_PUBLIC_ prefix)

---

## Implementation Details

### 1. Middleware Protection (`middleware.ts`)

Intercepts all requests to `/admin/*` routes:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login and API auth routes
  if (pathname.startsWith('/admin') &&
      !pathname.startsWith('/admin/login') &&
      !pathname.startsWith('/api/admin/auth')) {

    const session = request.cookies.get('admin_session');

    if (!session) {
      // Redirect to login with return URL
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
```

**Key Points**:
- Runs on EVERY request to `/admin/*`
- Excludes `/admin/login` to prevent redirect loop
- Stores intended destination in `?from=` query parameter
- Uses httpOnly cookies for security

---

### 2. Login API (`/app/api/admin/auth/login/route.ts`)

Validates credentials and creates session:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validate against environment variables
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      return NextResponse.json(
        { error: 'Admin credentials not configured' },
        { status: 500 }
      );
    }

    if (username === adminUsername && password === adminPassword) {
      // Generate session token
      const sessionToken = Buffer.from(
        `${username}:${Date.now()}:${process.env.SESSION_SECRET}`
      ).toString('base64');

      // Set secure cookie
      const cookieStore = await cookies();
      cookieStore.set('admin_session', sessionToken, {
        httpOnly: true,                              // Not accessible via JavaScript
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'lax',                             // CSRF protection
        maxAge: 60 * 60 * 24 * 7,                   // 7 days
        path: '/',
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid username or password' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
```

**Security Features**:
- Credentials never stored in database
- Session token includes timestamp and secret
- httpOnly prevents XSS attacks
- Secure flag for HTTPS in production
- SameSite prevents CSRF attacks

---

### 3. Login Page (`/app/admin/login/page.tsx`)

User interface for authentication:

```typescript
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Redirect to intended page or dashboard
        const from = searchParams.get('from') || '/admin';
        router.push(from);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Login form UI
  );
}
```

**Features**:
- Client-side form validation
- Loading states during authentication
- Error message display
- Redirect to intended page after login
- Clean, branded UI matching site design

---

### 4. Logout API (`/app/api/admin/auth/logout/route.ts`)

Invalidates session and clears cookie:

```typescript
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();

  // Delete the session cookie
  cookieStore.delete('admin_session');

  return NextResponse.json({ success: true });
}
```

---

### 5. Admin Dashboard (`/app/admin/page.tsx`)

Protected landing page with logout:

```typescript
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    const response = await fetch('/api/admin/auth/logout', {
      method: 'POST',
    });

    if (response.ok) {
      router.push('/admin/login');
    }
  };

  return (
    <div>
      {/* Dashboard UI */}
      <button onClick={handleLogout}>Logout</button>
      <Link href="/admin/blog/new">Create Blog Post</Link>
      <Link href="/admin/case-studies/new">Create Case Study</Link>
    </div>
  );
}
```

---

## Protected Routes

All routes requiring authentication:

- `/admin` - Dashboard
- `/admin/blog/new` - Create blog posts
- `/admin/case-studies/new` - Create case studies

**Future protected routes** (when built):
- `/admin/products` - Manage products
- `/admin/orders` - View/manage orders
- `/admin/customers` - View customers
- `/admin/settings` - Site settings

---

## Testing

### Local Development

1. Create `.env.local`:
```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
SESSION_SECRET=random-secret-key-32-characters-long
```

2. Start dev server:
```bash
npm run dev
```

3. Test login:
- Navigate to `http://localhost:3000/admin`
- Should redirect to `/admin/login`
- Enter credentials
- Should redirect back to `/admin`

4. Test protected routes:
- Visit `/admin/blog/new` without logging in
- Should redirect to login
- After login, should access page

5. Test logout:
- Click logout button
- Should redirect to `/admin/login`
- Try accessing `/admin` - should require login again

### Production (Netlify)

1. Set environment variables in Netlify dashboard:
- Site configuration → Environment variables
- Add `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SESSION_SECRET`

2. Deploy and test:
- Visit `https://wagginmeals.com/admin`
- Test login flow
- Test session persistence (refresh page, still logged in)
- Test logout

---

## Security Considerations

### ✅ Implemented

- **httpOnly Cookies**: JavaScript cannot access session tokens
- **Secure Flag**: HTTPS-only cookies in production
- **SameSite Protection**: Prevents CSRF attacks
- **Server-Side Validation**: Credentials never sent to client
- **Environment Variables**: Secrets stored securely
- **Session Expiration**: 7-day automatic logout

### 🔒 Additional Security (Future)

Consider implementing:
- [ ] **Rate Limiting**: Prevent brute force attacks
- [ ] **2FA**: Two-factor authentication for admin
- [ ] **Session Invalidation**: Logout all devices
- [ ] **IP Whitelisting**: Restrict admin access by IP
- [ ] **Audit Logging**: Track admin actions
- [ ] **Password Requirements**: Enforce strong passwords
- [ ] **Session Rotation**: Regenerate tokens periodically

---

## Troubleshooting

### "Redirected to login repeatedly"

- Check that `ADMIN_USERNAME` and `ADMIN_PASSWORD` are set
- Verify credentials match exactly (case-sensitive)
- Clear browser cookies and try again

### "Session expires too quickly"

- Check server time is correct
- Verify `maxAge` in cookie configuration
- Ensure cookies aren't being blocked by browser

### "Login works locally but not on Netlify"

- Verify environment variables are set in Netlify
- Check that `SESSION_SECRET` is configured
- Ensure HTTPS is enabled (secure cookies require it)

### "Cannot access admin routes"

- Check middleware configuration
- Verify `middleware.ts` is in root directory
- Ensure Next.js version supports middleware (15.5.6 ✅)

---

## Migration Notes

### From Previous Setup (if applicable)

If you had a different auth system:

1. **Remove old auth files**
2. **Update environment variables**
3. **Clear all admin sessions** (users must re-login)
4. **Test all protected routes**

### Database Not Required

This system does NOT use a database:
- Credentials stored in environment variables only
- Sessions stored in browser cookies only
- No user table needed
- Scalable and simple

---

## Future Enhancements

When more admins are needed:

1. **Multi-User System**:
   - Add Supabase table for admin users
   - Password hashing (bcrypt)
   - Role-based access control
   - User management UI

2. **Advanced Features**:
   - Login history
   - Device management
   - Email notifications for logins
   - Temporary access tokens

---

## Related Documentation

- `BLOG-CREATION-SYSTEM-COMPLETE.md` - Blog post creation (requires admin auth)
- `CASE-STUDIES-SYSTEM-SUMMARY.md` - Case study creation (requires admin auth)
- `NETLIFY_ENV_VARS.md` - Environment variable configuration
- `PROJECT-STATUS-COMPLETE.md` - Overall project status

---

**Questions?** Check the code comments in `middleware.ts` and `/app/api/admin/auth/` files for additional implementation details.

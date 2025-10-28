import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { SupabaseClient, User } from '@supabase/supabase-js';

/**
 * Creates a Supabase client for server-side authentication
 * Properly handles cookies for session management in Next.js 15
 */
export async function createAuthServerClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Called from Server Component - ignore
            // Middleware will handle session refresh
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Called from Server Component - ignore
          }
        },
      },
    }
  );
}

/**
 * Get the current authenticated user on the server
 * Returns null if not authenticated
 */
export async function getServerUser(): Promise<User | null> {
  const supabase = await createAuthServerClient();

  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error getting server user:', error);
    return null;
  }
}

/**
 * Check if user is authenticated on the server
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getServerUser();
  return user !== null;
}

/**
 * Check if the current user has admin role
 */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createAuthServerClient();
  const user = await getServerUser();

  if (!user) return false;

  try {
    // Check user_roles table or custom claims
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      return false;
    }

    return data.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Require authentication - throws if not authenticated
 * Use in Server Actions and API Routes
 */
export async function requireAuth(): Promise<User> {
  const user = await getServerUser();

  if (!user) {
    throw new Error('Authentication required');
  }

  return user;
}

/**
 * Require admin role - throws if not admin
 * Use in admin-only Server Actions and API Routes
 */
export async function requireAdmin(): Promise<User> {
  const user = await requireAuth();
  const admin = await isAdmin();

  if (!admin) {
    throw new Error('Admin access required');
  }

  return user;
}

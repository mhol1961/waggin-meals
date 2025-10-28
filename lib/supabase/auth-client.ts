import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client optimized for authentication in the browser
 * Uses @supabase/ssr for proper cookie handling and session management
 */
export function createAuthClient(): SupabaseClient {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Singleton auth client for client-side use
 * Prevents creating multiple auth clients
 */
let authClientInstance: SupabaseClient | null = null;

export function getAuthClient(): SupabaseClient {
  if (!authClientInstance) {
    authClientInstance = createAuthClient();
  }
  return authClientInstance;
}

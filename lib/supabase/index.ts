/**
 * Supabase Client Re-Exports
 *
 * Provides a centralized import point for Supabase clients.
 *
 * Usage:
 * - Client components: import { supabase } from '@/lib/supabase'
 * - Server/API routes: import { createServerClient } from '@/lib/supabase'
 */

// Client-side exports (for 'use client' components)
export { supabase } from './client';
export type {
  BlogPost,
  Video,
  Testimonial,
  Event,
  Resource,
  Product,
} from './client';

// Server-side exports (for API routes and server components)
export { createServerClient, createClient } from './server';

// Re-export server helper functions that exist
export {
  getAllBlogPosts,
  getBlogPostBySlug,
} from './server';

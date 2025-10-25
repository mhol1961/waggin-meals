import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Supabase Server Client for Server-Side Operations
 *
 * Use this in:
 * - API routes (app/api/*)
 * - Server components (async components without 'use client')
 * - Server Actions
 *
 * This client bypasses Row Level Security (RLS)
 * ONLY use for trusted server-side operations like admin panel
 */
export function createServerClient() {
  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  }

  // If service role key is not set, fall back to anon key (read-only)
  const key = supabaseServiceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Helper Functions for Common CMS Operations
 */

export async function getAllBlogPosts(publishedOnly = true) {
  const supabase = createServerClient();

  let query = supabase
    .from('blog_posts')
    .select('*')
    .order('published_date', { ascending: false });

  if (publishedOnly) {
    query = query.eq('is_published', true);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }

  return data;
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }

  return data;
}

export async function getAllVideos(publishedOnly = true) {
  const supabase = createServerClient();

  let query = supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false });

  if (publishedOnly) {
    query = query.eq('is_published', true);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching videos:', error);
    return [];
  }

  return data;
}

export async function getAllTestimonials(publishedOnly = true) {
  const supabase = createServerClient();

  let query = supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  if (publishedOnly) {
    query = query.eq('is_published', true);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }

  return data;
}

export async function getFeaturedTestimonials() {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) {
    console.error('Error fetching featured testimonials:', error);
    return [];
  }

  return data;
}

export async function getAllEvents(publishedOnly = true) {
  const supabase = createServerClient();

  let query = supabase
    .from('events')
    .select('*')
    .order('start_date', { ascending: true });

  if (publishedOnly) {
    query = query.eq('is_published', true);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }

  return data;
}

export async function getUpcomingEvents() {
  const supabase = createServerClient();

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .gte('start_date', now)
    .order('start_date', { ascending: true });

  if (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }

  return data;
}

export async function getAllResources(publishedOnly = true) {
  const supabase = createServerClient();

  let query = supabase
    .from('resources')
    .select('*')
    .order('created_at', { ascending: false });

  if (publishedOnly) {
    query = query.eq('is_published', true);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching resources:', error);
    return [];
  }

  return data;
}

export async function getAllProducts(publishedOnly = true) {
  const supabase = createServerClient();

  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (publishedOnly) {
    query = query.eq('is_published', true);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data;
}

export async function getProductByHandle(handle: string) {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('handle', handle)
    .eq('is_published', true)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
}

export async function getProductsByCategory(category: string) {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .eq('is_published', true)
    .eq('in_stock', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }

  return data;
}

export async function getFeaturedProducts(limit = 6) {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_published', true)
    .eq('in_stock', true)
    .order('inventory_count', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }

  return data;
}

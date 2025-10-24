import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * Supabase Client for Client-Side Operations
 *
 * Use this in client components ('use client')
 * Has Row Level Security (RLS) enabled - only published content is visible
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * TypeScript types for database tables
 */
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  category: string;
  tags: string[];
  author: string;
  published_date: string | null;
  is_published: boolean;
  read_time: number | null;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  duration: number | null;
  category: string | null;
  tags: string[];
  transcript: string | null;
  is_published: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  dog_name: string;
  owner_name: string;
  location: string | null;
  category: string;
  problem: string;
  result: string;
  quote: string;
  service: string | null;
  rating: number;
  image_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  event_type: string | null;
  start_date: string;
  end_date: string | null;
  location: string | null;
  registration_url: string | null;
  max_attendees: number | null;
  current_attendees: number;
  price: number | null;
  image_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string | null;
  resource_type: string;
  file_url: string;
  thumbnail_url: string | null;
  category: string | null;
  tags: string[];
  download_count: number;
  is_free: boolean;
  price: number | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  weight: string | null;
  sku: string | null;
  inventory_count: number;
  category: string;
  tags: string[];
  images: string[];
  in_stock: boolean;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

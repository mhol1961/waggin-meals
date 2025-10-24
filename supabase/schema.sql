-- =============================================
-- Waggin Meals CMS Database Schema
-- =============================================
-- Run this in Supabase SQL Editor to create all tables
-- Go to: https://supabase.com/dashboard/project/lpevubhnsicbbpzeqmmv/sql/new

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Blog Posts Table
-- =============================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  author TEXT DEFAULT 'Christie',
  published_date TIMESTAMP WITH TIME ZONE,
  is_published BOOLEAN DEFAULT false,
  read_time INTEGER, -- in minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_date DESC);

-- =============================================
-- Videos Table (Christie's Video Library)
-- =============================================
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL, -- YouTube URL or self-hosted
  thumbnail_url TEXT,
  duration INTEGER, -- in seconds
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  transcript TEXT,
  is_published BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category);
CREATE INDEX IF NOT EXISTS idx_videos_published ON videos(is_published, created_at DESC);

-- =============================================
-- Testimonials Table
-- =============================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dog_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  location TEXT,
  category TEXT NOT NULL, -- e.g., 'Weight Loss', 'Digestive Issues'
  problem TEXT NOT NULL,
  result TEXT NOT NULL,
  quote TEXT NOT NULL,
  service TEXT, -- e.g., '3-Month Custom Meal Plan'
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_testimonials_category ON testimonials(category);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured, is_published);

-- =============================================
-- Events Table
-- =============================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_type TEXT, -- e.g., 'Workshop', 'Webinar', 'Class'
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT, -- Physical address or 'Online'
  registration_url TEXT,
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  price DECIMAL(10,2),
  image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_events_dates ON events(start_date DESC);
CREATE INDEX IF NOT EXISTS idx_events_published ON events(is_published, start_date DESC);

-- =============================================
-- Resources Table (PDF Guides, Downloads)
-- =============================================
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL, -- e.g., 'PDF', 'Checklist', 'Guide'
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  download_count INTEGER DEFAULT 0,
  is_free BOOLEAN DEFAULT true,
  price DECIMAL(10,2),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_resources_published ON resources(is_published, created_at DESC);

-- =============================================
-- Products Table (For E-commerce Phase 2)
-- =============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  handle TEXT UNIQUE NOT NULL, -- URL-friendly identifier
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2), -- Original price for sales
  weight TEXT, -- e.g., '2 lbs', '500g'
  sku TEXT,
  inventory_count INTEGER DEFAULT 0,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}', -- Array of image URLs
  in_stock BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_products_handle ON products(handle);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_published ON products(is_published, created_at DESC);

-- =============================================
-- Enable Row Level Security (RLS)
-- =============================================
-- This ensures data can only be accessed/modified through proper authentication

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS Policies - Allow public read access to published content
-- =============================================

-- Blog Posts: Anyone can read published posts
CREATE POLICY "Public can read published blog posts"
  ON blog_posts FOR SELECT
  USING (is_published = true);

-- Videos: Anyone can read published videos
CREATE POLICY "Public can read published videos"
  ON videos FOR SELECT
  USING (is_published = true);

-- Testimonials: Anyone can read published testimonials
CREATE POLICY "Public can read published testimonials"
  ON testimonials FOR SELECT
  USING (is_published = true);

-- Events: Anyone can read published events
CREATE POLICY "Public can read published events"
  ON events FOR SELECT
  USING (is_published = true);

-- Resources: Anyone can read published resources
CREATE POLICY "Public can read published resources"
  ON resources FOR SELECT
  USING (is_published = true);

-- Products: Anyone can read published products
CREATE POLICY "Public can read published products"
  ON products FOR SELECT
  USING (is_published = true);

-- =============================================
-- Functions for automatic timestamp updates
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Sample Data (Optional - for testing)
-- =============================================

-- Sample Blog Post
INSERT INTO blog_posts (title, slug, excerpt, content, category, tags, is_published, published_date, read_time)
VALUES (
  'Getting Started with Fresh Food for Dogs',
  'getting-started-fresh-food',
  'Learn the basics of transitioning your dog to fresh, whole food meals.',
  '# Getting Started with Fresh Food for Dogs\n\nTransitioning your dog to fresh food can seem overwhelming, but it doesn''t have to be! Here are the key steps...',
  'Nutrition Basics',
  ARRAY['fresh-food', 'beginner', 'nutrition'],
  true,
  NOW(),
  5
);

-- Sample Testimonial
INSERT INTO testimonials (dog_name, owner_name, location, category, problem, result, quote, service, rating, is_published, is_featured)
VALUES (
  'Bella',
  'Sarah M.',
  'Asheville, NC',
  'Weight Loss',
  'Overweight & Low Energy',
  'Lost 12 lbs in 4 months, energy levels soared',
  'Christie''s custom meal plan completely transformed Bella''s life. She lost weight gradually and safely, and now she plays like a puppy again!',
  '3-Month Custom Meal Plan',
  5,
  true,
  true
);

-- Sample Event
INSERT INTO events (title, description, event_type, start_date, location, price, is_published)
VALUES (
  'Fresh Food Basics Workshop',
  'Join Christie for a hands-on workshop on preparing fresh food meals for your dog.',
  'Workshop',
  NOW() + INTERVAL '30 days',
  'Asheville, NC',
  49.00,
  true
);

-- =============================================
-- Setup Complete!
-- =============================================
-- Next steps:
-- 1. Go to Supabase Dashboard > SQL Editor
-- 2. Copy and paste this entire file
-- 3. Click "Run" to create all tables
-- 4. Tables will appear in your Table Editor

/**
 * Sitemap for Waggin' Meals
 * Generates XML sitemap for search engines
 */

import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wagginmeals.com';

// Use anon key instead of service role key for sitemap generation
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages with priorities and change frequencies
  // Note: lastModified omitted for static pages to prevent unnecessary crawl signals
  const staticPages: MetadataRoute.Sitemap = [
    // Homepage - Highest priority
    {
      url: siteUrl,
      changeFrequency: 'daily',
      priority: 1.0,
    },

    // Main service pages - Very high priority
    {
      url: `${siteUrl}/nutrition-services`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/shop`,
      changeFrequency: 'daily',
      priority: 0.9,
    },

    // Important content pages - High priority
    {
      url: `${siteUrl}/blog`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/case-studies`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/testimonials`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    // Product categories and collections
    {
      url: `${siteUrl}/collections`,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/meal-toppers`,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/bundles`,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/smart-bundles`,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/recommended-products`,
      changeFrequency: 'weekly',
      priority: 0.7,
    },

    // Health condition pages
    {
      url: `${siteUrl}/digestive-health`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/food-sensitivities`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/kidney-health`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/weight-management`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    // Resource pages
    {
      url: `${siteUrl}/resources`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/faq`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/feeding-calculator`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/guides/fresh-food-guide`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },

    // About and company pages
    {
      url: `${siteUrl}/contact`,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/contact-expert`,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/ingredient-sourcing`,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/feeding-made-simple`,
      changeFrequency: 'yearly',
      priority: 0.5,
    },

    // Special programs
    {
      url: `${siteUrl}/monthly-wag-box`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/diagnostic`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/puppies`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/supplementation`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/boost-nutrition`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },

    // Partnership and events
    {
      url: `${siteUrl}/partnerships/twisted-laurel`,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${siteUrl}/events`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/market-brochure`,
      changeFrequency: 'yearly',
      priority: 0.4,
    },

    // Legal pages - Low priority but necessary
    {
      url: `${siteUrl}/privacy`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/shipping`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },

    // Auth pages - Low priority
    {
      url: `${siteUrl}/auth/login`,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${siteUrl}/auth/signup`,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  // Fetch dynamic blog posts
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('status', 'published')
    .order('updated_at', { ascending: false });

  const blogPages: MetadataRoute.Sitemap = (blogPosts || []).map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Fetch dynamic products
  const { data: products } = await supabase
    .from('products')
    .select('handle, updated_at')
    .eq('is_published', true)
    .order('updated_at', { ascending: false });

  const productPages: MetadataRoute.Sitemap = (products || []).map((product) => ({
    url: `${siteUrl}/products/${product.handle}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Fetch dynamic case studies
  const { data: caseStudies } = await supabase
    .from('case_studies')
    .select('slug, updated_at')
    .eq('is_published', true)
    .order('updated_at', { ascending: false});

  const caseStudyPages: MetadataRoute.Sitemap = (caseStudies || []).map((study) => ({
    url: `${siteUrl}/case-studies/${study.slug}`,
    lastModified: new Date(study.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Fetch dynamic collections
  const { data: collections } = await supabase
    .from('collections')
    .select('slug, updated_at')
    .eq('is_published', true)
    .order('updated_at', { ascending: false });

  const collectionPages: MetadataRoute.Sitemap = (collections || []).map((collection) => ({
    url: `${siteUrl}/collections/${collection.slug}`,
    lastModified: new Date(collection.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Combine all pages
  return [
    ...staticPages,
    ...blogPages,
    ...productPages,
    ...caseStudyPages,
    ...collectionPages,
  ];
}

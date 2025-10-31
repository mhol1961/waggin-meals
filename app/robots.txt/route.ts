/**
 * Robots.txt Route Handler
 * Tells search engine crawlers which pages can be crawled
 */

import { NextResponse } from 'next/server';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wagginmeals.com';
  
  const robotsTxt = `# Waggin' Meals - Robots.txt
# Allow all search engines to crawl the site

User-agent: *
Allow: /

# Disallow admin areas
Disallow: /admin
Disallow: /api/
Disallow: /checkout/confirmation

# Disallow test and development pages
Disallow: /test
Disallow: /hero-variations

# Sitemap location
Sitemap: ${siteUrl}/sitemap.xml

# Crawl-delay (optional - helps prevent server overload)
Crawl-delay: 1
`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
    },
  });
}

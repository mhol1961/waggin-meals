import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export async function GET() {
  const robotsTxt = `# Waggin Meals Pet Nutrition - Robots.txt
# Allow all search engines to crawl the site

User-agent: *
Allow: /

# Disallow admin and API routes
Disallow: /admin/
Disallow: /api/

# Disallow checkout pages (no need to index)
Disallow: /checkout/

# Disallow hero variations (test pages)
Disallow: /hero-variations/

# Allow important pages
Allow: /shop
Allow: /products
Allow: /blog
Allow: /case-studies
Allow: /nutrition-services
Allow: /about

# Sitemap location
Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://wagginmeals.com'}/sitemap.xml
`

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}

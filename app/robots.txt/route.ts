// app/robots.txt/route.ts
// Dynamic robots.txt generation for search engine crawlers

export async function GET() {
  const robotsTxt = `# Waggin Meals Pet Nutrition Co.
# Allow all search engines to crawl the site

User-agent: *
Allow: /

# Sitemap location
Sitemap: https://wagginmeals.com/sitemap.xml

# Disallow admin and internal pages
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /cart/

# Crawl-delay for aggressive bots
User-agent: *
Crawl-delay: 1
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400', // Cache for 1 day
    },
  });
}

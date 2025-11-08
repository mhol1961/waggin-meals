import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/customer/',
        '/account/',
        '/auth/',
        '/checkout/confirmation',
        '/test',
        '/hero-variations/',
        '/about2',
        '/about3',
        '/diagnostic',
        '/login',
        '/signup',
      ],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://wagginmeals.com'}/sitemap.xml`,
  }
}

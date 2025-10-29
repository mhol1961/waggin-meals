/**
 * SEO Metadata Utility
 * 
 * Provides consistent, optimized metadata across all pages
 */

import { Metadata } from 'next'

export interface PageMetadata {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
  noIndex?: boolean
  pathname?: string // Relative path like '/shop' or '/blog/post-slug'
}

const SITE_NAME = 'Waggin Meals'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wagginmeals.com'
const DEFAULT_OG_IMAGE = '/images/logo-waggin-meals.png'

/**
 * Generate complete metadata for a page
 */
export function generateMetadata(page: PageMetadata): Metadata {
  const fullTitle = page.title.includes(SITE_NAME)
    ? page.title
    : `${page.title} | ${SITE_NAME}`

  // Build absolute URLs for canonical and Open Graph
  const canonicalUrl = page.pathname
    ? `${SITE_URL}${page.pathname}`
    : SITE_URL

  // Ensure OG image is absolute
  const ogImageUrl = page.ogImage
    ? page.ogImage.startsWith('http') ? page.ogImage : `${SITE_URL}${page.ogImage}`
    : `${SITE_URL}${DEFAULT_OG_IMAGE}`

  const metadata: Metadata = {
    title: fullTitle,
    description: page.description,
    keywords: page.keywords,

    // Open Graph (Facebook, LinkedIn)
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: fullTitle,
      description: page.description,
      url: canonicalUrl,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: page.description,
      images: [ogImageUrl],
    },

    // Robots
    robots: page.noIndex ? {
      index: false,
      follow: false,
    } : {
      index: true,
      follow: true,
    },

    // Canonical URL
    alternates: {
      canonical: canonicalUrl,
    },
  }

  return metadata
}

/**
 * Common page metadata presets
 */
export const PageMetadataPresets = {
  home: {
    title: 'Fresh Dog Food & Canine Nutrition Expert | Waggin Meals',
    description: 'Master\'s-trained canine nutritionist offering fresh dog food, custom meal plans, and expert gut health consultations. Based in Asheville, NC. Healthy Gut = Clean Butt. Transform your dog\'s health with science-backed nutrition.',
    keywords: ['dog food', 'canine nutrition', 'fresh dog food', 'dog nutritionist', 'custom dog meals', 'Asheville dog food', 'pet nutrition consultant', 'dog gut health'],
    pathname: '/',
  },

  shop: {
    title: 'Shop Fresh Dog Food & Nutrition Products',
    description: 'Browse our selection of fresh dog food, meal toppers, supplements, and nutrition bundles. All products formulated by a master\'s-trained canine nutritionist specializing in gut health.',
    keywords: ['buy dog food', 'fresh dog food', 'dog supplements', 'meal toppers', 'nutrition bundles', 'gut health dog food'],
    pathname: '/shop',
  },

  nutritionServices: {
    title: 'Canine Nutrition Consultation Services',
    description: 'Expert nutrition consultations with a master\'s-trained canine nutritionist. Get custom meal plans, dietary analysis, and ongoing support for your dog\'s health. Specializing in gut health and digestive wellness.',
    keywords: ['dog nutrition consultation', 'canine nutritionist', 'custom dog meal plan', 'pet nutrition expert', 'dog diet consultation', 'dog gut health'],
    pathname: '/nutrition-services',
  },

  blog: {
    title: 'Dog Nutrition Blog - Expert Tips & Advice',
    description: 'Expert articles on canine nutrition, fresh feeding, health conditions, and science-backed pet care advice from a master\'s-trained nutritionist specializing in gut health.',
    keywords: ['dog nutrition blog', 'pet nutrition tips', 'canine health', 'dog feeding advice', 'dog gut health'],
    pathname: '/blog',
  },

  caseStudies: {
    title: 'Success Stories - Real Results from Custom Nutrition',
    description: 'Read real case studies showing how custom nutrition plans transformed dogs\' health. From digestive issues to weight management and more. Healthy Gut = Clean Butt.',
    keywords: ['dog nutrition success stories', 'pet health transformations', 'dog diet results'],
    pathname: '/case-studies',
  },

  about: {
    title: 'About Christie Webb - Master\'s-Trained Canine Nutritionist',
    description: 'Meet Christie Webb, our master\'s-trained canine nutritionist with dual master\'s degrees and years of experience helping dogs thrive through science-backed nutrition and gut health expertise.',
    keywords: ['Christie Webb canine nutritionist', 'master\'s trained dog nutritionist', 'pet nutrition expert', 'dog gut health specialist'],
    pathname: '/about',
  },
  
  contact: {
    title: 'Contact Us - Get Expert Nutrition Help',
    description: 'Contact Waggin Meals for nutrition consultations, product questions, or custom meal planning. Based in Asheville, NC with nationwide shipping. Master\'s-trained gut health specialist.',
    keywords: ['contact dog nutritionist', 'nutrition consultation', 'Asheville pet nutrition', 'dog gut health expert'],
    pathname: '/contact',
  },

  digestiveHealth: {
    title: 'Digestive Health Solutions for Dogs - Healthy Gut = Clean Butt',
    description: 'Science-backed nutrition strategies for dogs with digestive issues, sensitive stomachs, IBD, and GI problems. Expert guidance from a master\'s-trained nutritionist specializing in gut health.',
    keywords: ['dog digestive health', 'dog stomach issues', 'canine IBD', 'dog gut health', 'sensitive stomach dog food'],
    pathname: '/digestive-health',
  },

  kidneyHealth: {
    title: 'Kidney Health & Nutrition for Dogs',
    description: 'Specialized nutrition support for dogs with kidney disease. Learn about kidney-friendly diets and supplements from a master\'s-trained nutritionist.',
    keywords: ['dog kidney disease', 'kidney diet for dogs', 'renal support dog food', 'CKD dogs'],
    pathname: '/kidney-health',
  },

  weightManagement: {
    title: 'Weight Management & Healthy Weight for Dogs',
    description: 'Custom weight management plans for overweight and underweight dogs. Science-backed strategies for healthy, sustainable weight loss or gain from a gut health specialist.',
    keywords: ['dog weight loss', 'overweight dog', 'dog diet plan', 'healthy dog weight'],
    pathname: '/weight-management',
  },

  puppies: {
    title: 'Puppy Nutrition - Start Your Puppy Right',
    description: 'Expert puppy nutrition guidance for optimal growth and development. Learn what to feed, how much, and when from a master\'s-trained nutritionist. Build a healthy gut from day one.',
    keywords: ['puppy nutrition', 'puppy feeding guide', 'puppy food', 'puppy diet', 'puppy gut health'],
    pathname: '/puppies',
  },

  supplementation: {
    title: 'Dog Supplements & Nutritional Support',
    description: 'High-quality dog supplements for joint health, digestion, skin & coat, and overall wellness. Expert-selected and nutritionist-approved. Specializing in gut health support.',
    keywords: ['dog supplements', 'pet vitamins', 'joint supplements for dogs', 'probiotics for dogs', 'gut health supplements'],
    pathname: '/supplementation',
  },
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': `${SITE_URL}${item.url}`,
    })),
  }
}

/**
 * Generate product structured data
 */
export function generateProductSchema(product: {
  name: string
  description: string
  image: string
  price: number
  currency?: string
  availability?: string
  brand?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': product.name,
    'description': product.description,
    'image': `${SITE_URL}${product.image}`,
    'brand': {
      '@type': 'Brand',
      'name': product.brand || SITE_NAME,
    },
    'offers': {
      '@type': 'Offer',
      'price': product.price.toFixed(2),
      'priceCurrency': product.currency || 'USD',
      'availability': product.availability || 'https://schema.org/InStock',
    },
  }
}

/**
 * Generate article structured data
 */
export function generateArticleSchema(article: {
  title: string
  description: string
  image?: string
  datePublished: string
  dateModified?: string
  author?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': article.title,
    'description': article.description,
    'image': article.image ? `${SITE_URL}${article.image}` : undefined,
    'datePublished': article.datePublished,
    'dateModified': article.dateModified || article.datePublished,
    'author': {
      '@type': 'Person',
      'name': article.author || 'Christie Webb',
    },
    'publisher': {
      '@type': 'Organization',
      'name': SITE_NAME,
      'logo': {
        '@type': 'ImageObject',
        'url': `${SITE_URL}${DEFAULT_OG_IMAGE}`,
      },
    },
  }
}

/**
 * Generate FAQ structured data
 */
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  }
}

/**
 * Generate local business structured data
 */
export function generateLocalBusinessSchema() {
  // Get social URLs from environment or use defaults
  const socialUrls = []
  if (process.env.NEXT_PUBLIC_FACEBOOK_URL) {
    socialUrls.push(process.env.NEXT_PUBLIC_FACEBOOK_URL)
  }
  if (process.env.NEXT_PUBLIC_INSTAGRAM_URL) {
    socialUrls.push(process.env.NEXT_PUBLIC_INSTAGRAM_URL)
  }
  if (process.env.NEXT_PUBLIC_LINKEDIN_URL) {
    socialUrls.push(process.env.NEXT_PUBLIC_LINKEDIN_URL)
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': SITE_URL,
    'name': SITE_NAME,
    'description': 'Master\'s-trained canine nutritionist specializing in gut health. Fresh dog food, custom meal plans, and expert nutrition consultations. Healthy Gut = Clean Butt.',
    'url': SITE_URL,
    'telephone': process.env.NEXT_PUBLIC_PHONE || '',
    'email': process.env.NEXT_PUBLIC_EMAIL || 'info@wagginmeals.com',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': process.env.NEXT_PUBLIC_ADDRESS || '',
      'addressLocality': 'Asheville',
      'addressRegion': 'NC',
      'postalCode': process.env.NEXT_PUBLIC_ZIP || '',
      'addressCountry': 'US',
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': process.env.NEXT_PUBLIC_LATITUDE || '35.5951',
      'longitude': process.env.NEXT_PUBLIC_LONGITUDE || '-82.5515',
    },
    'openingHoursSpecification': [
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        'opens': '09:00',
        'closes': '17:00',
      },
    ],
    'priceRange': '$$',
    'image': `${SITE_URL}${DEFAULT_OG_IMAGE}`,
    'logo': `${SITE_URL}${DEFAULT_OG_IMAGE}`,
    'sameAs': socialUrls.length > 0 ? socialUrls : undefined,
  }
}

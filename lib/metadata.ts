/**
 * Metadata Utility for SEO
 * Generates consistent metadata across all pages
 */

import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wagginmeals.com';
const siteName = "Waggin' Meals";
const siteDescription = "Premium fresh dog food and expert canine nutrition services by board-certified nutritionist Christie Naquin. Transform your dog's health with personalized meal plans and fresh, locally-sourced ingredients.";

export interface MetadataOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noIndex?: boolean;
}

/**
 * Generate complete metadata for a page
 */
export function generateMetadata(options: MetadataOptions = {}): Metadata {
  const {
    title,
    description = siteDescription,
    keywords = [],
    image = '/images/logo-waggin-meals.png',
    url = siteUrl,
    type = 'website',
    publishedTime,
    modifiedTime,
    author = 'Christie Naquin, Board-Certified Canine Nutritionist',
    noIndex = false,
  } = options;

  // Build full title
  const fullTitle = title ? `${title} | ${siteName}` : siteName;

  // Build canonical URL
  const canonicalUrl = url.startsWith('http') ? url : `${siteUrl}${url}`;

  // Build full image URL
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

  // Default keywords
  const defaultKeywords = [
    'fresh dog food',
    'canine nutrition',
    'pet nutrition',
    'dog nutritionist',
    'fresh pet food',
    'dog meal plans',
    'custom dog food',
    'Christie Naquin',
  ];

  const allKeywords = [...new Set([...keywords, ...defaultKeywords])];

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: allKeywords,
    authors: [{ name: author }],
    creator: siteName,
    publisher: siteName,
    metadataBase: new URL(siteUrl),
    
    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title || siteName,
        },
      ],
      locale: 'en_US',
      type: type === 'product' ? 'website' : type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },

    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
      creator: '@wagginmeals', // Update if Twitter handle exists
    },

    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    verification: {
      // Add Google Search Console verification if available
      // google: 'your-google-verification-code',
    },
  };

  return metadata;
}

/**
 * Generate metadata for product pages
 */
export function generateProductMetadata(product: {
  title: string;
  description: string;
  price: number;
  image?: string;
  handle: string;
}): Metadata {
  return generateMetadata({
    title: product.title,
    description: product.description.substring(0, 160),
    keywords: [
      product.title.toLowerCase(),
      'fresh dog food',
      'premium pet food',
      'dog nutrition',
    ],
    image: product.image || '/images/logo-waggin-meals.png',
    url: `/products/${product.handle}`,
    type: 'product',
  });
}

/**
 * Generate metadata for blog posts
 */
export function generateBlogMetadata(post: {
  title: string;
  excerpt: string;
  image?: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
}): Metadata {
  return generateMetadata({
    title: post.title,
    description: post.excerpt.substring(0, 160),
    keywords: [
      'dog nutrition tips',
      'pet health',
      'canine wellness',
      'dog care',
    ],
    image: post.image || '/images/logo-waggin-meals.png',
    url: `/blog/${post.slug}`,
    type: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt || post.publishedAt,
    author: post.author || 'Christie Naquin, Board-Certified Canine Nutritionist',
  });
}

/**
 * Generate metadata for case studies
 */
export function generateCaseStudyMetadata(study: {
  title: string;
  summary: string;
  image?: string;
  slug: string;
  dogName: string;
}): Metadata {
  return generateMetadata({
    title: `${study.dogName}'s Success Story: ${study.title}`,
    description: study.summary.substring(0, 160),
    keywords: [
      'dog transformation',
      'pet success story',
      'dog health improvement',
      'nutrition results',
    ],
    image: study.image || '/images/logo-waggin-meals.png',
    url: `/case-studies/${study.slug}`,
    type: 'article',
  });
}

/**
 * Generate local business structured data (JSON-LD)
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'PetStore', 'FoodEstablishment'],
    name: siteName,
    description: siteDescription,
    image: `${siteUrl}/images/logo-waggin-meals.png`,
    '@id': siteUrl,
    url: siteUrl,
    telephone: '+1-828-WAGGIN1', // Contact via website form
    email: 'info@wagginmeals.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Asheville',
      addressRegion: 'NC',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 35.5951,
      longitude: -82.5515,
    },
    areaServed: {
      '@type': 'State',
      name: 'North Carolina',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00',
      },
    ],
    servesCuisine: 'Pet Food',
    paymentAccepted: 'Cash, Credit Card, Debit Card',
    priceRange: '$$-$$$',
    founder: {
      '@type': 'Person',
      name: 'Christie Naquin',
      jobTitle: 'Board-Certified Canine Nutritionist',
      description: "Master's-trained Integrative Animal Nutritionist specializing in canine gut health",
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Pet Nutrition Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Fresh Dog Food',
            description: 'Human-grade, gently cooked fresh dog food',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Nutrition Consultation',
            description: 'Custom meal plans and nutrition guidance',
            price: '395.00',
            priceCurrency: 'USD',
          },
        },
      ],
    },
    knowsAbout: [
      'Canine Nutrition',
      'Dog Gut Health',
      'Fresh Dog Food',
      'Pet Nutrition Consultation',
      'Custom Meal Plans',
      'Integrative Animal Nutrition',
    ],
  };
}

/**
 * Generate organization structured data (JSON-LD)
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/images/logo-waggin-meals.png`,
    description: siteDescription,
    founder: {
      '@type': 'Person',
      name: 'Christie Naquin',
      jobTitle: 'Board-Certified Canine Nutritionist',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'info@wagginmeals.com',
      availableLanguage: 'English',
    },
  };
}

/**
 * Generate product structured data (JSON-LD)
 * Enhanced to support variants and detailed product information
 */
export function generateProductSchema(product: any, variants: any[] = []) {
  const hasVariants = variants && variants.length > 0;

  // Base product images
  const images = product.images && product.images.length > 0
    ? product.images.map((img: string) =>
        img.startsWith('http') ? img : `${siteUrl}${img}`
      )
    : [`${siteUrl}/images/logo-waggin-meals.png`];

  // Determine availability
  const availability = product.in_stock
    ? 'https://schema.org/InStock'
    : 'https://schema.org/OutOfStock';

  // Build offers - either single or multiple (for variants)
  let offers;
  if (hasVariants) {
    // Multiple offers for variants
    offers = variants.map((variant: any) => ({
      '@type': 'Offer',
      name: variant.title,
      price: variant.price.toFixed(2),
      priceCurrency: 'USD',
      availability: variant.is_available && variant.inventory_quantity > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${siteUrl}/products/${product.handle}`,
      sku: variant.sku || undefined,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    }));
  } else {
    // Single offer
    offers = {
      '@type': 'Offer',
      price: product.price.toFixed(2),
      priceCurrency: 'USD',
      availability,
      url: `${siteUrl}/products/${product.handle}`,
      sku: product.sku || undefined,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description || `Premium fresh dog food: ${product.title}`,
    image: images,
    sku: product.sku || undefined,
    brand: {
      '@type': 'Brand',
      name: siteName,
    },
    offers: hasVariants ? offers : offers,
    // Add aggregate rating if available (future enhancement)
    // aggregateRating: {
    //   '@type': 'AggregateRating',
    //   ratingValue: '4.8',
    //   reviewCount: '24',
    // },
  };
}

/**
 * Generate breadcrumb structured data (JSON-LD)
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
    })),
  };
}

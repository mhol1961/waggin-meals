import type { Metadata } from 'next';
import { Abril_Fatface, Poppins } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

const abrilFatface = Abril_Fatface({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-abril-fatface',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Waggin Meals Pet Nutrition Co. | Fresh Dog Food & Canine Nutrition',
  description: 'High-Grade & Freshly Cooked Dog Food - Small Batch Kitchen - Canine Nutritionist. Scientifically formulated by an Integrative Animal Nutritionist.',
  keywords: ['dog food', 'fresh dog food', 'canine nutrition', 'pet nutritionist', 'dog meals', 'healthy dog food', 'custom dog food', 'subscription dog food'],
  authors: [{ name: 'Christie Willett, M.A., M.S.' }],
  creator: 'Waggin Meals Pet Nutrition Co.',
  publisher: 'Waggin Meals Pet Nutrition Co.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://wagginmeals.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Waggin Meals Pet Nutrition Co. | Fresh Dog Food & Canine Nutrition',
    description: 'High-Grade & Freshly Cooked Dog Food - Small Batch Kitchen - Canine Nutritionist. Scientifically formulated by an Integrative Animal Nutritionist.',
    siteName: 'Waggin Meals Pet Nutrition Co.',
    images: [
      {
        url: '/images/beef-sweet-potato-bowl.jpg',
        width: 1200,
        height: 630,
        alt: 'Fresh dog food from Waggin Meals',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Waggin Meals Pet Nutrition Co. | Fresh Dog Food',
    description: 'High-Grade & Freshly Cooked Dog Food - Small Batch Kitchen - Canine Nutritionist',
    images: ['/images/beef-sweet-potato-bowl.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD structured data for local business
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "PetStore",
    "name": "Waggin Meals Pet Nutrition Co.",
    "description": "High-Grade & Freshly Cooked Dog Food - Small Batch Kitchen - Canine Nutritionist",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://wagginmeals.com",
    "logo": `${process.env.NEXT_PUBLIC_SITE_URL || "https://wagginmeals.com"}/images/logo-waggin-meals.png`,
    "image": `${process.env.NEXT_PUBLIC_SITE_URL || "https://wagginmeals.com"}/images/beef-sweet-potato-bowl.jpg`,
    "founder": {
      "@type": "Person",
      "name": "Christie Willett",
      "jobTitle": "Canine Integrative Animal Nutritionist",
      "hasCredential": [
        {
          "@type": "EducationalOccupationalCredential",
          "credentialCategory": "degree",
          "name": "Master of Arts"
        },
        {
          "@type": "EducationalOccupationalCredential",
          "credentialCategory": "degree",
          "name": "Master of Science"
        }
      ]
    },
    "priceRange": "$$",
    "servesCuisine": "Pet Food",
    "slogan": "High-Grade & Freshly Cooked Dog Food",
    "areaServed": "United States"
  };

  return (
    <html lang="en">
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Google Analytics 4 - TODO: Add your GA4 Measurement ID in .env.local */}
        {/* NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className={`${abrilFatface.variable} ${poppins.variable} antialiased`}>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}

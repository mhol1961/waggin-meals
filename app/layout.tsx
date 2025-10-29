import type { Metadata } from 'next';
import { Abril_Fatface, Poppins } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { CartProvider } from '@/contexts/cart-context';
import { AuthProvider } from '@/contexts/auth-context';
import CartDrawer from '@/components/cart-drawer';
import { generateLocalBusinessSchema } from '@/lib/metadata';

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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wagginmeals.com';

export const metadata: Metadata = {
  title: {
    default: 'Fresh Dog Food & Canine Nutrition Expert | Waggin Meals',
    template: '%s | Waggin Meals',
  },
  description: 'Master\'s-trained canine nutritionist specializing in gut health. Fresh dog food, custom meal plans, and expert nutrition consultations. Based in Asheville, NC. Healthy Gut = Clean Butt. Transform your dog\'s health with science-backed nutrition.',
  keywords: ['dog food', 'canine nutrition', 'fresh dog food', 'dog nutritionist', 'custom dog meals', 'Asheville dog food', 'pet nutrition consultant', 'dog gut health', 'master\'s trained nutritionist'],
  authors: [{ name: 'Christie Webb' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Waggin Meals',
    title: 'Fresh Dog Food & Canine Nutrition Expert | Waggin Meals',
    description: 'Master\'s-trained canine nutritionist specializing in gut health. Fresh dog food, custom meal plans, and expert nutrition consultations. Healthy Gut = Clean Butt.',
    images: [
      {
        url: `${SITE_URL}/images/logo-waggin-meals.png`,
        width: 1200,
        height: 630,
        alt: 'Waggin Meals Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fresh Dog Food & Canine Nutrition Expert | Waggin Meals',
    description: 'Master\'s-trained canine nutritionist specializing in gut health. Fresh dog food, custom meal plans, and expert nutrition consultations. Healthy Gut = Clean Butt.',
    images: [`${SITE_URL}/images/logo-waggin-meals.png`],
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
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <html lang="en">
      <head>
        {/* LocalBusiness Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
      </head>
      <body className={`${abrilFatface.variable} ${poppins.variable} antialiased`}>
        <AuthProvider>
          <CartProvider>
            <Navigation />
            {children}
            <Footer />
            <CartDrawer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

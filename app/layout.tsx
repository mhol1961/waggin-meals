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
  title: 'Waggin Meals Pet Nutrition Co.',
  description: 'High-Grade & Freshly Cooked Dog Food - Small Batch Kitchen - Canine Nutritionist. Scientifically formulated by an Integrative Animal Nutritionist.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${abrilFatface.variable} ${poppins.variable} antialiased`}>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Market Brochure | Waggin Meals',
  description: 'Downloadable market brochure featuring our premium dog nutrition bundles, meal options, and feeding guide. Perfect for sharing our fresh food menu.',
  keywords: 'dog food menu, pet nutrition brochure, feeding guide, meal options',
};

export default function MarketBrochureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premium Bundle Packages | Waggin Meals',
  description: 'Save big with our premium nutrition bundles. Choose from Smart Pup Starter Pack, Standard Pup Pack, Premium Pup Pack, or Waggin Meals Club Box. Fresh dog food bundles with customizable options and subscription savings.',
  keywords: 'dog food bundles, pet nutrition packages, fresh dog food subscription, meal bundles, dog food deals',
};

export default function BundlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

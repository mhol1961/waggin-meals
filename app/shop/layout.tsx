import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Premium Dog Food & Nutrition | Waggin Meals',
  description: 'Shop fresh dog food, meal toppers, supplements, and nutrition products. Expert-formulated recipes for your dog\'s health.',
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}

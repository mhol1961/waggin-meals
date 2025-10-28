import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Product Collections | Waggin Meals',
  description: 'Browse our curated collections of premium dog nutrition products',
};

export default function CollectionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Collection | Waggin Meals',
  description: 'Browse our curated collection of premium dog nutrition products',
};

export default function CollectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}

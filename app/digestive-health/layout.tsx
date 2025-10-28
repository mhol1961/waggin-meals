import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Digestive Health for Dogs | Waggin Meals',
  description: 'Expert guidance on canine digestive health, gut microbiome, and nutrition solutions',
};

export default function DigestiveHealthLayout({ children }: { children: React.ReactNode }) {
  return children;
}

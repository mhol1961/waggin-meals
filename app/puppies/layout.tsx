import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Puppy Nutrition | Waggin Meals',
  description: 'Expert puppy nutrition guidance for healthy growth and development',
};

export default function PuppiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}

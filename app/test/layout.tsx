import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Test Page | Waggin Meals',
  description: 'Test page for development',
};

export default function TestLayout({ children }: { children: React.ReactNode }) {
  return children;
}

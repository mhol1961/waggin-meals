import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Case Study | Waggin Meals',
  description: 'Real success stories from our canine nutrition clients',
};

export default function CaseStudyLayout({ children }: { children: React.ReactNode }) {
  return children;
}

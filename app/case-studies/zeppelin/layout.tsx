import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zeppelin\'s Success Story | Waggin Meals Case Studies',
  description: 'How personalized canine nutrition transformed Zeppelin\'s health and wellbeing',
};

export default function ZeppelinCaseStudyLayout({ children }: { children: React.ReactNode }) {
  return children;
}

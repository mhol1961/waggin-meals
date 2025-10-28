import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Our Expert | Waggin Meals',
  description: 'Schedule a consultation with board-certified canine nutritionist Christie Naquin',
};

export default function ContactExpertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Waggin Meals | Board-Certified Canine Nutritionist',
  description: 'Meet Christie Naquin, board-certified canine nutritionist and founder of Waggin Meals. Expert dog nutrition consultations and premium fresh food.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}

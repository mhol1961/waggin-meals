import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Feeding Calculator | Waggin Meals',
  description: 'Calculate the perfect portion sizes for your dog based on weight, activity level, and nutritional needs',
};

export default function FeedingCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

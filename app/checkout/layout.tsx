import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout | Waggin Meals',
  description: 'Complete your order for premium dog nutrition products',
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

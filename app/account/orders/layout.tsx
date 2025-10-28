import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Orders | Waggin Meals',
  description: 'View your order history and track shipments',
};

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return children;
}

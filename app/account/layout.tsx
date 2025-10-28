import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Account | Waggin Meals',
  description: 'Manage your Waggin Meals account, orders, and subscriptions',
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}

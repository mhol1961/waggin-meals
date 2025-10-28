import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile | Waggin Meals',
  description: 'Manage your account profile and preferences',
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}

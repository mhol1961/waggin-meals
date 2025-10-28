import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Event | Admin',
  description: 'Edit event',
};

export default function AdminEventEditLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Waggin Meals',
  description: 'Waggin Meals privacy policy and data protection information',
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | Waggin Meals',
  description: 'Login to your Waggin Meals account',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}

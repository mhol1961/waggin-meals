import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Monthly Wag Box | Waggin Meals Rewards',
  description: 'Join Waggin Rewards and get exclusive monthly surprises for your pup',
};

export default function MonthlyWagBoxLayout({ children }: { children: React.ReactNode }) {
  return children;
}

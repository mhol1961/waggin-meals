import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events | Waggin Meals',
  description: 'Upcoming dog nutrition events, workshops, and educational sessions',
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

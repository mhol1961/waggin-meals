import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events & Workshops | Waggin Meals Pet Nutrition',
  description: 'Join Christie Naquin for pet nutrition workshops, farmers market appearances, and educational events in Asheville, NC. Learn about fresh food feeding for dogs.',
  keywords: 'dog nutrition events Asheville NC, pet nutrition workshops, farmers market pet food, dog health seminars, fresh dog food events',
  openGraph: {
    title: 'Nutrition Events & Workshops | Waggin Meals',
    description: 'Meet Christie at local markets and workshops. Learn about fresh food nutrition for your dog.',
    type: 'website',
    url: 'https://wagginmeals.com/events',
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

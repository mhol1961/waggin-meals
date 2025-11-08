import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Testimonials | Waggin Meals Pet Nutrition',
  description: 'Read success stories from pet owners whose dogs transformed with Christie\'s fresh food nutrition plans. Real results from real clients in Asheville, NC and beyond.',
  keywords: 'dog nutrition testimonials, pet nutrition success stories, fresh dog food reviews, Asheville NC dog nutritionist reviews, canine nutrition results',
  openGraph: {
    title: 'Client Success Stories | Waggin Meals',
    description: 'See how fresh, customized nutrition transformed dogs\' lives. Weight loss, digestive health, allergies, and more.',
    type: 'website',
    url: 'https://wagginmeals.com/testimonials',
  },
};

export default function TestimonialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

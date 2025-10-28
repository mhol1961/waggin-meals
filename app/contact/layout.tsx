import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Waggin Meals',
  description: 'Get in touch with Waggin Meals. We\'re here to help with your dog nutrition questions.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

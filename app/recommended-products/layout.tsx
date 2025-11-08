import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recommended Products | Waggin Meals Pet Nutrition',
  description: 'Christie\'s curated list of dog nutrition products, supplements, and feeding tools. Expert-recommended products to support your dog\'s fresh food journey.',
  keywords: 'dog nutrition products, pet supplements, fresh dog food accessories, dog feeding tools, canine nutritionist recommendations',
  openGraph: {
    title: 'Expert-Recommended Dog Nutrition Products | Waggin Meals',
    description: 'Carefully selected products to complement your dog\'s fresh food diet. From supplements to feeding tools.',
    type: 'website',
    url: 'https://wagginmeals.com/recommended-products',
  },
};

export default function RecommendedProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

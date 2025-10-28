import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nutrition Consultation Services | Waggin Meals',
  description: 'Professional dog nutrition consultations with board-certified canine nutritionist Christie Naquin. Custom meal plans and expert guidance.',
};

export default function NutritionServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

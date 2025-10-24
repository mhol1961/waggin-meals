import { Leaf, Heart, CheckCircle } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: 'Fresh & Sustainably Sourced',
    description:
      'Locally sourced ingredients from our farm partners in the Blue Ridge Mountains. Free shipping for orders over $100.00 - we even offer next-day service!',
  },
  {
    icon: Heart,
    title: 'Nutritionist Formulated, Handcrafted',
    description:
      "Created by an Animal Nutritionist (with 2 Master's degrees and pursuing a PhD in Animal Nutrition). We offer a specialized nutrition, bite sizes, and do not mass-produce.",
  },
  {
    icon: CheckCircle,
    title: 'Whole Food Ingredients',
    description:
      'Our meals support overall health, boost immunity, and help your dog thrive from the inside out. Gently cooked in small batches to preserve nutritional value.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-text-heading">
            Doggy Farm Kitchens weren't a thing—until now!
          </h2>
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bg-light-blue">
                    <Icon className="h-8 w-8 text-primary-blue" />
                  </div>
                </div>
                <h3 className="mb-4 text-xl font-bold text-text-heading">
                  {feature.title}
                </h3>
                <p className="text-text-body leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

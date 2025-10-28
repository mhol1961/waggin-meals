export interface Bundle {
  id: string;
  name: string;
  slug: string;
  description: string;
  tagline: string;
  basePrice: number;
  savingsAmount: number;
  isBestValue: boolean;
  isFeatured: boolean;
  badgeText?: string;
  imageUrl: string;
  includedItems: BundleItem[];
  customizable: boolean;
  subscriptionOptions: string[];
  features: string[];
  shipping: string;
}

export interface BundleItem {
  category: 'meal' | 'topper' | 'broth' | 'supplement';
  quantity: number;
  description: string;
  isRequired: boolean;
  options?: string[]; // For customizable items
}

export const bundles: Bundle[] = [
  {
    id: 'smart-pup-starter',
    name: 'Smart Pup Starter Pack',
    slug: 'smart-pup-starter',
    tagline: 'Perfect for trying fresh food',
    description: 'Everything you need to start your dog\'s fresh food journey. Includes 2 meals, bone broth, and a fresh topper.',
    basePrice: 71.98,
    savingsAmount: 8.00,
    isBestValue: false,
    isFeatured: false,
    badgeText: 'Great Start',
    imageUrl: '/images/bundles/smart-pup-starter.jpg',
    customizable: true,
    subscriptionOptions: ['one-time', 'weekly', 'biweekly', 'monthly', '4-weeks', '6-weeks', '8-weeks'],
    features: [
      '2 Meal Packs (your choice)',
      '1 Bone & Veggie Broth',
      '1 Fresh Topper',
      'Save $8.00',
      'Shipping Included (+$1 per Beef Meal)',
    ],
    shipping: 'Included (+$1 per Beef Meal)',
    includedItems: [
      {
        category: 'meal',
        quantity: 2,
        description: 'Choose any 2 meal varieties',
        isRequired: true,
        options: ['Chicken & Rice', 'Chicken & Sweet Potato', 'Turkey & Rice', 'Turkey & Sweet Potato', 'Beef & Rice', 'Beef & Sweet Potato'],
      },
      {
        category: 'broth',
        quantity: 1,
        description: 'Bone & Veggie Broth',
        isRequired: true,
      },
      {
        category: 'topper',
        quantity: 1,
        description: 'Choose 1 fresh topper',
        isRequired: true,
        options: ['Chicken Superfood Cakes', 'Pup-a-Loaf', 'Hand-Rolled Beef Meatballs'],
      },
    ],
  },
  {
    id: 'standard-pup-pack',
    name: 'Standard Pup Pack',
    slug: 'standard-pup-pack',
    tagline: 'Most popular choice',
    description: 'Our most popular bundle for dogs who love variety. Includes 6 meals, bone broth, and a fresh topper.',
    basePrice: 146.99,
    savingsAmount: 17.00,
    isBestValue: false,
    isFeatured: true,
    badgeText: 'Most Popular',
    imageUrl: '/images/bundles/standard-pup-pack.jpg',
    customizable: true,
    subscriptionOptions: ['one-time', 'weekly', 'biweekly', 'monthly', '4-weeks', '6-weeks', '8-weeks'],
    features: [
      '6 Meal Packs (your choice)',
      '1 Bone & Veggie Broth',
      '1 Fresh Topper',
      'Save $17.00',
      'Shipping Included (+$1 per Beef Meal)',
    ],
    shipping: 'Included (+$1 per Beef Meal)',
    includedItems: [
      {
        category: 'meal',
        quantity: 6,
        description: 'Choose any 6 meal varieties',
        isRequired: true,
        options: ['Chicken & Rice', 'Chicken & Sweet Potato', 'Turkey & Rice', 'Turkey & Sweet Potato', 'Beef & Rice', 'Beef & Sweet Potato'],
      },
      {
        category: 'broth',
        quantity: 1,
        description: 'Bone & Veggie Broth',
        isRequired: true,
      },
      {
        category: 'topper',
        quantity: 1,
        description: 'Choose 1 fresh topper',
        isRequired: true,
        options: ['Chicken Superfood Cakes', 'Pup-a-Loaf', 'Hand-Rolled Beef Meatballs'],
      },
    ],
  },
  {
    id: 'premium-pup-pack',
    name: 'Premium Pup Pack',
    slug: 'premium-pup-pack',
    tagline: 'Best value for fresh feeding',
    description: 'Our best value bundle! Includes 10 meals and 2 bone broths - perfect for consistent fresh feeding.',
    basePrice: 169.99,
    savingsAmount: 19.00,
    isBestValue: true,
    isFeatured: true,
    badgeText: 'Best Value',
    imageUrl: '/images/bundles/premium-pup-pack.jpg',
    customizable: true,
    subscriptionOptions: ['one-time', 'weekly', 'biweekly', 'monthly', '4-weeks', '6-weeks', '8-weeks'],
    features: [
      '10 Meal Packs (your choice)',
      '2 Bone & Veggie Broths',
      'Save $19.00',
      'Shipping Included (+$1 per Beef Meal)',
      'Best Price Per Meal',
    ],
    shipping: 'Included (+$1 per Beef Meal)',
    includedItems: [
      {
        category: 'meal',
        quantity: 10,
        description: 'Choose any 10 meal varieties',
        isRequired: true,
        options: ['Chicken & Rice', 'Chicken & Sweet Potato', 'Turkey & Rice', 'Turkey & Sweet Potato', 'Beef & Rice', 'Beef & Sweet Potato'],
      },
      {
        category: 'broth',
        quantity: 2,
        description: 'Bone & Veggie Broth',
        isRequired: true,
      },
    ],
  },
  {
    id: 'waggin-meals-club-box',
    name: 'Waggin Meals Club Box',
    slug: 'waggin-meals-club-box',
    tagline: 'Tail-waggin\' surprises every month',
    description: 'A curated box of goodies for your pup! Get 3 tail-waggin\' items plus a special surprise every delivery.',
    basePrice: 49.99,
    savingsAmount: 0,
    isBestValue: false,
    isFeatured: true,
    badgeText: 'Subscription Only',
    imageUrl: '/images/bundles/waggin-meals-club-box.jpg',
    customizable: false,
    subscriptionOptions: ['4-weeks', '6-weeks', '8-weeks'],
    features: [
      '3 Curated Items',
      'Special Surprise Gift',
      'Recurring Delivery',
      'Flexible Schedule (4, 6, or 8 weeks)',
      'Cancel Anytime',
    ],
    shipping: 'Included',
    includedItems: [
      {
        category: 'supplement',
        quantity: 3,
        description: 'Curated items (varies each box)',
        isRequired: true,
      },
      {
        category: 'supplement',
        quantity: 1,
        description: 'Surprise gift',
        isRequired: true,
      },
    ],
  },
];

export function getBundleBySlug(slug: string): Bundle | undefined {
  return bundles.find(bundle => bundle.slug === slug);
}

export function getFeaturedBundles(): Bundle[] {
  return bundles.filter(bundle => bundle.isFeatured);
}

export function getBestValueBundle(): Bundle | undefined {
  return bundles.find(bundle => bundle.isBestValue);
}

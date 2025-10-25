// Collections/Categories for organizing products

export interface Collection {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  type: 'protein' | 'meal-type' | 'health-goal' | 'diet-type';
  productIds: string[]; // IDs of products in this collection
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export const collections: Collection[] = [
  // By Protein
  {
    id: 'chicken-meals',
    slug: 'chicken-meals',
    title: 'Chicken Meals',
    description: 'Fresh, human-grade chicken meals packed with protein and essential nutrients. Perfect for dogs who love poultry!',
    image: '/images/2025/07/Chicken-Superfood-Cake-Board-scaled.jpg',
    type: 'protein',
    productIds: ['chicken-sweet-potato'], // Add more product IDs as they're created
    featured: true,
    seoTitle: 'Fresh Chicken Dog Food | Human-Grade Chicken Meals for Dogs',
    seoDescription: 'Premium fresh chicken meals for dogs. Human-grade ingredients, locally sourced, nutritionally balanced. Perfect for dogs of all ages and breeds.',
  },
  {
    id: 'beef-meals',
    slug: 'beef-meals',
    title: 'Beef Meals',
    description: 'Rich, savory beef meals with wholesome vegetables. High-quality protein your dog will love.',
    image: '/images/2025/07/Beef-and-Sweet-Potato-Bowl-scaled.jpg',
    type: 'protein',
    productIds: [], // Add beef product IDs
    featured: true,
    seoTitle: 'Fresh Beef Dog Food | Human-Grade Beef Meals for Dogs',
    seoDescription: 'Premium fresh beef meals for dogs. Grass-fed beef, organic vegetables, nutritionally complete. Made fresh in small batches.',
  },
  {
    id: 'turkey-meals',
    slug: 'turkey-meals',
    title: 'Turkey Meals',
    description: 'Lean turkey protein with nutrient-rich vegetables. Great for dogs with sensitivities.',
    image: '/images/2025/07/Chicken-Superfood-Cake-Board-scaled.jpg',
    type: 'protein',
    productIds: [],
    seoTitle: 'Fresh Turkey Dog Food | Lean Turkey Meals for Dogs',
    seoDescription: 'Lean turkey meals perfect for dogs with food sensitivities. Human-grade ingredients, easy to digest, nutritionally balanced.',
  },
  {
    id: 'variety-packs',
    slug: 'variety-packs',
    title: 'Variety Packs',
    description: 'Mix of proteins to keep mealtime exciting. Perfect for picky eaters or dogs who love variety!',
    image: '/images/2025/07/Chicken-Superfood-Cake-Board-scaled.jpg',
    type: 'protein',
    productIds: [],
    seoTitle: 'Variety Dog Food Packs | Mixed Protein Meals for Dogs',
    seoDescription: 'Keep your dog excited about mealtime! Variety packs with multiple protein sources. Fresh, human-grade, rotating proteins.',
  },

  // By Meal Type
  {
    id: 'complete-meals',
    slug: 'complete-meals',
    title: 'Complete Fresh Meals',
    description: 'Nutritionally complete meals that provide everything your dog needs. Feed as their primary diet.',
    image: '/images/2025/07/Beef-and-Sweet-Potato-Bowl-scaled.jpg',
    type: 'meal-type',
    productIds: ['chicken-sweet-potato'],
    featured: true,
    seoTitle: 'Complete Fresh Dog Food Meals | Nutritionally Balanced Dog Food',
    seoDescription: 'Complete fresh dog meals with all essential nutrients. AAFCO-approved formulations. Feed as a complete diet or meal replacement.',
  },
  {
    id: 'meal-toppers',
    slug: 'meal-toppers',
    title: 'Meal Toppers',
    description: 'Nutrient-dense toppers to enhance your dog\'s kibble. Add fresh food nutrition to any diet.',
    image: '/images/2025/07/Chicken-Superfood-Cake-Board-scaled.jpg',
    type: 'meal-type',
    productIds: [],
    seoTitle: 'Dog Food Meal Toppers | Fresh Food Kibble Toppers',
    seoDescription: 'Boost your dog\'s kibble with fresh meal toppers. Add nutrition, flavor, and variety to any diet. Human-grade ingredients.',
  },
  {
    id: 'supplements-boosts',
    slug: 'supplements-boosts',
    title: 'Supplements & Boosts',
    description: 'Targeted nutrition boosts for specific health needs. Support joint health, digestion, skin & coat.',
    image: '/images/2025/09/Canine-Nutrtion-Services.webp',
    type: 'meal-type',
    productIds: [],
    seoTitle: 'Dog Nutrition Supplements | Health Boosts for Dogs',
    seoDescription: 'Premium supplements and nutrition boosts for dogs. Support joint health, digestion, immunity, and more. Expert-formulated.',
  },

  // By Health Goal
  {
    id: 'digestive-health',
    slug: 'digestive-health',
    title: 'Digestive Health',
    description: 'Easy-to-digest meals for sensitive stomachs. Supports healthy digestion and gut health.',
    image: '/images/2025/07/Beef-and-Sweet-Potato-Bowl-scaled.jpg',
    type: 'health-goal',
    productIds: ['chicken-sweet-potato'], // Sweet potatoes are great for digestion
    featured: true,
    seoTitle: 'Dog Food for Digestive Health | Sensitive Stomach Dog Food',
    seoDescription: 'Fresh dog food for digestive health. Easy to digest, supports gut health, perfect for sensitive stomachs. Vet-approved formulations.',
  },
  {
    id: 'joint-mobility',
    slug: 'joint-mobility',
    title: 'Joint & Mobility Support',
    description: 'Meals enriched with ingredients that support healthy joints and mobility. Great for active and senior dogs.',
    image: '/images/2025/07/Chicken-Superfood-Cake-Board-scaled.jpg',
    type: 'health-goal',
    productIds: [],
    seoTitle: 'Dog Food for Joint Health | Mobility Support for Dogs',
    seoDescription: 'Fresh dog meals with joint-supporting ingredients. Glucosamine, omega-3s, anti-inflammatory foods. Perfect for active and senior dogs.',
  },
  {
    id: 'skin-coat',
    slug: 'skin-coat',
    title: 'Skin & Coat Health',
    description: 'Omega-rich meals for a shiny coat and healthy skin. Address dryness, itching, and dullness.',
    image: '/images/2025/07/Chicken-Superfood-Cake-Board-scaled.jpg',
    type: 'health-goal',
    productIds: [],
    seoTitle: 'Dog Food for Skin and Coat | Healthy Coat Dog Food',
    seoDescription: 'Fresh meals for healthy skin and shiny coats. Rich in omega-3s and essential fatty acids. Address itching and dryness naturally.',
  },
  {
    id: 'weight-management',
    slug: 'weight-management',
    title: 'Weight Management',
    description: 'Portion-controlled, nutrient-dense meals for maintaining healthy weight. High protein, lower calories.',
    image: '/images/2025/07/Beef-and-Sweet-Potato-Bowl-scaled.jpg',
    type: 'health-goal',
    productIds: [],
    seoTitle: 'Weight Management Dog Food | Healthy Weight Dog Meals',
    seoDescription: 'Fresh dog food for weight management. High protein, nutrient-dense, portion-controlled. Help your dog achieve and maintain healthy weight.',
  },
  {
    id: 'puppy-nutrition',
    slug: 'puppy-nutrition',
    title: 'Puppy Nutrition',
    description: 'Specially formulated meals for growing puppies. Higher calories and nutrients for healthy development.',
    image: '/images/2025/07/Chicken-Superfood-Cake-Board-scaled.jpg',
    type: 'health-goal',
    productIds: [],
    featured: true,
    seoTitle: 'Fresh Puppy Food | Nutritious Meals for Growing Puppies',
    seoDescription: 'Premium fresh food for puppies. Formulated for healthy growth and development. Higher protein, essential nutrients, delicious taste.',
  },
  {
    id: 'senior-dog-care',
    slug: 'senior-dog-care',
    title: 'Senior Dog Care',
    description: 'Gentle, easy-to-digest meals tailored for senior dogs. Support aging gracefully with optimal nutrition.',
    image: '/images/2025/07/Beef-and-Sweet-Potato-Bowl-scaled.jpg',
    type: 'health-goal',
    productIds: [],
    featured: true,
    seoTitle: 'Senior Dog Food | Nutrition for Older Dogs',
    seoDescription: 'Fresh meals for senior dogs. Easy to digest, supports joint health, kidney function, and vitality. Age gracefully with optimal nutrition.',
  },

  // By Diet Type
  {
    id: 'grain-free',
    slug: 'grain-free',
    title: 'Grain-Free Options',
    description: 'Protein-rich meals without grains. Perfect for dogs with grain sensitivities or allergies.',
    image: '/images/2025/07/Chicken-Superfood-Cake-Board-scaled.jpg',
    type: 'diet-type',
    productIds: [],
    seoTitle: 'Grain-Free Dog Food | Fresh Grain-Free Meals for Dogs',
    seoDescription: 'Premium grain-free fresh dog food. High-quality proteins, nutrient-rich vegetables, no grains. Perfect for sensitivities.',
  },
  {
    id: 'limited-ingredient',
    slug: 'limited-ingredient',
    title: 'Limited Ingredient',
    description: 'Simple recipes with fewer ingredients. Ideal for identifying food sensitivities and allergies.',
    image: '/images/2025/07/Beef-and-Sweet-Potato-Bowl-scaled.jpg',
    type: 'diet-type',
    productIds: [],
    seoTitle: 'Limited Ingredient Dog Food | Simple Recipe Dog Meals',
    seoDescription: 'Fresh limited ingredient dog food. Simple recipes, fewer ingredients, easy to digest. Perfect for food sensitivities.',
  },
  {
    id: 'novel-protein',
    slug: 'novel-protein',
    title: 'Novel Protein',
    description: 'Unique protein sources for dogs with common protein allergies. Try something new!',
    image: '/images/2025/07/Chicken-Superfood-Cake-Board-scaled.jpg',
    type: 'diet-type',
    productIds: [],
    seoTitle: 'Novel Protein Dog Food | Unique Protein Sources for Dogs',
    seoDescription: 'Fresh dog food with novel proteins. Perfect for dogs with chicken or beef allergies. Hypoallergenic, nutritious, delicious.',
  },
];

/**
 * Get all collections
 */
export function getAllCollections(): Collection[] {
  return collections;
}

/**
 * Get collection by slug
 */
export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find(c => c.slug === slug);
}

/**
 * Get collections by type
 */
export function getCollectionsByType(type: Collection['type']): Collection[] {
  return collections.filter(c => c.type === type);
}

/**
 * Get featured collections
 */
export function getFeaturedCollections(): Collection[] {
  return collections.filter(c => c.featured);
}

/**
 * Get products for a collection
 */
export function getProductsForCollection(collection: Collection, allProducts: any[]): any[] {
  return allProducts.filter(product => collection.productIds.includes(product.id));
}

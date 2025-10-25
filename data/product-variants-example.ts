import { Product, ProductVariant } from '@/types/product';

// Example: How to set up product variants for Waggin Meals

// Variant options for Fresh Food meals (4-cup, 8-cup, 12-cup packs)
export const createFreshFoodVariants = (basePrice: number, protein: string): ProductVariant[] => [
  {
    id: `${protein}-4cup`,
    sku: `WM-${protein.toUpperCase()}-4CUP`,
    title: '4-Cup Pack',
    price: basePrice,
    weight: '800g',
    servings: 4,
    inStock: true,
    stockQty: 50,
  },
  {
    id: `${protein}-8cup`,
    sku: `WM-${protein.toUpperCase()}-8CUP`,
    title: '8-Cup Pack (Save 10%)',
    price: Number((basePrice * 2 * 0.9).toFixed(2)), // 10% discount
    compareAtPrice: basePrice * 2,
    weight: '1.6kg',
    servings: 8,
    inStock: true,
    stockQty: 35,
    isDefault: true, // Most popular option
  },
  {
    id: `${protein}-12cup`,
    sku: `WM-${protein.toUpperCase()}-12CUP`,
    title: '12-Cup Pack (Save 15%)',
    price: Number((basePrice * 3 * 0.85).toFixed(2)), // 15% discount
    compareAtPrice: basePrice * 3,
    weight: '2.4kg',
    servings: 12,
    inStock: true,
    stockQty: 20,
  },
];

// Example: Chicken & Sweet Potato with variants
export const chickenSweetPotatoWithVariants: Product = {
  id: 'chicken-sweet-potato',
  handle: 'chicken-farm-meal-copy',
  title: 'Chicken & Sweet Potato Farm Meal',
  description: 'Fresh chicken with sweet potatoes, organic superfoods, and essential supplements for complete nutrition. Available in multiple sizes to fit your feeding schedule.',
  price: 15.99, // Starting price (smallest variant)
  images: [
    '/images/products/ChickenandSweetPotatoBowl.jpg',
    '/images/products/Chicken_and_Sweet_Potato.jpg',
    '/images/products/Chicken_SP.jpg'
  ],
  category: 'Dog Food',
  collection: 'fresh-food',
  tags: ['chicken', 'sweet-potato', 'grain-free', 'fresh', 'superfoods'],
  status: 'active',
  ingredients: 'Chicken, Sweet Potatoes, Carrots, Squash, Zucchini, Green Beans, Cucumbers, Spinach, Kale, Apples, Cranberries, Blueberries, Collagen Powder, Pomegranate Powder, Pumpkin Powder, Oregano, Safflower Oil, Olive Oil, Coconut Oil, Turmeric, Ginger, Calcium Phosphorus, Folic Acid',
  analysis: 'Crude Protein (min) 8%, Crude Fat (min) 3%, Crude Fiber (max) 3%, Moisture (max) 74%',
  inStock: true,
  hasVariants: true,
  variants: createFreshFoodVariants(15.99, 'chicken-sp'),
};

// Example: Supplement variants (different quantities)
export const createSupplementVariants = (basePrice: number, supplement: string): ProductVariant[] => [
  {
    id: `${supplement}-1jar`,
    sku: `WM-${supplement.toUpperCase()}-1JAR`,
    title: '1 Jar (30-day supply)',
    price: basePrice,
    weight: '60g',
    servings: 30,
    inStock: true,
    stockQty: 25,
  },
  {
    id: `${supplement}-3jar`,
    sku: `WM-${supplement.toUpperCase()}-3JAR`,
    title: '3 Jars (90-day supply)',
    price: Number((basePrice * 3 * 0.85).toFixed(2)), // 15% discount
    compareAtPrice: basePrice * 3,
    weight: '180g',
    servings: 90,
    inStock: true,
    stockQty: 15,
    isDefault: true, // Most popular for subscriptions
  },
  {
    id: `${supplement}-6jar`,
    sku: `WM-${supplement.toUpperCase()}-6JAR`,
    title: '6 Jars (6-month supply)',
    price: Number((basePrice * 6 * 0.80).toFixed(2)), // 20% discount
    compareAtPrice: basePrice * 6,
    weight: '360g',
    servings: 180,
    inStock: true,
    stockQty: 10,
  },
];

// Example: Bone Broth variants (different sizes)
export const createBoneBrothVariants = (): ProductVariant[] => [
  {
    id: 'broth-16oz',
    sku: 'WM-BROTH-16OZ',
    title: '16 oz Container',
    price: 14.00,
    weight: '16 oz (473ml)',
    servings: 16, // 1 oz per serving
    inStock: true,
    stockQty: 30,
  },
  {
    id: 'broth-32oz',
    sku: 'WM-BROTH-32OZ',
    title: '32 oz Container (Save 10%)',
    price: 25.20, // 10% discount
    compareAtPrice: 28.00,
    weight: '32 oz (946ml)',
    servings: 32,
    inStock: true,
    stockQty: 20,
    isDefault: true,
  },
  {
    id: 'broth-64oz',
    sku: 'WM-BROTH-64OZ',
    title: '64 oz Container (Save 15%)',
    price: 47.60, // 15% discount
    compareAtPrice: 56.00,
    weight: '64 oz (1.9L)',
    servings: 64,
    inStock: true,
    stockQty: 10,
  },
];

// Real-world pricing example for Christie:
// 4-cup pack:  $15.99 ($4.00/cup)
// 8-cup pack:  $28.78 ($3.60/cup) - Save $3.20
// 12-cup pack: $40.77 ($3.40/cup) - Save $7.20

// This incentivizes larger purchases while giving customers flexibility!

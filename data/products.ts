// Waggin Meals Products Data
// Source: Shopify Export (shopify-files/products_export_1.csv)

import { Product, Collection, ProductVariant } from '@/types/product';

// Export types for backwards compatibility
export type { Product, Collection, ProductVariant };

// === FRESH FOOD COLLECTION ===
export const freshFoodProducts: Product[] = [
  {
    id: 'chicken-sweet-potato',
    handle: 'chicken-farm-meal-copy',
    title: 'Chicken & Sweet Potato Farm Meal',
    description: 'Fresh chicken with sweet potatoes, organic superfoods, and essential supplements for complete nutrition. Available in multiple sizes to fit your feeding schedule.',
    price: 15.99,
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
    weight: '800g (4 cups)',
    inStock: true,
    stockQty: 9908,
    hasVariants: true,
    variants: [
      {
        id: 'chicken-sp-4cup',
        sku: 'WM-CHICKEN-SP-4CUP',
        title: '4-Cup Pack',
        price: 15.99,
        weight: '800g',
        servings: 4,
        inStock: true,
        stockQty: 50,
      },
      {
        id: 'chicken-sp-8cup',
        sku: 'WM-CHICKEN-SP-8CUP',
        title: '8-Cup Pack (Save 10%)',
        price: 28.78,
        compareAtPrice: 31.98,
        weight: '1.6kg',
        servings: 8,
        inStock: true,
        stockQty: 35,
        isDefault: true,
      },
      {
        id: 'chicken-sp-12cup',
        sku: 'WM-CHICKEN-SP-12CUP',
        title: '12-Cup Pack (Save 15%)',
        price: 40.77,
        compareAtPrice: 47.97,
        weight: '2.4kg',
        servings: 12,
        inStock: true,
        stockQty: 20,
      },
    ],
  },
  {
    id: 'chicken-rice',
    handle: 'chicken-farm-meal',
    title: 'Chicken & Rice Farm Meal',
    description: '800 Grams - 4 cups. Complete and balanced chicken meal with rice, perfect for dogs with sensitive stomachs.',
    price: 15.99,
    images: [
      '/images/products/Chicken_and_Rice_Bowl.jpg',
      '/images/products/Chicken_and_Rice.jpg',
      '/images/products/Chicken_Rice.jpg'
    ],
    category: 'Dog Food',
    collection: 'fresh-food',
    tags: ['chicken', 'rice', 'sensitive-stomach', 'fresh', 'digestive-health'],
    status: 'active',
    ingredients: 'Chicken, Rice, Carrots, Squash, Zucchini, Green Beans, Cucumbers, Spinach, Kale, Apples, Cranberries, Blueberries, Collagen Powder, Pomegranate Powder, Pumpkin Powder, Oregano, Safflower Oil, Olive Oil, Coconut Oil, Turmeric, Ginger, Calcium Phosphorus, Folic Acid',
    analysis: 'Crude Protein (min) 8%, Crude Fat (min) 3%, Crude Fiber (max) 1.5%, Moisture (max) 73%',
    weight: '800g (4 cups)',
    inStock: true,
    stockQty: 9892,
    hasVariants: false,
  },
  {
    id: 'turkey-rice',
    handle: 'turkey-farm-meal-copy-1',
    title: 'Turkey & Rice Farm Meal',
    description: '800 Grams - 4 cups. Lean turkey protein with rice and superfoods for optimal nutrition.',
    price: 15.99,
    images: [
      '/images/products/Chicken_and_Rice_Bowl.jpg',
      '/images/products/Turkey_Rice.jpg',
      '/images/products/Turkey_and_Rice.jpg'
    ],
    category: 'Dog Food',
    collection: 'fresh-food',
    tags: ['turkey', 'rice', 'lean-protein', 'fresh'],
    status: 'active',
    ingredients: 'Turkey, Rice, Carrots, Squash, Zucchini, Green Beans, Cucumbers, Spinach, Kale, Apples, Cranberries, Blueberries, Collagen Powder, Pomegranate Powder, Pumpkin Powder, Oregano, Safflower Oil, Olive Oil, Coconut Oil, Turmeric, Ginger, Calcium Phosphorus, Folic Acid',
    analysis: 'Crude Protein (min) 8%, Crude Fat (min) 3%, Crude Fiber (max) 1.5%, Moisture (max) 74%',
    weight: '800g (4 cups)',
    inStock: true,
    stockQty: 9918
  },
  {
    id: 'turkey-sweet-potato',
    handle: 'turkey-farm-meal-copy',
    title: 'Turkey & Sweet Potato Farm Meal',
    description: '800 Grams - 4 cups. Turkey with sweet potatoes and nutrient-rich superfoods.',
    price: 15.99,
    images: [
      '/images/products/ChickenandSweetPotatoBowl.jpg',
      '/images/products/Turkey_and_Sweet_Potato_copy_385764f1-975a-4e36-82a8-3319670f7b23.jpg',
      '/images/products/Turkey_SP.jpg'
    ],
    category: 'Dog Food',
    collection: 'fresh-food',
    tags: ['turkey', 'sweet-potato', 'grain-free', 'fresh'],
    status: 'active',
    ingredients: 'Turkey, Sweet Potatoes, Carrots, Squash, Zucchini, Green Beans, Cucumbers, Spinach, Kale, Apples, Cranberries, Blueberries, Collagen Powder, Pomegranate Powder, Pumpkin Powder, Oregano, Safflower Oil, Olive Oil, Coconut Oil, Turmeric, Ginger, Calcium Phosphorus, Folic Acid',
    analysis: 'Crude Protein (min) 8%, Crude Fat (min) 3%, Crude Fiber (max) 3%, Moisture (max) 76%',
    weight: '800g (4 cups)',
    inStock: true,
    stockQty: 9854
  },
  {
    id: 'beef-sweet-potato',
    handle: 'beef-farm-meal-copy',
    title: 'Beef & Sweet Potato Farm Meal',
    description: '750 Grams - 4 cups. Rich beef protein with sweet potatoes for active dogs.',
    price: 16.99,
    images: [
      '/images/products/BeefandSweetPotatoBowl.jpg',
      '/images/products/Beef_and_Sweet_Potato_8a466a70-4ac9-440b-ad19-9db86d19776f.jpg',
      '/images/products/Beef_SP_56043c48-b7d6-4db1-a54f-1702c008349a.jpg'
    ],
    category: 'Dog Food',
    collection: 'fresh-food',
    tags: ['beef', 'sweet-potato', 'high-protein', 'fresh', 'active-dogs'],
    status: 'active',
    ingredients: 'Beef, Sweet Potatoes, Carrots, Squash, Zucchini, Green Beans, Cucumbers, Spinach, Kale, Apples, Cranberries, Blueberries, Collagen Powder, Pomegranate Powder, Pumpkin Powder, Oregano, Safflower Oil, Olive Oil, Coconut Oil, Turmeric, Ginger, Calcium Phosphorus, Folic Acid',
    analysis: 'Crude Protein (min) 11%, Crude Fat (min) 8%, Crude Fiber (max) 1.5%, Moisture (max) 72%',
    weight: '750g (4 cups)',
    inStock: true,
    stockQty: 9891
  },
  {
    id: 'beef-rice',
    handle: 'beef-farm-meal-copy-copy',
    title: 'Beef & Rice Farm Meal',
    description: '750 Grams - 4 cups. Hearty beef with rice for sustained energy.',
    price: 16.99,
    images: [
      '/images/products/Beef_and_Rice_Bowl.jpg',
      '/images/products/Beef_and_Rice_d876c154-b6d9-4efb-b88b-955caca7a311.jpg',
      '/images/products/Beef_Rice.jpg'
    ],
    category: 'Dog Food',
    collection: 'fresh-food',
    tags: ['beef', 'rice', 'high-protein', 'fresh'],
    status: 'active',
    ingredients: 'Beef, Rice, Carrots, Squash, Zucchini, Green Beans, Cucumbers, Spinach, Kale, Apples, Cranberries, Blueberries, Collagen Powder, Pomegranate Powder, Pumpkin Powder, Oregano, Safflower Oil, Olive Oil, Coconut Oil, Turmeric, Ginger, Calcium Phosphorus, Folic Acid',
    analysis: 'Crude Protein (min) 11%, Crude Fat (min) 8%, Crude Fiber (max) 1.5%, Moisture (max) 72%',
    weight: '750g (4 cups)',
    inStock: true,
    stockQty: 9881
  },
  {
    id: 'low-protein-salmon',
    handle: 'low-protein-diet-atlantic-salmon',
    title: 'Low Protein Diet - Atlantic Salmon',
    description: '2 Cup Packs (Pre-Order Only). Specially formulated for dogs requiring low protein diets, perfect for kidney health.',
    price: 10.50,
    images: [
      '/images/products/Waggin_Meals.png',
      '/images/products/Kidney_Diease.png'
    ],
    category: 'Prescription Dog Food',
    collection: 'fresh-food',
    tags: ['salmon', 'low-protein', 'kidney-health', 'therapeutic', 'pre-order'],
    status: 'active',
    ingredients: 'Salmon, Basmati Rice, Carrots, Cauliflower, Green Beans, Spinach, Blueberries, Pomegranate, Collagen Powder, Ginger, Sunflower Oil, Bone Broth',
    analysis: 'As fed: Protein 5.4%, Fat 1.3%, Carbohydrates 16.8%, Moisture 73.3%. 1.2 kcal/g, 264 kcal/cup',
    weight: '2 cups per pack',
    inStock: true,
    stockQty: 12
  },
  {
    id: 'pup-a-loaf',
    handle: 'pup-a-loaf',
    title: 'Pup-a-loaf',
    description: 'Our best seller! A dog-friendly meatloaf. 390 Grams, 1 Loaf, 6 Slices. Perfect for training or special treats.',
    price: 14.00,
    images: [
      '/images/products/PupALoafBoard72res.jpg',
      '/images/products/Pup_A_Loaf_72res.jpg',
      '/images/products/Pupaloaf_copy_793ac649-8682-46ae-bde1-e9481d79a49f.jpg'
    ],
    category: 'Dog Food',
    collection: 'fresh-food',
    tags: ['turkey', 'rice', 'meatloaf', 'bestseller', 'training'],
    status: 'active',
    ingredients: 'Turkey, Rice, Whole Oats, Carrots, Green Beans, Spinach, Cottage Cheese, Eggs, Coconut Oil, Olive Oil, Oregano, Turmeric, Ginger',
    analysis: 'Crude Protein (min) 8%, Crude Fat (min) 6%, Crude Fiber (max) 1%, Moisture (max) 78%',
    weight: '390g (6 slices)',
    inStock: true,
    stockQty: 45
  },
  {
    id: 'chicken-superfood-cakes',
    handle: 'chicken-superfood-cakes',
    title: 'Chicken Superfood Cakes',
    description: 'Perfect for travel or picky eaters. 430 Grams, 4 Cakes per package.',
    price: 14.25,
    images: [
      '/images/products/ChickenSuperfoodCakeBoard.jpg',
      '/images/products/Chicken_Superfood_Cake_1b7bebd2-94a6-4c61-8ec9-3c106eab2c49.jpg',
      '/images/products/Chicken_Superfood_Cakes.jpg'
    ],
    category: 'Dog Food',
    collection: 'fresh-food',
    tags: ['chicken', 'travel-size', 'picky-eaters', 'superfoods'],
    status: 'active',
    ingredients: 'Chicken, Carrots, Green Beans, Spinach, Kale, Chicken Liver, Chicken Hearts, Organic Blueberry Powder, Pomegranate Powder, Cranberry Powder, Pumpkin Powder, Cottage Cheese, Eggs, Coconut Oil, Olive Oil, Rice, Oregano, Turmeric, Ginger',
    analysis: 'Crude Protein (min) 7.5%, Crude Fat (min) 4%, Crude Fiber (max) 1%, Moisture (max) 72%',
    weight: '430g (4 cakes)',
    inStock: true,
    stockQty: 72
  }
];

// === MEAL TOPPERS COLLECTION ===
export const mealToppersProducts: Product[] = [
  {
    id: 'beef-topper',
    handle: 'beef-freeze-dried-topper',
    title: 'Beef Superfood Topper',
    description: 'Enhanced with superfoods like Blueberries, Leafy Greens, Pumpkin, Coconut, Fish Oil, Turmeric. Supports immunity, digestion, and picky eaters.',
    price: 18.98,
    images: ['/images/products/BeefTopper72.jpg'],
    category: 'Dog Food',
    collection: 'meal-toppers',
    tags: ['beef', 'topper', 'superfoods', 'digestive-health'],
    status: 'active',
    ingredients: 'Beef, Blueberries, Leafy Greens, Pumpkin, Coconut, Fish Oil, Turmeric',
    weight: '6 lbs',
    inStock: false,
    stockQty: 13
  },
  {
    id: 'chicken-topper',
    handle: 'chicken-superfood-topper',
    title: 'Chicken Superfood Topper',
    description: 'Enhanced with superfoods. Use dry or rehydrate for extra flavor. Great for both dogs & cats.',
    price: 18.98,
    images: ['/images/products/ChickenTopper72.jpg'],
    category: 'Dog Food',
    collection: 'meal-toppers',
    tags: ['chicken', 'topper', 'superfoods', 'for-cats-too'],
    status: 'active',
    ingredients: 'Chicken, Blueberries, Leafy Greens, Pumpkin, Coconut, Fish Oil, Turmeric',
    weight: '6 oz',
    inStock: true,
    stockQty: 15
  },
  {
    id: 'lamb-topper',
    handle: 'lamb-superfood-topper',
    title: 'Lamb Superfood Topper',
    description: 'Enhanced with superfoods. Supports immunity, digestion, and picky eaters.',
    price: 19.98,
    images: ['/images/products/LambTopper72.jpg'],
    category: 'Dog Food',
    collection: 'meal-toppers',
    tags: ['lamb', 'topper', 'superfoods', 'picky-eaters'],
    status: 'active',
    ingredients: 'Lamb, Blueberries, Leafy Greens, Pumpkin, Coconut, Fish Oil, Turmeric',
    weight: '6 oz',
    inStock: true,
    stockQty: 19
  },
  {
    id: 'salmon-topper',
    handle: 'salmon-superfood-topper',
    title: 'Salmon Superfood Topper',
    description: 'Enhanced with superfoods. Rich in Omega-3s for skin and coat health.',
    price: 19.98,
    images: ['/images/products/SalmonTopper72.jpg'],
    category: 'Dog Food',
    collection: 'meal-toppers',
    tags: ['salmon', 'topper', 'superfoods', 'omega-3', 'skin-coat'],
    status: 'active',
    ingredients: 'Salmon, Blueberries, Leafy Greens, Pumpkin, Coconut, Fish Oil, Turmeric',
    weight: '6 lbs',
    inStock: true,
    stockQty: 16
  },
  {
    id: 'bone-veggie-broth',
    handle: 'bone-veggie-broths-2',
    title: 'Bone & Veggie Broth',
    description: 'Slow simmered for 48 hours. 4 Cups, 950 Grams. Supports liver detox, immune system, healthy skin & coat, joint strength, digestive health, and hydration.',
    price: 14.00,
    images: [
      '/images/products/Bone-Broth-Topper-Bowl-scaled_a43724fa-096f-44fb-a4c1-1a37180596c5.jpg',
      '/images/products/Bone_Broth_Topper.jpg',
      '/images/products/Bone_Veggie_Broth_Reg_a39c5a72-866e-43d8-b0e8-af04be4458c1.jpg'
    ],
    category: 'Dog Food',
    collection: 'meal-toppers',
    tags: ['broth', 'bone-broth', 'digestive-health', 'joint-health', 'hydration'],
    status: 'active',
    ingredients: 'Beef Bone Broth, Carrots, Green Beans, Spinach, Kale, Apple Cider Vinegar, Oregano, Turmeric, Ginger',
    analysis: 'Crude Protein (min) 1%, Crude Fat (min) 0.10%, Crude Fiber (Max) 1%, Moisture (max) 100%',
    weight: '950g (4 cups)',
    inStock: true,
    stockQty: 9936
  },
  {
    id: 'prince-jax-stew',
    handle: 'prince-jax-stew-2',
    title: 'Prince Jax Stew',
    description: 'We recommend using this as a topper for any of our meals. Combine two meal packs with this stew for all the benefits of our bone broth and more!',
    price: 19.29,
    images: [
      '/images/products/Prince-Jax-Stew-Bowl-scaled_f10ad903-2361-4b6c-ac52-c785dcdb5a49.jpg',
      '/images/products/Prince_Jax_Stew_Reg.jpg',
      '/images/products/Prince_Jax_Stew_b80cf6f6-e5a4-4007-a3ca-42c8852f0167.jpg'
    ],
    category: 'Dog Food',
    collection: 'meal-toppers',
    tags: ['stew', 'turkey', 'beef-broth', 'topper', 'grain-free'],
    status: 'active',
    ingredients: 'Beef Bone Broth, Turkey, Sweet Potatoes, Carrots, Green Beans, Spinach, Kale, Apple Cider Vinegar, Oregano, Turmeric, Ginger',
    analysis: 'Crude Protein (min) 8%, Crude Fat (min) 3%, Crude Fiber (max) 1.5%, Moisture (max) 78%',
    weight: '300g',
    inStock: true,
    stockQty: 959
  }
];

// === TREATS COLLECTION ===
export const treatsProducts: Product[] = [
  {
    id: 'meatball-treats',
    handle: 'meatball-dog-treats',
    title: 'Meatball Dog Treats',
    description: 'Treat your pup to something truly special—13 hand-rolled, hearty meatballs made with love at Waggin Meals! Perfect for even the pickiest eaters.',
    price: 16.99,
    images: [
      '/images/products/meatballs.jpg',
      '/images/products/meatball_treats.jpg',
      '/images/products/Jax.jpg'
    ],
    category: 'Dog Treats',
    collection: 'treats',
    tags: ['beef', 'treats', 'training', 'meatballs', 'picky-eaters'],
    status: 'active',
    ingredients: 'Beef, Whole Oats, Apples, Bananas, Cottage Cheese, Eggs, Ginger, Turmeric, Oregano, Coconut Oil, Safflower Oil',
    weight: '13 meatballs',
    inStock: true,
    stockQty: 4
  },
  {
    id: 'turmeric-eggs-bacon',
    handle: 'turmeric-eggs-bacon-superfood-dog-treat',
    title: 'Turmeric, Eggs & Bacon - Superfood Dog Treat',
    description: 'Superfoods are not only a smart healthy choice for your dog but will also be one to wag their tail for!',
    price: 14.99,
    images: ['/images/products/TumericEggsandBacon.jpg'],
    category: 'Dog Treats',
    collection: 'treats',
    tags: ['treats', 'superfoods', 'turmeric', 'training', 'soft'],
    status: 'active',
    ingredients: 'Wheat Flour, Dried Eggs, Vegetable Glycerin, Turmeric Powder, Malted Barley, Natural Bacon Flavor, Liquid smoke, Brown rice',
    weight: '6.5 oz',
    inStock: true,
    stockQty: 12
  },
  {
    id: 'spinach-mozzarella-kale',
    handle: 'spinach-mozzarella-kale-probiotics',
    title: 'Spinach, Mozzarella, Kale & Probiotics - Superfood Treat',
    description: 'Superfoods with probiotics that promote gut health, a strong immune system, and digestive balance.',
    price: 14.99,
    images: ['/images/products/SpinachMozzarellaKaleProbiotics.jpg'],
    category: 'Dog Treats',
    collection: 'treats',
    tags: ['treats', 'superfoods', 'probiotics', 'digestive-health', 'soft'],
    status: 'active',
    ingredients: 'Spinach, Mozzarella, Kale, Probiotics, Wheat Flour, Vegetable Glycerin',
    weight: '6.5 oz',
    inStock: true,
    stockQty: 17
  },
  {
    id: 'apple-chicken-bites',
    handle: 'apple-chicken-smart-bites',
    title: 'Apple & Chicken Smart Bites - Superfood Treat',
    description: 'Each treat is loaded with Apples and Chicken. When you open the bag the aroma of apples smells like a homemade apple pie!',
    price: 14.99,
    images: ['/images/products/Apple_ChickenSmartBitescopy.jpg'],
    category: 'Dog Treats',
    collection: 'treats',
    tags: ['treats', 'superfoods', 'apple', 'chicken', 'training'],
    status: 'active',
    ingredients: 'Apples, Chicken, Wheat Flour, Vegetable Glycerin',
    weight: '6.5 oz',
    inStock: true,
    stockQty: 26
  },
  {
    id: 'beet-bites',
    handle: 'beet-bites-natural-dog-treat',
    title: 'Beet Bites - Natural Dog Treat',
    description: 'Nutritious beets benefit dogs with anti-cancer properties, fights inflammation, detoxification support, and helps boost stamina.',
    price: 14.99,
    images: ['/images/products/BeetBites.jpg'],
    category: 'Dog Treats',
    collection: 'treats',
    tags: ['treats', 'beets', 'anti-inflammatory', 'superfoods'],
    status: 'active',
    ingredients: 'Beets, Wheat Flour, Vegetable Glycerin',
    weight: '6.5 oz',
    inStock: true,
    stockQty: 28
  },
  {
    id: 'lamb-chips',
    handle: 'lamb-chews-natural-dog-treat',
    title: 'Lamb Chips - Natural Dog Treat',
    description: 'Soft lamb treats made with all natural lamb hearts. Perfect for picky dogs and training sessions. Single Source Protein.',
    price: 16.99,
    images: [
      '/images/products/LambChewyBars.jpg',
      '/images/products/Lamb_Chips_png.png'
    ],
    category: 'Dog Treats',
    collection: 'treats',
    tags: ['treats', 'lamb', 'high-protein', 'training', 'soft-chewy'],
    status: 'active',
    ingredients: 'Lamb Hearts',
    weight: '6.5 oz',
    inStock: true,
    stockQty: 5
  },
  {
    id: 'venison-sausages',
    handle: 'venison-sausages',
    title: 'Venison Sausages',
    description: '100% Venison. Healthy, delicious and free of additives, preservatives or fillers. Grain free and gluten free.',
    price: 19.99,
    images: ['/images/products/Venison-Sausages-1-scaled.jpg'],
    category: 'Dog Treats',
    collection: 'treats',
    tags: ['treats', 'venison', 'grain-free', 'gluten-free', 'single-ingredient'],
    status: 'active',
    ingredients: 'Venison',
    weight: '7.5 oz',
    inStock: true,
    stockQty: 17
  },
  {
    id: 'duck-bars',
    handle: 'duck-bars-2',
    title: 'Duck Bars - Natural Dog Treat',
    description: 'All natural, limited ingredient dog treats made in the USA. Great source of protein, similar texture to jerky treats and low in fat.',
    price: 15.49,
    images: ['/images/products/Duck-Bars-scaled_7d7e7c1a-f25c-403e-9bf0-41b61487421b.jpg'],
    category: 'Dog Treats',
    collection: 'treats',
    tags: ['treats', 'duck', 'low-fat', 'jerky', 'usa-made'],
    status: 'active',
    ingredients: 'Duck, pea flour, pea protein, chickpea, coconut glycerin, potato flour, flaxseed, cane molasses, salt, lactic acid, natural smoke flavor, mixed tocopherols',
    analysis: 'Protein (min) 13.0%, Crude Fat (min) 5.0%, Fiber (max) 3.0%, Moisture (max) 25.0%',
    weight: 'Multiple sizes',
    inStock: true,
    stockQty: 17
  }
];

// === COLLECTIONS ===
export const collections: Collection[] = [
  {
    id: 'fresh-food',
    name: 'Fresh Food Collection',
    slug: 'fresh-food',
    description: 'Our signature farm-fresh meals made with human-grade ingredients, superfoods, and essential nutrients. Every meal is carefully crafted for complete and balanced nutrition.',
    image: '/images/products/ChickenandSweetPotatoBowl.jpg',
    products: freshFoodProducts
  },
  {
    id: 'meal-toppers',
    name: 'Meal Toppers & Add-ons',
    slug: 'meal-toppers',
    description: 'Boost your dog\'s meals with our superfood toppers, bone broths, and stews. Perfect for picky eaters or adding extra nutrition and flavor.',
    image: '/images/products/BeefTopper72.jpg',
    products: mealToppersProducts
  },
  {
    id: 'treats',
    name: 'Healthy Treats',
    slug: 'treats',
    description: 'Nutritious treats made with superfoods and limited ingredients. Perfect for training, rewards, or just showing your pup some love.',
    image: '/images/products/meatballs.jpg',
    products: treatsProducts
  }
];

// === ALL PRODUCTS ===
export const allProducts: Product[] = [
  ...freshFoodProducts,
  ...mealToppersProducts,
  ...treatsProducts
];

// === HELPER FUNCTIONS ===
export function getProductByHandle(handle: string): Product | undefined {
  return allProducts.find(p => p.handle === handle);
}

export function getProductsByCollection(collectionSlug: string): Product[] {
  return allProducts.filter(p => p.collection === collectionSlug);
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find(c => c.slug === slug);
}

export function getFeaturedProducts(limit: number = 6): Product[] {
  // Return best-sellers and high-stock items
  return allProducts
    .filter(p => p.status === 'active' && p.inStock)
    .sort((a, b) => (b.stockQty || 0) - (a.stockQty || 0))
    .slice(0, limit);
}

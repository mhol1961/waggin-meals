// Waggin Meals Products Data
// Source: Shopify Export (shopify-files/products_export_1.csv)

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  collection: string;
  tags: string[];
  status: 'active' | 'draft';
  ingredients?: string;
  analysis?: string;
  weight?: string;
  sku?: string;
  inStock: boolean;
  stockQty?: number;
  hasVariants?: boolean;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  products: Product[];
}

// === FRESH FOOD COLLECTION ===
export const freshFoodProducts: Product[] = [
  {
    id: 'chicken-sweet-potato',
    handle: 'chicken-farm-meal-copy',
    title: 'Chicken & Sweet Potato Farm Meal',
    description: '800 Grams - 4 cups. Fresh chicken with sweet potatoes, organic superfoods, and essential supplements for complete nutrition. Sourced from hormone & antibiotic-free TN farms.',
    price: 15.99,
    images: [
      '/images/products/ChickenandSweetPotatoBowl.jpg'
    ],
    category: 'Dog Food',
    collection: 'fresh-food',
    tags: ['chicken', 'sweet-potato', 'grain-free', 'fresh', 'superfoods'],
    status: 'active',
    ingredients: 'Chicken, Chicken Liver, Sweet Potatoes, Carrots, Squash, Zucchini, Green Beans, Cucumbers, Spinach, Kale, Apples, Cranberries, Blueberries, Collagen Powder, Pomegranate Powder, Pumpkin Powder, Oregano, Safflower Oil, Extra Virgin Olive Oil, Organic Coconut Oil, Turmeric, Ginger, Calcium Carbonate, Dicalcium Phosphate, Folic Acid, Vitamin E Supplement',
    analysis: 'Crude Protein (min) 8%, Crude Fat (min) 3%, Crude Fiber (max) 3%, Moisture (max) 74%',
    weight: '800g (4 cups)',
    inStock: true,
    stockQty: 9908
  },
  {
    id: 'chicken-rice',
    handle: 'chicken-farm-meal',
    title: 'Chicken & Rice Farm Meal',
    description: '800 Grams - 4 cups. Complete and balanced chicken meal with rice, perfect for dogs with sensitive stomachs. 282 kcal per cup. Sourced from hormone & antibiotic-free TN farms.',
    price: 15.99,
    images: [
      '/images/products/Chicken_and_Rice_Bowl.jpg'
    ],
    category: 'Dog Food',
    collection: 'fresh-food',
    tags: ['chicken', 'rice', 'sensitive-stomach', 'fresh', 'digestive-health'],
    status: 'active',
    ingredients: 'Chicken, Chicken Liver, Rice, Carrots, Squash, Zucchini, Green Beans, Cucumbers, Spinach, Kale, Apples, Cranberries, Blueberries, Collagen Powder, Pomegranate Powder, Pumpkin Powder, Oregano, Safflower Oil, Extra Virgin Olive Oil, Organic Coconut Oil, Turmeric, Ginger, Calcium Carbonate, Dicalcium Phosphate, Folic Acid, Vitamin E Supplement',
    analysis: 'Crude Protein (min) 8%, Crude Fat (min) 3%, Crude Fiber (max) 1.5%, Moisture (max) 73%. 282 kcal per cup',
    weight: '800g (4 cups)',
    inStock: true,
    stockQty: 9892
  },
  {
    id: 'turkey-rice',
    handle: 'turkey-farm-meal-copy-1',
    title: 'Turkey & Rice Farm Meal',
    description: '800 Grams - 4 cups. Lean turkey protein with rice and superfoods for optimal nutrition. 279 kcal per cup. Sourced from GA farms.',
    price: 15.99,
    images: [
      '/images/products/Chicken_and_Rice_Bowl.jpg'
    ],
    category: 'Dog Food',
    collection: 'fresh-food',
    tags: ['turkey', 'rice', 'lean-protein', 'fresh'],
    status: 'active',
    ingredients: 'Turkey, Chicken Liver, Rice, Carrots, Squash, Zucchini, Green Beans, Cucumbers, Spinach, Kale, Apples, Cranberries, Blueberries, Collagen Powder, Pomegranate Powder, Pumpkin Powder, Oregano, Safflower Oil, Extra Virgin Olive Oil, Organic Coconut Oil, Turmeric, Ginger, Calcium Carbonate, Dicalcium Phosphate, Folic Acid, Vitamin E Supplement',
    analysis: 'Crude Protein (min) 8%, Crude Fat (min) 3%, Crude Fiber (max) 1.5%, Moisture (max) 74%. 279 kcal per cup',
    weight: '800g (4 cups)',
    inStock: true,
    stockQty: 9918
  },
  {
    id: 'turkey-sweet-potato',
    handle: 'turkey-farm-meal-copy',
    title: 'Turkey & Sweet Potato Farm Meal',
    description: '800 Grams - 4 cups. Turkey with sweet potatoes and nutrient-rich superfoods. 270 kcal per cup. Sourced from GA farms.',
    price: 15.99,
    images: [
      '/images/products/ChickenandSweetPotatoBowl.jpg'
    ],
    category: 'Dog Food',
    collection: 'fresh-food',
    tags: ['turkey', 'sweet-potato', 'grain-free', 'fresh'],
    status: 'active',
    ingredients: 'Turkey, Chicken Liver, Sweet Potatoes, Carrots, Squash, Zucchini, Green Beans, Cucumbers, Spinach, Kale, Apples, Cranberries, Blueberries, Collagen Powder, Pomegranate Powder, Pumpkin Powder, Oregano, Safflower Oil, Extra Virgin Olive Oil, Organic Coconut Oil, Turmeric, Ginger, Calcium Carbonate, Dicalcium Phosphate, Folic Acid, Vitamin E Supplement',
    analysis: 'Crude Protein (min) 8%, Crude Fat (min) 3%, Crude Fiber (max) 3%, Moisture (max) 76%. 270 kcal per cup',
    weight: '800g (4 cups)',
    inStock: true,
    stockQty: 9854
  },
  {
    id: 'beef-sweet-potato',
    handle: 'beef-farm-meal-copy',
    title: 'Beef & Sweet Potato Farm Meal',
    description: '750 Grams - 4 cups. Rich beef protein with sweet potatoes for active dogs. 303 kcal per cup. Sourced from grass-fed NC farms.',
    price: 16.99,
    images: [
      '/images/products/BeefandSweetPotatoBowl.jpg'
    ],
    category: 'Dog Food',
    collection: 'fresh-food',
    tags: ['beef', 'sweet-potato', 'high-protein', 'fresh', 'active-dogs'],
    status: 'active',
    ingredients: 'Beef, Beef Liver, Sweet Potatoes, Carrots, Squash, Zucchini, Green Beans, Cucumbers, Spinach, Kale, Apples, Cranberries, Blueberries, Collagen Powder, Pomegranate Powder, Pumpkin Powder, Oregano, Safflower Oil, Extra Virgin Olive Oil, Organic Coconut Oil, Turmeric, Ginger, Calcium Carbonate, Dicalcium Phosphate, Folic Acid, Vitamin E Supplement',
    analysis: 'Crude Protein (min) 11%, Crude Fat (min) 8%, Crude Fiber (max) 1.5%, Moisture (max) 72%. 303 kcal per cup',
    weight: '750g (4 cups)',
    inStock: true,
    stockQty: 9891
  },
  {
    id: 'beef-rice',
    handle: 'beef-farm-meal-copy-copy',
    title: 'Beef & Rice Farm Meal',
    description: '750 Grams - 4 cups. Hearty beef with rice for sustained energy. 320 kcal per cup. Sourced from grass-fed NC farms.',
    price: 16.99,
    images: [
      '/images/products/Beef_and_Rice_Bowl.jpg'
    ],
    category: 'Dog Food',
    collection: 'fresh-food',
    tags: ['beef', 'rice', 'high-protein', 'fresh'],
    status: 'active',
    ingredients: 'Beef, Beef Liver, Rice, Carrots, Squash, Zucchini, Green Beans, Cucumbers, Spinach, Kale, Apples, Cranberries, Blueberries, Collagen Powder, Pomegranate Powder, Pumpkin Powder, Oregano, Safflower Oil, Extra Virgin Olive Oil, Organic Coconut Oil, Turmeric, Ginger, Calcium Carbonate, Dicalcium Phosphate, Folic Acid, Vitamin E Supplement',
    analysis: 'Crude Protein (min) 11%, Crude Fat (min) 8%, Crude Fiber (max) 1.5%, Moisture (max) 72%. 320 kcal per cup',
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
      '/images/products/Waggin_Meals.png'
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
      '/images/products/PupALoafBoard72res.jpg'
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
      '/images/products/ChickenSuperfoodCakeBoard.jpg'
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
      '/images/products/Bone-Broth-Topper-Bowl-scaled_a43724fa-096f-44fb-a4c1-1a37180596c5.jpg'
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
    price: 19.00,
    images: [
      '/images/products/Prince-Jax-Stew-Bowl-scaled_f10ad903-2361-4b6c-ac52-c785dcdb5a49.jpg'
    ],
    category: 'Dog Food',
    collection: 'meal-toppers',
    tags: ['stew', 'turkey', 'beef-broth', 'topper', 'grain-free'],
    status: 'active',
    ingredients: 'Beef Bone Broth, Turkey, Sweet Potatoes, Carrots, Green Beans, Spinach, Kale, Apple Cider Vinegar, Oregano, Turmeric, Ginger',
    analysis: 'Crude Protein (min) 8%, Crude Fat (min) 3%, Crude Fiber (max) 1.5%, Moisture (max) 78%',
    weight: '5-cup pack',
    inStock: true,
    stockQty: 959
  },
  {
    id: 'pumpkin-broth',
    handle: 'pumpkin-broth',
    title: 'Daily Dish Pumpkin Broth',
    description: 'Shelf-stable pumpkin broth perfect for digestive support and hydration. Great for picky eaters or adding moisture to meals.',
    price: 9.99,
    images: ['/images/products/Waggin_Meals.png'],
    category: 'Dog Food',
    collection: 'meal-toppers',
    tags: ['broth', 'pumpkin', 'digestive-health', 'hydration', 'shelf-stable', 'topper'],
    status: 'active',
    ingredients: 'Pumpkin Puree, Bone Broth, Cinnamon, Ginger',
    analysis: 'Supports digestive health, rich in fiber',
    weight: '12 oz',
    inStock: true,
    stockQty: 100
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
      '/images/products/meatballs.jpg'
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
      '/images/products/LambChewyBars.jpg'
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
  },
  // === NOVEL PROTEIN BAKED BITES ===
  {
    id: 'rabbit-baked-bites',
    handle: 'rabbit-baked-bites',
    title: 'Rabbit Baked Bites',
    description: 'Premium novel protein treat perfect for dogs with food sensitivities. Made with 100% rabbit, these grain-free bites are ideal for elimination diets and training.',
    price: 13.99,
    images: ['/images/products/Waggin_Meals.png'],
    category: 'Dog Treats',
    collection: 'treats',
    tags: ['treats', 'rabbit', 'novel-protein', 'grain-free', 'allergy-friendly', 'training'],
    status: 'active',
    ingredients: 'Rabbit, Sweet Potato Flour, Coconut Oil',
    analysis: 'Single source novel protein, grain-free',
    weight: '4 oz',
    inStock: true,
    stockQty: 50
  },
  {
    id: 'venison-baked-bites',
    handle: 'venison-baked-bites',
    title: 'Venison Baked Bites',
    description: 'Wild-sourced venison treats perfect for sensitive stomachs. These grain-free, limited ingredient bites are ideal for dogs with food allergies or intolerances.',
    price: 13.99,
    images: ['/images/products/Waggin_Meals.png'],
    category: 'Dog Treats',
    collection: 'treats',
    tags: ['treats', 'venison', 'novel-protein', 'grain-free', 'allergy-friendly', 'training'],
    status: 'active',
    ingredients: 'Venison, Sweet Potato Flour, Coconut Oil',
    analysis: 'Single source novel protein, grain-free',
    weight: '4 oz',
    inStock: true,
    stockQty: 50
  },
  {
    id: 'duck-baked-bites',
    handle: 'duck-baked-bites',
    title: 'Duck Baked Bites',
    description: 'Rich, flavorful duck treats for dogs with chicken or beef sensitivities. Grain-free and perfect for picky eaters or dogs needing a novel protein source.',
    price: 13.99,
    images: ['/images/products/Waggin_Meals.png'],
    category: 'Dog Treats',
    collection: 'treats',
    tags: ['treats', 'duck', 'novel-protein', 'grain-free', 'allergy-friendly', 'training'],
    status: 'active',
    ingredients: 'Duck, Sweet Potato Flour, Coconut Oil',
    analysis: 'Single source novel protein, grain-free',
    weight: '4 oz',
    inStock: true,
    stockQty: 50
  },
  {
    id: 'salmon-baked-bites',
    handle: 'salmon-baked-bites',
    title: 'Salmon Baked Bites',
    description: 'Omega-3 rich salmon treats perfect for skin and coat health. Grain-free, limited ingredient recipe ideal for dogs with food sensitivities.',
    price: 13.99,
    images: ['/images/products/Waggin_Meals.png'],
    category: 'Dog Treats',
    collection: 'treats',
    tags: ['treats', 'salmon', 'novel-protein', 'grain-free', 'omega-3', 'skin-coat', 'training'],
    status: 'active',
    ingredients: 'Salmon, Sweet Potato Flour, Coconut Oil',
    analysis: 'Single source novel protein, grain-free, rich in Omega-3',
    weight: '4 oz',
    inStock: true,
    stockQty: 50
  },
  {
    id: 'alligator-baked-bites',
    handle: 'alligator-baked-bites',
    title: 'Alligator Baked Bites',
    description: 'Exotic novel protein perfect for dogs with multiple food allergies. Ultra-lean, grain-free, and hypoallergenic - ideal for elimination diets.',
    price: 13.99,
    images: ['/images/products/Waggin_Meals.png'],
    category: 'Dog Treats',
    collection: 'treats',
    tags: ['treats', 'alligator', 'novel-protein', 'grain-free', 'hypoallergenic', 'low-fat', 'training'],
    status: 'active',
    ingredients: 'Alligator, Sweet Potato Flour, Coconut Oil',
    analysis: 'Single source novel protein, grain-free, ultra-lean',
    weight: '4 oz',
    inStock: true,
    stockQty: 50
  },
  {
    id: 'wild-boar-baked-bites',
    handle: 'wild-boar-baked-bites',
    title: 'Wild Boar Baked Bites',
    description: 'Rich, gamey wild boar treats for adventurous eaters. Grain-free novel protein perfect for dogs with common protein allergies or sensitivities.',
    price: 13.99,
    images: ['/images/products/Waggin_Meals.png'],
    category: 'Dog Treats',
    collection: 'treats',
    tags: ['treats', 'wild-boar', 'novel-protein', 'grain-free', 'allergy-friendly', 'training'],
    status: 'active',
    ingredients: 'Wild Boar, Sweet Potato Flour, Coconut Oil',
    analysis: 'Single source novel protein, grain-free',
    weight: '4 oz',
    inStock: true,
    stockQty: 50
  }
];

// === WAGGIN MEALS CARE COLLECTION ===
export const careProducts: Product[] = [
  {
    id: 'bug-shield-soap',
    handle: 'bug-shield-dog-soap',
    title: 'Bug Shield Dog Soap',
    description: 'Natural bug-repelling dog soap with essential oils. Gentle formula cleanses while protecting against fleas, ticks, and mosquitoes. Made with neem oil, citronella, eucalyptus, and lavender.',
    price: 13.99,
    images: ['/images/products/Waggin_Meals.png'],
    category: 'Dog Care',
    collection: 'care',
    tags: ['soap', 'bug-repellent', 'natural', 'essential-oils', 'flea-tick'],
    status: 'active',
    ingredients: 'Saponified Oils (Coconut, Olive, Palm), Neem Oil, Citronella Essential Oil, Eucalyptus Essential Oil, Lavender Essential Oil, Cedarwood Essential Oil, Peppermint Essential Oil',
    analysis: 'Natural insect repellent, chemical-free',
    weight: '4 oz bar',
    inStock: true,
    stockQty: 75
  },
  {
    id: 'bug-shield-spray',
    handle: 'bug-shield-spray',
    title: 'Bug Shield Spray',
    description: 'All-natural bug repellent spray for dogs. Botanical blend of essential oils safely repels fleas, ticks, and mosquitoes. No harsh chemicals - just pure plant power.',
    price: 12.99,
    images: ['/images/products/Waggin_Meals.png'],
    category: 'Dog Care',
    collection: 'care',
    tags: ['spray', 'bug-repellent', 'natural', 'essential-oils', 'flea-tick', 'chemical-free'],
    status: 'active',
    ingredients: 'Distilled Water, Witch Hazel, Neem Oil, Citronella Essential Oil, Eucalyptus Essential Oil, Lavender Essential Oil, Cedarwood Essential Oil, Lemongrass Essential Oil, Peppermint Essential Oil',
    analysis: 'Botanical insect repellent, safe for daily use',
    weight: '8 oz spray bottle',
    inStock: true,
    stockQty: 100
  },
  {
    id: 'derma-shield-shampoo',
    handle: 'derma-shield-shampoo',
    title: 'Derma Shield Shampoo',
    description: 'Gentle, therapeutic shampoo for sensitive skin. Soothes irritation, reduces inflammation, and promotes healing. Perfect for dogs with skin allergies, hot spots, or dermatitis.',
    price: 13.99,
    images: ['/images/products/Waggin_Meals.png'],
    category: 'Dog Care',
    collection: 'care',
    tags: ['shampoo', 'sensitive-skin', 'therapeutic', 'anti-inflammatory', 'healing', 'allergies'],
    status: 'active',
    ingredients: 'Aloe Vera Juice, Saponified Oils (Coconut, Olive), Colloidal Oatmeal, Calendula Extract, Chamomile Extract, Lavender Essential Oil, Tea Tree Oil, Vitamin E',
    analysis: 'pH-balanced, hypoallergenic, soap-free',
    weight: '8 oz bottle',
    inStock: true,
    stockQty: 80
  }
];

// === BUNDLES COLLECTION ===
export const bundleProducts: Product[] = [
  {
    id: 'smart-pup-starter-pack',
    handle: 'smart-pup-starter-pack',
    title: 'Smart Pup Starter Pack',
    description: 'Perfect introduction to Waggin Meals! Includes 2 farm meal packs (your choice of protein), 1 superfood topper, and a training treat sample. Great for trying our products or gifting to a new dog parent.',
    price: 49.99,
    compareAtPrice: 55.00,
    images: ['/images/products/Waggin_Meals.png'],
    category: 'Bundles',
    collection: 'bundles',
    tags: ['bundle', 'starter', 'sample', 'gift'],
    status: 'active',
    ingredients: 'Bundle includes: 2 Fresh Farm Meals (choice of protein), 1 Superfood Topper (2 oz sample), 1 Training Treat Pack',
    weight: 'Variety bundle',
    inStock: true,
    stockQty: 25,
    hasVariants: true
  },
  {
    id: 'standard-pup-pack',
    handle: 'standard-pup-pack',
    title: 'Standard Pup Pack',
    description: 'Everything your pup needs for a week! Includes 4 farm meal packs (mix proteins), 1 full-size superfood topper, 1 bone broth, and a healthy treat pack. Save $12 vs buying individually.',
    price: 89.99,
    compareAtPrice: 102.00,
    images: ['/images/products/Waggin_Meals.png'],
    category: 'Bundles',
    collection: 'bundles',
    tags: ['bundle', 'weekly', 'value', 'complete'],
    status: 'active',
    ingredients: 'Bundle includes: 4 Fresh Farm Meals (choice of proteins), 1 Superfood Topper (6 oz), 1 Bone & Veggie Broth, 1 Healthy Treat Pack',
    weight: 'Weekly supply',
    inStock: true,
    stockQty: 30,
    hasVariants: true
  },
  {
    id: 'premium-pup-pack',
    handle: 'premium-pup-pack',
    title: 'Premium Pup Pack',
    description: 'The ultimate monthly nutrition package! Includes 16 farm meal packs (variety of proteins), 2 superfood toppers, 2 bone broths, Pup-a-Loaf, treat variety pack, and your choice of 1 care product. Save $35!',
    price: 249.99,
    compareAtPrice: 285.00,
    images: ['/images/products/Waggin_Meals.png'],
    category: 'Bundles',
    collection: 'bundles',
    tags: ['bundle', 'monthly', 'premium', 'complete', 'best-value'],
    status: 'active',
    ingredients: 'Bundle includes: 16 Fresh Farm Meals (variety), 2 Superfood Toppers, 2 Bone Broths, 1 Pup-a-Loaf, Treat Variety Pack (3 flavors), 1 Care Product (choice of Bug Shield Soap, Bug Shield Spray, or Derma Shield Shampoo)',
    weight: 'Monthly supply',
    inStock: true,
    stockQty: 20,
    hasVariants: true
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
  },
  {
    id: 'care',
    name: 'Waggin Meals Care',
    slug: 'care',
    description: 'Natural care products for your dog\'s skin and coat. Bug repellent soaps, sprays, and therapeutic shampoos made with essential oils and botanicals.',
    image: '/images/products/Waggin_Meals.png',
    products: careProducts
  },
  {
    id: 'bundles',
    name: 'Value Bundles',
    slug: 'bundles',
    description: 'Save money with our curated bundles! Starter packs, weekly supplies, and premium monthly packages. Everything your dog needs in one convenient package.',
    image: '/images/products/Waggin_Meals.png',
    products: bundleProducts
  }
];

// === ALL PRODUCTS ===
export const allProducts: Product[] = [
  ...freshFoodProducts,
  ...mealToppersProducts,
  ...treatsProducts,
  ...careProducts,
  ...bundleProducts
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

// Enhanced Product Data with Comprehensive Details
// This file contains detailed product information including nutritional analysis,
// source information, and health recommendations

import { EnhancedProduct, calculateDryMatter } from '@/types/enhanced-product';

export const enhancedFreshFoodProducts: EnhancedProduct[] = [
  {
    // === CHICKEN & SWEET POTATO ===
    id: 'chicken-sweet-potato',
    handle: 'chicken-farm-meal-copy',
    title: 'Chicken & Sweet Potato Farm Meal',
    description: 'Fresh, human-grade chicken with nutrient-rich sweet potatoes and organic superfoods. Grain-free and gently cooked for optimal digestion.',
    detailedDescription: 'Our Chicken & Sweet Potato Farm Meal combines lean, free-range chicken with sweet potatoes to create a grain-free, highly digestible meal perfect for dogs with grain sensitivities. Packed with antioxidant-rich superfoods including kale, spinach, cranberries, and blueberries, this meal supports immune health, healthy digestion, and vibrant energy. Gently cooked in small batches to preserve nutrients while ensuring food safety.',
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
    weight: '800g (4 cups)',
    inStock: true,
    stockQty: 9908,

    ingredients: 'Fresh Chicken (hormone & antibiotic-free), Organic Sweet Potatoes, Carrots, Squash, Zucchini, Green Beans, Cucumbers, Organic Spinach, Organic Kale, Apples, Cranberries, Blueberries, Grass-fed Collagen Powder, Pomegranate Powder, Pumpkin Powder, Oregano, Safflower Oil, Extra Virgin Olive Oil, Organic Coconut Oil, Turmeric, Ginger, Calcium Carbonate, Dicalcium Phosphate, Folic Acid, Vitamin E Supplement',

    guaranteedAnalysis: {
      protein: {
        min: '8%',
        dryMatter: '30.8%'  // Calculated: 8 / (100-74) = 30.8%
      },
      fat: {
        min: '3%',
        dryMatter: '11.5%'
      },
      fiber: {
        max: '3%',
        dryMatter: '11.5%'
      },
      moisture: {
        max: '74%'
      },
      calories: {
        perCup: '200 kcal/cup',
        perGram: '1.0 kcal/g'
      }
    },

    nutritionalHighlights: {
      keyNutrients: ['B Vitamins (B3, B6)', 'Selenium', 'Phosphorus', 'Beta-Carotene', 'Vitamin A', 'Fiber'],
      benefits: [
        'Lean protein supports muscle health without excess fat',
        'Sweet potatoes provide sustained energy and digestive fiber',
        'Antioxidants from superfoods support immune function',
        'Omega fatty acids promote healthy skin and coat',
        'Gently cooked to preserve nutrients'
      ]
    },

    sourceInformation: {
      protein: 'Free-range chicken from NC and TN farms, hormone and antibiotic-free, USDA-inspected',
      vegetables: 'Locally-sourced organic vegetables from NC, TN, and GA farms when seasonally available',
      quality: 'Human-grade ingredients prepared in a USDA-certified kitchen with strict food safety protocols'
    },

    carbBenefits: {
      name: 'Sweet Potato',
      type: 'Grain-free complex carbohydrate',
      benefits: [
        'High in dietary fiber for healthy digestion',
        'Rich in beta-carotene (converts to vitamin A)',
        'Provides steady, sustained energy without blood sugar spikes',
        'Contains vitamins C and B6, manganese, and potassium',
        'Naturally anti-inflammatory properties'
      ],
      bestFor: [
        'Dogs with grain sensitivities or allergies',
        'Active dogs needing sustained energy',
        'Dogs with inflammatory conditions',
        'Supporting healthy digestion',
        'Weight management (fiber keeps dogs satisfied)'
      ]
    },

    healthRecommendations: {
      idealFor: [
        'Dogs with grain sensitivities or celiac-like conditions',
        'Active and working dogs needing sustained energy',
        'Dogs with inflammatory conditions (arthritis, IBD)',
        'Puppies and growing dogs',
        'Dogs recovering from illness (highly digestible)',
        'Weight management programs (fiber provides satiety)'
      ],
      notRecommendedFor: [
        'Dogs with confirmed chicken allergies',
        'Dogs requiring ultra-low fat diets for severe pancreatitis'
      ],
      feedingGuidance: 'Feed according to your dog\'s weight, age, and activity level. Can be fed as a complete meal or mixed with kibble as a topper. Store refrigerated for up to 5 days or freeze for up to 6 months. Thaw in refrigerator before serving.'
    }
  },

  {
    // === CHICKEN & RICE ===
    id: 'chicken-rice',
    handle: 'chicken-farm-meal',
    title: 'Chicken & Rice Farm Meal',
    description: 'Complete and balanced chicken meal with easily digestible rice, perfect for sensitive stomachs and everyday nutrition.',
    detailedDescription: 'Our Chicken & Rice Farm Meal is the gold standard for dogs with sensitive digestive systems. Combining lean, hormone-free chicken with white rice creates a gentle, highly digestible meal that soothes upset stomachs while providing complete nutrition. This meal is veterinarian-recommended for dogs recovering from digestive issues, bland diet protocols, and everyday feeding for dogs who thrive on simplicity.',
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
    weight: '800g (4 cups)',
    inStock: true,
    stockQty: 9892,

    ingredients: 'Fresh Chicken (hormone & antibiotic-free), White Rice, Carrots, Squash, Zucchini, Green Beans, Cucumbers, Organic Spinach, Organic Kale, Apples, Cranberries, Blueberries, Grass-fed Collagen Powder, Pomegranate Powder, Pumpkin Powder, Oregano, Safflower Oil, Extra Virgin Olive Oil, Organic Coconut Oil, Turmeric, Ginger, Calcium Carbonate, Dicalcium Phosphate, Folic Acid, Vitamin E Supplement',

    guaranteedAnalysis: {
      protein: {
        min: '8%',
        dryMatter: '29.6%'  // 8 / (100-73) = 29.6%
      },
      fat: {
        min: '3%',
        dryMatter: '11.1%'
      },
      fiber: {
        max: '1.5%',
        dryMatter: '5.6%'
      },
      moisture: {
        max: '73%'
      },
      calories: {
        perCup: '205 kcal/cup',
        perGram: '1.03 kcal/g'
      }
    },

    nutritionalHighlights: {
      keyNutrients: ['B Vitamins (B3, B6)', 'Selenium', 'Phosphorus', 'Easy-digest Carbohydrates', 'Joint-supporting Collagen'],
      benefits: [
        'Ultra-lean protein gentle on sensitive stomachs',
        'White rice is the most digestible carbohydrate',
        'Low fiber content reduces digestive workload',
        'Collagen supports joint health and gut lining',
        'Veterinarian-recommended for bland diets'
      ]
    },

    sourceInformation: {
      protein: 'Free-range chicken from NC and TN farms, hormone and antibiotic-free, USDA-inspected',
      vegetables: 'Locally-sourced organic vegetables from NC, TN, and GA farms when seasonally available',
      quality: 'Human-grade ingredients prepared in a USDA-certified kitchen with strict food safety protocols'
    },

    carbBenefits: {
      name: 'White Rice',
      type: 'Highly digestible complex carbohydrate',
      benefits: [
        'Easiest grain to digest - gentle on sensitive stomachs',
        'Low fiber content reduces digestive stress',
        'Quick energy source without digestive upset',
        'Naturally gluten-free',
        'Helps firm stools in dogs with diarrhea',
        'Bland flavor profile ideal for picky eaters'
      ],
      bestFor: [
        'Dogs with sensitive stomachs or digestive issues',
        'Recovery from vomiting or diarrhea (bland diet)',
        'Dogs with inflammatory bowel disease (IBD)',
        'Post-surgery recovery',
        'Senior dogs with slowed digestion',
        'Dogs with pancreatitis (ultra-low fat)'
      ]
    },

    healthRecommendations: {
      idealFor: [
        'Dogs with sensitive stomachs or chronic digestive issues',
        'Recovery from gastrointestinal upset (vet-recommended bland diet)',
        'Dogs with inflammatory bowel disease (IBD)',
        'Post-operative recovery',
        'Senior dogs with reduced digestive capacity',
        'Dogs with pancreatitis (lean protein, low fat)',
        'Picky eaters (mild, familiar flavors)',
        'Everyday feeding for healthy dogs'
      ],
      notRecommendedFor: [
        'Dogs with confirmed chicken allergies',
        'Dogs with diabetes (white rice has higher glycemic index)'
      ],
      feedingGuidance: 'Ideal as a complete meal or therapeutic bland diet. Can be mixed with kibble or fed alone. For digestive upset, feed small, frequent meals throughout the day. Store refrigerated for up to 5 days or freeze for up to 6 months.'
    }
  },

  {
    // === TURKEY & RICE ===
    id: 'turkey-rice',
    handle: 'turkey-farm-meal-copy-1',
    title: 'Turkey & Rice Farm Meal',
    description: 'Ultra-lean turkey protein with rice and superfoods. Perfect for weight management, anxious dogs, and gentle nutrition.',
    detailedDescription: 'Our Turkey & Rice Farm Meal offers the leanest protein option for dogs needing low-fat nutrition without compromising on taste or nutrients. Turkey\'s natural tryptophan content promotes calmness in anxious or hyperactive dogs, while the easily digestible rice provides gentle energy. This meal is ideal for weight management, pancreatitis recovery, and dogs who need a chicken alternative.',
    price: 15.99,
    images: [
      '/images/products/Chicken_and_Rice_Bowl.jpg',
      '/images/products/Turkey_Rice.jpg',
      '/images/products/Turkey_and_Rice.jpg'
    ],
    category: 'Dog Food',
    collection: 'fresh-food',
    tags: ['turkey', 'rice', 'lean-protein', 'fresh', 'calming', 'weight-management'],
    status: 'active',
    weight: '800g (4 cups)',
    inStock: true,
    stockQty: 9918,

    ingredients: 'Fresh Turkey (hormone & antibiotic-free), White Rice, Carrots, Squash, Zucchini, Green Beans, Cucumbers, Organic Spinach, Organic Kale, Apples, Cranberries, Blueberries, Grass-fed Collagen Powder, Pomegranate Powder, Pumpkin Powder, Oregano, Safflower Oil, Extra Virgin Olive Oil, Organic Coconut Oil, Turmeric, Ginger, Calcium Carbonate, Dicalcium Phosphate, Folic Acid, Vitamin E Supplement',

    guaranteedAnalysis: {
      protein: {
        min: '8%',
        dryMatter: '30.8%'  // 8 / (100-74) = 30.8%
      },
      fat: {
        min: '3%',
        dryMatter: '11.5%'
      },
      fiber: {
        max: '1.5%',
        dryMatter: '5.8%'
      },
      moisture: {
        max: '74%'
      },
      calories: {
        perCup: '195 kcal/cup',
        perGram: '0.98 kcal/g'
      }
    },

    nutritionalHighlights: {
      keyNutrients: ['Tryptophan (calming)', 'B Vitamins (B3, B6)', 'Selenium', 'Zinc', 'Phosphorus', 'Low Fat'],
      benefits: [
        'Ultra-lean protein (lower fat than chicken)',
        'Tryptophan promotes calmness and better sleep',
        'Less allergenic than chicken for sensitive dogs',
        'Supports healthy weight loss and maintenance',
        'High in B vitamins for energy metabolism',
        'Joint-supporting collagen for mobility'
      ]
    },

    sourceInformation: {
      protein: 'Free-range turkey from NC and TN farms, hormone and antibiotic-free, USDA-inspected',
      vegetables: 'Locally-sourced organic vegetables from NC, TN, and GA farms when seasonally available',
      quality: 'Human-grade ingredients prepared in a USDA-certified kitchen with strict food safety protocols'
    },

    carbBenefits: {
      name: 'White Rice',
      type: 'Highly digestible complex carbohydrate',
      benefits: [
        'Easiest grain to digest - gentle on sensitive stomachs',
        'Low fiber content reduces digestive stress',
        'Quick energy source without digestive upset',
        'Naturally gluten-free',
        'Helps firm stools in dogs with diarrhea',
        'Bland flavor profile ideal for picky eaters'
      ],
      bestFor: [
        'Dogs with sensitive stomachs or digestive issues',
        'Recovery from vomiting or diarrhea (bland diet)',
        'Dogs with inflammatory bowel disease (IBD)',
        'Post-surgery recovery',
        'Senior dogs with slowed digestion',
        'Weight management (low calorie density)'
      ]
    },

    healthRecommendations: {
      idealFor: [
        'Dogs with chicken allergies or sensitivities',
        'Anxious, reactive, or hyperactive dogs (tryptophan benefits)',
        'Dogs with pancreatitis or pancreatic sensitivity',
        'Weight management and obesity',
        'Senior dogs needing lean, gentle nutrition',
        'Dogs recovering from illness',
        'Protein rotation diets',
        'Dogs needing calming support'
      ],
      notRecommendedFor: [
        'Very active dogs needing higher fat for energy (unless supplemented)',
        'Dogs with diabetes (white rice has higher glycemic index)'
      ],
      feedingGuidance: 'Perfect for weight loss programs - measure carefully and adjust portions based on weight loss goals. Can be fed as complete meal or mixed with vegetables for volume. Many owners report calmer, more balanced dogs within 2-3 weeks.'
    }
  },

  {
    // === TURKEY & SWEET POTATO ===
    id: 'turkey-sweet-potato',
    handle: 'turkey-farm-meal-copy',
    title: 'Turkey & Sweet Potato Farm Meal',
    description: 'Grain-free turkey with nutrient-rich sweet potatoes. Lean protein for active dogs with grain sensitivities.',
    detailedDescription: 'Our Turkey & Sweet Potato Farm Meal combines the calming benefits of turkey with the sustained energy of sweet potatoes. This grain-free formula is perfect for active dogs with grain sensitivities who need lean protein without excess fat. Turkey\'s natural tryptophan supports emotional balance, while sweet potato fiber promotes healthy digestion and steady energy levels.',
    price: 15.99,
    images: [
      '/images/products/ChickenandSweetPotatoBowl.jpg',
      '/images/products/Turkey_and_Sweet_Potato_copy_385764f1-975a-4e36-82a8-3319670f7b23.jpg',
      '/images/products/Turkey_SP.jpg'
    ],
    category: 'Dog Food',
    collection: 'fresh-food',
    tags: ['turkey', 'sweet-potato', 'grain-free', 'fresh', 'calming'],
    status: 'active',
    weight: '800g (4 cups)',
    inStock: true,
    stockQty: 9854,

    ingredients: 'Fresh Turkey (hormone & antibiotic-free), Organic Sweet Potatoes, Carrots, Squash, Zucchini, Green Beans, Cucumbers, Organic Spinach, Organic Kale, Apples, Cranberries, Blueberries, Grass-fed Collagen Powder, Pomegranate Powder, Pumpkin Powder, Oregano, Safflower Oil, Extra Virgin Olive Oil, Organic Coconut Oil, Turmeric, Ginger, Calcium Carbonate, Dicalcium Phosphate, Folic Acid, Vitamin E Supplement',

    guaranteedAnalysis: {
      protein: {
        min: '8%',
        dryMatter: '33.3%'  // 8 / (100-76) = 33.3%
      },
      fat: {
        min: '3%',
        dryMatter: '12.5%'
      },
      fiber: {
        max: '3%',
        dryMatter: '12.5%'
      },
      moisture: {
        max: '76%'
      },
      calories: {
        perCup: '190 kcal/cup',
        perGram: '0.95 kcal/g'
      }
    },

    nutritionalHighlights: {
      keyNutrients: ['Tryptophan (calming)', 'Beta-Carotene', 'B Vitamins', 'Fiber', 'Vitamin A', 'Antioxidants'],
      benefits: [
        'Lean protein supports muscle without excess calories',
        'Tryptophan promotes calmness and stress reduction',
        'Sweet potato fiber supports digestive health',
        'Grain-free for dogs with sensitivities',
        'Beta-carotene supports eye and skin health',
        'Sustained energy without blood sugar spikes'
      ]
    },

    sourceInformation: {
      protein: 'Free-range turkey from NC and TN farms, hormone and antibiotic-free, USDA-inspected',
      vegetables: 'Locally-sourced organic vegetables from NC, TN, and GA farms when seasonally available',
      quality: 'Human-grade ingredients prepared in a USDA-certified kitchen with strict food safety protocols'
    },

    carbBenefits: {
      name: 'Sweet Potato',
      type: 'Grain-free complex carbohydrate',
      benefits: [
        'High in dietary fiber for healthy digestion',
        'Rich in beta-carotene (converts to vitamin A)',
        'Provides steady, sustained energy without blood sugar spikes',
        'Contains vitamins C and B6, manganese, and potassium',
        'Naturally anti-inflammatory properties'
      ],
      bestFor: [
        'Dogs with grain sensitivities or allergies',
        'Active dogs needing sustained energy',
        'Dogs with inflammatory conditions',
        'Supporting healthy digestion',
        'Weight management (fiber keeps dogs satisfied)'
      ]
    },

    healthRecommendations: {
      idealFor: [
        'Dogs with grain sensitivities or celiac-like conditions',
        'Chicken-allergic dogs needing an alternative',
        'Anxious or hyperactive dogs (calming tryptophan)',
        'Active dogs needing lean, sustained energy',
        'Dogs with inflammatory conditions',
        'Weight management (low fat, high fiber)',
        'Protein rotation diets'
      ],
      notRecommendedFor: [
        'Dogs requiring ultra-low fiber diets',
        'Very active dogs needing higher fat content'
      ],
      feedingGuidance: 'Excellent for active dogs who need lean protein and sustained energy. Many owners report improved calmness and focus within 2-3 weeks. Can be fed as a complete meal or mixed with other proteins for variety.'
    }
  },

  {
    // === BEEF & SWEET POTATO ===
    id: 'beef-sweet-potato',
    handle: 'beef-farm-meal-copy',
    title: 'Beef & Sweet Potato Farm Meal',
    description: 'Rich, grass-fed beef with sweet potatoes. Packed with iron and protein for active, working, and growing dogs.',
    detailedDescription: 'Our Beef & Sweet Potato Farm Meal provides the richest protein and highest iron content of all our meals. Made with grass-fed beef from local NC farms, this grain-free formula combines muscle-building protein with the sustained energy of sweet potatoes. Perfect for active dogs, working dogs, puppies, and dogs needing to build or maintain lean muscle mass.',
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
    weight: '750g (4 cups)',
    inStock: true,
    stockQty: 9891,

    ingredients: 'Grass-fed Beef (hormone & antibiotic-free), Organic Sweet Potatoes, Carrots, Squash, Zucchini, Green Beans, Cucumbers, Organic Spinach, Organic Kale, Apples, Cranberries, Blueberries, Grass-fed Collagen Powder, Pomegranate Powder, Pumpkin Powder, Oregano, Safflower Oil, Extra Virgin Olive Oil, Organic Coconut Oil, Turmeric, Ginger, Calcium Carbonate, Dicalcium Phosphate, Folic Acid, Vitamin E Supplement',

    guaranteedAnalysis: {
      protein: {
        min: '11%',
        dryMatter: '39.3%'  // 11 / (100-72) = 39.3%
      },
      fat: {
        min: '8%',
        dryMatter: '28.6%'
      },
      fiber: {
        max: '1.5%',
        dryMatter: '5.4%'
      },
      moisture: {
        max: '72%'
      },
      calories: {
        perCup: '265 kcal/cup',
        perGram: '1.41 kcal/g'
      }
    },

    nutritionalHighlights: {
      keyNutrients: ['Heme Iron (highly absorbable)', 'B12', 'Zinc', 'Creatine', 'B6', 'Selenium', 'Beta-Carotene'],
      benefits: [
        'Highest protein content for muscle development',
        'Rich heme iron prevents anemia and boosts energy',
        'B12 supports nerve function and red blood cells',
        'Creatine supports muscle energy and recovery',
        'Zinc strengthens immune system',
        'Highly palatable - even picky eaters love it'
      ]
    },

    sourceInformation: {
      protein: 'Grass-fed beef from NC, TN, and GA pasture-raised farms, hormone and antibiotic-free, USDA-inspected',
      vegetables: 'Locally-sourced organic vegetables from NC, TN, and GA farms when seasonally available',
      quality: 'Human-grade ingredients prepared in a USDA-certified kitchen with strict food safety protocols'
    },

    carbBenefits: {
      name: 'Sweet Potato',
      type: 'Grain-free complex carbohydrate',
      benefits: [
        'High in dietary fiber for healthy digestion',
        'Rich in beta-carotene (converts to vitamin A)',
        'Provides steady, sustained energy without blood sugar spikes',
        'Contains vitamins C and B6, manganese, and potassium',
        'Naturally anti-inflammatory properties'
      ],
      bestFor: [
        'Dogs with grain sensitivities or allergies',
        'Active dogs needing sustained energy',
        'Dogs with inflammatory conditions',
        'Supporting healthy digestion',
        'Muscle building and recovery'
      ]
    },

    healthRecommendations: {
      idealFor: [
        'Active and working dogs with high energy needs',
        'Growing puppies (when properly balanced)',
        'Dogs with anemia or low iron levels',
        'Underweight dogs needing to gain muscle',
        'Picky eaters (highly palatable)',
        'Dogs with no food sensitivities',
        'Sporting and performance dogs',
        'Muscle recovery and building'
      ],
      notRecommendedFor: [
        'Dogs with confirmed beef allergies',
        'Dogs with pancreatitis (higher fat content)',
        'Overweight dogs (unless portion-controlled)',
        'Dogs on elimination diets (common allergen)'
      ],
      feedingGuidance: 'Best for active dogs with high energy needs. Monitor portions for less active dogs to prevent weight gain. Excellent for building or maintaining lean muscle mass. Can be mixed with leaner proteins for dogs needing lower fat.'
    }
  },

  {
    // === BEEF & RICE ===
    id: 'beef-rice',
    handle: 'beef-farm-meal-copy-copy',
    title: 'Beef & Rice Farm Meal',
    description: 'Hearty grass-fed beef with easily digestible rice. Complete nutrition for sustained energy and muscle health.',
    detailedDescription: 'Our Beef & Rice Farm Meal pairs the rich protein and iron of grass-fed beef with the gentle digestibility of white rice. This classic combination provides complete nutrition with easy digestion, making it suitable for dogs who tolerate beef well but need a gentler carbohydrate than sweet potato. Perfect for active dogs, working dogs, and those needing to build or maintain muscle mass.',
    price: 16.99,
    images: [
      '/images/products/Beef_and_Rice_Bowl.jpg',
      '/images/products/Beef_and_Rice_d876c154-b6d9-4efb-b88b-955caca7a311.jpg',
      '/images/products/Beef_Rice.jpg'
    ],
    category: 'Dog Food',
    collection: 'fresh-food',
    tags: ['beef', 'rice', 'high-protein', 'fresh', 'muscle-building'],
    status: 'active',
    weight: '750g (4 cups)',
    inStock: true,
    stockQty: 9881,

    ingredients: 'Grass-fed Beef (hormone & antibiotic-free), White Rice, Carrots, Squash, Zucchini, Green Beans, Cucumbers, Organic Spinach, Organic Kale, Apples, Cranberries, Blueberries, Grass-fed Collagen Powder, Pomegranate Powder, Pumpkin Powder, Oregano, Safflower Oil, Extra Virgin Olive Oil, Organic Coconut Oil, Turmeric, Ginger, Calcium Carbonate, Dicalcium Phosphate, Folic Acid, Vitamin E Supplement',

    guaranteedAnalysis: {
      protein: {
        min: '11%',
        dryMatter: '39.3%'  // 11 / (100-72) = 39.3%
      },
      fat: {
        min: '8%',
        dryMatter: '28.6%'
      },
      fiber: {
        max: '1.5%',
        dryMatter: '5.4%'
      },
      moisture: {
        max: '72%'
      },
      calories: {
        perCup: '270 kcal/cup',
        perGram: '1.44 kcal/g'
      }
    },

    nutritionalHighlights: {
      keyNutrients: ['Heme Iron (highly absorbable)', 'B12', 'Zinc', 'Creatine', 'B6', 'Selenium', 'Easy-digest Carbs'],
      benefits: [
        'Highest protein content for muscle development',
        'Rich heme iron prevents anemia and boosts energy',
        'B12 supports nerve function and red blood cells',
        'Creatine supports muscle energy and recovery',
        'Rice provides quick, digestible energy',
        'Lower fiber for sensitive stomachs'
      ]
    },

    sourceInformation: {
      protein: 'Grass-fed beef from NC, TN, and GA pasture-raised farms, hormone and antibiotic-free, USDA-inspected',
      vegetables: 'Locally-sourced organic vegetables from NC, TN, and GA farms when seasonally available',
      quality: 'Human-grade ingredients prepared in a USDA-certified kitchen with strict food safety protocols'
    },

    carbBenefits: {
      name: 'White Rice',
      type: 'Highly digestible complex carbohydrate',
      benefits: [
        'Easiest grain to digest - gentle on stomachs',
        'Low fiber content reduces digestive workload',
        'Quick energy source for active dogs',
        'Naturally gluten-free',
        'Helps firm stools',
        'Pairs well with rich proteins like beef'
      ],
      bestFor: [
        'Active dogs needing quick energy',
        'Dogs with sensitive stomachs',
        'Building and maintaining muscle mass',
        'Dogs who do not tolerate high-fiber diets',
        'Working dogs and sporting breeds',
        'Everyday feeding for healthy, active dogs'
      ]
    },

    healthRecommendations: {
      idealFor: [
        'Active and working dogs with high energy needs',
        'Sporting dogs and performance animals',
        'Dogs needing muscle development or recovery',
        'Underweight dogs needing to gain',
        'Dogs with anemia or low iron levels',
        'Picky eaters (highly palatable)',
        'Dogs who tolerate beef but need easier digestion than sweet potato',
        'Everyday feeding for healthy, active dogs'
      ],
      notRecommendedFor: [
        'Dogs with confirmed beef allergies',
        'Dogs with pancreatitis (higher fat content)',
        'Overweight or sedentary dogs (unless portion-controlled)',
        'Dogs on elimination diets (beef is a common allergen)',
        'Dogs with diabetes (white rice has higher glycemic index)'
      ],
      feedingGuidance: 'Ideal for active dogs needing muscle-building protein and quick energy. Monitor portions for less active dogs to prevent weight gain. Can be mixed with leaner proteins for dogs needing balanced nutrition. Excellent for muscle recovery after exercise.'
    }
  }
];

// Export individual products for easy access
export const chickenSweetPotato = enhancedFreshFoodProducts[0];
export const chickenRice = enhancedFreshFoodProducts[1];
export const turkeyRice = enhancedFreshFoodProducts[2];
export const turkeySweetPotato = enhancedFreshFoodProducts[3];
export const beefSweetPotato = enhancedFreshFoodProducts[4];
export const beefRice = enhancedFreshFoodProducts[5];

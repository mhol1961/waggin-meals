const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const bundles = [
  {
    name: 'Smart Pup Starter Pack',
    slug: 'smart-pup-starter',
    description: 'Everything you need to start your dog\'s fresh food journey. Includes 2 meals, bone broth, and a fresh topper.',
    tagline: 'Perfect for trying fresh food',
    base_price: 71.98,
    savings_amount: 8.00,
    is_best_value: false,
    is_featured: false,
    badge_text: 'Great Start',
    image_url: '/images/bundles/smart-pup-starter.jpg',
    customizable: true,
    metadata: {
      subscriptionOptions: ['one-time', 'weekly', 'biweekly', 'monthly', '4-weeks', '6-weeks', '8-weeks'],
      features: [
        '2 Meal Packs (your choice)',
        '1 Bone & Veggie Broth',
        '1 Fresh Topper',
        'Save $8.00',
        'Shipping Included (+$1 per Beef Meal)',
      ],
      shipping: 'Included (+$1 per Beef Meal)'
    },
    included_items: [
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
    name: 'Standard Pup Pack',
    slug: 'standard-pup-pack',
    description: 'Our most popular bundle for dogs who love variety. Includes 6 meals, bone broth, and a fresh topper.',
    tagline: 'Most popular choice',
    base_price: 146.99,
    savings_amount: 17.00,
    is_best_value: false,
    is_featured: true,
    badge_text: 'Most Popular',
    image_url: '/images/bundles/standard-pup-pack.jpg',
    customizable: true,
    metadata: {
      subscriptionOptions: ['one-time', 'weekly', 'biweekly', 'monthly', '4-weeks', '6-weeks', '8-weeks'],
      features: [
        '6 Meal Packs (your choice)',
        '1 Bone & Veggie Broth',
        '1 Fresh Topper',
        'Save $17.00',
        'Shipping Included (+$1 per Beef Meal)',
      ],
      shipping: 'Included (+$1 per Beef Meal)'
    },
    included_items: [
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
    name: 'Premium Pup Pack',
    slug: 'premium-pup-pack',
    description: 'Our best value bundle! Includes 10 meals and 2 bone broths - perfect for consistent fresh feeding.',
    tagline: 'Best value for fresh feeding',
    base_price: 169.99,
    savings_amount: 19.00,
    is_best_value: true,
    is_featured: true,
    badge_text: 'Best Value',
    image_url: '/images/bundles/premium-pup-pack.jpg',
    customizable: true,
    metadata: {
      subscriptionOptions: ['one-time', 'weekly', 'biweekly', 'monthly', '4-weeks', '6-weeks', '8-weeks'],
      features: [
        '10 Meal Packs (your choice)',
        '2 Bone & Veggie Broths',
        'Save $19.00',
        'Shipping Included (+$1 per Beef Meal)',
        'Best Price Per Meal',
      ],
      shipping: 'Included (+$1 per Beef Meal)'
    },
    included_items: [
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
    name: 'Waggin Meals Club Box',
    slug: 'waggin-meals-club-box',
    description: 'A curated box of goodies for your pup! Get 3 tail-waggin\' items plus a special surprise every delivery.',
    tagline: 'Tail-waggin\' surprises every month',
    base_price: 49.99,
    savings_amount: 0,
    is_best_value: false,
    is_featured: true,
    badge_text: 'Subscription Only',
    image_url: '/images/bundles/waggin-meals-club-box.jpg',
    customizable: false,
    metadata: {
      subscriptionOptions: ['4-weeks', '6-weeks', '8-weeks'],
      features: [
        '3 Curated Items',
        'Special Surprise Gift',
        'Recurring Delivery',
        'Flexible Schedule (4, 6, or 8 weeks)',
        'Cancel Anytime',
      ],
      shipping: 'Included'
    },
    included_items: [
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

async function seedBundles() {
  try {
    console.log('🌱 Starting bundle seeding...\n');

    // Clear existing bundles
    console.log('Clearing existing bundles...');
    const { error: deleteError } = await supabase
      .from('bundles')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.error('Error clearing bundles:', deleteError);
      throw deleteError;
    }

    console.log('✓ Existing bundles cleared\n');

    // Insert bundles
    for (const bundle of bundles) {
      console.log(`Inserting: ${bundle.name}...`);

      const { data, error } = await supabase
        .from('bundles')
        .insert([bundle])
        .select()
        .single();

      if (error) {
        console.error(`Error inserting ${bundle.name}:`, error);
        throw error;
      }

      console.log(`✓ ${bundle.name} inserted with ID: ${data.id}`);
    }

    console.log('\n✅ Bundle seeding completed successfully!');
    console.log(`\n📊 Total bundles: ${bundles.length}`);
    console.log('   - Smart Pup Starter Pack: $71.98 (Save $8)');
    console.log('   - Standard Pup Pack: $146.99 (Save $17)');
    console.log('   - Premium Pup Pack: $169.99 (Save $19) ⭐ BEST VALUE');
    console.log('   - Waggin Meals Club Box: $49.99');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedBundles();

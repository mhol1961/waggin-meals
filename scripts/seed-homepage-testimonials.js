/**
 * Seed testimonials from homepage to database
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const testimonialsFromHomepage = [
  {
    dog_name: 'Maisy',
    owner_name: 'Matt Wolfe',
    quote: 'Our dog Maisy absolutely devours the fresh meals that Christie prepares. And it\'s satisfying to know the food is prepared by a pet nutritionist. Can\'t recommend her enough.',
    category: 'Customer Reviews',
    rating: 5,
    is_published: true,
    is_featured: true,
    location: '',
    problem: 'General Nutrition',
    result: 'Happy & Healthy',
    service: 'Fresh Meals',
    image_url: null,
  },
  {
    dog_name: 'Large Pup',
    owner_name: 'Elizabeth Joslin',
    quote: 'Our large pup loves their food and broth! Christie is so helpful, kind & very knowledgeable about canine nutrition! You can tell she genuinely cares about your dog\'s health and not just selling products. They also offer a private dog park that you can rent hourly! We recently rented the park for our pups birthday and had a blast.',
    category: 'Customer Reviews',
    rating: 5,
    is_published: true,
    is_featured: true,
    location: '',
    problem: 'General Nutrition',
    result: 'Happy & Healthy',
    service: 'Fresh Meals',
    image_url: null,
  },
  {
    dog_name: 'Two Girls',
    owner_name: 'Amber Munoz',
    quote: 'My dogs love this food!! I love the convenience and nutritional value this company provides. I know both of my dogs are getting the best quality ingredients. Both my girls look forward to meal times as they love the taste of the food and jump for joy.',
    category: 'Customer Reviews',
    rating: 5,
    is_published: true,
    is_featured: true,
    location: '',
    problem: 'General Nutrition',
    result: 'Happy & Healthy',
    service: 'Fresh Meals',
    image_url: null,
  },
  {
    dog_name: 'Pet',
    owner_name: 'Thom Slater',
    quote: 'Top notch, prepared fresh on-site healthiest possible dog meals and treats! Certified and experienced owners & staff who care about your pets and you!! The new location is fantastic!!',
    category: 'Customer Reviews',
    rating: 5,
    is_published: true,
    is_featured: true,
    location: '',
    problem: 'General Nutrition',
    result: 'Happy & Healthy',
    service: 'Fresh Meals',
    image_url: null,
  },
];

async function seedTestimonials() {
  console.log('🌱 Seeding homepage testimonials...\n');

  // Check existing testimonials
  const { data: existing } = await supabase
    .from('testimonials')
    .select('owner_name');

  const existingOwners = existing?.map(t => t.owner_name) || [];
  console.log(`📋 Found ${existing?.length || 0} existing testimonials\n`);

  // Insert new testimonials (skip if owner already exists)
  let inserted = 0;
  let skipped = 0;

  for (const testimonial of testimonialsFromHomepage) {
    if (existingOwners.includes(testimonial.owner_name)) {
      console.log(`⏭️  Skipping ${testimonial.owner_name} (already exists)`);
      skipped++;
      continue;
    }

    const { data, error } = await supabase
      .from('testimonials')
      .insert([testimonial])
      .select();

    if (error) {
      console.error(`❌ Error inserting ${testimonial.owner_name}:`, error);
    } else {
      console.log(`✅ Added testimonial from ${testimonial.owner_name}`);
      inserted++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`✅ Inserted: ${inserted}`);
  console.log(`⏭️  Skipped (duplicates): ${skipped}`);
  console.log(`📝 Total testimonials now in database: ${(existing?.length || 0) + inserted}`);
}

seedTestimonials().catch(console.error);

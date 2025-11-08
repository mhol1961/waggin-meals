const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Map of product handles to their correct image paths
const imageUpdates = {
  // Skin Care Line
  'bug-shield-dog-soap': ['/Bug Shield Soap.jpeg'],
  'bug-shield-spray': ['/Bug Shield Spray.jpeg', '/Bug Spray 2.jpeg'],
  'derma-shield-shampoo': ['/Derma Shield Shampoo.jpeg', '/Derma Shield Shampoo Close Up.jpeg'],

  // Broth
  'pumpkin-broth': ['/Pumpkin Broth.jpeg'],

  // Bundles/Packs
  'premium-pup-pack': ['/Bundles.jpeg'],
  'standard-pup-pack': ['/Bundles.jpeg'],
  'smart-pup-starter-pack': ['/Bundles.jpeg'],

  // Baked Bites (use treat line image for now)
  'alligator-baked-bites': ['/New Treat Line to put on picture for Variants.jpeg'],
  'duck-baked-bites': ['/New Treat Line to put on picture for Variants.jpeg'],
  'rabbit-baked-bites': ['/New Treat Line to put on picture for Variants.jpeg'],
  'salmon-baked-bites': ['/New Treat Line to put on picture for Variants.jpeg'],
  'venison-baked-bites': ['/New Treat Line to put on picture for Variants.jpeg'],
  'wild-boar-baked-bites': ['/New Treat Line to put on picture for Variants.jpeg'],

  // Travel Fee Consultations (use Expert Consultation image)
  'consultation-travel-buncombe-madison': ['/images/Expert Consultation.jpg'],
  'consultation-travel-hendersonville-yancey': ['/images/Expert Consultation.jpg'],
  'consultation-travel-macon-swain': ['/images/Expert Consultation.jpg'],
};

async function fixProductImages() {
  console.log('\n=== FIXING PRODUCT IMAGES ===\n');

  for (const [handle, images] of Object.entries(imageUpdates)) {
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('id, title')
      .eq('handle', handle)
      .single();

    if (fetchError || !product) {
      console.log(`❌ Product not found: ${handle}`);
      continue;
    }

    const { error: updateError } = await supabase
      .from('products')
      .update({ images })
      .eq('id', product.id);

    if (updateError) {
      console.log(`❌ Failed to update ${product.title}:`, updateError.message);
    } else {
      console.log(`✅ Updated ${product.title}`);
      console.log(`   Images: ${images.join(', ')}`);
    }
  }

  console.log('\n=== DONE ===\n');
}

fixProductImages();

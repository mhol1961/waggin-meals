const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkProductImages() {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, title, handle, images')
    .order('title');

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  console.log('\n=== PRODUCTS WITH MISSING OR PLACEHOLDER IMAGES ===\n');

  products.forEach(product => {
    const hasNoImages = !product.images || product.images.length === 0;
    const hasPlaceholder = product.images?.some(img =>
      img.includes('placeholder') || img.includes('https://via.placeholder.com')
    );

    if (hasNoImages || hasPlaceholder) {
      console.log(`\n❌ ${product.title}`);
      console.log(`   Handle: ${product.handle}`);
      console.log(`   Images: ${product.images?.length || 0} total`);
      if (product.images && product.images.length > 0) {
        product.images.forEach((img, i) => {
          console.log(`     ${i + 1}. ${img}`);
        });
      }
    }
  });

  console.log('\n\n=== ALL PRODUCTS AND THEIR IMAGES ===\n');

  products.forEach(product => {
    console.log(`\n${product.title}`);
    console.log(`  Handle: ${product.handle}`);
    if (product.images && product.images.length > 0) {
      product.images.forEach((img, i) => {
        console.log(`  ${i + 1}. ${img}`);
      });
    } else {
      console.log(`  Images: NONE`);
    }
  });
}

checkProductImages();

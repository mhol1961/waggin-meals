/**
 * Create $1 Test Product
 * Creates a simple $1 product for testing the checkout flow
 *
 * Usage: node scripts/create-test-product.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const testProduct = {
  handle: 'test-product-1-dollar',
  title: '🧪 Test Product - $1',
  description: 'This is a test product for checkout testing only. DO NOT ship this product. Price: $1.00 for safe testing. Contains no actual food - this is purely for testing the checkout flow.',
  price: 1.00,
  compare_at_price: null,
  images: ['/images/logo-waggin-meals.png'],
  category: 'test',
  tags: ['test', 'checkout-test', 'do-not-ship'],
  weight: '1 test unit',
  sku: 'TEST-001',
  inventory_count: 999,
  inventory_quantity: 999,
  in_stock: true,
  is_published: true,
  is_featured: false,
  has_variants: false,
  track_inventory: true,
  low_stock_threshold: 5,
  allow_backorder: false
};

async function createTestProduct() {
  console.log('🧪 Creating $1 test product for checkout testing...\n');

  try {
    // Check if test product already exists
    const { data: existingProduct } = await supabase
      .from('products')
      .select('id, handle, title')
      .eq('handle', testProduct.handle)
      .single();

    if (existingProduct) {
      console.log('✅ Test product already exists!');
      console.log('   ID:', existingProduct.id);
      console.log('   Title:', existingProduct.title);
      console.log('   Handle:', existingProduct.handle);
      console.log('\n📍 URL: /products/test-product-1-dollar');
      console.log('💰 Price: $1.00\n');
      return existingProduct;
    }

    // Insert the test product
    const { data: newProduct, error } = await supabase
      .from('products')
      .insert([testProduct])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating test product:', error.message);
      throw error;
    }

    console.log('✅ Test product created successfully!');
    console.log('   ID:', newProduct.id);
    console.log('   Title:', newProduct.title);
    console.log('   Handle:', newProduct.handle);
    console.log('   Price: $' + newProduct.price.toFixed(2));
    console.log('\n📍 Product URL: /products/test-product-1-dollar');
    console.log('🛒 Add to cart and test checkout!');
    console.log('\n⚠️  REMEMBER: This is a TEST product - do not fulfill orders for this item!\n');

    return newProduct;
  } catch (error) {
    console.error('❌ Failed to create test product:', error);
    process.exit(1);
  }
}

// Run the script
createTestProduct()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });

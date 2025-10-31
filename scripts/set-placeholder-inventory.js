/**
 * Set Placeholder Inventory Quantities
 * Sets random but realistic inventory counts for all products
 *
 * This is temporary - Christie will update with real counts later
 *
 * Usage: node scripts/set-placeholder-inventory.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Generate random inventory between min and max
function randomInventory(min = 50, max = 500) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Some realistic-looking inventory numbers
const inventoryOptions = [45, 72, 89, 127, 156, 189, 222, 267, 298, 332, 387, 445, 478];

function getRandomInventory() {
  // 70% chance of using a preset number, 30% chance of random
  if (Math.random() < 0.7) {
    return inventoryOptions[Math.floor(Math.random() * inventoryOptions.length)];
  }
  return randomInventory(40, 500);
}

async function setPlaceholderInventory() {
  console.log('📦 Setting placeholder inventory quantities for all products...\n');

  try {
    // Fetch all products
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, title, handle, inventory_count, category')
      .order('title');

    if (fetchError) {
      console.error('❌ Error fetching products:', fetchError.message);
      throw fetchError;
    }

    if (!products || products.length === 0) {
      console.log('⚠️  No products found in database');
      return;
    }

    console.log(`Found ${products.length} products\n`);

    let updated = 0;
    let skipped = 0;

    for (const product of products) {
      // Skip the test product
      if (product.handle === 'test-product-1-dollar') {
        console.log(`  ⏭️  Skipped: ${product.title} (test product)`);
        skipped++;
        continue;
      }

      // Generate random inventory
      const newInventory = getRandomInventory();

      // Update inventory
      const { error: updateError } = await supabase
        .from('products')
        .update({
          inventory_count: newInventory,
          inventory_quantity: newInventory,
          in_stock: true,
          low_stock_threshold: 5
        })
        .eq('id', product.id);

      if (updateError) {
        console.error(`  ❌ Error updating ${product.title}:`, updateError.message);
      } else {
        const oldCount = product.inventory_count || 0;
        console.log(`  ✅ ${product.title}`);
        console.log(`     ${oldCount} → ${newInventory} units`);
        updated++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Inventory Update Summary');
    console.log('='.repeat(60));
    console.log(`✅ Products updated: ${updated}`);
    console.log(`⏭️  Products skipped: ${skipped}`);
    console.log(`\n💡 NOTE: These are placeholder numbers.`);
    console.log(`   Christie can update with real counts via admin panel later.\n`);

  } catch (error) {
    console.error('❌ Failed to set inventory:', error);
    process.exit(1);
  }
}

// Run the script
setPlaceholderInventory()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });

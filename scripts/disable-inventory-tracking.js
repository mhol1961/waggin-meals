/**
 * Disable inventory tracking for all products
 * Christie doesn't want stock tracking enabled
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function disableInventoryTracking() {
  console.log('🔧 Disabling inventory tracking for all products...\n');

  try {
    // Update all products to not track inventory
    const { data, error, count } = await supabase
      .from('products')
      .update({ track_inventory: false })
      .eq('track_inventory', true)
      .select('id, handle, title');

    if (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }

    console.log(`✅ Updated ${data?.length || 0} products`);
    console.log('   Inventory tracking is now DISABLED for all products');
    console.log('   Products can be purchased without stock limits\n');

    // Verify
    const { data: verifyData } = await supabase
      .from('products')
      .select('track_inventory')
      .eq('track_inventory', true);

    if (verifyData && verifyData.length === 0) {
      console.log('✅ Verification passed: No products tracking inventory');
    } else {
      console.log(`⚠️  Warning: ${verifyData?.length || 0} products still tracking inventory`);
    }

  } catch (err) {
    console.error('❌ Failed:', err.message);
    process.exit(1);
  }
}

disableInventoryTracking();

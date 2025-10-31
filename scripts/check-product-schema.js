/**
 * Check Products Table Schema
 * Fetches one product to see what columns actually exist
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSchema() {
  console.log('🔍 Checking products table schema...\n');

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .limit(1)
    .single();

  if (error) {
    console.error('❌ Error fetching product:', error);
    return;
  }

  console.log('✅ Sample product fetched!\n');
  console.log('📋 Available columns:');
  console.log(Object.keys(data).sort());
  console.log('\n📦 Sample product data:');
  console.log(JSON.stringify(data, null, 2));
}

checkSchema().then(() => process.exit(0)).catch(console.error);

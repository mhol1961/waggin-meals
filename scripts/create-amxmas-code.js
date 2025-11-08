/**
 * Create AMXMAS Discount Code
 *
 * Usage: node scripts/create-amxmas-code.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createDiscountCode() {
  console.log('Creating AMXMAS discount code...\n');

  // What type of discount? Let me create a flexible one
  // You can modify these values:
  const discountCode = {
    code: 'AMXMAS',
    discount_type: 'percentage', // or 'fixed'
    discount_value: 15, // 15% off - change this as needed
    description: 'Christmas 2024 Special Discount',
    is_active: true,
    minimum_purchase: null, // No minimum purchase
    usage_limit: null, // Unlimited uses
    usage_count: 0,
    starts_at: new Date().toISOString(),
    expires_at: '2025-01-15T23:59:59Z', // Valid through Jan 15, 2025
    created_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from('discount_codes')
      .insert([discountCode])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        console.log('⚠️  AMXMAS code already exists. Updating it instead...\n');

        const { data: updated, error: updateError } = await supabase
          .from('discount_codes')
          .update({
            discount_value: discountCode.discount_value,
            description: discountCode.description,
            is_active: true,
            expires_at: discountCode.expires_at,
          })
          .eq('code', 'AMXMAS')
          .select()
          .single();

        if (updateError) {
          throw updateError;
        }

        console.log('✅ AMXMAS code updated successfully!\n');
        console.log(updated);
        return;
      }
      throw error;
    }

    console.log('✅ AMXMAS discount code created successfully!\n');
    console.log('Code:', data.code);
    console.log('Type:', data.discount_type);
    console.log('Value:', data.discount_value + (data.discount_type === 'percentage' ? '%' : '$'));
    console.log('Expires:', data.expires_at);
    console.log('Usage Limit:', data.usage_limit || 'Unlimited');
    console.log('\nCustomers can now use code "AMXMAS" at checkout!');

  } catch (error) {
    console.error('❌ Error creating discount code:', error.message);
    process.exit(1);
  }
}

createDiscountCode();

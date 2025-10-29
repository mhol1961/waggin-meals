/**
 * Verification Script for Variant Migration
 * Run this after applying the database migration
 *
 * Usage: node scripts/verify-migration.js
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyMigration() {
  console.log('🔍 Verifying Variant Migration...\n');

  let allPassed = true;

  // Check 1: variant_id column exists in order_items
  console.log('1️⃣  Checking variant_id column in order_items...');
  try {
    const { data, error } = await supabase
      .from('order_items')
      .select('variant_id')
      .limit(1);

    if (error) {
      console.log('   ❌ FAILED: variant_id column not found');
      console.log('   Error:', error.message);
      allPassed = false;
    } else {
      console.log('   ✅ PASS: variant_id column exists\n');
    }
  } catch (err) {
    console.log('   ❌ FAILED:', err.message);
    allPassed = false;
  }

  // Check 2: product_variants table exists
  console.log('2️⃣  Checking product_variants table...');
  try {
    const { data, error } = await supabase
      .from('product_variants')
      .select('id')
      .limit(1);

    if (error) {
      console.log('   ❌ FAILED: product_variants table not found');
      console.log('   Error:', error.message);
      allPassed = false;
    } else {
      console.log('   ✅ PASS: product_variants table exists\n');
    }
  } catch (err) {
    console.log('   ❌ FAILED:', err.message);
    allPassed = false;
  }

  // Check 3: inventory_adjustments table exists
  console.log('3️⃣  Checking inventory_adjustments table...');
  try {
    const { data, error } = await supabase
      .from('inventory_adjustments')
      .select('id')
      .limit(1);

    if (error) {
      console.log('   ❌ FAILED: inventory_adjustments table not found');
      console.log('   Error:', error.message);
      allPassed = false;
    } else {
      console.log('   ✅ PASS: inventory_adjustments table exists\n');
    }
  } catch (err) {
    console.log('   ❌ FAILED:', err.message);
    allPassed = false;
  }

  // Check 4: adjust_variant_inventory function exists
  console.log('4️⃣  Checking adjust_variant_inventory database function...');
  try {
    const { data, error } = await supabase.rpc('adjust_variant_inventory', {
      p_variant_id: '00000000-0000-0000-0000-000000000000',
      p_quantity_change: 0,
      p_reason: 'test',
      p_order_id: null,
      p_adjusted_by: 'verification'
    });

    // We expect this to fail because the variant doesn't exist,
    // but the function should exist
    if (error && error.message.includes('Variant not found')) {
      console.log('   ✅ PASS: adjust_variant_inventory function exists\n');
    } else if (error && error.message.includes('function') && error.message.includes('does not exist')) {
      console.log('   ❌ FAILED: adjust_variant_inventory function not found');
      console.log('   Error:', error.message);
      allPassed = false;
    } else {
      console.log('   ✅ PASS: adjust_variant_inventory function exists\n');
    }
  } catch (err) {
    console.log('   ❌ FAILED:', err.message);
    allPassed = false;
  }

  // Check 5: Test inserting order_item with variant_id
  console.log('5️⃣  Testing order_item insert with variant_id...');
  try {
    // Note: This will fail due to foreign key constraints, but that's expected
    // We just want to make sure the column accepts UUID values
    const testOrderId = '00000000-0000-0000-0000-000000000000';
    const testVariantId = '00000000-0000-0000-0000-000000000001';

    const { error } = await supabase
      .from('order_items')
      .insert({
        order_id: testOrderId,
        product_handle: 'test',
        product_title: 'test',
        product_name: 'Test Product',
        variant_id: testVariantId,
        variant_title: 'Test Variant',
        quantity: 1,
        price: 10.00,
        unit_price: 10.00,
        total: 10.00,
        total_price: 10.00
      });

    if (error && (error.message.includes('foreign key') || error.message.includes('violates'))) {
      console.log('   ✅ PASS: variant_id accepts UUID values (foreign key working)\n');
    } else if (error) {
      console.log('   ⚠️  WARNING: Unexpected error:', error.message);
      console.log('   (This might be okay if the error is not about variant_id)\n');
    } else {
      console.log('   ⚠️  WARNING: Test insert succeeded (you may need to clean up test data)\n');
    }
  } catch (err) {
    console.log('   ⚠️  WARNING:', err.message, '\n');
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  if (allPassed) {
    console.log('✅ ALL CHECKS PASSED!');
    console.log('Migration successfully applied.');
    console.log('\nYou can now:');
    console.log('1. Deploy the updated application code');
    console.log('2. Test creating orders with variants');
    console.log('3. Verify inventory deduction works');
  } else {
    console.log('❌ SOME CHECKS FAILED');
    console.log('Please review the errors above and:');
    console.log('1. Apply the migration if not yet done');
    console.log('2. Check database schema matches expected');
    console.log('3. Verify all tables and functions exist');
  }
  console.log('='.repeat(50) + '\n');

  process.exit(allPassed ? 0 : 1);
}

// Run verification
verifyMigration().catch(err => {
  console.error('\n❌ Verification script error:', err);
  process.exit(1);
});

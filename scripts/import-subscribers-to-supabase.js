/**
 * Subscriber Import to Supabase Script
 *
 * This script:
 * 1. Reads subscribers-with-tokens.json
 * 2. Creates customers in Supabase
 * 3. Creates customer addresses
 * 4. Creates subscriptions with secure tokens
 * 5. Reports import results
 *
 * Run: node scripts/import-subscribers-to-supabase.js
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  console.log('🐾 Waggin\' Meals Subscriber Import to Supabase\n');

  // Read the generated subscriber data
  const subscribersPath = path.join(__dirname, '../shopify-files/subscribers-with-tokens.json');

  if (!fs.existsSync(subscribersPath)) {
    console.error('❌ subscribers-with-tokens.json not found!');
    console.error('   Please run generate-subscriber-tokens.js first.\n');
    process.exit(1);
  }

  const subscribers = JSON.parse(fs.readFileSync(subscribersPath, 'utf-8'));
  console.log(`📊 Found ${subscribers.length} subscribers to import\n`);

  const results = {
    successful: 0,
    failed: 0,
    errors: [],
  };

  // Import each subscriber
  for (const subscriber of subscribers) {
    try {
      await importSubscriber(subscriber, results);
    } catch (error) {
      console.error(`❌ Failed to import ${subscriber.email}:`, error.message);
      results.errors.push({
        email: subscriber.email,
        error: error.message,
      });
      results.failed++;
    }
  }

  // Print summary
  console.log('\n📊 Import Summary:');
  console.log(`   Total: ${subscribers.length}`);
  console.log(`   ✅ Successful: ${results.successful}`);
  console.log(`   ❌ Failed: ${results.failed}`);

  if (results.errors.length > 0) {
    console.log('\n⚠️  Errors:');
    results.errors.forEach(err => {
      console.log(`   ${err.email}: ${err.error}`);
    });
  }

  console.log('\n✅ Import complete!');
  console.log('\n📋 Next steps:');
  console.log('   1. Import ghl-import.csv into GoHighLevel');
  console.log('   2. Tag all subscribers "Needs Re-Authorization"');
  console.log('   3. Launch re-authorization campaign');
  console.log('   4. Monitor completion rate daily\n');
}

async function importSubscriber(subscriber, results) {
  console.log(`Importing ${subscriber.email}...`);

  // Step 1: Create or update customer
  const { data: existingCustomer } = await supabase
    .from('customers')
    .select('id')
    .eq('email', subscriber.email)
    .single();

  let customerId;

  if (existingCustomer) {
    // Update existing customer
    const { data: updatedCustomer, error: updateError } = await supabase
      .from('customers')
      .update({
        first_name: subscriber.first_name,
        last_name: subscriber.last_name,
        phone: subscriber.phone || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingCustomer.id)
      .select()
      .single();

    if (updateError) throw new Error(`Failed to update customer: ${updateError.message}`);
    customerId = updatedCustomer.id;
    console.log(`  ↻ Updated existing customer`);
  } else {
    // Create new customer
    const { data: newCustomer, error: createError } = await supabase
      .from('customers')
      .insert({
        email: subscriber.email,
        first_name: subscriber.first_name,
        last_name: subscriber.last_name,
        phone: subscriber.phone || null,
        total_orders: subscriber.order_count || 0,
        total_spent: subscriber.total_spent || 0,
      })
      .select()
      .single();

    if (createError) throw new Error(`Failed to create customer: ${createError.message}`);
    customerId = newCustomer.id;
    console.log(`  ✓ Created new customer`);
  }

  // Step 2: Create address if provided
  let addressId = null;

  if (subscriber.address_line1 && subscriber.city && subscriber.state && subscriber.zip_code) {
    const { data: address, error: addressError } = await supabase
      .from('customer_addresses')
      .insert({
        customer_id: customerId,
        first_name: subscriber.first_name,
        last_name: subscriber.last_name,
        address_line1: subscriber.address_line1,
        address_line2: subscriber.address_line2 || null,
        city: subscriber.city,
        state: subscriber.state,
        zip_code: subscriber.zip_code,
        country: subscriber.country || 'US',
        phone: subscriber.phone || null,
        is_default: true,
      })
      .select()
      .single();

    if (addressError) {
      console.log(`  ⚠️  Address creation failed: ${addressError.message}`);
    } else {
      addressId = address.id;
      console.log(`  ✓ Created address`);
    }
  }

  // Step 3: Create subscription with secure token
  const { data: subscription, error: subscriptionError } = await supabase
    .from('subscriptions')
    .insert({
      customer_id: customerId,
      status: subscriber.status || 'pending_payment',
      frequency: subscriber.frequency || 'monthly',
      items: JSON.stringify([
        {
          product_id: null, // Will be updated when customer re-authorizes
          product_name: 'Subscription Box',
          quantity: 1,
          price: subscriber.subscription_price || 0,
        },
      ]),
      subtotal: subscriber.subscription_price || 0,
      shipping_cost: 0, // Will be calculated on first order
      tax_amount: 0, // Will be calculated on first order
      total: subscriber.subscription_price || 0,
      next_billing_date: subscriber.next_billing_date,
      shipping_address_id: addressId,
      secure_token: subscriber.secure_token,
      token_expires_at: subscriber.token_expires_at,
      failed_payment_count: 0,
    })
    .select()
    .single();

  if (subscriptionError) {
    throw new Error(`Failed to create subscription: ${subscriptionError.message}`);
  }

  console.log(`  ✓ Created subscription with secure token`);
  console.log(`  🔗 Portal: ${subscriber.portal_url}`);

  results.successful++;
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

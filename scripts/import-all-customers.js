/**
 * All Customers Import Script
 *
 * This script imports ALL customers from Shopify (not just subscribers):
 * 1. Reads customers_export.csv
 * 2. Creates customers in Supabase
 * 3. Creates their default addresses
 * 4. Preserves order history metadata
 *
 * This is separate from subscription migration - this imports
 * ALL existing Shopify customers regardless of subscription status.
 *
 * Run: node scripts/import-all-customers.js
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// CSV parser
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      rows.push(row);
    }
  }

  return rows;
}

function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim().replace(/^"|"$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim().replace(/^"|"$/g, ''));
  return values;
}

function parseShopifyNumber(value) {
  if (!value) return 0;
  // Remove currency symbols, commas, and parse
  const cleaned = value.replace(/[$,]/g, '');
  return parseFloat(cleaned) || 0;
}

async function main() {
  console.log('🐾 Waggin\' Meals - Import All Customers from Shopify\n');
  console.log('='.repeat(60));

  // Read customers export
  const customersPath = path.join(__dirname, '../shopify-files/customers_export.csv');

  if (!fs.existsSync(customersPath)) {
    console.error('❌ customers_export.csv not found!');
    console.error('   Please ensure the file is in shopify-files/ folder.\n');
    process.exit(1);
  }

  const customers = parseCSV(customersPath);
  console.log(`\n📊 Found ${customers.length} customers in Shopify export\n`);

  const results = {
    successful: 0,
    updated: 0,
    failed: 0,
    errors: [],
  };

  // Import each customer
  for (const customer of customers) {
    try {
      await importCustomer(customer, results);
    } catch (error) {
      console.error(`❌ Failed to import ${customer.Email}:`, error.message);
      results.errors.push({
        email: customer.Email,
        error: error.message,
      });
      results.failed++;
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Import Summary:');
  console.log(`   Total: ${customers.length}`);
  console.log(`   ✅ Created: ${results.successful}`);
  console.log(`   ↻  Updated: ${results.updated}`);
  console.log(`   ❌ Failed: ${results.failed}`);

  if (results.errors.length > 0) {
    console.log('\n⚠️  Errors:');
    results.errors.slice(0, 10).forEach(err => {
      console.log(`   ${err.email}: ${err.error}`);
    });
    if (results.errors.length > 10) {
      console.log(`   ... and ${results.errors.length - 10} more errors`);
    }
  }

  console.log('\n✅ Customer import complete!');
  console.log('\n📋 Next step:');
  console.log('   Run: node scripts/generate-subscriber-tokens.js\n');
}

async function importCustomer(customer, results) {
  const email = customer.Email?.trim();

  if (!email) {
    console.log(`⚠️  Skipping customer with no email`);
    results.failed++;
    return;
  }

  // Check if customer already exists
  const { data: existingCustomer } = await supabase
    .from('customers')
    .select('id')
    .eq('email', email)
    .single();

  // Parse Shopify data
  const firstName = customer['First Name'] || '';
  const lastName = customer['Last Name'] || '';
  const phone = customer.Phone || customer['Default Address Phone'] || null;
  const totalOrders = parseInt(customer['Orders Count']) || 0;
  const totalSpent = parseShopifyNumber(customer['Total Spent']);
  const tags = customer.Tags || '';
  const note = customer.Note || '';

  let customerId;

  if (existingCustomer) {
    // Update existing customer
    const { data: updatedCustomer, error: updateError } = await supabase
      .from('customers')
      .update({
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        total_orders: totalOrders,
        total_spent: totalSpent,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingCustomer.id)
      .select()
      .single();

    if (updateError) throw new Error(`Failed to update customer: ${updateError.message}`);
    customerId = updatedCustomer.id;
    console.log(`↻  Updated: ${email}`);
    results.updated++;
  } else {
    // Create new customer
    const { data: newCustomer, error: createError } = await supabase
      .from('customers')
      .insert({
        email: email,
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        total_orders: totalOrders,
        total_spent: totalSpent,
      })
      .select()
      .single();

    if (createError) throw new Error(`Failed to create customer: ${createError.message}`);
    customerId = newCustomer.id;
    console.log(`✓  Created: ${email}`);
    results.successful++;
  }

  // Create default address if provided
  const addressLine1 = customer['Default Address Address1'];
  const city = customer['Default Address City'];
  const state = customer['Default Address Province Code'];
  const zipCode = customer['Default Address Zip'];

  if (addressLine1 && city && state && zipCode) {
    // Check if address already exists
    const { data: existingAddress } = await supabase
      .from('customer_addresses')
      .select('id')
      .eq('customer_id', customerId)
      .eq('address_line1', addressLine1)
      .eq('city', city)
      .eq('state', state)
      .single();

    if (!existingAddress) {
      const { error: addressError } = await supabase
        .from('customer_addresses')
        .insert({
          customer_id: customerId,
          first_name: firstName,
          last_name: lastName,
          address_line1: addressLine1,
          address_line2: customer['Default Address Address2'] || null,
          city: city,
          state: state,
          zip_code: zipCode,
          country: customer['Default Address Country'] || 'US',
          phone: phone,
          is_default: true,
        });

      if (addressError) {
        console.log(`  ⚠️  Address creation failed for ${email}: ${addressError.message}`);
      }
    }
  }
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

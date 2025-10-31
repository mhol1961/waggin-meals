/**
 * Import Customers and Orders from Shopify CSV Exports to Supabase
 * Run with: npx tsx scripts/import-customers-orders.ts
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import path from 'path';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

// Load environment variables
config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ShopifyCustomer {
  'Customer ID': string;
  'First Name': string;
  'Last Name': string;
  'Email': string;
  'Accepts Email Marketing': string;
  'Default Address Address1': string;
  'Default Address Address2': string;
  'Default Address City': string;
  'Default Address Province Code': string;
  'Default Address Country Code': string;
  'Default Address Zip': string;
  'Default Address Phone': string;
  'Phone': string;
  'Total Spent': string;
  'Total Orders': string;
  'Tags': string;
}

interface ShopifyOrder {
  'Name': string;
  'Email': string;
  'Financial Status': string;
  'Fulfillment Status': string;
  'Subtotal': string;
  'Shipping': string;
  'Taxes': string;
  'Total': string;
  'Created at': string;
  'Lineitem name': string;
  'Lineitem quantity': string;
  'Lineitem price': string;
  'Billing Name': string;
  'Billing Address1': string;
  'Billing City': string;
  'Billing Zip': string;
  'Billing Province': string;
  'Billing Country': string;
  'Shipping Name': string;
  'Shipping Address1': string;
  'Shipping City': string;
  'Shipping Zip': string;
  'Shipping Province': string;
  'Shipping Country': string;
  'Tags': string;
  'Id': string;
}

async function importCustomers() {
  console.log('\n🚀 Importing customers from CSV...\n');

  const customersFile = fs.readFileSync(
    path.join(process.cwd(), 'shopify-files', 'customers_export.csv'),
    'utf-8'
  );

  const customers = parse(customersFile, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
  }) as ShopifyCustomer[];

  console.log(`📦 Found ${customers.length} customers in CSV\n`);

  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  for (const customer of customers) {
    try {
      // Clean up customer ID (remove leading quote if present)
      const shopifyId = customer['Customer ID'].replace(/^'/, '');
      const email = customer['Email'];

      if (!email) {
        console.log(`⏭️  Skipping customer with no email (ID: ${shopifyId})`);
        skippedCount++;
        continue;
      }

      // Check if customer already exists by email
      const { data: existing } = await supabase
        .from('customers')
        .select('id')
        .eq('email', email)
        .single();

      if (existing) {
        console.log(`⏭️  Skipping "${email}" (already exists)`);
        skippedCount++;
        continue;
      }

      // Prepare customer data (using only existing columns)
      const customerData = {
        email: email,
        first_name: customer['First Name'] || null,
        last_name: customer['Last Name'] || null,
        phone: customer['Phone'] || customer['Default Address Phone'] || null,
        total_spent: parseFloat(customer['Total Spent']) || 0,
        order_count: parseInt(customer['Total Orders']) || 0,
      };

      const { error } = await supabase
        .from('customers')
        .insert(customerData);

      if (error) {
        console.error(`❌ Error importing "${email}":`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Imported: ${email}`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Error processing customer:`, err);
      errorCount++;
    }
  }

  console.log(`\n📊 Customer Import Summary:`);
  console.log(`   ✅ Successfully imported: ${successCount}`);
  console.log(`   ⏭️  Skipped (already exist or no email): ${skippedCount}`);
  console.log(`   ❌ Errors: ${errorCount}\n`);

  return successCount;
}

async function importOrders() {
  console.log('\n🚀 Importing orders from CSV...\n');

  const ordersFile = fs.readFileSync(
    path.join(process.cwd(), 'shopify-files', 'orders_export_1.csv'),
    'utf-8'
  );

  const orderRows = parse(ordersFile, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
  }) as ShopifyOrder[];

  console.log(`📦 Found ${orderRows.length} order rows in CSV\n`);

  // Group rows by order number (Name field)
  const ordersMap = new Map<string, ShopifyOrder[]>();
  for (const row of orderRows) {
    const orderName = row['Name'];
    if (!ordersMap.has(orderName)) {
      ordersMap.set(orderName, []);
    }
    ordersMap.get(orderName)!.push(row);
  }

  console.log(`📦 Found ${ordersMap.size} unique orders\n`);

  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  for (const [orderName, rows] of ordersMap) {
    try {
      const firstRow = rows[0];
      const shopifyOrderId = firstRow['Id'];

      if (!shopifyOrderId) {
        console.log(`⏭️  Skipping order ${orderName} (no ID)`);
        skippedCount++;
        continue;
      }

      // Check if order already exists by order number
      const { data: existing } = await supabase
        .from('orders')
        .select('id')
        .eq('order_number', orderName)
        .single();

      if (existing) {
        console.log(`⏭️  Skipping order #${orderName} (already exists)`);
        skippedCount++;
        continue;
      }

      // Find customer by email
      const email = firstRow['Email'];
      const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', email)
        .single();

      if (!customer) {
        console.log(`⚠️  Customer not found for ${email}, skipping order #${orderName}`);
        skippedCount++;
        continue;
      }

      // Parse shipping name
      const shippingNameParts = firstRow['Shipping Name']?.split(' ') || [];
      const shippingFirstName = shippingNameParts[0] || '';
      const shippingLastName = shippingNameParts.slice(1).join(' ') || '';

      // Prepare order data to match the actual orders table schema
      // Use only the minimal fields that we know exist
      const orderData: any = {
        order_number: orderName,
        customer_id: customer.id,
        customer_email: email,
        status: firstRow['Fulfillment Status'] === 'fulfilled' ? 'delivered' : 'pending',
        payment_status: firstRow['Financial Status'] === 'paid' ? 'paid' : 'pending',
        subtotal: parseFloat(firstRow['Subtotal']) || 0,
        tax: parseFloat(firstRow['Taxes']) || 0,
        total: parseFloat(firstRow['Total']) || 0,
        created_at: new Date(firstRow['Created at']).toISOString(),
      };

      // Try to add optional fields one by one
      if (shippingFirstName) orderData.customer_first_name = shippingFirstName;
      if (shippingLastName) orderData.customer_last_name = shippingLastName;
      if (firstRow['Shipping Address1']) orderData.shipping_address = firstRow['Shipping Address1'];
      if (firstRow['Shipping City']) orderData.shipping_city = firstRow['Shipping City'];
      if (firstRow['Shipping Province']) orderData.shipping_state = firstRow['Shipping Province'];
      if (firstRow['Shipping Zip']) orderData.shipping_zip = firstRow['Shipping Zip'].replace(/^'/, '');
      if (firstRow['Shipping']) orderData.shipping_cost = parseFloat(firstRow['Shipping']) || 0;

      // Insert order
      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) {
        console.error(`❌ Error importing order #${orderName}:`, orderError.message);
        errorCount++;
        continue;
      }

      // Import line items
      for (const row of rows) {
        if (row['Lineitem name']) {
          const quantity = parseInt(row['Lineitem quantity']) || 1;
          const price = parseFloat(row['Lineitem price']) || 0;

          const lineItemData = {
            order_id: newOrder.id,
            product_id: null, // Shopify products don't have our product IDs
            variant_id: null,
            product_title: row['Lineitem name'],
            variant_title: null,
            quantity: quantity,
            price: price,
            total: quantity * price,
          };

          await supabase.from('order_items').insert(lineItemData);
        }
      }

      console.log(`✅ Imported order #${orderName} with ${rows.length} items`);
      successCount++;
    } catch (err) {
      console.error(`❌ Error processing order #${orderName}:`, err);
      errorCount++;
    }
  }

  console.log(`\n📊 Order Import Summary:`);
  console.log(`   ✅ Successfully imported: ${successCount}`);
  console.log(`   ⏭️  Skipped (already exist or no customer): ${skippedCount}`);
  console.log(`   ❌ Errors: ${errorCount}\n`);
}

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('📦 SHOPIFY DATA IMPORT TO SUPABASE');
  console.log('='.repeat(60));

  // Import customers first (orders depend on customers)
  await importCustomers();

  // Then import orders
  await importOrders();

  console.log('\n' + '='.repeat(60));
  console.log('✅ IMPORT COMPLETE!');
  console.log('='.repeat(60) + '\n');
}

main();

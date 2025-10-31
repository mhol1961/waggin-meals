/**
 * Import Order Items for Existing Orders from Shopify CSV
 * Run with: npx tsx scripts/import-order-items.ts
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

interface ShopifyOrder {
  'Name': string;
  'Id': string;
  'Lineitem name': string;
  'Lineitem quantity': string;
  'Lineitem price': string;
}

async function importOrderItems() {
  console.log('\n🚀 Importing order items from CSV...\n');

  // First, load all products for matching
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, title');

  if (productsError || !products) {
    console.error('❌ Error loading products:', productsError);
    return;
  }

  console.log(`📦 Loaded ${products.length} products for matching\n`);

  // Create a product name lookup map (normalize names for fuzzy matching)
  const productMap = new Map<string, string>();
  for (const product of products) {
    const normalizedTitle = product.title.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    productMap.set(normalizedTitle, product.id);
  }

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

  // Group rows by order number
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
      // Find order in database by order number
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('id')
        .eq('order_number', orderName)
        .single();

      if (orderError || !order) {
        console.log(`⏭️  Order #${orderName} not found in database`);
        skippedCount++;
        continue;
      }

      // Check if items already exist
      const { count: existingCount } = await supabase
        .from('order_items')
        .select('*', { count: 'exact', head: true })
        .eq('order_id', order.id);

      if (existingCount && existingCount > 0) {
        console.log(`⏭️  Order #${orderName} already has ${existingCount} items`);
        skippedCount++;
        continue;
      }

      // Import line items
      let itemsImported = 0;
      let itemsSkipped = 0;
      for (const row of rows) {
        if (row['Lineitem name']) {
          const quantity = parseInt(row['Lineitem quantity']) || 1;
          const price = parseFloat(row['Lineitem price']) || 0;
          const productName = row['Lineitem name'];

          // Try to match product name
          const normalizedName = productName.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, ' ')
            .trim();

          const productId = productMap.get(normalizedName);

          if (!productId) {
            // Product not found - skip this item
            itemsSkipped++;
            continue;
          }

          const lineItemData = {
            order_id: order.id,
            product_id: productId,
            product_title: productName,
            quantity: quantity,
            price: price,
            total: quantity * price,
          };

          const { error: itemError } = await supabase
            .from('order_items')
            .insert(lineItemData);

          if (itemError) {
            console.error(`  ❌ Error importing item "${productName}":`, itemError.message);
            errorCount++;
          } else {
            itemsImported++;
          }
        }
      }

      if (itemsImported > 0) {
        console.log(`✅ Imported ${itemsImported} items for order #${orderName}`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Error processing order #${orderName}:`, err);
      errorCount++;
    }
  }

  console.log(`\n📊 Order Items Import Summary:`);
  console.log(`   ✅ Orders with items imported: ${successCount}`);
  console.log(`   ⏭️  Skipped (already exist or order not found): ${skippedCount}`);
  console.log(`   ❌ Errors: ${errorCount}\n`);
}

importOrderItems();

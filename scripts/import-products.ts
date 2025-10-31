/**
 * Import Products from Data File to Supabase
 * Run with: npx tsx scripts/import-products.ts
 */

import { createClient } from '@supabase/supabase-js';
import { allProducts } from '../data/products';
import { config } from 'dotenv';
import path from 'path';

// Load environment variables
config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function importProducts() {
  console.log(`\n🚀 Importing ${allProducts.length} products to Supabase...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const product of allProducts) {
    try {
      // Check if product already exists
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('handle', product.handle)
        .single();

      if (existing) {
        console.log(`⏭️  Skipping "${product.title}" (already exists)`);
        continue;
      }

      // Map data file format to database format
      const dbProduct = {
        title: product.title,
        handle: product.handle,
        description: product.description,
        price: product.price,
        compare_at_price: product.compareAtPrice || null,
        weight: product.weight,
        sku: product.sku || null,
        inventory_count: product.stockQty || 100,
        category: product.tags?.[0] || 'other',
        tags: product.tags || [],
        images: product.images || [],
        in_stock: product.inStock !== false,
        is_featured: false,
        is_published: product.status === 'active',
      };

      const { error } = await supabase
        .from('products')
        .insert(dbProduct);

      if (error) {
        console.error(`❌ Error importing "${product.title}":`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Imported: ${product.title}`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Error importing "${product.title}":`, err);
      errorCount++;
    }
  }

  console.log(`\n📊 Import Summary:`);
  console.log(`   ✅ Successfully imported: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   ⏭️  Skipped (already exist): ${allProducts.length - successCount - errorCount}\n`);
}

importProducts();

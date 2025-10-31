/**
 * Migrate Local Product Images to Supabase Storage
 * Uploads all local product images to Supabase Storage and updates database URLs
 * Run with: npx tsx scripts/migrate-images-to-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

// Load environment variables
config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function migrateImages() {
  console.log('\n🚀 Starting image migration to Supabase Storage...\n');

  try {
    // Get all products from database
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, title, images');

    if (fetchError) {
      throw new Error(`Failed to fetch products: ${fetchError.message}`);
    }

    if (!products || products.length === 0) {
      console.log('❌ No products found in database');
      return;
    }

    console.log(`📦 Found ${products.length} products to process\n`);

    let totalImages = 0;
    let uploadedImages = 0;
    let skippedImages = 0;
    let errorImages = 0;

    for (const product of products) {
      console.log(`\n🔍 Processing: ${product.title}`);

      if (!product.images || product.images.length === 0) {
        console.log('  ⏭️  No images to process');
        continue;
      }

      const updatedImages: string[] = [];

      for (const imageUrl of product.images) {
        totalImages++;

        // Skip if already in Supabase Storage
        if (imageUrl.includes('supabase.co/storage')) {
          console.log(`  ✅ Already in Supabase: ${imageUrl.split('/').pop()}`);
          updatedImages.push(imageUrl);
          skippedImages++;
          continue;
        }

        // Process local images
        if (imageUrl.startsWith('/images/')) {
          const localPath = path.join(process.cwd(), 'public', imageUrl);
          const fileName = path.basename(imageUrl);

          console.log(`  📤 Uploading: ${fileName}`);

          try {
            // Check if file exists
            if (!fs.existsSync(localPath)) {
              console.log(`  ⚠️  File not found: ${localPath}`);
              errorImages++;
              continue;
            }

            // Read file
            const fileBuffer = fs.readFileSync(localPath);

            // Generate unique filename
            const timestamp = Date.now();
            const randomStr = Math.random().toString(36).substring(7);
            const fileExt = path.extname(fileName).toLowerCase();
            const uniqueFileName = `product-${timestamp}-${randomStr}${fileExt}`;

            // Map file extensions to proper MIME types
            const mimeTypes: Record<string, string> = {
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.png': 'image/png',
              '.gif': 'image/gif',
              '.webp': 'image/webp',
              '.svg': 'image/svg+xml',
            };

            const contentType = mimeTypes[fileExt] || 'image/jpeg';

            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('product-images')
              .upload(uniqueFileName, fileBuffer, {
                contentType,
                cacheControl: '3600',
                upsert: false,
              });

            if (uploadError) {
              console.log(`  ❌ Upload failed: ${uploadError.message}`);
              errorImages++;
              continue;
            }

            // Get public URL
            const { data: urlData } = supabase.storage
              .from('product-images')
              .getPublicUrl(uniqueFileName);

            console.log(`  ✅ Uploaded successfully`);
            updatedImages.push(urlData.publicUrl);
            uploadedImages++;
          } catch (err) {
            console.log(`  ❌ Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
            errorImages++;
          }
        } else {
          // Keep external URLs as-is
          updatedImages.push(imageUrl);
          skippedImages++;
        }
      }

      // Update product in database
      if (updatedImages.length > 0) {
        const { error: updateError } = await supabase
          .from('products')
          .update({ images: updatedImages })
          .eq('id', product.id);

        if (updateError) {
          console.log(`  ❌ Failed to update database: ${updateError.message}`);
        } else {
          console.log(`  💾 Database updated with ${updatedImages.length} image URLs`);
        }
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Migration Summary:');
    console.log('='.repeat(60));
    console.log(`   📷 Total images processed: ${totalImages}`);
    console.log(`   ✅ Successfully uploaded: ${uploadedImages}`);
    console.log(`   ⏭️  Skipped (already in Supabase): ${skippedImages}`);
    console.log(`   ❌ Errors: ${errorImages}`);
    console.log('='.repeat(60) + '\n');

    if (uploadedImages > 0) {
      console.log('🎉 Migration complete! All images are now in Supabase Storage.\n');
    } else if (skippedImages === totalImages) {
      console.log('✅ All images were already in Supabase Storage.\n');
    } else {
      console.log('⚠️  Migration completed with some errors. Check logs above.\n');
    }
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateImages();

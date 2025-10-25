const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const INPUT_DIR = path.join(__dirname, '../public/images');
const QUALITY = 80; // WebP quality (0-100, 80 is good balance)
const EXCLUDED_EXTENSIONS = ['.svg', '.gif', '.webp']; // Don't convert these

// Stats tracking
let stats = {
  processed: 0,
  errors: 0,
  originalSize: 0,
  newSize: 0,
  files: []
};

// Get all image files recursively
function getAllImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllImageFiles(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

// Optimize a single image
async function optimizeImage(inputPath) {
  try {
    const ext = path.extname(inputPath).toLowerCase();
    const dir = path.dirname(inputPath);
    const baseName = path.basename(inputPath, ext);
    const outputPath = path.join(dir, `${baseName}.webp`);

    // Skip if WebP already exists and is newer
    if (fs.existsSync(outputPath)) {
      const inputStat = fs.statSync(inputPath);
      const outputStat = fs.statSync(outputPath);
      if (outputStat.mtime > inputStat.mtime) {
        console.log(`⏭️  Skipping (already optimized): ${path.relative(INPUT_DIR, inputPath)}`);
        return;
      }
    }

    // Get original file size
    const originalSize = fs.statSync(inputPath).size;

    // Process image
    await sharp(inputPath)
      .webp({ quality: QUALITY })
      .toFile(outputPath);

    // Get new file size
    const newSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);

    stats.processed++;
    stats.originalSize += originalSize;
    stats.newSize += newSize;
    stats.files.push({
      path: path.relative(INPUT_DIR, inputPath),
      originalSize,
      newSize,
      savings
    });

    console.log(`✅ Optimized: ${path.relative(INPUT_DIR, inputPath)}`);
    console.log(`   ${formatBytes(originalSize)} → ${formatBytes(newSize)} (${savings}% smaller)`);

  } catch (error) {
    stats.errors++;
    console.error(`❌ Error processing ${inputPath}:`, error.message);
  }
}

// Format bytes to human readable
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Main function
async function main() {
  console.log('🖼️  Image Optimization Starting...\n');
  console.log(`📁 Scanning: ${INPUT_DIR}\n`);

  // Get all images
  const imageFiles = getAllImageFiles(INPUT_DIR);
  console.log(`📊 Found ${imageFiles.length} images to process\n`);

  if (imageFiles.length === 0) {
    console.log('No images found to optimize.');
    return;
  }

  // Process each image
  for (const file of imageFiles) {
    await optimizeImage(file);
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('🎉 Optimization Complete!\n');
  console.log(`✅ Processed: ${stats.processed} images`);
  console.log(`❌ Errors: ${stats.errors}`);
  console.log(`📦 Original Size: ${formatBytes(stats.originalSize)}`);
  console.log(`📦 New Size: ${formatBytes(stats.newSize)}`);
  console.log(`💾 Saved: ${formatBytes(stats.originalSize - stats.newSize)} (${((stats.originalSize - stats.newSize) / stats.originalSize * 100).toFixed(1)}%)`);
  console.log('='.repeat(60));

  console.log('\n📝 Next Steps:');
  console.log('1. Update image imports to use .webp extensions');
  console.log('2. Consider adding <picture> tags for fallbacks:');
  console.log('   <picture>');
  console.log('     <source srcset="image.webp" type="image/webp">');
  console.log('     <img src="image.jpg" alt="description">');
  console.log('   </picture>');
  console.log('3. After testing, you can delete original .jpg/.png files to save space\n');
}

// Run
main().catch(console.error);

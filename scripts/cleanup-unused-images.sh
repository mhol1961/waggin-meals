#!/bin/bash

# Waggin' Meals - Image Cleanup Script
# Removes 3,604 unused WordPress duplicate images (saves 894MB)
# Preserves only the 17 images actually used in the codebase

set -e

echo "🧹 Starting image cleanup..."
echo "This will delete ~894MB of unused WordPress duplicate images"
echo ""

# Backup list of files being deleted
BACKUP_LIST="/tmp/waggin-meals-deleted-images.txt"

# Change to images directory
cd /mnt/c/waggin-meals/public/images

# List of images to KEEP (17 images actually used in code)
KEEP_IMAGES=(
  "2025/07/Beef-and-Sweet-Potato-Bowl-scaled.jpg"
  "2025/07/Chicken-Superfood-Cake-Board-scaled.jpg"
  "2025/07/Christie-7-16-25-11-copy.jpg"
  "2025/09/Canine-Nutrtion-Services.webp"
  "5 Strands food sensitivities.png"
  "5 Strands.webp"
  "Candy Before Photo.jpg"
  "Christy-holding-black-dog.jpg"
  "beef-sweet-potato-bowl.jpg"
  "biome-example-hero-homepage.png"
  "chicken-superfood-board.jpg"
  "logo-waggin-meals.png"
  "products/BeefandSweetPotatoBowl.jpg"
  "products/ChickenandSweetPotatoBowl.jpg"
  "products/PupALoafBoard72res.jpg"
  "waggin-logos.png"
  "woman-with-white-dog.webp"
)

# Create temporary directory for images to keep
TEMP_KEEP_DIR="/tmp/waggin-meals-images-keep"
rm -rf "$TEMP_KEEP_DIR"
mkdir -p "$TEMP_KEEP_DIR"

echo "📦 Backing up 17 images that are actually used..."
for img in "${KEEP_IMAGES[@]}"; do
  if [ -f "$img" ]; then
    mkdir -p "$TEMP_KEEP_DIR/$(dirname "$img")"
    cp -v "$img" "$TEMP_KEEP_DIR/$img"
  else
    echo "⚠️  Warning: $img not found"
  fi
done

echo ""
echo "🗑️  Deleting WordPress duplicate folders..."

# Count files before deletion
BEFORE_COUNT=$(find . -type f | wc -l)
BEFORE_SIZE=$(du -sh . | awk '{print $1}')

echo "Before: $BEFORE_COUNT files ($BEFORE_SIZE)"
echo ""

# Delete entire WordPress date folders (except files we're keeping)
echo "Deleting 2025/07/ (saving ~763MB)..."
find 2025/07/ -type f > "$BACKUP_LIST"
rm -rf 2025/07/

echo "Deleting 2025/08/ (saving 48MB)..."
find 2025/08/ -type f >> "$BACKUP_LIST" 2>/dev/null || true
rm -rf 2025/08/

# Restore the 3 images we need from 2025/07/
echo ""
echo "♻️  Restoring 3 needed images from 2025/07/..."
mkdir -p 2025/07/
cp -v "$TEMP_KEEP_DIR/2025/07/"* 2025/07/ 2>/dev/null || true

# Restore 1 image from 2025/09/
mkdir -p 2025/09/
cp -v "$TEMP_KEEP_DIR/2025/09/"* 2025/09/ 2>/dev/null || true

# Count files after deletion
AFTER_COUNT=$(find . -type f | wc -l)
AFTER_SIZE=$(du -sh . | awk '{print $1}')

echo ""
echo "✅ Cleanup complete!"
echo "After: $AFTER_COUNT files ($AFTER_SIZE)"
echo "Deleted: $((BEFORE_COUNT - AFTER_COUNT)) files"
echo ""
echo "📝 List of deleted files saved to: $BACKUP_LIST"
echo "🔄 Backup of kept images in: $TEMP_KEEP_DIR"
echo ""
echo "You can restore from backup if needed:"
echo "  cp -r $TEMP_KEEP_DIR/* /mnt/c/waggin-meals/public/images/"

#!/bin/bash

# Waggin' Meals - Final Image Cleanup
# Keep ONLY the 17 images actually used in code
# Delete all WordPress duplicate sizes and unused files

set -e

cd /mnt/c/waggin-meals/public/images

echo "🧹 Final cleanup - keeping ONLY 17 images actually used in code..."
echo ""

BEFORE_SIZE=$(du -sh . | awk '{print $1}')
BEFORE_COUNT=$(find . -type f | wc -l)
echo "Before: $BEFORE_COUNT files ($BEFORE_SIZE)"
echo ""

# Create final backup
FINAL_BACKUP="/tmp/waggin-meals-final-17-images"
rm -rf "$FINAL_BACKUP"
mkdir -p "$FINAL_BACKUP"

echo "📦 Backing up the 17 images that are actually used..."

# Backup from 2025 folders
mkdir -p "$FINAL_BACKUP/2025/07"
mkdir -p "$FINAL_BACKUP/2025/09"
cp -v "2025/07/Beef-and-Sweet-Potato-Bowl-scaled.jpg" "$FINAL_BACKUP/2025/07/"
cp -v "2025/07/Chicken-Superfood-Cake-Board-scaled.jpg" "$FINAL_BACKUP/2025/07/"
cp -v "2025/07/Christie-7-16-25-11-copy.jpg" "$FINAL_BACKUP/2025/07/"
cp -v "2025/09/Canine-Nutrtion-Services.webp" "$FINAL_BACKUP/2025/09/"

# Backup root images
cp -v "5 Strands food sensitivities.png" "$FINAL_BACKUP/" 2>/dev/null || true
cp -v "5 Strands.webp" "$FINAL_BACKUP/" 2>/dev/null || true
cp -v "Candy Before Photo.jpg" "$FINAL_BACKUP/" 2>/dev/null || true
cp -v "Christy-holding-black-dog.jpg" "$FINAL_BACKUP/" 2>/dev/null || true
cp -v "beef-sweet-potato-bowl.jpg" "$FINAL_BACKUP/" 2>/dev/null || true
cp -v "biome-example-hero-homepage.png" "$FINAL_BACKUP/" 2>/dev/null || true
cp -v "chicken-superfood-board.jpg" "$FINAL_BACKUP/" 2>/dev/null || true
cp -v "logo-waggin-meals.png" "$FINAL_BACKUP/" 2>/dev/null || true
cp -v "waggin-logos.png" "$FINAL_BACKUP/" 2>/dev/null || true
cp -v "woman-with-white-dog.webp" "$FINAL_BACKUP/" 2>/dev/null || true

# Backup products
mkdir -p "$FINAL_BACKUP/products"
cp -v "products/BeefandSweetPotatoBowl.jpg" "$FINAL_BACKUP/products/"
cp -v "products/ChickenandSweetPotatoBowl.jpg" "$FINAL_BACKUP/products/"
cp -v "products/PupALoafBoard72res.jpg" "$FINAL_BACKUP/products/"

echo ""
echo "🗑️  Deleting ALL other files..."

# Delete everything
find . -mindepth 1 -delete

echo ""
echo "♻️  Restoring ONLY the 17 needed images..."

# Restore the 17 images
cp -rv "$FINAL_BACKUP"/* .

AFTER_SIZE=$(du -sh . | awk '{print $1}')
AFTER_COUNT=$(find . -type f | wc -l)

echo ""
echo "✅ Final cleanup complete!"
echo "Before: $BEFORE_COUNT files ($BEFORE_SIZE)"
echo "After: $AFTER_COUNT files ($AFTER_SIZE)"
echo "Saved: $((BEFORE_COUNT - AFTER_COUNT)) files"
echo ""
echo "📝 Backup location: $FINAL_BACKUP"

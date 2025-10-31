#!/bin/bash

# Waggin' Meals - WordPress Artifacts Cleanup
# Removes WordPress plugin/theme directories and unused product images
# Expected savings: Additional ~110MB

set -e

cd /mnt/c/waggin-meals/public/images

echo "🧹 Cleaning up WordPress plugin artifacts..."
echo ""

# Size before
BEFORE_SIZE=$(du -sh . | awk '{print $1}')
echo "Before: $BEFORE_SIZE"
echo ""

# Backup the 3 product images we need
echo "📦 Backing up 3 needed product images..."
mkdir -p /tmp/waggin-products-keep
cp -v products/BeefandSweetPotatoBowl.jpg /tmp/waggin-products-keep/
cp -v products/ChickenandSweetPotatoBowl.jpg /tmp/waggin-products-keep/
cp -v products/PupALoafBoard72res.jpg /tmp/waggin-products-keep/

echo ""
echo "🗑️  Deleting WordPress artifacts..."

# Delete WordPress plugin/theme directories
rm -rf ast-block-templates-json/
echo "✓ Deleted ast-block-templates-json/ (15MB)"

rm -rf astra-sites/
echo "✓ Deleted astra-sites/ (4.8MB)"

rm -rf elementor/
echo "✓ Deleted elementor/ (2MB)"

rm -rf uag-plugin/
echo "✓ Deleted uag-plugin/ (260KB)"

rm -rf wc-logs/
echo "✓ Deleted wc-logs/ (12KB)"

rm -rf fonts/
echo "✓ Deleted fonts/ (168KB)"

rm -rf wpcf7_uploads/
rm -rf woocommerce_uploads/
rm -rf bundles/
rm -rf ai-builder/
rm -rf astra-docs/
echo "✓ Deleted empty WordPress directories"

# Delete all product images except the 3 we need
echo ""
echo "🗑️  Cleaning up unused product images..."
rm -rf products/
mkdir -p products/
cp -v /tmp/waggin-products-keep/* products/
echo "✓ Deleted 103 unused product images (kept 3)"

# Size after
AFTER_SIZE=$(du -sh . | awk '{print $1}')

echo ""
echo "✅ WordPress artifact cleanup complete!"
echo "After: $AFTER_SIZE"
echo ""
echo "Remaining directories:"
du -h --max-depth=1 | sort -hr

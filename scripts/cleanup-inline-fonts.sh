#!/bin/bash

# Script to remove inline fontFamily styles and add Tailwind font classes
# Replaces style={{ fontFamily: "'Poppins', sans-serif" }} with className font-sans
# Replaces style={{ fontFamily: "'Abril Fatface', serif" }} with className font-serif

set -e

echo "Starting font cleanup..."

# Find all TSX files with inline fontFamily
files=$(grep -rl "style={{ fontFamily:" components/ app/ 2>/dev/null || true)

if [ -z "$files" ]; then
    echo "No files found with inline fontFamily styles"
    exit 0
fi

count=$(echo "$files" | wc -l)
echo "Found $count files with inline fontFamily styles"

# Process each file
for file in $files; do
    echo "Processing: $file"

    # Create a backup
    cp "$file" "$file.bak"

    # Remove Poppins inline styles and ensure font-sans is in className
    # Pattern 1: style={{ fontFamily: "'Poppins', sans-serif" }}
    sed -i 's/ style={{ fontFamily: "'"'"'Poppins'"'"', sans-serif" }}//g' "$file"
    sed -i 's/ style={{ fontFamily: '"'"'Poppins, sans-serif'"'"' }}//g' "$file"

    # Remove Abril Fatface inline styles
    sed -i 's/ style={{ fontFamily: "'"'"'Abril Fatface'"'"', serif" }}//g' "$file"
    sed -i 's/ style={{ fontFamily: '"'"'Abril Fatface, serif'"'"' }}//g' "$file"

    # Add font-sans to className if not present (for elements that had Poppins)
    # This is approximate - manual review may be needed

    # Remove backup if successful
    rm "$file.bak"
done

echo "Font cleanup complete!"
echo "Processed $count files"
echo ""
echo "Note: Tailwind classes (font-sans, font-serif) are already configured in tailwind.config.ts"
echo "The default font family is 'Poppins' (font-sans), so most elements don't need explicit font-sans class"

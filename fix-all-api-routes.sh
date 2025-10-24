#!/bin/bash

# Fix all API [id] route handlers for Next.js 15 async params

for file in /mnt/c/waggin-meals/app/api/admin/*/\[id\]/route.ts; do
  echo "Fixing $file..."

  # Step 1: Change params type to Promise
  sed -i 's/{ params }: { params: { id: string } }/{ params }: { params: Promise<{ id: string }> }/g' "$file"

  # Step 2: Add await params line after auth check
  # This adds it after "if (!authenticated) { return ... }" block
  sed -i '/if (!authenticated) {/{N;N;N;s/}\n$/}\n\n    \/\/ Await params in Next.js 15\n    const { id } = await params;\n/}' "$file"

  # Step 3: Replace params.id with id
  sed -i 's/params\.id\b/id/g' "$file"

  echo "  ✓ Fixed $file"
done

echo "Done!"

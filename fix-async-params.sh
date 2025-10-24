#!/bin/bash

# Script to fix Next.js 15 async params in all admin [id] pages

for dir in events products resources testimonials videos; do
  file="/mnt/c/waggin-meals/app/admin/$dir/[id]/page.tsx"

  if [ -f "$file" ]; then
    echo "Fixing $file..."

    # Use perl for better multi-line regex support
    perl -i -0pe 's/params: \{\s+id: string;\s+\};/params: Promise<{\n    id: string;\n  }>;/g' "$file"

    # Add the await params line after the auth check
    perl -i -pe 's/(redirect\(['"'"'"]\/admin\/login['"'"'"]\);)\s+$/\1\n\n  \/\/ Await params in Next.js 15\n  const { id } = await params;\n/g' "$file"

    # Replace params.id with just id
    perl -i -pe 's/params\.id(?![a-zA-Z_])/id/g' "$file"

    echo "Fixed $file"
  fi
done

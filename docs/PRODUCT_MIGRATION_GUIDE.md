# Product Migration Guide

**Date:** January 28, 2025
**Purpose:** Migrate all products from static data (`data/products.ts`) to Supabase database

---

## Overview

This guide walks through migrating 28 products across 3 collections from hardcoded TypeScript data to the Supabase database. After completion, the site will fetch products dynamically from the database instead of static imports.

---

## Prerequisites

✅ Supabase project configured
✅ Environment variables set (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`)
✅ Node.js installed for running seed script

---

## Step 1: Apply Database Migration

### Option A: Via Supabase Dashboard (Recommended)

1. **Navigate to SQL Editor:**
   - Go to https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql
   - Click "New Query"

2. **Copy Migration SQL:**
   - Open `/supabase/migrations/add-collections-and-enhance-products.sql`
   - Copy entire contents

3. **Execute Migration:**
   - Paste SQL into Supabase SQL Editor
   - Click "Run" button
   - Verify success message appears

### Option B: Via Supabase CLI

```bash
# Navigate to project root
cd /mnt/c/waggin-meals

# Apply migration (if using Supabase CLI)
supabase db push
```

### What This Does:

- ✅ Creates `collections` table with slug, name, description, image fields
- ✅ Adds `collection_id` foreign key to `products` table
- ✅ Adds `ingredients`, `nutritional_analysis`, `status` fields to `products`
- ✅ Inserts 3 default collections (fresh-food, meal-toppers, treats)
- ✅ Creates `products_with_collections` view for easy querying
- ✅ Adds auto-update trigger for `collections.updated_at`

---

## Step 2: Seed Products

### Run Seed Script:

```bash
# From project root
node scripts/seed-products.js
```

### Expected Output:

```
🌱 Starting product seed...

📦 Processing collection: fresh-food
  ✓ Product exists: chicken-farm-meal-copy - skipping
  ✓ Product exists: beef-sweet-potato-bowl - skipping
  ... (or "✓ Inserted: [product-title]" for new products)

📦 Processing collection: meal-toppers
  ✓ Inserted: Beef Bone Broth & Stew Topper (72oz)
  ...

📦 Processing collection: treats
  ✓ Inserted: Meatball Treats (3oz)
  ...

✅ Seed complete! Total products processed: 28
```

### What This Does:

- Inserts all 28 products from `data/products.ts`
- Links each product to correct collection via `collection_id`
- Sets `ingredients` and `nutritional_analysis` fields
- Imports all product images (up to 8 per product)
- Sets inventory counts from static data
- Auto-features products with >100 inventory (high stock items)
- Skips products that already exist (checks by `handle`)

---

## Step 3: Verify Migration

### Check Collections:

```bash
# In Supabase SQL Editor
SELECT * FROM collections ORDER BY display_order;
```

**Expected:**
- 3 rows: fresh-food, meal-toppers, treats
- Each has name, slug, description, image, display_order

### Check Products:

```bash
# In Supabase SQL Editor
SELECT
  p.title,
  p.handle,
  c.name as collection_name,
  p.inventory_count,
  p.is_featured
FROM products p
LEFT JOIN collections c ON p.collection_id = c.id
ORDER BY c.display_order, p.created_at;
```

**Expected:**
- 28 products total
- 9 in "Fresh Food Collection"
- 6 in "Meal Toppers & Add-ons"
- 13 in "Healthy Treats"
- High-stock items marked as featured

### Check View:

```bash
# In Supabase SQL Editor
SELECT * FROM products_with_collections LIMIT 5;
```

**Expected:**
- Products with `collection_name` and `collection_slug` columns populated

---

## Step 4: Test API Endpoints

### Test Products Endpoint:

```bash
# Fetch all products
curl http://localhost:3000/api/products | jq

# Fetch fresh food collection
curl http://localhost:3000/api/products?collection=fresh-food | jq

# Fetch featured products
curl http://localhost:3000/api/products?featured=true | jq

# Fetch in-stock treats
curl http://localhost:3000/api/products?collection=treats&in_stock=true | jq
```

### Test Collections Endpoint:

```bash
# Fetch all collections with product counts
curl http://localhost:3000/api/collections | jq

# Fetch collections with full product lists
curl http://localhost:3000/api/collections?include_products=true | jq
```

### Test Individual Product:

```bash
# Fetch specific product by handle
curl http://localhost:3000/api/products/chicken-farm-meal-copy | jq
curl http://localhost:3000/api/products/beef-topper-72 | jq
curl http://localhost:3000/api/products/meatball-treats | jq
```

---

## Step 5: Update Frontend Components

Once migration is verified, update frontend components to fetch from API instead of static imports:

### Before (Static Import):

```typescript
import { products, collections } from '@/data/products';
```

### After (API Fetch):

```typescript
// In a server component
async function getProducts(collection?: string) {
  const url = collection
    ? `/api/products?collection=${collection}`
    : '/api/products';
  const res = await fetch(url);
  const data = await res.json();
  return data.products;
}

// Usage
const products = await getProducts('fresh-food');
```

### Components to Update:

- `app/shop/page.tsx` - Main shop page
- `app/meal-toppers/page.tsx` - Meal toppers page
- `app/page.tsx` - Homepage (featured products)
- Any other pages that import from `data/products.ts`

---

## Rollback Instructions

If migration fails or needs to be reverted:

### Delete Seeded Products:

```sql
DELETE FROM products WHERE collection_id IS NOT NULL;
```

### Drop Collections Table:

```sql
DROP VIEW IF EXISTS products_with_collections;
DROP TABLE IF EXISTS collections CASCADE;
ALTER TABLE products DROP COLUMN IF EXISTS collection_id;
ALTER TABLE products DROP COLUMN IF EXISTS ingredients;
ALTER TABLE products DROP COLUMN IF EXISTS nutritional_analysis;
ALTER TABLE products DROP COLUMN IF EXISTS status;
```

---

## Troubleshooting

### Issue: "relation 'collections' does not exist"

**Solution:** Migration not applied. Go back to Step 1 and apply migration SQL.

### Issue: Seed script reports "Error: connect ECONNREFUSED"

**Solution:** Check environment variables in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` must be set
- `SUPABASE_SERVICE_ROLE_KEY` must be set

### Issue: Products not showing on frontend

**Solution:**
1. Verify products exist: `SELECT COUNT(*) FROM products;`
2. Check `is_published = true` and `status = 'active'`
3. Ensure API endpoints return data (test with curl)
4. Check browser console for fetch errors

### Issue: Collections have 0 product_count

**Solution:**
1. Verify products have `collection_id` set
2. Run: `SELECT collection_id, COUNT(*) FROM products GROUP BY collection_id;`
3. Re-run seed script if counts are wrong

---

## Next Steps After Migration

Once products are successfully migrated:

1. **Update Product Images:**
   - Replace placeholder image paths with actual optimized images
   - Ensure all images exist in `/public/images/products/`

2. **Add Product Variants:**
   - Use `/app/admin/products/[id]/variants/edit/page.tsx` to add variants
   - Example: Different sizes for fresh food (1lb, 2lb, 5lb)

3. **Configure Featured Products:**
   - Update `is_featured` flag for products to show on homepage
   - Use admin dashboard or SQL: `UPDATE products SET is_featured = true WHERE handle = '...'`

4. **Test Checkout Flow:**
   - Add products to cart
   - Verify inventory deduction after order
   - Check variant selection (if applicable)

5. **Remove Static Data File:**
   - Once frontend is updated, remove or archive `data/products.ts`
   - Update imports across codebase

---

## Migration Checklist

- [ ] Apply database migration (Step 1)
- [ ] Run seed script (Step 2)
- [ ] Verify 3 collections exist
- [ ] Verify 28 products exist
- [ ] Test all API endpoints (Step 4)
- [ ] Update frontend components (Step 5)
- [ ] Test product pages load correctly
- [ ] Test shop page loads correctly
- [ ] Test cart/checkout with database products
- [ ] Remove static imports from codebase

---

**Status:** Ready to execute
**Estimated Time:** 30-45 minutes
**Risk Level:** Low (rollback available)

# Apply Variant Migration - Step-by-Step Guide

**Migration File:** `/supabase/migrations/add-variant-id-to-order-items.sql`
**Estimated Time:** 2-5 minutes
**Impact:** Zero downtime, backwards compatible

---

## Prerequisites

- [ ] Supabase project access
- [ ] Database credentials
- [ ] Backup recommended (optional, migration is safe)

---

## Option 1: Supabase Dashboard (Easiest)

### Step 1: Open SQL Editor
1. Go to https://app.supabase.com
2. Select your project (Waggin Meals)
3. Navigate to **SQL Editor** in left sidebar

### Step 2: Run Migration
1. Click **New Query**
2. Copy the SQL below:

```sql
-- Add variant_id to order_items table
ALTER TABLE order_items
ADD COLUMN variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_order_items_variant_id ON order_items(variant_id);

-- Add comment for documentation
COMMENT ON COLUMN order_items.variant_id IS 'References product_variants table. NULL if product has no variants or legacy order.';
```

3. Click **Run** or press `Ctrl+Enter`

### Step 3: Verify Success
You should see:
```
Success. No rows returned
```

If you see an error, check the Troubleshooting section below.

---

## Option 2: Supabase CLI

### Step 1: Install Supabase CLI (if not installed)
```bash
npm install -g supabase
```

### Step 2: Link Project
```bash
cd /mnt/c/waggin-meals
supabase link --project-ref YOUR_PROJECT_REF
```

### Step 3: Apply Migration
```bash
supabase db push
```

This will apply all pending migrations in `/supabase/migrations/`.

---

## Option 3: Direct PostgreSQL Connection

### Step 1: Get Connection String
1. Go to Supabase Dashboard → Settings → Database
2. Copy the connection string (URI format)
3. Replace `[YOUR-PASSWORD]` with actual password

### Step 2: Connect and Run
```bash
psql "your-connection-string-here" -f supabase/migrations/add-variant-id-to-order-items.sql
```

---

## Verification Steps

### 1. Check Column Exists
Run this query in SQL Editor:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'order_items'
  AND column_name = 'variant_id';
```

**Expected Result:**
```
column_name | data_type | is_nullable
variant_id  | uuid      | YES
```

### 2. Check Index Exists
```sql
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'order_items'
  AND indexname = 'idx_order_items_variant_id';
```

**Expected Result:**
```
indexname                  | indexdef
idx_order_items_variant_id | CREATE INDEX idx_order_items_variant_id ON public.order_items USING btree (variant_id)
```

### 3. Check Foreign Key
```sql
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'order_items'
  AND kcu.column_name = 'variant_id';
```

**Expected Result:** Should show foreign key to `product_variants(id)`

---

## Post-Migration Checklist

After successful migration:

- [ ] Verify column exists (query above)
- [ ] Verify index exists (query above)
- [ ] Verify foreign key exists (query above)
- [ ] Check existing orders still work (no NULL errors)
- [ ] Deploy updated application code
- [ ] Test new order creation with variants
- [ ] Test new order creation without variants

---

## Troubleshooting

### Error: "column already exists"
**Solution:** Migration already applied. Check verification queries to confirm.

### Error: "relation product_variants does not exist"
**Problem:** product_variants table not created yet.
**Solution:** Run the complete schema first: `/supabase/complete-schema.sql`

### Error: "permission denied"
**Problem:** Insufficient database permissions.
**Solution:** Use the service role key or database owner credentials.

### Error: "syntax error"
**Problem:** Copy/paste issue or incomplete SQL.
**Solution:** Copy entire migration file content exactly as-is.

---

## Rollback (If Needed)

If you need to undo this migration:

```sql
-- Remove index
DROP INDEX IF EXISTS idx_order_items_variant_id;

-- Remove column
ALTER TABLE order_items DROP COLUMN IF EXISTS variant_id;
```

**Note:** Rollback is safe - existing orders are unaffected. You'll just lose variant tracking for new orders.

---

## What This Enables

After applying this migration:

✅ Orders can track which variant was purchased
✅ Inventory deducted from correct variant
✅ Order history shows variant details
✅ Subscription renewals track variants
✅ Admin can see variant sales data
✅ Customers see variant info in order confirmations

---

## Next Steps After Migration

1. **Deploy Application Code**
   ```bash
   git add .
   git commit -m "Add variant support to orders"
   git push
   ```

2. **Test Checkout Flow**
   - Place test order with variant
   - Verify order_items has variant_id populated
   - Check inventory was deducted from variant

3. **Monitor for Issues**
   - Watch application logs
   - Check Supabase logs for errors
   - Test subscription renewals

---

## Support

If you encounter issues:

1. Check Supabase Dashboard → Logs
2. Check application error logs
3. Verify database schema matches expected state
4. Review verification queries above

---

**Migration Status:** ⏳ Pending
**Required for:** Variant tracking in orders
**Safe to apply:** ✅ Yes - backwards compatible, zero downtime

# Inventory System Analysis & Recommendations

**Date**: November 1, 2025
**Status**: DISABLED (blocking all orders)
**Priority**: Medium (orders work without it, but tracking is important)

---

## Current Status

The inventory tracking system is **temporarily disabled** because it was blocking ALL order creation with "Unknown error" messages.

###Files Disabled:
- `hooks/use-cart-inventory-check.ts` - Frontend cart validation (lines 48-53)
- `app/api/checkout/create-order/route.ts` - Backend order creation (lines 87-92)

### Error Observed:
```json
{
  "error": "Some items are out of stock",
  "unavailable_items": [{
    "title": "Test Product",
    "requested": 1,
    "available": 0,
    "reason": "Unknown error"
  }]
}
```

---

## Root Cause Analysis

The inventory system (`lib/inventory.ts`) relies on **Postgres database functions** that may:

1. **Not exist** in the Supabase database
2. **Have incorrect permissions**
3. **Throw errors** that are caught and returned as "Unknown error"

### Key Dependencies:

**Postgres Functions Required:**
- `check_inventory_availability(p_product_id, p_variant_id, p_quantity)` - Used by `checkAvailability()`
- `adjust_inventory(...)` - Used by `decrementInventory()`
- `get_low_stock_items()` - Used by `getLowStockProducts()`

**Database Views Required:**
- `inventory_status` - Aggregated view of current inventory

**Database Tables Required:**
- `inventory_transactions` - Audit trail of all inventory changes
- `products.inventory_quantity` - Stock levels for products
- `product_variants.inventory_quantity` - Stock levels for variants

---

## Recommended Fixes

### Option 1: Quick Fix - Remove Dependency on Postgres Functions ✅ **RECOMMENDED**

Replace the RPC calls with direct queries:

**Before (lines 109-113):**
```typescript
const { data, error } = await supabase.rpc('check_inventory_availability', {
  p_product_id: productId,
  p_variant_id: variantId || null,
  p_quantity: quantity,
});
```

**After:**
```typescript
// Get product or variant directly
let query = variantId
  ? supabase.from('product_variants').select('inventory_quantity, track_inventory, allow_backorder').eq('id', variantId).single()
  : supabase.from('products').select('inventory_quantity, track_inventory, allow_backorder').eq('id', productId).single();

const { data, error } = await query;

if (error) {
  return {
    available: false,
    current_quantity: 0,
    requested_quantity: quantity,
    track_inventory: true,
    allow_backorder: false,
    reason: error.message
  };
}

// Simple availability check
const available = !data.track_inventory || data.allow_backorder || data.inventory_quantity >= quantity;

return {
  available,
  current_quantity: data.inventory_quantity,
  requested_quantity: quantity,
  track_inventory: data.track_inventory,
  allow_backorder: data.allow_backorder
};
```

### Option 2: Verify Postgres Functions Exist

Run this SQL in Supabase to check:

```sql
-- Check if functions exist
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('check_inventory_availability', 'adjust_inventory', 'get_low_stock_items');

-- Check if inventory_status view exists
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'inventory_status';
```

If they don't exist, create them from migration files.

### Option 3: Disable Inventory Tracking Permanently

If the client doesn't need inventory tracking:

1. Remove all inventory-related code
2. Set all products to `track_inventory = false`
3. Remove inventory tables from database
4. Simplify checkout flow

---

## Impact Analysis

### With Inventory Disabled (Current State):
- ✅ Orders process successfully
- ✅ No checkout friction
- ❌ Can sell out-of-stock items (overselling risk)
- ❌ No low-stock warnings
- ❌ No automatic inventory deduction
- ❌ Manual inventory management required

### With Inventory Enabled (After Fix):
- ✅ Prevents overselling
- ✅ Low stock alerts for admin
- ✅ Automatic inventory tracking
- ✅ Audit trail of all inventory changes
- ❌ Slightly more complex checkout flow
- ❌ Requires manual restocking

---

## Testing Plan

Once fixed, test the following scenarios:

1. **Add product to cart** → Should check availability
2. **Checkout with sufficient stock** → Should succeed and decrement inventory
3. **Checkout with insufficient stock** → Should show error before payment
4. **Admin bulk inventory update** → Should log transactions
5. **View low stock items** → Should display correct thresholds

---

## Files to Review/Fix

1. `lib/inventory.ts` - Main inventory service (replace RPC calls)
2. `supabase/migrations/` - Check for inventory function definitions
3. `app/api/inventory/status/route.ts` - API endpoint for availability checks
4. `hooks/use-cart-inventory-check.ts` - Re-enable after fixing
5. `app/api/checkout/create-order/route.ts` - Re-enable inventory check (line 87-92)

---

## Recommendations for Client

**Short Term:**
- Keep inventory disabled for now to allow orders
- Manually track inventory in spreadsheet
- Monitor for overselling issues

**Long Term:**
- Implement Option 1 (remove Postgres function dependency)
- Set up low stock email alerts
- Train staff on inventory management dashboard
- Consider integrating with inventory management system (if needed)

---

## Next Steps When Ready to Fix

1. **Backup database** - Always backup before modifying inventory system
2. **Implement Option 1** - Simplify to direct queries
3. **Test thoroughly** - Use test products with known inventory levels
4. **Re-enable gradually** - Start with cart check, then order creation
5. **Monitor closely** - Watch for errors in first week after re-enabling

---

**Status**: Documented and ready for implementation when client prioritizes inventory tracking.

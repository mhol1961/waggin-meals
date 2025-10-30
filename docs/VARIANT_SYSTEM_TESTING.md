# Product Variants System - Testing Guide

**Created:** January 30, 2025
**System Version:** 1.0
**Status:** Ready for Testing

---

## System Overview

The product variants system allows products to have multiple variations (sizes, flavors, weights, etc.) with independent pricing, inventory tracking, and SKUs.

### Key Features
- ✅ Multi-option variants (up to 3 options: Size, Flavor, Color, etc.)
- ✅ Independent pricing per variant
- ✅ Per-variant inventory tracking
- ✅ Automatic SKU generation
- ✅ Admin management interface
- ✅ Customer-facing variant selector
- ✅ Cart integration with variant support
- ✅ Order tracking with variant details

---

## Pre-Testing Setup

### 1. Database Migration Status
Verify the variants tables exist:
```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('product_variants', 'inventory_adjustments');

-- Check if has_variants column exists on products
SELECT column_name FROM information_schema.columns
WHERE table_name = 'products'
AND column_name = 'has_variants';
```

### 2. Environment Variables
Ensure these are set in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 3. Start Development Server
```bash
npm run dev
```

---

## Test Plan

### Phase 1: Admin - Create Variants (10-15 minutes)

#### Test 1.1: Navigate to Variant Manager
1. Go to `/admin/login` and log in
2. Navigate to `/admin/products`
3. Select a product (or create a test product)
4. Click "Manage Variants" or go to `/admin/products/{productId}/variants`

**Expected:** Variant management page loads with empty state

#### Test 1.2: Create First Variant (5lb Beef Bowl)
1. Click "Add Variant" button
2. Fill in form:
   - Title: `5lb`
   - SKU: Leave empty (auto-generate) or enter `BEEF-5LB`
   - Price: `29.99`
   - Compare at Price: `34.99` (optional)
   - Weight: `5`
   - Inventory Quantity: `50`
   - Option 1 Name: `Size`
   - Option 1 Value: `5lb`
   - Track Inventory: ✓ (checked)
3. Click "Create Variant"

**Expected:**
- Success message appears
- Variant appears in list
- SKU is auto-generated if left empty
- Product now has `has_variants = true`

#### Test 1.3: Create Second Variant (10lb Beef Bowl)
1. Click "Add Variant" again
2. Fill in form:
   - Title: `10lb`
   - SKU: Auto-generate
   - Price: `54.99`
   - Compare at Price: `59.99`
   - Weight: `10`
   - Inventory Quantity: `30`
   - Option 1 Name: `Size`
   - Option 1 Value: `10lb`
3. Click "Create Variant"

**Expected:**
- Second variant created successfully
- Both variants visible in table
- Different SKUs for each variant

#### Test 1.4: Create Third Variant (15lb Beef Bowl)
1. Create third variant:
   - Title: `15lb`
   - Price: `79.99`
   - Weight: `15`
   - Inventory: `20`
   - Option 1 Name: `Size`
   - Option 1 Value: `15lb`

**Expected:**
- All 3 variants visible
- Sorted by position (or creation order)

#### Test 1.5: Edit a Variant
1. Click "Edit" on the 10lb variant
2. Change price to `52.99`
3. Change inventory to `35`
4. Add notes: "Discounted for testing"
5. Click "Save Changes"

**Expected:**
- Redirects back to variant list
- Changes are reflected
- Updated timestamp changes

#### Test 1.6: Adjust Inventory
1. Click "Edit" on 5lb variant
2. Scroll to "Inventory Adjustments" section
3. Click "Adjust Inventory"
4. Enter:
   - Quantity Change: `+10`
   - Reason: `Restock`
   - Notes: `Test restock`
5. Submit

**Expected:**
- Inventory increases from 50 to 60
- Adjustment appears in history table
- Audit trail created

#### Test 1.7: Delete a Variant
1. Create a temporary variant (Title: "TEST - DELETE ME")
2. Click "Delete" on this variant
3. Confirm deletion

**Expected:**
- Variant removed from list
- If it was the last variant, product `has_variants` becomes `false`

---

### Phase 2: Customer - View and Select Variants (10 minutes)

#### Test 2.1: Navigate to Product Page
1. Go to shop page `/shop`
2. Find the product you added variants to
3. Click on the product

**Expected:**
- Product page loads
- Variant selector component visible
- All 3 variants shown as buttons/options

#### Test 2.2: Variant Selection UI
1. Observe the variant selector
2. Check each variant option displays:
   - Variant name (5lb, 10lb, 15lb)
   - Price
   - Stock status

**Expected:**
- All variants clickable
- Current selection highlighted
- Price updates when variant selected
- Stock indicator shows availability

#### Test 2.3: Select Different Variants
1. Click on "5lb" variant
2. Observe price changes to $29.99
3. Click on "10lb" variant
4. Observe price changes to $52.99
5. Click on "15lb" variant
6. Observe price changes to $79.99

**Expected:**
- Price updates instantly
- Selected variant highlights
- Product details reflect selected variant

#### Test 2.4: Out of Stock Variant
**Setup:** Edit a variant in admin and set `inventory_quantity = 0`

1. Refresh product page
2. Observe out-of-stock variant

**Expected:**
- Variant shows as unavailable/disabled
- Cannot select out-of-stock variant
- Message indicates it's out of stock

---

### Phase 3: Cart Integration (10 minutes)

#### Test 3.1: Add Variant to Cart
1. On product page, select "5lb" variant ($29.99)
2. Click "Add to Cart"

**Expected:**
- Cart sidebar opens
- Item shows:
  - Product name
  - Variant name ("5lb")
  - Price: $29.99
  - Quantity: 1

#### Test 3.2: Add Different Variant
1. Select "10lb" variant ($52.99)
2. Click "Add to Cart"

**Expected:**
- Cart now has 2 line items:
  - Product - 5lb ($29.99) x 1
  - Product - 10lb ($52.99) x 1
- Variants treated as separate items
- Total: $82.98

#### Test 3.3: Add Same Variant Again
1. Select "5lb" variant
2. Click "Add to Cart" again

**Expected:**
- Cart still has 2 line items
- 5lb quantity increases to 2
- Subtotal: $59.98 (29.99 x 2)
- 10lb remains at 1
- Total: $112.97

#### Test 3.4: Update Quantities
1. In cart, change 5lb quantity to 3
2. Change 10lb quantity to 2

**Expected:**
- Quantities update
- Prices recalculate
- 5lb: $89.97 (29.99 x 3)
- 10lb: $105.98 (52.99 x 2)
- Total: $195.95

#### Test 3.5: Remove Variant from Cart
1. Click remove (X) on 10lb variant
2. Confirm removal

**Expected:**
- 10lb removed from cart
- 5lb remains (qty: 3)
- Total: $89.97

---

### Phase 4: Checkout and Orders (15 minutes)

#### Test 4.1: Proceed to Checkout
1. With variants in cart, click "Checkout"
2. Fill in shipping/billing information
3. Proceed through checkout flow

**Expected:**
- Variants display correctly in order summary
- Prices match selected variants
- Variant names visible

#### Test 4.2: Complete Test Order
1. Complete checkout (use test payment if integrated)
2. Submit order

**Expected:**
- Order confirmation page shows variant details
- Email confirmation (if configured) shows variants

#### Test 4.3: Admin - View Order with Variants
1. Go to `/admin/orders`
2. Find the test order you just placed
3. Open order details

**Expected:**
- Order shows items with variant information
- Each line item displays:
  - Product name
  - Variant name
  - SKU
  - Price
  - Quantity

#### Test 4.4: Inventory Deduction
1. Go back to `/admin/products/{productId}/variants`
2. Check inventory for ordered variants

**Expected:**
- Inventory reduced by quantities ordered
- Inventory adjustments created with reason "sale"
- Order ID linked in adjustment record

---

### Phase 5: API Testing (Optional - for developers)

#### Test 5.1: GET Variants
```bash
curl http://localhost:3000/api/products/{productId}/variants
```

**Expected:** JSON array of variants with full details

#### Test 5.2: GET Single Variant
```bash
curl http://localhost:3000/api/variants/{variantId}
```

**Expected:** Single variant object with product relation

#### Test 5.3: POST Create Variant
```bash
curl -X POST http://localhost:3000/api/products/{productId}/variants \
  -H "Content-Type: application/json" \
  -d '{
    "title": "API Test Variant",
    "sku": "API-TEST-001",
    "price": 19.99,
    "inventory_quantity": 100,
    "option1_name": "Test",
    "option1_value": "API"
  }'
```

**Expected:** 201 Created with variant object

#### Test 5.4: PATCH Update Variant
```bash
curl -X PATCH http://localhost:3000/api/variants/{variantId} \
  -H "Content-Type: application/json" \
  -d '{
    "price": 24.99,
    "inventory_quantity": 75
  }'
```

**Expected:** 200 OK with updated variant

#### Test 5.5: DELETE Variant
```bash
curl -X DELETE http://localhost:3000/api/variants/{variantId}
```

**Expected:** 200 OK with deletion confirmation

---

## Edge Cases and Error Scenarios

### Edge Case 1: Duplicate SKU
1. Try creating a variant with an existing SKU
**Expected:** Error message "SKU already exists"

### Edge Case 2: No Variant Selected
1. On product page with variants, click "Add to Cart" without selecting a variant
**Expected:** Prompt to select variant, or first variant auto-selected

### Edge Case 3: Negative Inventory
1. Try adjusting inventory by -999 when only 50 in stock
**Expected:** Error: "Insufficient inventory"

### Edge Case 4: Delete Last Variant
1. Delete all variants from a product
**Expected:** Product `has_variants` changes to `false`, product reverts to non-variant display

### Edge Case 5: Overselling Prevention
1. Set variant inventory to 2
2. Try adding 5 to cart
**Expected:** Error or limit to available quantity

---

## Success Criteria

### ✅ Must Pass
- [ ] Variants can be created, edited, and deleted in admin
- [ ] Variant selector displays correctly on product pages
- [ ] Price updates when variant selected
- [ ] Variants can be added to cart with correct details
- [ ] Different variants treated as separate cart items
- [ ] Orders record variant information
- [ ] Inventory tracks per-variant and deducts on purchase
- [ ] No TypeScript compilation errors
- [ ] No console errors on product page

### ✅ Should Pass
- [ ] SKU auto-generation works
- [ ] Inventory adjustments create audit trail
- [ ] Out-of-stock variants are disabled
- [ ] Low stock warnings display
- [ ] Compare-at pricing shows savings
- [ ] Variant images display (if configured)
- [ ] Mobile responsive variant selector

### ✅ Nice to Have
- [ ] Variant search/filter in admin
- [ ] Bulk variant import
- [ ] Variant analytics/reporting
- [ ] Quick-edit inventory inline

---

## Known Issues / Limitations

1. **No variant reordering UI:** Variants display by creation order, no drag-and-drop reordering yet
2. **No bulk operations:** Must edit variants one at a time
3. **No variant-specific images:** Variant images not fully implemented in UI
4. **No CSV import/export:** Manual entry only

---

## Cleanup After Testing

1. Delete test variants
2. Reset inventory to production values
3. Remove test orders (or mark as test)
4. Clear cart

---

## Troubleshooting

### Issue: Variants not displaying on product page
**Solution:** Check `product.has_variants` is `true` and `product.id` is set

### Issue: "Failed to fetch variants" error
**Solution:** Check API route exists at `/api/products/[id]/variants` and Supabase connection

### Issue: Duplicate cart items for same variant
**Solution:** Check `cart_key` generation includes `variant_id`

### Issue: Inventory not deducting
**Solution:** Verify checkout flow calls inventory adjustment function with variant_id

---

## Next Steps After Testing

1. **Monitor Performance:** Check page load times with variants
2. **Customer Feedback:** Gather feedback on variant selector UX
3. **Analytics:** Track which variants sell best
4. **Enhancements:**
   - Add variant-specific images
   - Implement bulk operations
   - Add CSV import/export
   - Create variant templates

---

## Support

For issues or questions:
- Check console for error messages
- Review `/docs/ORDER_MANAGEMENT_SYSTEM.md` for cart/order flow
- Check Supabase logs for database errors
- Review API responses in Network tab

**Last Updated:** January 30, 2025

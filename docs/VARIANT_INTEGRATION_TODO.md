# Product Variants Integration - Completion Guide

**Date:** January 28, 2025
**Status:** In Progress (Priority 2 of 4)
**Dependencies:** API endpoints complete, VariantSelector component exists

---

## ✅ What's Already Complete

### Database & Backend (100%)
- ✅ `product_variants` table with full schema
- ✅ `inventory_adjustments` table for audit trail
- ✅ GET `/api/products/[id]/variants` - Fetch variants for product
- ✅ POST `/api/products/[id]/variants` - Create variant
- ✅ GET `/api/variants/[id]` - Fetch single variant
- ✅ PATCH `/api/variants/[id]` - Update variant
- ✅ DELETE `/api/variants/[id]` - Delete variant
- ✅ All TypeScript types defined (`types/product-variant.ts`)

### Frontend Components (50%)
- ✅ `VariantSelector` component (`components/variant-selector.tsx`)
  - Extracts options from variants automatically
  - Shows availability based on selections
  - Displays selected variant price & stock
  - Already styled and functional
- ✅ Cart context already supports variants
  - `variant_id`, `variant_title`, `sku` fields
  - `cart_key` generation: `${product_id}-${variant_id}`

---

## 🚧 What Needs To Be Done

### Priority 2: Frontend Integration (Current Focus)

#### Step 1: Update AddToCartButton Component
**File:** `/mnt/c/waggin-meals/components/add-to-cart-button.tsx`

**Current State:** Only accepts base product data
**Needed:** Accept optional variant information

**Changes Required:**

```typescript
// UPDATE THE INTERFACE
interface AddToCartButtonProps {
  product: {
    id: string;
    handle: string;
    title: string;
    price: number;
    images: string[];
    weight?: string;
  };
  // ADD THESE
  selectedVariant?: {
    variant_id: string;
    variant_title: string;
    sku: string;
    price: number;
  } | null;
  disabled?: boolean; // For when no variant is selected
  variant?: 'primary' | 'secondary';
  className?: string;
}

// UPDATE handleAddToCart function (line 23-40)
const handleAddToCart = (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();

  setIsAdding(true);

  // Build cart item with variant support
  const cartItem: any = {
    id: product.id,
    handle: product.handle,
    title: product.title,
    price: selectedVariant ? selectedVariant.price : product.price,
    image: product.images[0],
    weight: product.weight,
  };

  // Add variant fields if variant is selected
  if (selectedVariant) {
    cartItem.variant_id = selectedVariant.variant_id;
    cartItem.variant_title = selectedVariant.variant_title;
    cartItem.sku = selectedVariant.sku;
  }

  addItem(cartItem);

  setTimeout(() => {
    setIsAdding(false);
  }, 1000);
};

// UPDATE BUTTON (line 49-52)
<button
  onClick={handleAddToCart}
  disabled={isAdding || disabled}  // Add disabled prop
  className={`${baseClasses} ${variantClasses} ${className}`}
  style={{ fontFamily: "'Poppins', sans-serif" }}
>
```

#### Step 2: Integrate Variants into Product Detail Page
**File:** `/mnt/c/waggin-meals/app/products/[handle]/page.tsx`

**Current State:** Uses static product data from `/data/products.ts`
**Needed:** Fetch and display variants when product has them

**Add These Imports (line 1-9):**
```typescript
import { useState, useEffect } from 'react';  // Already has useState
import VariantSelector from '@/components/variant-selector';  // NEW
import type { ProductVariant } from '@/types/product-variant';  // NEW
```

**Add State Variables (after line 15):**
```typescript
const [variants, setVariants] = useState<ProductVariant[]>([]);
const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
const [loadingVariants, setLoadingVariants] = useState(false);
```

**Add useEffect to Fetch Variants (after state declarations):**
```typescript
// Fetch variants if product has them
useEffect(() => {
  async function fetchVariants() {
    // Check if product has variants (you'll need to add hasVariants property to Product type)
    if (!product?.hasVariants) return;

    setLoadingVariants(true);
    try {
      const response = await fetch(`/api/products/${product.id}/variants`);
      if (!response.ok) throw new Error('Failed to fetch variants');

      const data = await response.json();
      setVariants(data.variants || []);
    } catch (error) {
      console.error('Error fetching variants:', error);
    } finally {
      setLoadingVariants(false);
    }
  }

  if (product) {
    fetchVariants();
  }
}, [product]);
```

**Insert VariantSelector (around line 133, after description):**
```typescript
{/* Description */}
<p className="text-[16px] leading-relaxed text-[#666666] mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
  {product.description}
</p>

{/* VARIANT SELECTOR - ADD THIS */}
{variants.length > 0 && (
  <div className="mb-6">
    <VariantSelector
      productId={product.id}
      variants={variants}
      onVariantChange={(variant) => setSelectedVariant(variant)}
    />
  </div>
)}

{/* Tags */}
<div className="flex flex-wrap gap-2 mb-8">
```

**Update Price Display (around line 116-133):**
```typescript
{/* Price */}
<div className="mb-6">
  <div className="flex items-baseline gap-3">
    <span className="text-4xl font-bold text-[#a5b5eb]" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* CHANGE THIS LINE */}
      ${selectedVariant ? selectedVariant.price.toFixed(2) : product.price.toFixed(2)}
    </span>
    {/* Update compare price logic too */}
    {(selectedVariant?.compare_at_price || product.compareAtPrice) && (
      <span className="text-xl text-[#999999] line-through" style={{ fontFamily: "'Poppins', sans-serif" }}>
        ${(selectedVariant?.compare_at_price || product.compareAtPrice)!.toFixed(2)}
      </span>
    )}
  </div>
  {product.weight && !selectedVariant && (
    <p className="text-[16px] text-[#666666] mt-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {product.weight}
    </p>
  )}
</div>
```

**Update Stock Status Display (around line 154-173):**
```typescript
{/* Stock Status */}
<div className="mb-8">
  {/* CHANGE THIS SECTION */}
  {selectedVariant ? (
    // Show variant stock
    selectedVariant.track_inventory ? (
      selectedVariant.inventory_quantity > 0 ? (
        <div className="flex items-center text-green-600">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          <span className="font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
            In Stock
            {selectedVariant.inventory_quantity < 10 && ` - Only ${selectedVariant.inventory_quantity} left!`}
          </span>
        </div>
      ) : (
        <div className="flex items-center text-red-600">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
          </svg>
          <span className="font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Out of Stock</span>
        </div>
      )
    ) : (
      <div className="flex items-center text-green-600">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
        </svg>
        <span className="font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>In Stock</span>
      </div>
    )
  ) : (
    // Show product-level stock (existing code)
    product.inStock ? (
      <div className="flex items-center text-green-600">
        ...existing code...
      </div>
    ) : (
      <div className="flex items-center text-red-600">
        ...existing code...
      </div>
    )
  )}
</div>
```

**Update AddToCartButton Call (around line 177-190):**
```typescript
{/* CTA Buttons */}
<div className="space-y-3">
  {/* CHANGE THIS SECTION */}
  {(selectedVariant ? selectedVariant.inventory_quantity > 0 : product.inStock) ? (
    <>
      <AddToCartButton
        product={{
          id: product.id,
          handle: product.handle,
          title: product.title,
          price: product.price,
          images: product.images,
          weight: product.weight,
        }}
        // ADD THESE PROPS
        selectedVariant={
          selectedVariant
            ? {
                variant_id: selectedVariant.id,
                variant_title: selectedVariant.title,
                sku: selectedVariant.sku,
                price: selectedVariant.price,
              }
            : null
        }
        disabled={variants.length > 0 && !selectedVariant}  // Disable if variants exist but none selected
        variant="primary"
        className="w-full px-8 py-4 rounded-lg text-lg"
      />
```

#### Step 3: Add hasVariants to Product Type
**File:** `/mnt/c/waggin-meals/data/products.ts`

**Update Product Interface (line 7):**
```typescript
export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  collection: string;
  tags: string[];
  status: 'active' | 'draft';
  ingredients?: string;
  analysis?: string;
  weight?: string;
  sku?: string;
  inStock: boolean;
  stockQty?: number;
  hasVariants?: boolean;  // ADD THIS
}
```

**Add hasVariants to Products (line 27+):**
For any products that should have variants, add `hasVariants: true` to their definition.

---

### Priority 3: Admin Variant Management (Next)

#### Create Variant Edit Page
**File:** `/mnt/c/waggin-meals/app/admin/products/[id]/variants/[variantId]/page.tsx`

**Status:** File exists but may be incomplete
**Needed:** Full edit form for individual variants

**Should Include:**
- Form fields for all variant properties
- Inventory adjustment interface
- Image upload for variant-specific images
- Save/cancel buttons
- Delete variant option

**Reference:** Use the existing variant create form in `/app/admin/products/[id]/variants/page.tsx:36-74` as a template

#### Enhance Variant List View
**File:** `/mnt/c/waggin-meals/app/admin/products/[id]/variants/page.tsx`

**Improvements Needed:**
- Bulk operations (enable/disable, price updates)
- Quick inventory adjustments
- Sortable columns
- Filter by availability/stock status
- Export to CSV

---

### Priority 4: Checkout & Orders Integration

#### Update Checkout to Handle Variants
**Files:** Checkout pages and order creation API

**Changes Needed:**
1. Display variant information in cart review
2. Include variant SKU in order items
3. Link order items to variants for inventory tracking

**Database Migration Required:**
```sql
-- Add variant_id to order_items table
ALTER TABLE order_items
ADD COLUMN variant_id UUID REFERENCES product_variants(id);

-- Add index
CREATE INDEX idx_order_items_variant ON order_items(variant_id);
```

#### Update Order Display
**Files:** Admin order pages, customer order history

**Changes Needed:**
1. Show variant title next to product name
2. Display variant SKU in order details
3. Include variant info in packing slips

#### Inventory Deduction
**File:** Order creation API

**Changes Needed:**
When order is created, if product has variant_id:
```typescript
// Deduct inventory using database function
await supabase.rpc('adjust_variant_inventory', {
  p_variant_id: orderItem.variant_id,
  p_quantity_change: -orderItem.quantity,
  p_reason: 'sale',
  p_order_id: order.id,
  p_adjusted_by: 'system'
});
```

---

## Testing Checklist

### Manual Testing Required

**Variant Selection:**
- [ ] Options display correctly
- [ ] Unavailable combinations are disabled
- [ ] Price updates when variant selected
- [ ] Stock status updates when variant selected
- [ ] "Add to Cart" disabled when no variant selected

**Cart Functionality:**
- [ ] Variant added to cart with correct info
- [ ] Cart shows variant title (e.g., "Product - 5lb")
- [ ] Different variants of same product treated as separate items
- [ ] Cart quantity updates work per variant

**Admin Management:**
- [ ] Create new variant successfully
- [ ] Edit existing variant
- [ ] Delete variant
- [ ] Inventory adjustments recorded correctly
- [ ] has_variants flag updates automatically

**Checkout & Orders:**
- [ ] Variant info displayed in checkout
- [ ] Order created with variant_id
- [ ] Inventory decremented correctly
- [ ] Order confirmation shows variant details

---

## Migration Strategy

### Current: Static Product Data
Products are defined in `/data/products.ts` (TypeScript file)

### Goal: Database-Backed Products
Products stored in Supabase `products` table

### Migration Path:

**Phase 1: Hybrid (Current Approach)**
- Keep static products for simple items
- Fetch variants from database for products with `hasVariants: true`
- **Advantage:** Minimal disruption, gradual migration

**Phase 2: Full Migration (Future)**
- Move all products to database
- Update shop/product pages to fetch from API
- Remove `/data/products.ts` file
- **Advantage:** Complete consistency, dynamic updates

---

## Known Issues & Considerations

### Issue 1: Static vs Database Products
**Problem:** Products currently defined in TypeScript, variants in database
**Impact:** Inconsistent data sources
**Solution:** Implement hybrid approach (Phase 1 above)

### Issue 2: Cart Persistence
**Problem:** Cart stored in localStorage with product IDs
**Impact:** If product data changes, cart may have stale info
**Solution:** Already handled - cart stores price/title at add time

### Issue 3: SEO for Variants
**Problem:** Each variant doesn't have unique URL
**Impact:** Can't link directly to specific variant
**Solution:** Consider adding query params: `/products/chicken-meal?variant=5lb`

---

## Estimated Timeline

**Remaining Work:**
- Priority 2 (Frontend Integration): 3-4 hours
  - AddToCartButton update: 30 minutes
  - Product page integration: 2-3 hours
  - Testing: 30 minutes

- Priority 3 (Admin Improvements): 2-3 hours
  - Variant edit page: 1-2 hours
  - List view enhancements: 1 hour

- Priority 4 (Checkout Integration): 3-4 hours
  - Database migration: 30 minutes
  - Checkout updates: 1-2 hours
  - Inventory integration: 1 hour
  - Testing: 1 hour

**Total: 8-11 hours**

---

## Next Steps

1. **Immediate:** Complete Priority 2 (Frontend Integration)
   - Start with AddToCartButton component update
   - Then integrate into product detail page
   - Test end-to-end cart flow with variants

2. **Short-term:** Priority 3 (Admin Management)
   - Focus on variant edit page
   - Add bulk operations if time permits

3. **Launch-critical:** Priority 4 (Checkout Integration)
   - Must be done before accepting real orders
   - Critical for inventory accuracy

---

**Last Updated:** January 28, 2025
**Status:** Ready for implementation
**Blocker:** None - all dependencies complete

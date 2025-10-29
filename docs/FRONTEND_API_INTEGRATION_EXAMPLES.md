# Frontend API Integration Examples

**Date:** January 28, 2025
**Purpose:** Show how to update frontend components to use new product API endpoints

---

## Overview

After migrating products to the database, frontend components need to fetch from API endpoints instead of static imports. This guide provides complete examples for common pages.

---

## Key Changes Summary

### Before (Static Data):
```typescript
import { products, collections } from '@/data/products';
```

### After (API Fetch):
```typescript
// Fetch in server component
const response = await fetch('http://localhost:3000/api/products');
const { products } = await response.json();
```

---

## Example 1: Shop Page (Complete Rewrite)

**File:** `/app/shop/page.tsx`

### Updated Implementation:

```typescript
import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from '@/components/add-to-cart-button';

// Type definitions
interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: number;
  compare_at_price?: number;
  images: string[];
  category: string;
  tags: string[];
  weight?: string;
  in_stock: boolean;
  inventory_count: number;
  is_featured: boolean;
  collection_id: string;
  collection_name: string;
  collection_slug: string;
}

interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  product_count: number;
  products?: Product[];
}

// Fetch collections with products from API
async function getCollections(): Promise<Collection[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/collections?include_products=true`,
      { cache: 'no-store' } // Always fetch fresh data
    );

    if (!response.ok) {
      throw new Error('Failed to fetch collections');
    }

    const data = await response.json();
    return data.collections;
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
}

export default async function ShopPage() {
  const collections = await getCollections();

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Shop Waggin Meals
          </h1>
          <p className="text-lg text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Premium nutrition for dogs who deserve the best
          </p>
        </div>
      </section>

      {/* Bundles Promotion Banner */}
      <section className="bg-gradient-to-r from-[#2f4b38] to-[#3d5e49] px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="inline-block bg-[#ffc107] text-[#2f4b38] px-3 py-1 rounded-full text-sm font-bold mb-3">
                SAVE UP TO $19
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Premium Nutrition Bundles
              </h2>
              <p className="text-lg text-white/90 mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Save big with our curated bundles. Customize your selection or choose a pre-configured package.
              </p>
              <ul className="text-white/80 text-sm space-y-1 mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <li>✓ Free Shipping Included</li>
                <li>✓ Flexible Delivery Options</li>
                <li>✓ Subscribe & Save an Extra 3%</li>
              </ul>
            </div>
            <div className="flex-shrink-0">
              <Link
                href="/bundles"
                className="inline-block bg-white text-[#2f4b38] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#f5f1ea] transition-colors shadow-lg"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                View Bundles →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Product Collections */}
      {collections.map((collection) => (
        <section key={collection.id} className="bg-white px-4 py-16 border-b-2 border-[#e0e0e0]">
          <div className="mx-auto max-w-7xl">
            {/* Collection Header */}
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-normal text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                {collection.name}
              </h2>
              <p className="text-[16px] text-[#666666] max-w-3xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {collection.description}
              </p>
              <p className="text-sm text-[#999999] mt-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {collection.product_count} {collection.product_count === 1 ? 'product' : 'products'}
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {collection.products?.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.handle}`}
                  className="bg-white border-2 border-[#e0e0e0] rounded-lg overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  {/* Product Image */}
                  <div className="relative h-56 bg-[#f8f9fa] overflow-hidden">
                    <Image
                      src={product.images[0] || '/images/placeholder.jpg'}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {!product.in_stock && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Out of Stock
                      </div>
                    )}
                    {product.tags.includes('bestseller') && (
                      <div className="absolute top-2 left-2 bg-[#ffc107] text-[#856404] px-3 py-1 rounded-full text-xs font-semibold">
                        Best Seller
                      </div>
                    )}
                    {product.is_featured && (
                      <div className="absolute top-2 left-2 bg-[#a5b5eb] text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-[#3c3a47] mb-2 line-clamp-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {product.title}
                    </h3>

                    {product.weight && (
                      <p className="text-sm text-[#666666] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {product.weight}
                      </p>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-2xl font-bold text-[#a5b5eb]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          ${product.price.toFixed(2)}
                        </span>
                        {product.compare_at_price && (
                          <span className="text-sm text-[#999999] line-through ml-2">
                            ${product.compare_at_price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-[13px] text-[#666666] mb-4 line-clamp-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {product.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {product.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-[#e8f4fb] text-[#0c5460] px-2 py-1 rounded"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Stock Status */}
                    {product.inventory_count > 0 && product.inventory_count < 10 && (
                      <p className="text-xs text-orange-600 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Only {product.inventory_count} left in stock!
                      </p>
                    )}

                    {/* Add to Cart Button */}
                    {product.in_stock ? (
                      <AddToCartButton
                        product={{
                          id: product.id,
                          handle: product.handle,
                          title: product.title,
                          price: product.price,
                          images: product.images,
                          weight: product.weight,
                        }}
                        variant="primary"
                        className="w-full px-4 py-2 rounded-lg"
                      />
                    ) : (
                      <div className="block w-full bg-gray-300 text-gray-600 text-center px-4 py-2 rounded-lg font-semibold cursor-not-allowed"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Out of Stock
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Why Choose Waggin Meals */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-12 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Why Choose Waggin Meals
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#a5b5eb] rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-4">
                ✓
              </div>
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Expert-Formulated
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Every recipe designed by Christie, a certified pet nutritionist with years of experience
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#a5b5eb] rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-4">
                🌱
              </div>
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Whole Food Ingredients
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Human-grade, fresh ingredients with no artificial preservatives or fillers
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#a5b5eb] rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-4">
                💙
              </div>
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Made with Love
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Small-batch production ensures quality and freshness in every order
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
```

### Key Changes:

1. **Removed static import** - No longer imports from `@/data/products`
2. **Added type definitions** - Proper TypeScript types for Product and Collection
3. **Created fetch function** - `getCollections()` fetches from API
4. **Made component async** - Server component can await data
5. **Updated field names** - Database uses snake_case (`in_stock`, `compare_at_price`, etc.)
6. **Added product count display** - Shows number of products per collection
7. **Added inventory warnings** - Shows "Only X left" for low stock
8. **Added featured badge** - Shows featured products from database

---

## Example 2: Homepage Featured Products

**File:** `/app/page.tsx` (excerpt)

### Before:
```typescript
import { products } from '@/data/products';

export default function HomePage() {
  const featuredProducts = products.filter(p => p.tags.includes('featured'));
  // ... render featured products
}
```

### After:
```typescript
async function getFeaturedProducts() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products?featured=true&limit=3`,
      { cache: 'no-store' }
    );
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();
  // ... render featured products
}
```

---

## Example 3: Individual Product Page

**File:** `/app/products/[handle]/page.tsx`

```typescript
import Image from 'next/image';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/add-to-cart-button';

interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: number;
  compare_at_price?: number;
  images: string[];
  category: string;
  tags: string[];
  weight?: string;
  in_stock: boolean;
  inventory_count: number;
  ingredients?: string;
  nutritional_analysis?: string;
  collection_name: string;
  collection_slug: string;
  variants: ProductVariant[];
  has_variants: boolean;
}

interface ProductVariant {
  id: string;
  title: string;
  price: number;
  compare_at_price?: number;
  inventory_count: number;
  in_stock: boolean;
}

async function getProduct(handle: string): Promise<Product | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products/${handle}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle);

  if (!product) {
    notFound();
  }

  return (
    <main className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="relative h-96 bg-[#f8f9fa] rounded-lg overflow-hidden mb-4">
              <Image
                src={product.images[0] || '/images/placeholder.jpg'}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1).map((img, idx) => (
                  <div key={idx} className="relative h-24 bg-[#f8f9fa] rounded overflow-hidden">
                    <Image src={img} alt={`${product.title} ${idx + 2}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="text-sm text-[#a5b5eb] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {product.collection_name}
            </div>
            <h1 className="text-4xl font-normal text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
              {product.title}
            </h1>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-[#a5b5eb]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                ${product.price.toFixed(2)}
              </span>
              {product.compare_at_price && (
                <span className="text-xl text-[#999999] line-through">
                  ${product.compare_at_price.toFixed(2)}
                </span>
              )}
              {product.weight && (
                <span className="text-sm text-[#666666]">({product.weight})</span>
              )}
            </div>

            <p className="text-[16px] text-[#666666] mb-6 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {product.description}
            </p>

            {/* Stock Status */}
            {product.in_stock ? (
              <>
                {product.inventory_count < 10 && (
                  <p className="text-sm text-orange-600 mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Only {product.inventory_count} left in stock - order soon!
                  </p>
                )}
                <AddToCartButton
                  product={{
                    id: product.id,
                    handle: product.handle,
                    title: product.title,
                    price: product.price,
                    images: product.images,
                    weight: product.weight,
                  }}
                  variant="primary"
                  className="w-full md:w-auto px-8 py-4 rounded-lg text-lg"
                />
              </>
            ) : (
              <div className="bg-gray-200 text-gray-600 text-center px-8 py-4 rounded-lg font-semibold">
                Out of Stock
              </div>
            )}

            {/* Ingredients */}
            {product.ingredients && (
              <div className="mt-8 p-4 bg-[#f8f9fa] rounded-lg">
                <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Ingredients
                </h3>
                <p className="text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {product.ingredients}
                </p>
              </div>
            )}

            {/* Nutritional Analysis */}
            {product.nutritional_analysis && (
              <div className="mt-4 p-4 bg-[#e8f4fb] rounded-lg">
                <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Guaranteed Analysis
                </h3>
                <p className="text-sm text-[#666666] whitespace-pre-line" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {product.nutritional_analysis}
                </p>
              </div>
            )}

            {/* Tags */}
            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-[#e8f4fb] text-[#0c5460] px-3 py-1 rounded-full"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
```

---

## Example 4: Collection-Specific Pages

**File:** `/app/meal-toppers/page.tsx`

### Before:
```typescript
import { collections } from '@/data/products';

export default function MealToppersPage() {
  const collection = collections.find(c => c.slug === 'meal-toppers');
  const products = collection?.products || [];
  // ... render
}
```

### After:
```typescript
async function getMealToppers() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products?collection=meal-toppers`,
      { cache: 'no-store' }
    );
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error('Error fetching meal toppers:', error);
    return [];
  }
}

export default async function MealToppersPage() {
  const products = await getMealToppers();
  // ... render
}
```

---

## Client-Side Fetching (For Interactive Components)

If you need to fetch products client-side (e.g., for real-time filtering):

```typescript
'use client';

import { useState, useEffect } from 'react';

interface Product {
  // ... type definition
}

export default function ClientProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const url = filter === 'all'
          ? '/api/products'
          : `/api/products?category=${filter}`;

        const response = await fetch(url);
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [filter]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* Filter buttons */}
      <button onClick={() => setFilter('all')}>All</button>
      <button onClick={() => setFilter('Dog Food')}>Dog Food</button>

      {/* Product grid */}
      <div className="grid grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id}>{product.title}</div>
        ))}
      </div>
    </div>
  );
}
```

---

## Environment Variable Configuration

Add to `.env.local`:

```bash
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

For production:

```bash
NEXT_PUBLIC_BASE_URL=https://wagginmeals.com
```

---

## Common Pitfalls & Solutions

### Issue 1: "products is not iterable"

**Cause:** API returns `{ products: [...] }` but code expects array directly

**Solution:**
```typescript
// ❌ Wrong
const products = await fetch('/api/products');

// ✅ Correct
const response = await fetch('/api/products');
const { products } = await response.json();
```

### Issue 2: Field name mismatches

**Cause:** Database uses snake_case, static data used camelCase

**Solution:** Update all field references:
- `inStock` → `in_stock`
- `compareAtPrice` → `compare_at_price`
- `inventoryCount` → `inventory_count`

### Issue 3: Images not loading

**Cause:** Image paths in database may be incomplete

**Solution:** Add fallback:
```typescript
<Image src={product.images[0] || '/images/placeholder.jpg'} alt={product.title} />
```

---

## Testing Checklist

After updating components:

- [ ] Shop page loads all collections
- [ ] Products display correct prices and images
- [ ] Individual product pages work
- [ ] Add to cart still functions
- [ ] Out of stock products show correctly
- [ ] Low stock warnings appear
- [ ] Featured products display on homepage
- [ ] Category filtering works
- [ ] Tags display properly
- [ ] Ingredients and nutritional info show (if present)

---

## Next Steps

1. Apply product migration (see `PRODUCT_MIGRATION_GUIDE.md`)
2. Update shop page first (largest impact)
3. Update homepage featured products section
4. Update collection-specific pages (meal-toppers, treats, etc.)
5. Update individual product pages
6. Test checkout flow end-to-end
7. Remove or archive `data/products.ts` once confirmed working

---

**Status:** Ready for implementation
**Estimated Time:** 2-3 hours for all pages
**Risk Level:** Low (can test locally before deploying)

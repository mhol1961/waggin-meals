// Product Variant Types

export interface ProductVariant {
  id: string;
  sku: string;
  title: string; // e.g., "4-Cup Pack", "12-Cup Pack"
  price: number;
  compareAtPrice?: number;
  weight: string; // e.g., "800g", "2.4kg"
  servings: number; // number of cups/servings
  inStock: boolean;
  stockQty: number;
  isDefault?: boolean; // which variant to show by default
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: number; // base/starting price (lowest variant price)
  compareAtPrice?: number;
  images: string[];
  category: string;
  collection: string;
  tags: string[];
  status: 'active' | 'draft';
  ingredients?: string;
  analysis?: string;
  weight?: string; // deprecated - use variants
  sku?: string; // deprecated - use variants
  inStock: boolean;
  stockQty?: number; // deprecated - use variants

  // NEW: Product Variants
  variants?: ProductVariant[];
  hasVariants: boolean;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  products: Product[];
}

// Cart item with variant support
export interface CartItem {
  productId: string;
  variantId?: string;
  handle: string;
  title: string;
  variantTitle?: string;
  price: number;
  image: string;
  quantity: number;
  weight?: string;
}

// Helper function to get variant display name
export function getVariantDisplayName(variant: ProductVariant): string {
  return `${variant.servings} Cups (${variant.weight})`;
}

// Helper function to calculate savings
export function calculateSavings(variant: ProductVariant): number {
  if (!variant.compareAtPrice || variant.compareAtPrice <= variant.price) {
    return 0;
  }
  return variant.compareAtPrice - variant.price;
}

// Helper function to calculate savings percentage
export function calculateSavingsPercentage(variant: ProductVariant): number {
  if (!variant.compareAtPrice || variant.compareAtPrice <= variant.price) {
    return 0;
  }
  return Math.round(((variant.compareAtPrice - variant.price) / variant.compareAtPrice) * 100);
}

/**
 * Product Variants Helper Functions
 * Comprehensive utility library for managing product variants
 */

import { supabase } from '@/lib/supabase-client';
import type {
  ProductVariant,
  CreateVariantRequest,
  UpdateVariantRequest,
  AdjustInventoryRequest,
  AdjustInventoryResponse,
} from '@/types/product-variant';

// ============================================
// Variant CRUD Operations
// ============================================

/**
 * Get all variants for a product
 */
export async function getProductVariants(
  productId: string
): Promise<ProductVariant[]> {
  const { data, error } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', productId)
    .order('position', { ascending: true });

  if (error) {
    console.error('Error fetching product variants:', error);
    throw new Error(`Failed to fetch variants: ${error.message}`);
  }

  return data || [];
}

/**
 * Get a single variant by ID
 */
export async function getVariantById(
  variantId: string
): Promise<ProductVariant | null> {
  const { data, error } = await supabase
    .from('product_variants')
    .select('*')
    .eq('id', variantId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null;
    }
    console.error('Error fetching variant:', error);
    throw new Error(`Failed to fetch variant: ${error.message}`);
  }

  return data;
}

/**
 * Get a variant by SKU
 */
export async function getVariantBySku(
  sku: string
): Promise<ProductVariant | null> {
  const { data, error } = await supabase
    .from('product_variants')
    .select('*')
    .eq('sku', sku)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching variant by SKU:', error);
    throw new Error(`Failed to fetch variant by SKU: ${error.message}`);
  }

  return data;
}

/**
 * Create a new variant
 */
export async function createVariant(
  input: CreateVariantRequest
): Promise<ProductVariant> {
  // Check if SKU already exists
  if (input.sku) {
    const existing = await getVariantBySku(input.sku);
    if (existing) {
      throw new Error(`SKU "${input.sku}" already exists`);
    }
  } else {
    // Auto-generate SKU if not provided
    input.sku = await generateUniqueSKU(input.product_id, input.title);
  }

  // Set defaults
  const variantData = {
    ...input,
    inventory_quantity: input.inventory_quantity ?? 0,
    inventory_policy: input.inventory_policy ?? 'deny',
    track_inventory: input.track_inventory ?? true,
    is_available: input.is_available ?? true,
    requires_shipping: input.requires_shipping ?? true,
    taxable: input.taxable ?? true,
    position: input.position ?? 0,
    weight_unit: input.weight_unit ?? 'lb',
    dimensions_unit: input.dimensions_unit ?? 'in',
  };

  const { data, error } = await supabase
    .from('product_variants')
    .insert(variantData)
    .select()
    .single();

  if (error) {
    console.error('Error creating variant:', error);
    throw new Error(`Failed to create variant: ${error.message}`);
  }

  // Update product has_variants flag
  await updateProductHasVariants(input.product_id);

  return data;
}

/**
 * Update an existing variant
 */
export async function updateVariant(
  variantId: string,
  input: UpdateVariantRequest
): Promise<ProductVariant> {
  // If updating SKU, check it doesn't already exist
  if (input.sku) {
    const existing = await getVariantBySku(input.sku);
    if (existing && existing.id !== variantId) {
      throw new Error(`SKU "${input.sku}" already exists`);
    }
  }

  const { data, error } = await supabase
    .from('product_variants')
    .update(input)
    .eq('id', variantId)
    .select()
    .single();

  if (error) {
    console.error('Error updating variant:', error);
    throw new Error(`Failed to update variant: ${error.message}`);
  }

  return data;
}

/**
 * Delete a variant
 */
export async function deleteVariant(variantId: string): Promise<void> {
  // Get product_id before deleting
  const variant = await getVariantById(variantId);
  if (!variant) {
    throw new Error('Variant not found');
  }

  const productId = variant.product_id;

  // Delete the variant
  const { error } = await supabase
    .from('product_variants')
    .delete()
    .eq('id', variantId);

  if (error) {
    console.error('Error deleting variant:', error);
    throw new Error(`Failed to delete variant: ${error.message}`);
  }

  // Update product has_variants flag
  await updateProductHasVariants(productId);
}

/**
 * Bulk create variants
 */
export async function bulkCreateVariants(
  variants: CreateVariantRequest[]
): Promise<ProductVariant[]> {
  const createdVariants: ProductVariant[] = [];
  const errors: string[] = [];

  for (const variant of variants) {
    try {
      const created = await createVariant(variant);
      createdVariants.push(created);
    } catch (error) {
      errors.push(
        `Failed to create variant "${variant.title}": ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  if (errors.length > 0) {
    console.warn('Bulk create errors:', errors);
  }

  return createdVariants;
}

// ============================================
// Inventory Management
// ============================================

/**
 * Check if variant has sufficient stock
 */
export async function checkVariantStock(
  variantId: string,
  quantity: number
): Promise<boolean> {
  const { data, error } = await supabase.rpc('check_variant_stock', {
    p_variant_id: variantId,
    p_quantity: quantity,
  });

  if (error) {
    console.error('Error checking variant stock:', error);
    throw new Error(`Failed to check stock: ${error.message}`);
  }

  return data === true;
}

/**
 * Adjust variant inventory with audit trail
 */
export async function adjustVariantInventory(
  request: AdjustInventoryRequest
): Promise<AdjustInventoryResponse> {
  const { data, error } = await supabase.rpc('adjust_variant_inventory', {
    p_variant_id: request.variant_id,
    p_quantity_change: request.quantity_change,
    p_reason: request.reason,
    p_notes: request.notes || null,
    p_order_id: request.order_id || null,
    p_adjusted_by: request.adjusted_by || 'system',
  });

  if (error) {
    console.error('Error adjusting inventory:', error);
    throw new Error(`Failed to adjust inventory: ${error.message}`);
  }

  return data as AdjustInventoryResponse;
}

/**
 * Get low stock variants (inventory < 10)
 */
export async function getLowStockVariants(): Promise<ProductVariant[]> {
  const { data, error } = await supabase
    .from('low_stock_variants')
    .select('*')
    .limit(50);

  if (error) {
    console.error('Error fetching low stock variants:', error);
    throw new Error(`Failed to fetch low stock variants: ${error.message}`);
  }

  return data || [];
}

/**
 * Get inventory adjustments for a variant
 */
export async function getVariantInventoryHistory(
  variantId: string,
  limit: number = 50
): Promise<any[]> {
  const { data, error } = await supabase
    .from('inventory_adjustments')
    .select('*')
    .eq('variant_id', variantId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching inventory history:', error);
    throw new Error(`Failed to fetch inventory history: ${error.message}`);
  }

  return data || [];
}

// ============================================
// Utility Functions
// ============================================

/**
 * Generate a unique SKU for a variant
 */
async function generateUniqueSKU(
  productId: string,
  variantTitle: string
): Promise<string> {
  // Get product info
  const { data: product } = await supabase
    .from('products')
    .select('title')
    .eq('id', productId)
    .single();

  const productName = product?.title || 'PRODUCT';

  // Clean and format strings
  const productSlug = productName
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .substring(0, 10);
  const variantSlug = variantTitle
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .substring(0, 10);

  // Try to generate unique SKU (max 10 attempts)
  for (let attempt = 0; attempt < 10; attempt++) {
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const sku = `${productSlug}-${variantSlug}-${random}`;

    // Check if SKU exists
    const existing = await getVariantBySku(sku);
    if (!existing) {
      return sku;
    }
  }

  // Fallback to UUID-based SKU
  const uuid = crypto.randomUUID().substring(0, 8).toUpperCase();
  return `${productSlug}-${uuid}`;
}

/**
 * Update product's has_variants flag based on variant count
 */
async function updateProductHasVariants(productId: string): Promise<void> {
  const variants = await getProductVariants(productId);
  const hasVariants = variants.length > 0;

  const { error } = await supabase
    .from('products')
    .update({ has_variants: hasVariants })
    .eq('id', productId);

  if (error) {
    console.error('Error updating product has_variants flag:', error);
  }
}

/**
 * Get variants with specific option values
 */
export function filterVariantsByOptions(
  variants: ProductVariant[],
  selectedOptions: Record<string, string>
): ProductVariant[] {
  return variants.filter((variant) => {
    for (const [optionName, optionValue] of Object.entries(selectedOptions)) {
      if (
        (variant.option1_name === optionName &&
          variant.option1_value !== optionValue) ||
        (variant.option2_name === optionName &&
          variant.option2_value !== optionValue) ||
        (variant.option3_name === optionName &&
          variant.option3_value !== optionValue)
      ) {
        return false;
      }
    }
    return true;
  });
}

/**
 * Extract unique option names and values from variants
 */
export function extractVariantOptions(
  variants: ProductVariant[]
): Array<{ name: string; values: string[] }> {
  const optionsMap: Record<string, Set<string>> = {};

  variants.forEach((variant) => {
    if (variant.option1_name && variant.option1_value) {
      if (!optionsMap[variant.option1_name]) {
        optionsMap[variant.option1_name] = new Set();
      }
      optionsMap[variant.option1_name].add(variant.option1_value);
    }

    if (variant.option2_name && variant.option2_value) {
      if (!optionsMap[variant.option2_name]) {
        optionsMap[variant.option2_name] = new Set();
      }
      optionsMap[variant.option2_name].add(variant.option2_value);
    }

    if (variant.option3_name && variant.option3_value) {
      if (!optionsMap[variant.option3_name]) {
        optionsMap[variant.option3_name] = new Set();
      }
      optionsMap[variant.option3_name].add(variant.option3_value);
    }
  });

  return Object.entries(optionsMap).map(([name, values]) => ({
    name,
    values: Array.from(values).sort(),
  }));
}

/**
 * Find matching variant based on selected options
 */
export function findVariantByOptions(
  variants: ProductVariant[],
  selectedOptions: Record<string, string>
): ProductVariant | null {
  return (
    variants.find((variant) => {
      const option1Match =
        !variant.option1_name ||
        selectedOptions[variant.option1_name] === variant.option1_value;
      const option2Match =
        !variant.option2_name ||
        selectedOptions[variant.option2_name] === variant.option2_value;
      const option3Match =
        !variant.option3_name ||
        selectedOptions[variant.option3_name] === variant.option3_value;

      return option1Match && option2Match && option3Match;
    }) || null
  );
}

/**
 * Calculate price range for product variants
 */
export function getVariantPriceRange(variants: ProductVariant[]): {
  min: number;
  max: number;
  hasPriceRange: boolean;
} {
  if (!variants || variants.length === 0) {
    return { min: 0, max: 0, hasPriceRange: false };
  }

  const prices = variants.map((v) => v.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  return {
    min,
    max,
    hasPriceRange: min !== max,
  };
}

/**
 * Format variant display title (combines all options)
 */
export function formatVariantTitle(variant: ProductVariant): string {
  const parts: string[] = [];

  if (variant.option1_value) parts.push(variant.option1_value);
  if (variant.option2_value) parts.push(variant.option2_value);
  if (variant.option3_value) parts.push(variant.option3_value);

  return parts.length > 0 ? parts.join(' / ') : variant.title;
}

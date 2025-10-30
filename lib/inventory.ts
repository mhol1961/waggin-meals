/**
 * Inventory Service
 *
 * Manages inventory tracking, availability checks, and transaction logging
 * for Waggin Meals products and variants.
 *
 * Features:
 * - Check product/variant availability
 * - Adjust inventory with audit trail
 * - Get low stock alerts
 * - View transaction history
 * - Bulk inventory updates
 */

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role for inventory operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// =============================================
// Types
// =============================================

export type TransactionType = 'sale' | 'restock' | 'return' | 'adjustment' | 'damage' | 'subscription';

export interface InventoryAvailability {
  available: boolean;
  current_quantity: number;
  requested_quantity: number;
  track_inventory: boolean;
  allow_backorder: boolean;
  reason?: string;
}

export interface InventoryAdjustment {
  success: boolean;
  transaction_id: string;
  product_id: string;
  variant_id?: string | null;
  quantity_before: number;
  quantity_after: number;
  quantity_change: number;
}

export interface InventoryTransaction {
  id: string;
  product_id: string;
  variant_id?: string | null;
  quantity_change: number;
  quantity_before: number;
  quantity_after: number;
  transaction_type: TransactionType;
  reason?: string | null;
  notes?: string | null;
  order_id?: string | null;
  subscription_id?: string | null;
  created_by: string;
  created_at: string;
}

export interface LowStockItem {
  type: 'product' | 'variant';
  product_id: string;
  variant_id?: string | null;
  product_title: string;
  variant_title?: string | null;
  sku: string;
  current_quantity: number;
  low_stock_threshold: number;
  is_out_of_stock: boolean;
}

export interface InventoryStatus {
  type: 'product' | 'variant';
  product_id: string;
  variant_id?: string | null;
  title: string;
  variant_title?: string | null;
  sku: string;
  inventory_quantity: number;
  low_stock_threshold: number;
  track_inventory: boolean;
  allow_backorder: boolean;
  stock_status: 'unlimited' | 'in_stock' | 'low_stock' | 'out_of_stock';
  is_available: boolean;
}

// =============================================
// Availability Checks
// =============================================

/**
 * Check if a product or variant has sufficient inventory
 *
 * @param productId - Product UUID
 * @param variantId - Optional variant UUID (required if product has variants)
 * @param quantity - Quantity needed (default: 1)
 * @returns Availability status and details
 */
export async function checkAvailability(
  productId: string,
  variantId?: string | null,
  quantity: number = 1
): Promise<InventoryAvailability> {
  try {
    const { data, error } = await supabase.rpc('check_inventory_availability', {
      p_product_id: productId,
      p_variant_id: variantId || null,
      p_quantity: quantity,
    });

    if (error) {
      console.error('[Inventory] Error checking availability:', error);
      throw error;
    }

    return data as InventoryAvailability;
  } catch (error) {
    console.error('[Inventory] Failed to check availability:', error);
    // Return unavailable on error to prevent overselling
    return {
      available: false,
      current_quantity: 0,
      requested_quantity: quantity,
      track_inventory: true,
      allow_backorder: false,
      reason: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check availability for multiple cart items
 *
 * @param items - Array of {productId, variantId?, quantity}
 * @returns Array of availability results
 */
export async function checkCartAvailability(
  items: Array<{ productId: string; variantId?: string | null; quantity: number }>
): Promise<Array<InventoryAvailability & { productId: string; variantId?: string | null }>> {
  const results = await Promise.all(
    items.map(async (item) => {
      const availability = await checkAvailability(item.productId, item.variantId, item.quantity);
      return {
        ...availability,
        productId: item.productId,
        variantId: item.variantId,
      };
    })
  );

  return results;
}

// =============================================
// Inventory Adjustments
// =============================================

/**
 * Decrement inventory (for sales/subscriptions)
 *
 * @param productId - Product UUID
 * @param variantId - Optional variant UUID
 * @param quantity - Quantity to decrement (positive number)
 * @param orderId - Order UUID for audit trail
 * @param subscriptionId - Optional subscription UUID
 * @returns Adjustment result
 */
export async function decrementInventory(
  productId: string,
  variantId: string | null | undefined,
  quantity: number,
  orderId: string,
  subscriptionId?: string | null,
  createdBy: string = 'system'
): Promise<InventoryAdjustment> {
  return adjustInventory(
    productId,
    variantId,
    -Math.abs(quantity), // Ensure negative
    subscriptionId ? 'subscription' : 'sale',
    subscriptionId ? 'Subscription order' : 'Order placed',
    null,
    orderId,
    subscriptionId,
    createdBy
  );
}

/**
 * Increment inventory (for restocks/returns)
 *
 * @param productId - Product UUID
 * @param variantId - Optional variant UUID
 * @param quantity - Quantity to increment (positive number)
 * @param reason - Reason for increase
 * @param notes - Optional notes
 * @param createdBy - User making the change
 * @returns Adjustment result
 */
export async function incrementInventory(
  productId: string,
  variantId: string | null | undefined,
  quantity: number,
  reason: 'restock' | 'return' | 'adjustment',
  notes?: string | null,
  createdBy: string = 'system'
): Promise<InventoryAdjustment> {
  return adjustInventory(
    productId,
    variantId,
    Math.abs(quantity), // Ensure positive
    reason,
    reason === 'restock' ? 'Inventory restocked' : reason === 'return' ? 'Order returned' : 'Manual adjustment',
    notes,
    null,
    null,
    createdBy
  );
}

/**
 * Adjust inventory (internal function)
 *
 * @param productId - Product UUID
 * @param variantId - Optional variant UUID
 * @param quantityChange - Positive = increase, Negative = decrease
 * @param transactionType - Type of transaction
 * @param reason - Short reason description
 * @param notes - Optional detailed notes
 * @param orderId - Optional order UUID
 * @param subscriptionId - Optional subscription UUID
 * @param createdBy - User making the change
 * @returns Adjustment result
 */
export async function adjustInventory(
  productId: string,
  variantId: string | null | undefined,
  quantityChange: number,
  transactionType: TransactionType,
  reason?: string | null,
  notes?: string | null,
  orderId?: string | null,
  subscriptionId?: string | null,
  createdBy: string = 'system'
): Promise<InventoryAdjustment> {
  try {
    const { data, error } = await supabase.rpc('adjust_inventory', {
      p_product_id: productId,
      p_variant_id: variantId || null,
      p_quantity_change: quantityChange,
      p_transaction_type: transactionType,
      p_reason: reason || null,
      p_notes: notes || null,
      p_order_id: orderId || null,
      p_subscription_id: subscriptionId || null,
      p_created_by: createdBy,
    });

    if (error) {
      console.error('[Inventory] Error adjusting inventory:', error);
      throw error;
    }

    return data as InventoryAdjustment;
  } catch (error) {
    console.error('[Inventory] Failed to adjust inventory:', error);
    throw error;
  }
}

// =============================================
// Inventory Status & Reporting
// =============================================

/**
 * Get current inventory status for a product or variant
 *
 * @param productId - Product UUID
 * @param variantId - Optional variant UUID
 * @returns Current inventory status
 */
export async function getInventoryStatus(
  productId: string,
  variantId?: string | null
): Promise<InventoryStatus | null> {
  try {
    let query = supabase
      .from('inventory_status')
      .select('*')
      .eq('product_id', productId);

    if (variantId) {
      query = query.eq('variant_id', variantId);
    } else {
      query = query.is('variant_id', null);
    }

    const { data, error } = await query.single();

    if (error) {
      console.error('[Inventory] Error getting inventory status:', error);
      return null;
    }

    return data as InventoryStatus;
  } catch (error) {
    console.error('[Inventory] Failed to get inventory status:', error);
    return null;
  }
}

/**
 * Get all low stock items
 *
 * @returns Array of low stock products and variants
 */
export async function getLowStockProducts(): Promise<LowStockItem[]> {
  try {
    const { data, error } = await supabase.rpc('get_low_stock_items');

    if (error) {
      console.error('[Inventory] Error getting low stock items:', error);
      throw error;
    }

    return data as LowStockItem[];
  } catch (error) {
    console.error('[Inventory] Failed to get low stock items:', error);
    return [];
  }
}

/**
 * Get all inventory statuses with optional filters
 *
 * @param filters - Optional filters (stock_status, type)
 * @returns Array of inventory statuses
 */
export async function getAllInventoryStatuses(filters?: {
  stock_status?: 'unlimited' | 'in_stock' | 'low_stock' | 'out_of_stock';
  type?: 'product' | 'variant';
  search?: string;
}): Promise<InventoryStatus[]> {
  try {
    let query = supabase.from('inventory_status').select('*');

    if (filters?.stock_status) {
      query = query.eq('stock_status', filters.stock_status);
    }

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }

    if (filters?.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,variant_title.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`
      );
    }

    const { data, error } = await query.order('title', { ascending: true });

    if (error) {
      console.error('[Inventory] Error getting inventory statuses:', error);
      throw error;
    }

    return data as InventoryStatus[];
  } catch (error) {
    console.error('[Inventory] Failed to get inventory statuses:', error);
    return [];
  }
}

// =============================================
// Transaction History
// =============================================

/**
 * Get inventory transaction history
 *
 * @param productId - Product UUID
 * @param variantId - Optional variant UUID
 * @param limit - Max number of transactions (default: 50)
 * @returns Array of transactions
 */
export async function getInventoryHistory(
  productId: string,
  variantId?: string | null,
  limit: number = 50
): Promise<InventoryTransaction[]> {
  try {
    let query = supabase
      .from('inventory_transactions')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (variantId) {
      query = query.eq('variant_id', variantId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[Inventory] Error getting inventory history:', error);
      throw error;
    }

    return data as InventoryTransaction[];
  } catch (error) {
    console.error('[Inventory] Failed to get inventory history:', error);
    return [];
  }
}

/**
 * Get all inventory transactions with filters
 *
 * @param filters - Optional filters
 * @returns Array of transactions
 */
export async function getAllTransactions(filters?: {
  transaction_type?: TransactionType;
  start_date?: string;
  end_date?: string;
  order_id?: string;
  limit?: number;
}): Promise<InventoryTransaction[]> {
  try {
    let query = supabase
      .from('inventory_transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.transaction_type) {
      query = query.eq('transaction_type', filters.transaction_type);
    }

    if (filters?.start_date) {
      query = query.gte('created_at', filters.start_date);
    }

    if (filters?.end_date) {
      query = query.lte('created_at', filters.end_date);
    }

    if (filters?.order_id) {
      query = query.eq('order_id', filters.order_id);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[Inventory] Error getting transactions:', error);
      throw error;
    }

    return data as InventoryTransaction[];
  } catch (error) {
    console.error('[Inventory] Failed to get transactions:', error);
    return [];
  }
}

// =============================================
// Bulk Operations
// =============================================

/**
 * Bulk update inventory from CSV data
 *
 * @param updates - Array of {sku, quantity, notes}
 * @param createdBy - User making the changes
 * @returns Result summary
 */
export async function bulkUpdateInventory(
  updates: Array<{
    sku: string;
    quantity: number;
    notes?: string;
  }>,
  createdBy: string = 'admin'
): Promise<{
  success: number;
  failed: number;
  errors: Array<{ sku: string; error: string }>;
}> {
  let success = 0;
  let failed = 0;
  const errors: Array<{ sku: string; error: string }> = [];

  for (const update of updates) {
    try {
      // Find product or variant by SKU
      const { data: product } = await supabase
        .from('products')
        .select('id, inventory_quantity')
        .eq('sku', update.sku)
        .is('has_variants', false)
        .single();

      const { data: variant } = await supabase
        .from('product_variants')
        .select('id, product_id, inventory_quantity')
        .eq('sku', update.sku)
        .single();

      if (product) {
        // Update product inventory
        const quantityChange = update.quantity - product.inventory_quantity;
        await adjustInventory(
          product.id,
          null,
          quantityChange,
          'adjustment',
          'Bulk inventory update',
          update.notes || null,
          null,
          null,
          createdBy
        );
        success++;
      } else if (variant) {
        // Update variant inventory
        const quantityChange = update.quantity - variant.inventory_quantity;
        await adjustInventory(
          variant.product_id,
          variant.id,
          quantityChange,
          'adjustment',
          'Bulk inventory update',
          update.notes || null,
          null,
          null,
          createdBy
        );
        success++;
      } else {
        errors.push({ sku: update.sku, error: 'SKU not found' });
        failed++;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push({ sku: update.sku, error: errorMessage });
      failed++;
    }
  }

  return { success, failed, errors };
}

// =============================================
// Utility Functions
// =============================================

/**
 * Check if a product should show low stock warning
 *
 * @param quantity - Current inventory quantity
 * @param threshold - Low stock threshold
 * @param trackInventory - Whether inventory is tracked
 * @returns True if low stock warning should be shown
 */
export function isLowStock(
  quantity: number,
  threshold: number,
  trackInventory: boolean
): boolean {
  return trackInventory && quantity > 0 && quantity <= threshold;
}

/**
 * Check if a product is out of stock
 *
 * @param quantity - Current inventory quantity
 * @param trackInventory - Whether inventory is tracked
 * @param allowBackorder - Whether backorders are allowed
 * @returns True if out of stock
 */
export function isOutOfStock(
  quantity: number,
  trackInventory: boolean,
  allowBackorder: boolean
): boolean {
  return trackInventory && quantity <= 0 && !allowBackorder;
}

/**
 * Get stock status badge info
 *
 * @param status - Stock status
 * @returns Badge color and text
 */
export function getStockStatusBadge(status: string): {
  color: string;
  text: string;
} {
  switch (status) {
    case 'in_stock':
      return { color: 'green', text: 'In Stock' };
    case 'low_stock':
      return { color: 'yellow', text: 'Low Stock' };
    case 'out_of_stock':
      return { color: 'red', text: 'Out of Stock' };
    case 'unlimited':
      return { color: 'blue', text: 'Always Available' };
    default:
      return { color: 'gray', text: 'Unknown' };
  }
}

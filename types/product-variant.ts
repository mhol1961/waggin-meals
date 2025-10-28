/**
 * Product Variants Type Definitions
 * Supports multiple product variations (sizes, flavors, colors, etc.)
 */

export interface ProductVariant {
  id: string;
  product_id: string;

  // Variant identification
  title: string; // e.g., "5lb", "10lb - Beef Flavor"
  sku: string;

  // Pricing
  price: number;
  compare_at_price?: number | null;
  cost_per_unit?: number | null;

  // Physical attributes
  weight?: number | null;
  weight_unit?: string; // 'lb', 'oz', 'kg', 'g'
  dimensions_length?: number | null;
  dimensions_width?: number | null;
  dimensions_height?: number | null;
  dimensions_unit?: string; // 'in', 'cm'

  // Variant options (up to 3)
  option1_name?: string | null;
  option1_value?: string | null;
  option2_name?: string | null;
  option2_value?: string | null;
  option3_name?: string | null;
  option3_value?: string | null;

  // Inventory
  inventory_quantity: number;
  inventory_policy: 'deny' | 'continue';
  track_inventory: boolean;

  // Availability
  is_available: boolean;
  requires_shipping: boolean;
  taxable: boolean;

  // Display
  image_url?: string | null;
  position: number;

  // Metadata
  barcode?: string | null;
  notes?: string | null;

  created_at: string;
  updated_at: string;
}

export interface InventoryAdjustment {
  id: string;
  variant_id: string;

  // Adjustment details
  quantity_change: number; // Positive for increases, negative for decreases
  quantity_before: number;
  quantity_after: number;

  // Reason
  reason: 'sale' | 'restock' | 'return' | 'damage' | 'adjustment' | 'subscription';
  notes?: string | null;
  order_id?: string | null;

  // Tracking
  adjusted_by: string; // User ID or 'system'

  created_at: string;
}

// Request/Response types for API
export interface CreateVariantRequest {
  product_id: string;
  title: string;
  sku: string;
  price: number;
  compare_at_price?: number;
  cost_per_unit?: number;

  weight?: number;
  weight_unit?: string;
  dimensions_length?: number;
  dimensions_width?: number;
  dimensions_height?: number;
  dimensions_unit?: string;

  option1_name?: string;
  option1_value?: string;
  option2_name?: string;
  option2_value?: string;
  option3_name?: string;
  option3_value?: string;

  inventory_quantity?: number;
  inventory_policy?: 'deny' | 'continue';
  track_inventory?: boolean;

  is_available?: boolean;
  requires_shipping?: boolean;
  taxable?: boolean;

  image_url?: string;
  position?: number;

  barcode?: string;
  notes?: string;
}

export interface UpdateVariantRequest {
  title?: string;
  sku?: string;
  price?: number;
  compare_at_price?: number | null;
  cost_per_unit?: number | null;

  weight?: number | null;
  weight_unit?: string;
  dimensions_length?: number | null;
  dimensions_width?: number | null;
  dimensions_height?: number | null;
  dimensions_unit?: string;

  option1_name?: string | null;
  option1_value?: string | null;
  option2_name?: string | null;
  option2_value?: string | null;
  option3_name?: string | null;
  option3_value?: string | null;

  inventory_quantity?: number;
  inventory_policy?: 'deny' | 'continue';
  track_inventory?: boolean;

  is_available?: boolean;
  requires_shipping?: boolean;
  taxable?: boolean;

  image_url?: string | null;
  position?: number;

  barcode?: string | null;
  notes?: string | null;
}

export interface AdjustInventoryRequest {
  variant_id: string;
  quantity_change: number;
  reason: 'sale' | 'restock' | 'return' | 'damage' | 'adjustment' | 'subscription';
  notes?: string;
  order_id?: string;
  adjusted_by?: string;
}

export interface AdjustInventoryResponse {
  success: boolean;
  adjustment_id: string;
  quantity_before: number;
  quantity_after: number;
  quantity_change: number;
}

// Extended product type with variants
export interface ProductWithVariants {
  id: string;
  title: string;
  handle: string;
  description?: string;
  category: string;
  tags?: string[];
  images?: string[];
  is_featured: boolean;
  is_published: boolean;
  has_variants: boolean;
  created_at: string;
  updated_at: string;

  // Variant data
  variants: ProductVariant[];
  variant_count?: number;
  total_inventory?: number;
  min_price?: number;
  max_price?: number;
}

// Variant option structure for UI
export interface VariantOption {
  name: string; // e.g., "Size", "Flavor"
  values: string[]; // e.g., ["5lb", "10lb", "15lb"]
}

// Selected variant options (for cart/checkout)
export interface SelectedVariantOptions {
  [optionName: string]: string;
  // Example: { "Size": "5lb", "Flavor": "Beef" }
}

// Low stock warning
export interface LowStockVariant extends ProductVariant {
  product_title: string;
  product_handle: string;
}

// Inventory check response
export interface StockCheckResponse {
  available: boolean;
  variant_id: string;
  requested_quantity: number;
  available_quantity: number;
  message?: string;
}

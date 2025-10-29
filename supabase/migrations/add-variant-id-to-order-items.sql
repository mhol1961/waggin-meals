-- =============================================
-- Migration: Add variant_id to order_items
-- Date: 2025-01-28
-- Purpose: Link order items to product variants for inventory tracking
-- =============================================

-- Add variant_id column to order_items table
ALTER TABLE order_items
ADD COLUMN variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_order_items_variant_id ON order_items(variant_id);

-- Add comment for documentation
COMMENT ON COLUMN order_items.variant_id IS 'References product_variants table. NULL if product has no variants or legacy order.';

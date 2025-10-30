-- =============================================
-- Inventory Tracking System
-- =============================================
-- Date: 2025-01-30
-- Description: Complete inventory tracking system for products and variants
-- Features:
--   - Product-level inventory tracking
--   - Audit trail for all inventory changes
--   - Low stock alerts
--   - Transaction history
--   - Race condition prevention

-- =============================================
-- PART 1: Add Inventory Fields to Products Table
-- =============================================

-- Add inventory tracking columns to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS inventory_quantity INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS track_inventory BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS allow_backorder BOOLEAN DEFAULT false;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_inventory_tracking ON products(track_inventory);
CREATE INDEX IF NOT EXISTS idx_products_low_stock ON products(inventory_quantity) WHERE track_inventory = true;

-- Comments
COMMENT ON COLUMN products.inventory_quantity IS 'Current inventory count (only used if has_variants = false)';
COMMENT ON COLUMN products.track_inventory IS 'Whether to track inventory for this product';
COMMENT ON COLUMN products.low_stock_threshold IS 'Quantity threshold for low stock alerts';
COMMENT ON COLUMN products.allow_backorder IS 'Whether to allow purchases when out of stock';

-- =============================================
-- PART 2: Add Low Stock Threshold to Variants
-- =============================================

-- Add low stock threshold to variants table
ALTER TABLE product_variants
ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS allow_backorder BOOLEAN DEFAULT false;

COMMENT ON COLUMN product_variants.low_stock_threshold IS 'Quantity threshold for low stock alerts';
COMMENT ON COLUMN product_variants.allow_backorder IS 'Whether to allow purchases when out of stock';

-- =============================================
-- PART 3: Create Inventory Transactions Table
-- =============================================

-- Create transaction types enum
DO $$ BEGIN
  CREATE TYPE inventory_transaction_type AS ENUM (
    'sale',           -- Inventory reduced due to order
    'restock',        -- Inventory added via restocking
    'return',         -- Inventory returned from order
    'adjustment',     -- Manual adjustment
    'damage',         -- Inventory lost to damage/spoilage
    'subscription'    -- Inventory reduced for subscription order
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create inventory transactions table
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Product/Variant reference
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,

  -- Transaction details
  quantity_change INTEGER NOT NULL, -- Positive = increase, Negative = decrease
  quantity_before INTEGER NOT NULL,
  quantity_after INTEGER NOT NULL,

  -- Transaction metadata
  transaction_type inventory_transaction_type NOT NULL,
  reason TEXT,
  notes TEXT,

  -- Related references
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,

  -- Audit trail
  created_by TEXT DEFAULT 'system',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance and reporting
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_product ON inventory_transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_variant ON inventory_transactions(variant_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_type ON inventory_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_created ON inventory_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_order ON inventory_transactions(order_id);

COMMENT ON TABLE inventory_transactions IS 'Complete audit trail for all inventory changes';
COMMENT ON COLUMN inventory_transactions.quantity_change IS 'Positive for increases, negative for decreases';
COMMENT ON COLUMN inventory_transactions.created_by IS 'User ID, admin email, or "system"';

-- =============================================
-- PART 4: Functions for Inventory Management
-- =============================================

-- Function: Check product/variant availability
CREATE OR REPLACE FUNCTION check_inventory_availability(
  p_product_id UUID,
  p_variant_id UUID DEFAULT NULL,
  p_quantity INTEGER DEFAULT 1
)
RETURNS JSONB AS $$
DECLARE
  v_result RECORD;
  v_available BOOLEAN := false;
  v_current_quantity INTEGER := 0;
  v_track_inventory BOOLEAN := true;
  v_allow_backorder BOOLEAN := false;
BEGIN
  -- Check if variant-level inventory
  IF p_variant_id IS NOT NULL THEN
    SELECT
      inventory_quantity,
      track_inventory,
      allow_backorder,
      is_available
    INTO v_result
    FROM product_variants
    WHERE id = p_variant_id AND product_id = p_product_id;

    IF NOT FOUND THEN
      RETURN jsonb_build_object(
        'available', false,
        'reason', 'Variant not found',
        'current_quantity', 0
      );
    END IF;

    v_current_quantity := v_result.inventory_quantity;
    v_track_inventory := v_result.track_inventory;
    v_allow_backorder := v_result.allow_backorder;

    IF NOT v_result.is_available THEN
      RETURN jsonb_build_object(
        'available', false,
        'reason', 'Variant not available',
        'current_quantity', v_current_quantity
      );
    END IF;
  ELSE
    -- Product-level inventory
    SELECT
      inventory_quantity,
      track_inventory,
      allow_backorder,
      is_published,
      has_variants
    INTO v_result
    FROM products
    WHERE id = p_product_id;

    IF NOT FOUND THEN
      RETURN jsonb_build_object(
        'available', false,
        'reason', 'Product not found',
        'current_quantity', 0
      );
    END IF;

    IF v_result.has_variants THEN
      RETURN jsonb_build_object(
        'available', false,
        'reason', 'Product has variants - must specify variant_id',
        'current_quantity', 0
      );
    END IF;

    v_current_quantity := v_result.inventory_quantity;
    v_track_inventory := v_result.track_inventory;
    v_allow_backorder := v_result.allow_backorder;

    IF NOT v_result.is_published THEN
      RETURN jsonb_build_object(
        'available', false,
        'reason', 'Product not published',
        'current_quantity', v_current_quantity
      );
    END IF;
  END IF;

  -- Check inventory
  IF NOT v_track_inventory THEN
    v_available := true;
  ELSIF v_allow_backorder THEN
    v_available := true;
  ELSIF v_current_quantity >= p_quantity THEN
    v_available := true;
  ELSE
    v_available := false;
  END IF;

  RETURN jsonb_build_object(
    'available', v_available,
    'current_quantity', v_current_quantity,
    'requested_quantity', p_quantity,
    'track_inventory', v_track_inventory,
    'allow_backorder', v_allow_backorder
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Adjust inventory (product or variant)
CREATE OR REPLACE FUNCTION adjust_inventory(
  p_product_id UUID,
  p_quantity_change INTEGER,
  p_transaction_type inventory_transaction_type,
  p_variant_id UUID DEFAULT NULL,
  p_reason TEXT DEFAULT NULL,
  p_notes TEXT DEFAULT NULL,
  p_order_id UUID DEFAULT NULL,
  p_subscription_id UUID DEFAULT NULL,
  p_created_by TEXT DEFAULT 'system'
)
RETURNS JSONB AS $$
DECLARE
  v_current_quantity INTEGER;
  v_new_quantity INTEGER;
  v_track_inventory BOOLEAN;
  v_allow_backorder BOOLEAN;
  v_transaction_id UUID;
BEGIN
  -- Validate product exists
  IF NOT EXISTS (SELECT 1 FROM products WHERE id = p_product_id) THEN
    RAISE EXCEPTION 'Product not found: %', p_product_id;
  END IF;

  -- Get current inventory and settings
  IF p_variant_id IS NOT NULL THEN
    -- Variant-level adjustment
    SELECT inventory_quantity, track_inventory, allow_backorder
    INTO v_current_quantity, v_track_inventory, v_allow_backorder
    FROM product_variants
    WHERE id = p_variant_id AND product_id = p_product_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Variant not found: %', p_variant_id;
    END IF;
  ELSE
    -- Product-level adjustment
    SELECT inventory_quantity, track_inventory, allow_backorder
    INTO v_current_quantity, v_track_inventory, v_allow_backorder
    FROM products
    WHERE id = p_product_id;
  END IF;

  -- Calculate new quantity
  v_new_quantity := v_current_quantity + p_quantity_change;

  -- Prevent negative inventory unless backorder allowed
  IF v_new_quantity < 0 AND v_track_inventory AND NOT v_allow_backorder THEN
    RAISE EXCEPTION 'Insufficient inventory. Current: %, Requested change: %, New would be: %',
      v_current_quantity, p_quantity_change, v_new_quantity;
  END IF;

  -- Update inventory
  IF p_variant_id IS NOT NULL THEN
    UPDATE product_variants
    SET inventory_quantity = v_new_quantity
    WHERE id = p_variant_id;
  ELSE
    UPDATE products
    SET inventory_quantity = v_new_quantity
    WHERE id = p_product_id;
  END IF;

  -- Create transaction record
  INSERT INTO inventory_transactions (
    product_id,
    variant_id,
    quantity_change,
    quantity_before,
    quantity_after,
    transaction_type,
    reason,
    notes,
    order_id,
    subscription_id,
    created_by
  ) VALUES (
    p_product_id,
    p_variant_id,
    p_quantity_change,
    v_current_quantity,
    v_new_quantity,
    p_transaction_type,
    p_reason,
    p_notes,
    p_order_id,
    p_subscription_id,
    p_created_by
  )
  RETURNING id INTO v_transaction_id;

  -- Return result
  RETURN jsonb_build_object(
    'success', true,
    'transaction_id', v_transaction_id,
    'product_id', p_product_id,
    'variant_id', p_variant_id,
    'quantity_before', v_current_quantity,
    'quantity_after', v_new_quantity,
    'quantity_change', p_quantity_change
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get low stock items
CREATE OR REPLACE FUNCTION get_low_stock_items()
RETURNS TABLE (
  type TEXT,
  product_id UUID,
  variant_id UUID,
  product_title TEXT,
  variant_title TEXT,
  sku TEXT,
  current_quantity INTEGER,
  low_stock_threshold INTEGER,
  is_out_of_stock BOOLEAN
) AS $$
BEGIN
  RETURN QUERY

  -- Products without variants
  SELECT
    'product'::TEXT,
    p.id AS product_id,
    NULL::UUID AS variant_id,
    p.title AS product_title,
    NULL::TEXT AS variant_title,
    p.sku AS sku,
    p.inventory_quantity AS current_quantity,
    p.low_stock_threshold,
    (p.inventory_quantity <= 0) AS is_out_of_stock
  FROM products p
  WHERE p.track_inventory = true
    AND p.has_variants = false
    AND p.inventory_quantity <= p.low_stock_threshold
    AND p.is_published = true

  UNION ALL

  -- Product variants
  SELECT
    'variant'::TEXT,
    p.id AS product_id,
    pv.id AS variant_id,
    p.title AS product_title,
    pv.title AS variant_title,
    pv.sku AS sku,
    pv.inventory_quantity AS current_quantity,
    pv.low_stock_threshold,
    (pv.inventory_quantity <= 0) AS is_out_of_stock
  FROM product_variants pv
  JOIN products p ON pv.product_id = p.id
  WHERE pv.track_inventory = true
    AND pv.inventory_quantity <= pv.low_stock_threshold
    AND pv.is_available = true
    AND p.is_published = true

  ORDER BY current_quantity ASC, product_title ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- PART 5: Views for Inventory Reporting
-- =============================================

-- View: Current inventory status for all products/variants
CREATE OR REPLACE VIEW inventory_status AS
SELECT
  'product' AS type,
  p.id AS product_id,
  NULL::UUID AS variant_id,
  p.title,
  NULL AS variant_title,
  p.sku,
  p.inventory_quantity,
  p.low_stock_threshold,
  p.track_inventory,
  p.allow_backorder,
  CASE
    WHEN NOT p.track_inventory THEN 'unlimited'
    WHEN p.inventory_quantity <= 0 THEN 'out_of_stock'
    WHEN p.inventory_quantity <= p.low_stock_threshold THEN 'low_stock'
    ELSE 'in_stock'
  END AS stock_status,
  p.is_published AS is_available
FROM products p
WHERE p.has_variants = false

UNION ALL

SELECT
  'variant' AS type,
  p.id AS product_id,
  pv.id AS variant_id,
  p.title,
  pv.title AS variant_title,
  pv.sku,
  pv.inventory_quantity,
  pv.low_stock_threshold,
  pv.track_inventory,
  pv.allow_backorder,
  CASE
    WHEN NOT pv.track_inventory THEN 'unlimited'
    WHEN pv.inventory_quantity <= 0 THEN 'out_of_stock'
    WHEN pv.inventory_quantity <= pv.low_stock_threshold THEN 'low_stock'
    ELSE 'in_stock'
  END AS stock_status,
  pv.is_available
FROM product_variants pv
JOIN products p ON pv.product_id = p.id;

COMMENT ON VIEW inventory_status IS 'Current inventory status for all products and variants';

-- =============================================
-- PART 6: Row Level Security (RLS)
-- =============================================

-- Enable RLS on inventory_transactions
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;

-- Public can't access inventory transactions
-- Authenticated users (admin) can view all transactions
CREATE POLICY "Authenticated users can read inventory transactions"
  ON inventory_transactions FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated users can create transactions (via functions)
CREATE POLICY "Authenticated users can create inventory transactions"
  ON inventory_transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- =============================================
-- PART 7: Initial Data Setup
-- =============================================

-- Set default inventory for existing products
UPDATE products
SET
  inventory_quantity = 100,
  track_inventory = true,
  low_stock_threshold = 5
WHERE inventory_quantity IS NULL OR inventory_quantity = 0;

-- Set default inventory for existing variants
UPDATE product_variants
SET
  inventory_quantity = 50,
  low_stock_threshold = 5
WHERE inventory_quantity = 0;

-- =============================================
-- PART 8: Helpful Comments
-- =============================================

COMMENT ON FUNCTION check_inventory_availability IS 'Check if product/variant has sufficient stock for purchase';
COMMENT ON FUNCTION adjust_inventory IS 'Safely adjust inventory with automatic audit trail creation';
COMMENT ON FUNCTION get_low_stock_items IS 'Get all products and variants below their low stock threshold';

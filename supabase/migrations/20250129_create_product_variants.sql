-- =============================================
-- Product Variants System
-- =============================================
-- Enables products to have multiple variants (sizes, flavors, etc.)
-- Example: "Beef Bowl" product can have variants:
--   - Beef Bowl - 5lb
--   - Beef Bowl - 10lb
--   - Beef Bowl - 15lb

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Product Variants Table
-- =============================================
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  -- Variant identification
  title TEXT NOT NULL, -- e.g., "5lb", "10lb - Beef Flavor", "Small / Red"
  sku TEXT UNIQUE NOT NULL,

  -- Pricing
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2), -- Original price for sales
  cost_per_unit DECIMAL(10,2), -- Wholesale/cost price for margin tracking

  -- Physical attributes
  weight DECIMAL(10,2), -- Weight in pounds
  weight_unit TEXT DEFAULT 'lb', -- 'lb', 'oz', 'kg', 'g'
  dimensions_length DECIMAL(10,2), -- Length in inches
  dimensions_width DECIMAL(10,2), -- Width in inches
  dimensions_height DECIMAL(10,2), -- Height in inches
  dimensions_unit TEXT DEFAULT 'in', -- 'in', 'cm'

  -- Variant options (up to 3 options like Shopify)
  option1_name TEXT, -- e.g., "Size"
  option1_value TEXT, -- e.g., "5lb"
  option2_name TEXT, -- e.g., "Flavor"
  option2_value TEXT, -- e.g., "Beef"
  option3_name TEXT, -- e.g., "Color"
  option3_value TEXT, -- e.g., "Red"

  -- Inventory
  inventory_quantity INTEGER DEFAULT 0,
  inventory_policy TEXT DEFAULT 'deny', -- 'deny' or 'continue' (allow overselling)
  track_inventory BOOLEAN DEFAULT true,

  -- Availability
  is_available BOOLEAN DEFAULT true,
  requires_shipping BOOLEAN DEFAULT true,
  taxable BOOLEAN DEFAULT true,

  -- Display
  image_url TEXT, -- Specific image for this variant
  position INTEGER DEFAULT 0, -- Display order

  -- Metadata
  barcode TEXT,
  notes TEXT, -- Internal notes

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_product_variants_available ON product_variants(is_available);

-- =============================================
-- Update Products Table
-- =============================================
-- Add has_variants flag to products table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='products' AND column_name='has_variants'
  ) THEN
    ALTER TABLE products ADD COLUMN has_variants BOOLEAN DEFAULT false;
  END IF;
END $$;

-- =============================================
-- Inventory Adjustments Table
-- =============================================
-- Track all inventory changes for audit purposes
CREATE TABLE IF NOT EXISTS inventory_adjustments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,

  -- Adjustment details
  quantity_change INTEGER NOT NULL, -- Positive for increases, negative for decreases
  quantity_before INTEGER NOT NULL,
  quantity_after INTEGER NOT NULL,

  -- Reason
  reason TEXT NOT NULL, -- 'sale', 'restock', 'return', 'damage', 'adjustment', 'subscription'
  notes TEXT,
  order_id UUID, -- Reference to order if related to a sale

  -- Tracking
  adjusted_by TEXT, -- User ID or 'system'

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_inventory_adjustments_variant ON inventory_adjustments(variant_id);
CREATE INDEX IF NOT EXISTS idx_inventory_adjustments_created ON inventory_adjustments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_adjustments_order ON inventory_adjustments(order_id);

-- =============================================
-- Update Trigger
-- =============================================
CREATE OR REPLACE FUNCTION update_product_variants_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_variants_timestamp
  BEFORE UPDATE ON product_variants
  FOR EACH ROW
  EXECUTE FUNCTION update_product_variants_updated_at();

-- =============================================
-- Row Level Security (RLS)
-- =============================================
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_adjustments ENABLE ROW LEVEL SECURITY;

-- Public can read available variants for published products
CREATE POLICY "Public can read available variants"
  ON product_variants FOR SELECT
  USING (is_available = true AND EXISTS (
    SELECT 1 FROM products
    WHERE products.id = product_variants.product_id
    AND products.is_published = true
  ));

-- Only authenticated users can view all variants
CREATE POLICY "Authenticated users can read all variants"
  ON product_variants FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can modify variants (for now, allow all authenticated users)
CREATE POLICY "Authenticated users can manage variants"
  ON product_variants FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Inventory adjustments policies
CREATE POLICY "Authenticated users can read inventory adjustments"
  ON inventory_adjustments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create inventory adjustments"
  ON inventory_adjustments FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- =============================================
-- Helpful Views
-- =============================================

-- View: Products with their variants count
CREATE OR REPLACE VIEW products_with_variant_count AS
SELECT
  p.*,
  COUNT(pv.id) as variant_count,
  SUM(pv.inventory_quantity) as total_inventory,
  MIN(pv.price) as min_price,
  MAX(pv.price) as max_price
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
GROUP BY p.id;

-- View: Low stock variants (inventory below 10)
CREATE OR REPLACE VIEW low_stock_variants AS
SELECT
  pv.*,
  p.title as product_title,
  p.handle as product_handle
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
WHERE pv.track_inventory = true
  AND pv.inventory_quantity < 10
  AND pv.is_available = true
ORDER BY pv.inventory_quantity ASC;

-- =============================================
-- Functions
-- =============================================

-- Function to adjust variant inventory with automatic audit trail
CREATE OR REPLACE FUNCTION adjust_variant_inventory(
  p_variant_id UUID,
  p_quantity_change INTEGER,
  p_reason TEXT,
  p_notes TEXT DEFAULT NULL,
  p_order_id UUID DEFAULT NULL,
  p_adjusted_by TEXT DEFAULT 'system'
)
RETURNS JSONB AS $$
DECLARE
  v_current_quantity INTEGER;
  v_new_quantity INTEGER;
  v_adjustment_id UUID;
BEGIN
  -- Get current inventory
  SELECT inventory_quantity INTO v_current_quantity
  FROM product_variants
  WHERE id = p_variant_id;

  IF v_current_quantity IS NULL THEN
    RAISE EXCEPTION 'Variant not found';
  END IF;

  -- Calculate new quantity
  v_new_quantity := v_current_quantity + p_quantity_change;

  -- Prevent negative inventory if policy is 'deny'
  IF v_new_quantity < 0 AND EXISTS (
    SELECT 1 FROM product_variants
    WHERE id = p_variant_id AND inventory_policy = 'deny'
  ) THEN
    RAISE EXCEPTION 'Insufficient inventory. Current: %, Requested change: %', v_current_quantity, p_quantity_change;
  END IF;

  -- Update variant inventory
  UPDATE product_variants
  SET inventory_quantity = v_new_quantity
  WHERE id = p_variant_id;

  -- Create adjustment record
  INSERT INTO inventory_adjustments (
    variant_id,
    quantity_change,
    quantity_before,
    quantity_after,
    reason,
    notes,
    order_id,
    adjusted_by
  ) VALUES (
    p_variant_id,
    p_quantity_change,
    v_current_quantity,
    v_new_quantity,
    p_reason,
    p_notes,
    p_order_id,
    p_adjusted_by
  )
  RETURNING id INTO v_adjustment_id;

  -- Return result
  RETURN jsonb_build_object(
    'success', true,
    'adjustment_id', v_adjustment_id,
    'quantity_before', v_current_quantity,
    'quantity_after', v_new_quantity,
    'quantity_change', p_quantity_change
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if variant has sufficient stock
CREATE OR REPLACE FUNCTION check_variant_stock(
  p_variant_id UUID,
  p_quantity INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  v_variant RECORD;
BEGIN
  SELECT inventory_quantity, inventory_policy, track_inventory, is_available
  INTO v_variant
  FROM product_variants
  WHERE id = p_variant_id;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  IF NOT v_variant.is_available THEN
    RETURN false;
  END IF;

  IF NOT v_variant.track_inventory THEN
    RETURN true;
  END IF;

  IF v_variant.inventory_policy = 'continue' THEN
    RETURN true;
  END IF;

  RETURN v_variant.inventory_quantity >= p_quantity;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- Comments
-- =============================================
COMMENT ON TABLE product_variants IS 'Stores product variants (sizes, flavors, etc.) with inventory tracking';
COMMENT ON TABLE inventory_adjustments IS 'Audit trail for all inventory changes';
COMMENT ON FUNCTION adjust_variant_inventory IS 'Safely adjust variant inventory with automatic audit logging';
COMMENT ON FUNCTION check_variant_stock IS 'Check if variant has sufficient stock for purchase';

-- Fix orders and order_items tables - add missing columns
-- Run this migration to align schema with customer account system

-- =============================================
-- Fix orders table
-- =============================================

-- Add customer first/last name columns
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS customer_first_name TEXT,
ADD COLUMN IF NOT EXISTS customer_last_name TEXT,
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS shipping_address JSONB,
ADD COLUMN IF NOT EXISTS tax DECIMAL(10,2) DEFAULT 0;

-- Migrate data from customer_name to first/last if needed
UPDATE orders
SET customer_first_name = SPLIT_PART(customer_name, ' ', 1),
    customer_last_name = CASE
        WHEN ARRAY_LENGTH(STRING_TO_ARRAY(customer_name, ' '), 1) > 1
        THEN SUBSTRING(customer_name FROM POSITION(' ' IN customer_name) + 1)
        ELSE ''
    END
WHERE customer_first_name IS NULL AND customer_name IS NOT NULL;

-- Create shipping_address JSON from discrete fields if needed
UPDATE orders
SET shipping_address = jsonb_build_object(
    'first_name', customer_first_name,
    'last_name', customer_last_name,
    'address_line1', shipping_address_line1,
    'address_line2', shipping_address_line2,
    'city', shipping_city,
    'state', shipping_state,
    'postal_code', shipping_zip,
    'country', 'US',
    'phone', shipping_phone
)
WHERE shipping_address IS NULL AND shipping_address_line1 IS NOT NULL;

-- =============================================
-- Fix order_items table
-- =============================================

-- Add missing columns
ALTER TABLE order_items
ADD COLUMN IF NOT EXISTS product_name TEXT,
ADD COLUMN IF NOT EXISTS unit_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS total_price DECIMAL(10,2);

-- Migrate data from product_title to product_name
UPDATE order_items
SET product_name = product_title
WHERE product_name IS NULL AND product_title IS NOT NULL;

-- Migrate price data
UPDATE order_items
SET unit_price = price,
    total_price = total
WHERE unit_price IS NULL;

-- =============================================
-- Create indexes for performance
-- =============================================

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- =============================================
-- Update trigger for updated_at
-- =============================================

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

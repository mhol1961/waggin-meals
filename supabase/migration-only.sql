-- =============================================
-- MIGRATION ONLY - Add missing columns and tables
-- Run this if you already have some tables created
-- =============================================

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Add missing columns to existing tables
-- =============================================

-- Fix customer_addresses table
ALTER TABLE customer_addresses
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Fix orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS customer_first_name TEXT,
ADD COLUMN IF NOT EXISTS customer_last_name TEXT,
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS shipping_address JSONB,
ADD COLUMN IF NOT EXISTS tax DECIMAL(10,2) DEFAULT 0;

-- Fix order_items table
ALTER TABLE order_items
ADD COLUMN IF NOT EXISTS product_name TEXT,
ADD COLUMN IF NOT EXISTS unit_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS total_price DECIMAL(10,2);

-- Fix subscriptions table
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS payment_profile_id TEXT,
ADD COLUMN IF NOT EXISTS payment_last_four TEXT,
ADD COLUMN IF NOT EXISTS payment_card_type TEXT,
ADD COLUMN IF NOT EXISTS secure_token TEXT UNIQUE;

-- =============================================
-- Migrate existing data
-- =============================================

-- Migrate order_items data
UPDATE order_items SET product_name = product_title WHERE product_name IS NULL AND product_title IS NOT NULL;
UPDATE order_items SET unit_price = price WHERE unit_price IS NULL;
UPDATE order_items SET total_price = total WHERE total_price IS NULL;

-- Migrate orders data (split customer_name into first/last if needed)
UPDATE orders
SET customer_first_name = SPLIT_PART(customer_name, ' ', 1),
    customer_last_name = CASE
        WHEN ARRAY_LENGTH(STRING_TO_ARRAY(customer_name, ' '), 1) > 1
        THEN SUBSTRING(customer_name FROM POSITION(' ' IN customer_name) + 1)
        ELSE ''
    END
WHERE customer_first_name IS NULL AND customer_name IS NOT NULL;

-- Create shipping_address JSON from discrete fields
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
-- Create missing indexes
-- =============================================

CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer_id ON customer_addresses(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_default ON customer_addresses(customer_id, is_default);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_customer_id ON subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_billing ON subscriptions(next_billing_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_secure_token ON subscriptions(secure_token);

-- =============================================
-- Create update_updated_at function if not exists
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =============================================
-- Create missing triggers (skip if exists)
-- =============================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_customer_addresses_updated_at') THEN
        CREATE TRIGGER update_customer_addresses_updated_at
            BEFORE UPDATE ON customer_addresses
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_orders_updated_at') THEN
        CREATE TRIGGER update_orders_updated_at
            BEFORE UPDATE ON orders
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- =============================================
-- DONE!
-- =============================================
-- This migration safely adds missing columns and fixes
-- the schema for customer authentication system
-- =============================================

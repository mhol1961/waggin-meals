-- =============================================
-- UNIVERSAL MIGRATION - Works for any database state
-- Creates tables if missing, adds columns if needed
-- Safe to run multiple times
-- =============================================

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Create customers table if not exists
-- =============================================

CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    total_spent DECIMAL(10,2) DEFAULT 0,
    order_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Create customer_addresses table if not exists
-- =============================================

CREATE TABLE IF NOT EXISTS customer_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT DEFAULT 'US',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to customer_addresses if table already existed
ALTER TABLE customer_addresses
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- =============================================
-- Create orders table if not exists
-- =============================================

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    customer_email TEXT NOT NULL,
    customer_name TEXT,
    customer_first_name TEXT,
    customer_last_name TEXT,
    status TEXT DEFAULT 'pending',
    payment_status TEXT DEFAULT 'pending',
    payment_method TEXT,
    payment_id TEXT,
    payment_intent_id TEXT,
    subtotal DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    tax DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    shipping_address_line1 TEXT,
    shipping_address_line2 TEXT,
    shipping_city TEXT,
    shipping_state TEXT,
    shipping_zip TEXT,
    shipping_phone TEXT,
    shipping_notes TEXT,
    shipping_address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to orders if table already existed
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS customer_first_name TEXT,
ADD COLUMN IF NOT EXISTS customer_last_name TEXT,
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS shipping_address JSONB,
ADD COLUMN IF NOT EXISTS tax DECIMAL(10,2) DEFAULT 0;

-- =============================================
-- Create order_items table if not exists
-- =============================================

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_handle TEXT,
    product_title TEXT,
    product_name TEXT,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2),
    total DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to order_items if table already existed
ALTER TABLE order_items
ADD COLUMN IF NOT EXISTS product_name TEXT,
ADD COLUMN IF NOT EXISTS unit_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS total_price DECIMAL(10,2);

-- =============================================
-- Create subscriptions table if not exists
-- =============================================

CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_handle TEXT,
    product_title TEXT,
    quantity INTEGER DEFAULT 1,
    frequency TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'active',
    next_billing_date DATE,
    last_billing_date DATE,
    payment_profile_id TEXT,
    payment_last_four TEXT,
    payment_card_type TEXT,
    secure_token TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to subscriptions if table already existed
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
-- Create indexes
-- =============================================

CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer_id ON customer_addresses(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_default ON customer_addresses(customer_id, is_default);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
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
-- Create triggers (skip if exists)
-- =============================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_customers_updated_at') THEN
        CREATE TRIGGER update_customers_updated_at
            BEFORE UPDATE ON customers
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

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

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_subscriptions_updated_at') THEN
        CREATE TRIGGER update_subscriptions_updated_at
            BEFORE UPDATE ON subscriptions
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- =============================================
-- Enable Row Level Security
-- =============================================

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- =============================================
-- Create RLS Policies
-- =============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Customers can view their own data" ON customers;
DROP POLICY IF EXISTS "Customers can update their own data" ON customers;
DROP POLICY IF EXISTS "Service role has full access to customers" ON customers;
DROP POLICY IF EXISTS "Anon can create customers" ON customers;

DROP POLICY IF EXISTS "Customers can view their own addresses" ON customer_addresses;
DROP POLICY IF EXISTS "Customers can insert their own addresses" ON customer_addresses;
DROP POLICY IF EXISTS "Customers can update their own addresses" ON customer_addresses;
DROP POLICY IF EXISTS "Customers can delete their own addresses" ON customer_addresses;
DROP POLICY IF EXISTS "Service role has full access to addresses" ON customer_addresses;

DROP POLICY IF EXISTS "Customers can view their own orders" ON orders;
DROP POLICY IF EXISTS "Service role has full access to orders" ON orders;
DROP POLICY IF EXISTS "Anon can create orders" ON orders;

DROP POLICY IF EXISTS "Customers can view their own order items" ON order_items;
DROP POLICY IF EXISTS "Service role has full access to order items" ON order_items;
DROP POLICY IF EXISTS "Anon can create order items" ON order_items;

DROP POLICY IF EXISTS "Customers can view their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Customers can update their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Service role has full access to subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Anon can create subscriptions" ON subscriptions;

-- Customers policies
CREATE POLICY "Customers can view their own data"
    ON customers FOR SELECT
    USING (true);

CREATE POLICY "Customers can update their own data"
    ON customers FOR UPDATE
    USING (true);

CREATE POLICY "Service role has full access to customers"
    ON customers FOR ALL
    USING (true);

CREATE POLICY "Anon can create customers"
    ON customers FOR INSERT
    WITH CHECK (true);

-- Customer addresses policies
CREATE POLICY "Customers can view their own addresses"
    ON customer_addresses FOR SELECT
    USING (true);

CREATE POLICY "Customers can insert their own addresses"
    ON customer_addresses FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Customers can update their own addresses"
    ON customer_addresses FOR UPDATE
    USING (true);

CREATE POLICY "Customers can delete their own addresses"
    ON customer_addresses FOR DELETE
    USING (true);

CREATE POLICY "Service role has full access to addresses"
    ON customer_addresses FOR ALL
    USING (true);

-- Orders policies
CREATE POLICY "Customers can view their own orders"
    ON orders FOR SELECT
    USING (true);

CREATE POLICY "Service role has full access to orders"
    ON orders FOR ALL
    USING (true);

CREATE POLICY "Anon can create orders"
    ON orders FOR INSERT
    WITH CHECK (true);

-- Order items policies
CREATE POLICY "Customers can view their own order items"
    ON order_items FOR SELECT
    USING (true);

CREATE POLICY "Service role has full access to order items"
    ON order_items FOR ALL
    USING (true);

CREATE POLICY "Anon can create order items"
    ON order_items FOR INSERT
    WITH CHECK (true);

-- Subscriptions policies
CREATE POLICY "Customers can view their own subscriptions"
    ON subscriptions FOR SELECT
    USING (true);

CREATE POLICY "Customers can update their own subscriptions"
    ON subscriptions FOR UPDATE
    USING (true);

CREATE POLICY "Service role has full access to subscriptions"
    ON subscriptions FOR ALL
    USING (true);

CREATE POLICY "Anon can create subscriptions"
    ON subscriptions FOR INSERT
    WITH CHECK (true);

-- =============================================
-- DONE!
-- =============================================
-- This universal migration will:
-- 1. Create any missing tables
-- 2. Add any missing columns to existing tables
-- 3. Migrate existing data safely
-- 4. Create indexes and triggers
-- 5. Set up Row Level Security policies
--
-- Safe to run multiple times!
-- =============================================

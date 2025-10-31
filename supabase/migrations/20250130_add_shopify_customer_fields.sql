-- Add Shopify customer import fields
-- Date: 2025-01-30

ALTER TABLE customers
ADD COLUMN IF NOT EXISTS shopify_customer_id TEXT,
ADD COLUMN IF NOT EXISTS accepts_marketing BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS address_line1 TEXT,
ADD COLUMN IF NOT EXISTS address_line2 TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'US',
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Create index on shopify_customer_id for lookups
CREATE INDEX IF NOT EXISTS idx_customers_shopify_id ON customers(shopify_customer_id);

-- Add comment
COMMENT ON COLUMN customers.shopify_customer_id IS 'Original Shopify customer ID for migration reference';

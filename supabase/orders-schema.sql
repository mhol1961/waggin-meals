-- =============================================
-- COMPLETE E-COMMERCE SCHEMA
-- Orders, Customers, Subscriptions, Cart Recovery
-- =============================================

-- =============================================
-- Customers Table
-- =============================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  is_subscribed BOOLEAN DEFAULT false
);

-- =============================================
-- Customer Addresses Table
-- =============================================
CREATE TABLE IF NOT EXISTS customer_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  address_type TEXT DEFAULT 'shipping', -- 'shipping' or 'billing'
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  country TEXT DEFAULT 'US',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Orders Table
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled, refunded
  payment_status TEXT DEFAULT 'pending', -- pending, paid, failed, refunded
  payment_method TEXT, -- authorize_net, quickbooks
  payment_id TEXT,

  -- Amounts
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,

  -- Shipping Info
  shipping_address_line1 TEXT NOT NULL,
  shipping_address_line2 TEXT,
  shipping_city TEXT NOT NULL,
  shipping_state TEXT NOT NULL,
  shipping_zip TEXT NOT NULL,
  shipping_phone TEXT,
  shipping_notes TEXT,

  -- Tracking
  tracking_number TEXT,
  tracking_carrier TEXT,
  tracking_url TEXT,
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,

  -- Metadata
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Order Items Table
-- =============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_handle TEXT NOT NULL,
  product_title TEXT NOT NULL,
  variant_title TEXT,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Subscriptions Table (Recurring Orders)
-- =============================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active', -- active, paused, cancelled
  frequency TEXT NOT NULL, -- weekly, biweekly, monthly
  next_billing_date DATE NOT NULL,

  -- Subscription Items
  items JSONB NOT NULL, -- Array of {product_id, quantity, price}

  -- Amounts
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,

  -- Shipping Info (from customer_addresses)
  shipping_address_id UUID REFERENCES customer_addresses(id),

  -- Payment Info
  payment_method TEXT,
  payment_token TEXT, -- Stored payment method token

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancelled_at TIMESTAMP WITH TIME ZONE
);

-- =============================================
-- Abandoned Carts Table
-- =============================================
CREATE TABLE IF NOT EXISTS abandoned_carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT UNIQUE NOT NULL,
  customer_email TEXT,
  customer_id UUID REFERENCES customers(id),

  cart_data JSONB NOT NULL, -- Full cart contents
  cart_total DECIMAL(10,2) NOT NULL,

  recovery_email_sent BOOLEAN DEFAULT false,
  recovery_email_sent_at TIMESTAMP WITH TIME ZONE,
  recovered BOOLEAN DEFAULT false,
  recovered_at TIMESTAMP WITH TIME ZONE,
  recovered_order_id UUID REFERENCES orders(id),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Discount Codes Table
-- =============================================
CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL, -- percentage, fixed
  discount_value DECIMAL(10,2) NOT NULL,

  -- Usage Limits
  usage_limit INTEGER, -- NULL = unlimited
  usage_count INTEGER DEFAULT 0,
  minimum_purchase DECIMAL(10,2),

  -- Date Restrictions
  starts_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,

  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Product Variants Table
-- =============================================
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  title TEXT NOT NULL, -- e.g., "Small (2 cups)", "Large (8 cups)"
  sku TEXT UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  weight TEXT,
  inventory_count INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Inventory Alerts Table
-- =============================================
CREATE TABLE IF NOT EXISTS inventory_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL, -- low_stock, out_of_stock, restocked
  threshold INTEGER,
  current_quantity INTEGER,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Indexes for Performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_customer_id ON subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_billing ON subscriptions(next_billing_date);

CREATE INDEX IF NOT EXISTS idx_abandoned_carts_session ON abandoned_carts(session_id);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_email ON abandoned_carts(customer_email);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_recovered ON abandoned_carts(recovered);

CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);

-- =============================================
-- Auto-update timestamps
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_abandoned_carts_updated_at BEFORE UPDATE ON abandoned_carts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discount_codes_updated_at BEFORE UPDATE ON discount_codes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Row Level Security (RLS)
-- =============================================

-- Customers
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers are viewable by everyone" ON customers FOR SELECT USING (true);
CREATE POLICY "Customers insertable by admins" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Customers updatable by admins" ON customers FOR UPDATE USING (true);

-- Customer Addresses
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Addresses viewable by everyone" ON customer_addresses FOR SELECT USING (true);
CREATE POLICY "Addresses insertable by admins" ON customer_addresses FOR INSERT WITH CHECK (true);
CREATE POLICY "Addresses updatable by admins" ON customer_addresses FOR UPDATE USING (true);

-- Orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Orders are viewable by everyone" ON orders FOR SELECT USING (true);
CREATE POLICY "Orders insertable by everyone" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Orders updatable by admins" ON orders FOR UPDATE USING (true);

-- Order Items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Order items viewable by everyone" ON order_items FOR SELECT USING (true);
CREATE POLICY "Order items insertable by everyone" ON order_items FOR INSERT WITH CHECK (true);

-- Subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Subscriptions viewable by everyone" ON subscriptions FOR SELECT USING (true);
CREATE POLICY "Subscriptions manageable by admins" ON subscriptions FOR ALL USING (true);

-- Abandoned Carts
ALTER TABLE abandoned_carts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Abandoned carts viewable by everyone" ON abandoned_carts FOR SELECT USING (true);
CREATE POLICY "Abandoned carts manageable by admins" ON abandoned_carts FOR ALL USING (true);

-- Discount Codes
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Discount codes viewable by everyone" ON discount_codes FOR SELECT USING (true);
CREATE POLICY "Discount codes manageable by admins" ON discount_codes FOR ALL USING (true);

-- Product Variants
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Variants viewable by everyone" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Variants manageable by admins" ON product_variants FOR ALL USING (true);

-- Inventory Alerts
ALTER TABLE inventory_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Inventory alerts viewable by everyone" ON inventory_alerts FOR SELECT USING (true);
CREATE POLICY "Inventory alerts manageable by admins" ON inventory_alerts FOR ALL USING (true);

-- =============================================
-- Newsletter Subscribers Table
-- =============================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  status TEXT DEFAULT 'active', -- active, unsubscribed
  source TEXT DEFAULT 'blog', -- blog, checkout, popup
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscribers(status);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Newsletter subscribers viewable by everyone" ON newsletter_subscribers FOR SELECT USING (true);
CREATE POLICY "Newsletter subscribers insertable by everyone" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Newsletter subscribers manageable by admins" ON newsletter_subscribers FOR ALL USING (true);

-- =============================================
-- Shipping Zones & Rates Table
-- =============================================
CREATE TABLE IF NOT EXISTS shipping_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  countries TEXT[] DEFAULT ARRAY['US'],
  states TEXT[], -- NULL = all states
  zip_codes TEXT[], -- NULL = all zip codes
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shipping_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_id UUID REFERENCES shipping_zones(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g., "Standard Shipping", "Express"
  description TEXT,
  rate_type TEXT NOT NULL, -- flat, weight_based, price_based
  flat_rate DECIMAL(10,2),
  min_weight DECIMAL(10,2),
  max_weight DECIMAL(10,2),
  weight_rate DECIMAL(10,2), -- $ per lb
  min_order DECIMAL(10,2),
  max_order DECIMAL(10,2),
  price_rate DECIMAL(10,2), -- % of order
  free_shipping_threshold DECIMAL(10,2), -- Free shipping over this amount
  estimated_days TEXT, -- e.g., "3-5 business days"
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shipping_rates_zone ON shipping_rates(zone_id);

ALTER TABLE shipping_zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Shipping zones viewable by everyone" ON shipping_zones FOR SELECT USING (true);
CREATE POLICY "Shipping zones manageable by admins" ON shipping_zones FOR ALL USING (true);

ALTER TABLE shipping_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Shipping rates viewable by everyone" ON shipping_rates FOR SELECT USING (true);
CREATE POLICY "Shipping rates manageable by admins" ON shipping_rates FOR ALL USING (true);

-- =============================================
-- Insert Default Shipping Zone & Rates
-- =============================================
INSERT INTO shipping_zones (name, countries, states)
VALUES ('United States', ARRAY['US'], NULL)
ON CONFLICT DO NOTHING;

INSERT INTO shipping_rates (
  zone_id,
  name,
  description,
  rate_type,
  flat_rate,
  free_shipping_threshold,
  estimated_days
)
SELECT
  id,
  'Standard Shipping',
  'Free shipping on orders over $50',
  'flat',
  12.99,
  50.00,
  '3-5 business days'
FROM shipping_zones
WHERE name = 'United States'
ON CONFLICT DO NOTHING;

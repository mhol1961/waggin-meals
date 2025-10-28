-- Create bundles table
CREATE TABLE IF NOT EXISTS bundles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  tagline TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  savings_amount DECIMAL(10,2) DEFAULT 0,
  is_best_value BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  badge_text TEXT,
  included_items JSONB DEFAULT '[]'::jsonb,
  customizable BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bundle_items table (links bundles to products)
CREATE TABLE IF NOT EXISTS bundle_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bundle_id UUID NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  is_required BOOLEAN DEFAULT TRUE,
  category TEXT, -- 'meal', 'topper', 'broth', 'supplement'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bundle_subscriptions table (customer bundle subscriptions)
CREATE TABLE IF NOT EXISTS bundle_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL,
  bundle_id UUID NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'paused', 'cancelled'
  frequency TEXT NOT NULL, -- 'weekly', 'biweekly', 'monthly', '4-weeks', '6-weeks', '8-weeks'
  custom_items JSONB DEFAULT '[]'::jsonb, -- Customized product selections
  next_billing_date DATE,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bundles_slug ON bundles(slug);
CREATE INDEX IF NOT EXISTS idx_bundles_featured ON bundles(is_featured);
CREATE INDEX IF NOT EXISTS idx_bundle_items_bundle ON bundle_items(bundle_id);
CREATE INDEX IF NOT EXISTS idx_bundle_items_product ON bundle_items(product_id);
CREATE INDEX IF NOT EXISTS idx_bundle_subscriptions_customer ON bundle_subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_bundle_subscriptions_bundle ON bundle_subscriptions(bundle_id);
CREATE INDEX IF NOT EXISTS idx_bundle_subscriptions_status ON bundle_subscriptions(status);

-- Add comments
COMMENT ON TABLE bundles IS 'Pre-configured bundle packages with pricing and savings';
COMMENT ON TABLE bundle_items IS 'Products included in each bundle with quantities';
COMMENT ON TABLE bundle_subscriptions IS 'Customer subscription to bundles with customization options';

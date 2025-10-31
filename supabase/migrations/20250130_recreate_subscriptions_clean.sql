-- =============================================
-- Clean Recreation of Subscription System Tables
-- Created: January 30, 2025
-- Purpose: Drop old tables and recreate with correct schema
-- =============================================

-- Drop existing tables in reverse dependency order
DROP TABLE IF EXISTS subscription_history CASCADE;
DROP TABLE IF EXISTS subscription_invoices CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS payment_methods CASCADE;

-- =============================================
-- Create payment_methods table FIRST (no dependencies)
-- =============================================
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL,

  -- Authorize.net CIM details
  authorize_net_profile_id TEXT, -- Authorize.net customer profile ID
  authorize_net_payment_profile_id TEXT, -- Authorize.net payment profile ID

  -- Card details (last 4 digits only for display)
  -- These fields are optional because Accept.js doesn't provide them
  card_type TEXT, -- 'Visa', 'Mastercard', 'Amex', 'Discover'
  last_four TEXT, -- Made optional - Accept.js doesn't provide
  expiration_month INTEGER, -- Made optional - Accept.js doesn't provide
  expiration_year INTEGER, -- Made optional - Accept.js doesn't provide

  -- Billing address
  billing_address JSONB, -- {first_name, last_name, address, city, state, zip, country}

  -- Status
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Create subscriptions table (references payment_methods)
-- =============================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL,
  order_id UUID, -- Made optional - orders table might not exist yet

  -- Subscription details
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'paused', 'cancelled', 'past_due', 'expired'
  type TEXT NOT NULL, -- 'bundle', 'product'

  -- Billing schedule
  frequency TEXT NOT NULL, -- 'weekly', 'biweekly', 'monthly', '4-weeks', '6-weeks', '8-weeks'
  interval_count INTEGER NOT NULL DEFAULT 1,
  next_billing_date DATE NOT NULL,
  last_billing_date DATE,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  paused_at TIMESTAMP WITH TIME ZONE,

  -- Pricing
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  discount_percentage DECIMAL(5,2) DEFAULT 0,

  -- Bundle or product details (JSONB for flexibility)
  items JSONB NOT NULL, -- Array of {product_id, quantity, price} or bundle details

  -- Payment method
  payment_method_id UUID REFERENCES payment_methods(id),

  -- Metadata
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Create subscription_invoices table
-- =============================================
CREATE TABLE subscription_invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  order_id UUID, -- Made optional - orders table might not exist yet

  -- Invoice details
  invoice_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL, -- 'pending', 'paid', 'failed', 'refunded'

  -- Amounts
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  shipping DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,

  -- Payment details
  payment_method_id UUID REFERENCES payment_methods(id),
  transaction_id TEXT, -- Authorize.net transaction ID

  -- Dates
  billing_date DATE NOT NULL,
  due_date DATE NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE,

  -- Retry tracking for failed payments
  attempt_count INTEGER DEFAULT 0,
  last_attempt_at TIMESTAMP WITH TIME ZONE,
  next_retry_at TIMESTAMP WITH TIME ZONE,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Create subscription_history table (for tracking changes)
-- =============================================
CREATE TABLE subscription_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,

  -- Change details
  action TEXT NOT NULL, -- 'created', 'updated', 'paused', 'resumed', 'cancelled', 'payment_failed', 'payment_succeeded'
  old_status TEXT,
  new_status TEXT,
  changed_fields JSONB, -- Track what changed

  -- Actor
  actor_type TEXT, -- 'customer', 'admin', 'system'
  actor_id UUID,

  -- Notes
  notes TEXT,

  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Create indexes for performance
-- =============================================
CREATE INDEX idx_payment_methods_customer ON payment_methods(customer_id);
CREATE INDEX idx_payment_methods_default ON payment_methods(customer_id, is_default);

CREATE INDEX idx_subscriptions_customer ON subscriptions(customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_next_billing ON subscriptions(next_billing_date);
CREATE INDEX idx_subscriptions_payment_method ON subscriptions(payment_method_id);

CREATE INDEX idx_subscription_invoices_subscription ON subscription_invoices(subscription_id);
CREATE INDEX idx_subscription_invoices_status ON subscription_invoices(status);
CREATE INDEX idx_subscription_invoices_billing_date ON subscription_invoices(billing_date);
CREATE INDEX idx_subscription_invoices_next_retry ON subscription_invoices(next_retry_at);

CREATE INDEX idx_subscription_history_subscription ON subscription_history(subscription_id);
CREATE INDEX idx_subscription_history_created ON subscription_history(created_at);

-- =============================================
-- Add comments
-- =============================================
COMMENT ON TABLE payment_methods IS 'Tokenized payment methods via Authorize.net CIM';
COMMENT ON TABLE subscriptions IS 'Customer subscription records with billing schedule and payment info';
COMMENT ON TABLE subscription_invoices IS 'Individual billing attempts for subscriptions';
COMMENT ON TABLE subscription_history IS 'Audit trail of all subscription changes';

-- =============================================
-- Create function to update updated_at timestamp
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- Create triggers for updated_at
-- =============================================
CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_invoices_updated_at BEFORE UPDATE ON subscription_invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Success message
-- =============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Subscription system tables recreated successfully!';
  RAISE NOTICE 'Tables created: payment_methods, subscriptions, subscription_invoices, subscription_history';
  RAISE NOTICE 'All columns use correct naming: authorize_net_profile_id / authorize_net_payment_profile_id';
END $$;

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL,
  order_id UUID REFERENCES orders(id),

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

-- Create payment_methods table (for Authorize.net CIM)
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL,

  -- Authorize.net CIM details
  customer_profile_id TEXT, -- Authorize.net customer profile ID
  payment_profile_id TEXT, -- Authorize.net payment profile ID

  -- Card details (last 4 digits only for display)
  card_type TEXT, -- 'Visa', 'Mastercard', 'Amex', 'Discover'
  last_four TEXT NOT NULL,
  expiration_month INTEGER NOT NULL,
  expiration_year INTEGER NOT NULL,

  -- Billing address
  billing_address JSONB, -- {first_name, last_name, address, city, state, zip, country}

  -- Status
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscription_invoices table
CREATE TABLE IF NOT EXISTS subscription_invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id),

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

-- Create subscription_history table (for tracking changes)
CREATE TABLE IF NOT EXISTS subscription_history (
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_customer ON subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_billing ON subscriptions(next_billing_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_payment_method ON subscriptions(payment_method_id);

CREATE INDEX IF NOT EXISTS idx_payment_methods_customer ON payment_methods(customer_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_default ON payment_methods(customer_id, is_default);

CREATE INDEX IF NOT EXISTS idx_subscription_invoices_subscription ON subscription_invoices(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_invoices_status ON subscription_invoices(status);
CREATE INDEX IF NOT EXISTS idx_subscription_invoices_billing_date ON subscription_invoices(billing_date);
CREATE INDEX IF NOT EXISTS idx_subscription_invoices_next_retry ON subscription_invoices(next_retry_at);

CREATE INDEX IF NOT EXISTS idx_subscription_history_subscription ON subscription_history(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_history_created ON subscription_history(created_at);

-- Add comments
COMMENT ON TABLE subscriptions IS 'Customer subscription records with billing schedule and payment info';
COMMENT ON TABLE payment_methods IS 'Tokenized payment methods via Authorize.net CIM';
COMMENT ON TABLE subscription_invoices IS 'Individual billing attempts for subscriptions';
COMMENT ON TABLE subscription_history IS 'Audit trail of all subscription changes';

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_invoices_updated_at BEFORE UPDATE ON subscription_invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add payment tokenization fields to subscriptions table
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS payment_customer_profile_id TEXT,
ADD COLUMN IF NOT EXISTS payment_profile_id TEXT,
ADD COLUMN IF NOT EXISTS payment_last_four TEXT,
ADD COLUMN IF NOT EXISTS payment_card_type TEXT,
ADD COLUMN IF NOT EXISTS secure_token TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS failed_payment_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_payment_attempt TIMESTAMP WITH TIME ZONE;

-- Create index on secure_token for fast lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_secure_token ON subscriptions(secure_token);

-- Create subscription billing history table
CREATE TABLE IF NOT EXISTS subscription_billing_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id),
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL, -- 'success', 'failed', 'refunded'
  payment_response JSONB,
  error_message TEXT,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_billing_history_subscription ON subscription_billing_history(subscription_id);
CREATE INDEX IF NOT EXISTS idx_billing_history_status ON subscription_billing_history(status);

-- Function to get subscriptions due for billing
CREATE OR REPLACE FUNCTION get_subscriptions_due_for_billing()
RETURNS TABLE (
  id UUID,
  customer_id UUID,
  frequency TEXT,
  next_billing_date DATE,
  items JSONB,
  subtotal DECIMAL(10,2),
  shipping_cost DECIMAL(10,2),
  tax_amount DECIMAL(10,2),
  total DECIMAL(10,2),
  payment_customer_profile_id TEXT,
  payment_profile_id TEXT,
  shipping_address_id UUID
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.customer_id,
    s.frequency,
    s.next_billing_date,
    s.items,
    s.subtotal,
    s.shipping_cost,
    s.tax_amount,
    s.total,
    s.payment_customer_profile_id,
    s.payment_profile_id,
    s.shipping_address_id
  FROM subscriptions s
  WHERE s.status = 'active'
    AND s.next_billing_date <= CURRENT_DATE
    AND s.payment_profile_id IS NOT NULL
  ORDER BY s.next_billing_date ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to update next billing date
CREATE OR REPLACE FUNCTION update_next_billing_date(
  sub_id UUID,
  freq TEXT
) RETURNS DATE AS $$
DECLARE
  new_date DATE;
BEGIN
  CASE freq
    WHEN 'weekly' THEN
      new_date := CURRENT_DATE + INTERVAL '7 days';
    WHEN 'biweekly' THEN
      new_date := CURRENT_DATE + INTERVAL '14 days';
    WHEN 'monthly' THEN
      new_date := CURRENT_DATE + INTERVAL '1 month';
    ELSE
      new_date := CURRENT_DATE + INTERVAL '1 month';
  END CASE;

  UPDATE subscriptions
  SET next_billing_date = new_date,
      updated_at = NOW()
  WHERE id = sub_id;

  RETURN new_date;
END;
$$ LANGUAGE plpgsql;

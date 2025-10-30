-- =============================================
-- Payment System Tables
-- Created: 2025-01-30
-- Purpose: Store payment transactions and refunds
-- =============================================

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Payment details
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  -- Status values: pending, authorized, captured, settled, voided, declined, error, refunded, partially_refunded

  -- Transaction information
  transaction_id VARCHAR(255), -- Authorize.net transaction ID
  auth_code VARCHAR(50), -- Authorization code
  payment_method VARCHAR(50) NOT NULL DEFAULT 'credit_card',
  -- Payment methods: credit_card, saved_card, apple_pay, google_pay

  -- Card information (NEVER store full card numbers!)
  card_type VARCHAR(20), -- visa, mastercard, amex, discover
  last_four VARCHAR(4), -- Last 4 digits only

  -- Response codes
  response_code VARCHAR(10),
  response_text TEXT,
  avs_result VARCHAR(10), -- Address Verification System result
  cvv_result VARCHAR(10), -- Card Verification Value result

  -- Error handling
  error_message TEXT,

  -- Additional metadata
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Indexes
  CONSTRAINT valid_status CHECK (status IN (
    'pending', 'authorized', 'captured', 'settled',
    'voided', 'declined', 'error', 'refunded', 'partially_refunded'
  ))
);

-- Create index on order_id for fast lookups
CREATE INDEX idx_payments_order_id ON payments(order_id);

-- Create index on customer_id
CREATE INDEX idx_payments_customer_id ON payments(customer_id);

-- Create index on transaction_id (unique)
CREATE UNIQUE INDEX idx_payments_transaction_id ON payments(transaction_id) WHERE transaction_id IS NOT NULL;

-- Create index on status
CREATE INDEX idx_payments_status ON payments(status);

-- Create index on created_at for sorting
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);

-- =============================================
-- Transactions table (audit log)
-- =============================================

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,

  -- Transaction details
  transaction_type VARCHAR(50) NOT NULL,
  -- Types: authorize, capture, refund, void, decline
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL,

  -- Authorize.net response
  transaction_id VARCHAR(255), -- Authorize.net trans ID
  auth_code VARCHAR(50),
  response_code VARCHAR(10),
  response_text TEXT,
  error_message TEXT,

  -- Request/response data for debugging
  request_data JSONB,
  response_data JSONB,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_transaction_type CHECK (transaction_type IN (
    'authorize', 'capture', 'refund', 'void', 'decline', 'error'
  ))
);

-- Create index on payment_id
CREATE INDEX idx_transactions_payment_id ON transactions(payment_id);

-- Create index on transaction_type
CREATE INDEX idx_transactions_type ON transactions(transaction_type);

-- Create index on created_at
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

-- =============================================
-- Customer Payment Profiles (for CIM - saved cards)
-- =============================================

CREATE TABLE IF NOT EXISTS customer_payment_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Authorize.net CIM profile IDs
  authorize_net_profile_id VARCHAR(255) NOT NULL,
  authorize_net_payment_profile_id VARCHAR(255) NOT NULL,

  -- Card information (NEVER store full card numbers!)
  card_type VARCHAR(20),
  last_four VARCHAR(4) NOT NULL,
  expiration_month VARCHAR(2) NOT NULL,
  expiration_year VARCHAR(4) NOT NULL,

  -- Billing address (stored with payment profile in Authorize.net)
  billing_address JSONB,

  -- Profile settings
  is_default BOOLEAN DEFAULT false,
  nickname VARCHAR(100), -- e.g., "Personal Visa", "Business Mastercard"

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique constraint on Authorize.net IDs
  CONSTRAINT unique_authnet_payment_profile UNIQUE (authorize_net_payment_profile_id)
);

-- Create index on customer_id
CREATE INDEX idx_payment_profiles_customer_id ON customer_payment_profiles(customer_id);

-- Create index on is_default
CREATE INDEX idx_payment_profiles_default ON customer_payment_profiles(is_default) WHERE is_default = true;

-- =============================================
-- Triggers for updated_at
-- =============================================

-- Payments table trigger
CREATE OR REPLACE FUNCTION update_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_payments_updated_at();

-- Customer payment profiles trigger
CREATE OR REPLACE FUNCTION update_payment_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payment_profiles_updated_at
  BEFORE UPDATE ON customer_payment_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_profiles_updated_at();

-- =============================================
-- Row Level Security (RLS)
-- =============================================

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_payment_profiles ENABLE ROW LEVEL SECURITY;

-- Payments policies
CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT
  USING (customer_id = auth.uid());

CREATE POLICY "Service role can manage all payments"
  ON payments FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Transactions policies
CREATE POLICY "Users can view their payment transactions"
  ON transactions FOR SELECT
  USING (
    payment_id IN (
      SELECT id FROM payments WHERE customer_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage all transactions"
  ON transactions FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Customer payment profiles policies
CREATE POLICY "Users can view their own payment profiles"
  ON customer_payment_profiles FOR SELECT
  USING (customer_id = auth.uid());

CREATE POLICY "Users can insert their own payment profiles"
  ON customer_payment_profiles FOR INSERT
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Users can update their own payment profiles"
  ON customer_payment_profiles FOR UPDATE
  USING (customer_id = auth.uid());

CREATE POLICY "Users can delete their own payment profiles"
  ON customer_payment_profiles FOR DELETE
  USING (customer_id = auth.uid());

CREATE POLICY "Service role can manage all payment profiles"
  ON customer_payment_profiles FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- =============================================
-- Helper Functions
-- =============================================

-- Function to get total refunded amount for a payment
CREATE OR REPLACE FUNCTION get_total_refunded(payment_uuid UUID)
RETURNS DECIMAL(10, 2) AS $$
  SELECT COALESCE(SUM(amount), 0)
  FROM transactions
  WHERE payment_id = payment_uuid
    AND transaction_type = 'refund'
    AND status IN ('authorized', 'captured', 'settled');
$$ LANGUAGE SQL STABLE;

-- Function to check if payment is fully refunded
CREATE OR REPLACE FUNCTION is_fully_refunded(payment_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT (
    SELECT amount FROM payments WHERE id = payment_uuid
  ) <= (
    SELECT get_total_refunded(payment_uuid)
  );
$$ LANGUAGE SQL STABLE;

-- Function to create payment with transaction log
CREATE OR REPLACE FUNCTION create_payment_with_transaction(
  p_order_id UUID,
  p_customer_id UUID,
  p_amount DECIMAL,
  p_transaction_id VARCHAR,
  p_auth_code VARCHAR,
  p_card_type VARCHAR,
  p_last_four VARCHAR,
  p_response_code VARCHAR,
  p_response_text TEXT,
  p_avs_result VARCHAR DEFAULT NULL,
  p_cvv_result VARCHAR DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_payment_id UUID;
  v_status VARCHAR;
BEGIN
  -- Determine status based on response code
  IF p_response_code = '1' THEN
    v_status := 'captured'; -- Authorize.net authCapture is immediate
  ELSE
    v_status := 'declined';
  END IF;

  -- Insert payment
  INSERT INTO payments (
    order_id,
    customer_id,
    amount,
    currency,
    status,
    transaction_id,
    auth_code,
    payment_method,
    card_type,
    last_four,
    response_code,
    response_text,
    avs_result,
    cvv_result
  ) VALUES (
    p_order_id,
    p_customer_id,
    p_amount,
    'USD',
    v_status,
    p_transaction_id,
    p_auth_code,
    'credit_card',
    p_card_type,
    p_last_four,
    p_response_code,
    p_response_text,
    p_avs_result,
    p_cvv_result
  )
  RETURNING id INTO v_payment_id;

  -- Insert transaction log
  INSERT INTO transactions (
    payment_id,
    transaction_type,
    amount,
    status,
    transaction_id,
    auth_code,
    response_code,
    response_text
  ) VALUES (
    v_payment_id,
    'capture',
    p_amount,
    v_status,
    p_transaction_id,
    p_auth_code,
    p_response_code,
    p_response_text
  );

  RETURN v_payment_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- Comments for documentation
-- =============================================

COMMENT ON TABLE payments IS 'Stores payment records for orders';
COMMENT ON TABLE transactions IS 'Audit log of all payment transaction attempts';
COMMENT ON TABLE customer_payment_profiles IS 'Saved payment methods for customers (CIM)';

COMMENT ON COLUMN payments.transaction_id IS 'Authorize.net transaction ID (unique)';
COMMENT ON COLUMN payments.last_four IS 'Last 4 digits of card (NEVER store full numbers!)';
COMMENT ON COLUMN payments.avs_result IS 'Address Verification System result code';
COMMENT ON COLUMN payments.cvv_result IS 'Card Verification Value result code';

-- =============================================
-- Success Message
-- =============================================

DO $$
BEGIN
  RAISE NOTICE 'Payment system tables created successfully!';
  RAISE NOTICE 'Tables: payments, transactions, customer_payment_profiles';
  RAISE NOTICE 'RLS policies enabled for data security';
  RAISE NOTICE 'Helper functions created for payment operations';
END $$;

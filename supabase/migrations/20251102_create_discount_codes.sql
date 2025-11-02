-- =============================================
-- Create Discount Codes Table
-- Created: November 2, 2025
-- Purpose: Manage promotional discount codes for orders
-- =============================================

CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Discount code details
  code TEXT UNIQUE NOT NULL,
  description TEXT,

  -- Discount configuration
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,

  -- Usage limits
  usage_limit INTEGER, -- NULL = unlimited
  usage_count INTEGER DEFAULT 0,
  minimum_purchase DECIMAL(10,2), -- Minimum order amount required

  -- Validity period
  starts_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Create indexes
-- =============================================
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_active ON discount_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_discount_codes_expires ON discount_codes(expires_at);

-- =============================================
-- Add comments
-- =============================================
COMMENT ON TABLE discount_codes IS 'Promotional discount codes for orders';
COMMENT ON COLUMN discount_codes.discount_type IS 'Type: percentage or fixed';
COMMENT ON COLUMN discount_codes.usage_limit IS 'Maximum number of times code can be used (NULL = unlimited)';
COMMENT ON COLUMN discount_codes.minimum_purchase IS 'Minimum order amount required to use code';

-- =============================================
-- Create trigger for updated_at
-- =============================================
CREATE TRIGGER update_discount_codes_updated_at BEFORE UPDATE ON discount_codes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Success message
-- =============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Discount codes table created successfully!';
END $$;

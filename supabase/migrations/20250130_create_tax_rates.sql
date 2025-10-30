-- =============================================
-- Tax Rates Table for E-Commerce Tax Calculator
-- Created: January 30, 2025
-- =============================================
-- This table stores tax rates at state, county, and ZIP code levels
-- for accurate sales tax calculation across the United States

-- Drop table if exists (for clean migrations)
DROP TABLE IF EXISTS tax_rates CASCADE;

-- =============================================
-- Tax Rates Table
-- =============================================
CREATE TABLE tax_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Geographic identifiers
  state_code VARCHAR(2) NOT NULL, -- 2-letter US state code (e.g., 'CA', 'TX', 'NY')
  state_name VARCHAR(100) NOT NULL, -- Full state name (e.g., 'California')
  county VARCHAR(100), -- Optional county name for county-level rates
  zip_code VARCHAR(10), -- Optional ZIP code for ZIP-level rates

  -- Tax rate (stored as decimal, e.g., 0.0725 for 7.25%)
  tax_rate DECIMAL(6, 4) NOT NULL CHECK (tax_rate >= 0 AND tax_rate <= 1),

  -- Metadata
  is_active BOOLEAN DEFAULT true,
  notes TEXT, -- Optional notes about the tax rate (e.g., special rules)

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CONSTRAINT check_geographic_specificity CHECK (
    -- At minimum, state_code and state_name must be provided
    state_code IS NOT NULL AND state_name IS NOT NULL
  )
);

-- =============================================
-- Indexes for Fast Lookups
-- =============================================
-- Index on state_code for state-level tax lookups
CREATE INDEX idx_tax_rates_state_code ON tax_rates(state_code) WHERE is_active = true;

-- Index on ZIP code for ZIP-level tax lookups
CREATE INDEX idx_tax_rates_zip_code ON tax_rates(zip_code) WHERE is_active = true AND zip_code IS NOT NULL;

-- Index on county for county-level tax lookups
CREATE INDEX idx_tax_rates_county ON tax_rates(state_code, county) WHERE is_active = true AND county IS NOT NULL;

-- Composite index for most specific lookups (ZIP takes precedence)
CREATE INDEX idx_tax_rates_lookup ON tax_rates(state_code, zip_code, county) WHERE is_active = true;

-- =============================================
-- Updated At Trigger Function
-- =============================================
-- Automatically update the updated_at timestamp on row updates
CREATE OR REPLACE FUNCTION update_tax_rates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_tax_rates_updated_at ON tax_rates;
CREATE TRIGGER trigger_update_tax_rates_updated_at
  BEFORE UPDATE ON tax_rates
  FOR EACH ROW
  EXECUTE FUNCTION update_tax_rates_updated_at();

-- =============================================
-- Seed Initial Tax Rates (US State-Level)
-- =============================================
-- Common US state sales tax rates (as of 2025)
-- These are base state rates; local rates may apply on top

INSERT INTO tax_rates (state_code, state_name, tax_rate, notes) VALUES
  -- States with sales tax
  ('AL', 'Alabama', 0.0400, 'Base state rate; local rates may apply'),
  ('AZ', 'Arizona', 0.0560, 'Base state rate; local rates may apply'),
  ('AR', 'Arkansas', 0.0650, 'Base state rate; local rates may apply'),
  ('CA', 'California', 0.0725, 'Base state rate; local rates vary widely'),
  ('CO', 'Colorado', 0.0290, 'Base state rate; significant local rates apply'),
  ('CT', 'Connecticut', 0.0635, 'State rate only'),
  ('FL', 'Florida', 0.0600, 'Base state rate; local rates may apply'),
  ('GA', 'Georgia', 0.0400, 'Base state rate; local rates may apply'),
  ('HI', 'Hawaii', 0.0400, 'GET (excise tax) rate'),
  ('ID', 'Idaho', 0.0600, 'Base state rate; local rates may apply'),
  ('IL', 'Illinois', 0.0625, 'Base state rate; local rates may apply'),
  ('IN', 'Indiana', 0.0700, 'State rate only'),
  ('IA', 'Iowa', 0.0600, 'Base state rate; local rates may apply'),
  ('KS', 'Kansas', 0.0650, 'Base state rate; local rates may apply'),
  ('KY', 'Kentucky', 0.0600, 'State rate only'),
  ('LA', 'Louisiana', 0.0445, 'Base state rate; local rates are significant'),
  ('ME', 'Maine', 0.0550, 'State rate only'),
  ('MD', 'Maryland', 0.0600, 'State rate only'),
  ('MA', 'Massachusetts', 0.0625, 'State rate only'),
  ('MI', 'Michigan', 0.0600, 'State rate only'),
  ('MN', 'Minnesota', 0.0688, 'Base state rate; local rates may apply'),
  ('MS', 'Mississippi', 0.0700, 'Base state rate; local rates may apply'),
  ('MO', 'Missouri', 0.0423, 'Base state rate; local rates are very common'),
  ('NE', 'Nebraska', 0.0550, 'Base state rate; local rates may apply'),
  ('NV', 'Nevada', 0.0685, 'Base state rate; local rates may apply'),
  ('NJ', 'New Jersey', 0.0663, 'State rate only'),
  ('NM', 'New Mexico', 0.0513, 'Base state rate; local rates may apply'),
  ('NY', 'New York', 0.0400, 'Base state rate; local rates vary widely'),
  ('NC', 'North Carolina', 0.0475, 'Base state rate; local rates may apply'),
  ('ND', 'North Dakota', 0.0500, 'Base state rate; local rates may apply'),
  ('OH', 'Ohio', 0.0575, 'Base state rate; local rates may apply'),
  ('OK', 'Oklahoma', 0.0450, 'Base state rate; local rates may apply'),
  ('PA', 'Pennsylvania', 0.0600, 'Base state rate; local rates may apply'),
  ('RI', 'Rhode Island', 0.0700, 'State rate only'),
  ('SC', 'South Carolina', 0.0600, 'Base state rate; local rates may apply'),
  ('SD', 'South Dakota', 0.0450, 'Base state rate; local rates may apply'),
  ('TN', 'Tennessee', 0.0700, 'Base state rate; local rates are very common'),
  ('TX', 'Texas', 0.0625, 'Base state rate; local rates may apply'),
  ('UT', 'Utah', 0.0485, 'Base state rate; local rates are very common'),
  ('VT', 'Vermont', 0.0600, 'Base state rate; local rates may apply'),
  ('VA', 'Virginia', 0.0530, 'Base state rate; local rates may apply'),
  ('WA', 'Washington', 0.0650, 'Base state rate; local rates vary widely'),
  ('WV', 'West Virginia', 0.0600, 'Base state rate; local rates may apply'),
  ('WI', 'Wisconsin', 0.0500, 'Base state rate; local rates may apply'),
  ('WY', 'Wyoming', 0.0400, 'Base state rate; local rates may apply'),

  -- States with NO sales tax
  ('AK', 'Alaska', 0.0000, 'No state sales tax; some local jurisdictions may have sales tax'),
  ('DE', 'Delaware', 0.0000, 'No sales tax'),
  ('MT', 'Montana', 0.0000, 'No state sales tax; some resort areas may have local tax'),
  ('NH', 'New Hampshire', 0.0000, 'No sales tax'),
  ('OR', 'Oregon', 0.0000, 'No sales tax')
ON CONFLICT DO NOTHING;

-- =============================================
-- Comments for Documentation
-- =============================================
COMMENT ON TABLE tax_rates IS 'Stores sales tax rates for US states, counties, and ZIP codes';
COMMENT ON COLUMN tax_rates.state_code IS 'Two-letter US state abbreviation (e.g., CA, TX, NY)';
COMMENT ON COLUMN tax_rates.tax_rate IS 'Tax rate as decimal (e.g., 0.0725 = 7.25%)';
COMMENT ON COLUMN tax_rates.is_active IS 'Whether this tax rate is currently active';
COMMENT ON COLUMN tax_rates.county IS 'Optional county name for county-specific rates';
COMMENT ON COLUMN tax_rates.zip_code IS 'Optional ZIP code for ZIP-specific rates';

-- =============================================
-- Enable Row Level Security (RLS)
-- =============================================
-- Enable RLS on the table
ALTER TABLE tax_rates ENABLE ROW LEVEL SECURITY;

-- Public can read active tax rates
CREATE POLICY "Tax rates are viewable by everyone"
  ON tax_rates FOR SELECT
  USING (is_active = true);

-- Only admins can insert/update/delete tax rates
-- Note: This assumes you have an admin role check function
-- For now, we'll allow all authenticated users (you can tighten this later)
CREATE POLICY "Tax rates are manageable by admins"
  ON tax_rates FOR ALL
  USING (auth.role() = 'authenticated');

-- =============================================
-- Grant Permissions
-- =============================================
-- Grant access to authenticated users
GRANT SELECT ON tax_rates TO anon, authenticated;
GRANT ALL ON tax_rates TO authenticated;

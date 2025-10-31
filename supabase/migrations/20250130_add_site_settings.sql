-- =============================================
-- Site Settings Table
-- =============================================
-- Purpose: Global site configuration settings
-- Date: 2025-01-30

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Tax Settings
  tax_collection_enabled BOOLEAN DEFAULT false,

  -- Future settings can be added here
  -- shipping_enabled BOOLEAN DEFAULT true,
  -- inventory_tracking_enabled BOOLEAN DEFAULT true,

  -- Metadata
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by TEXT
);

-- Insert default row (single row table - only one settings record)
INSERT INTO site_settings (tax_collection_enabled)
VALUES (false)
ON CONFLICT DO NOTHING;

-- Create trigger to update timestamp
CREATE OR REPLACE FUNCTION update_site_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER site_settings_updated
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_site_settings_timestamp();

-- RLS Policies
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings
CREATE POLICY "Allow public read access to site settings"
  ON site_settings
  FOR SELECT
  TO public
  USING (true);

-- Only authenticated users can update (admin check happens in API)
CREATE POLICY "Allow authenticated users to update site settings"
  ON site_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Comments
COMMENT ON TABLE site_settings IS 'Global site configuration settings';
COMMENT ON COLUMN site_settings.tax_collection_enabled IS 'Master switch for tax collection - when false, all orders have $0 tax';

-- Success message
DO $$ BEGIN
  RAISE NOTICE 'Site settings table created successfully!';
  RAISE NOTICE 'Tax collection is currently DISABLED (tax_collection_enabled = false)';
  RAISE NOTICE 'Enable it in Admin → Settings → Tax when ready';
END $$;

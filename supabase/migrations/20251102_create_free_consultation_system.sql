-- =====================================================
-- FREE CONSULTATION SYSTEM (Contact Expert Form)
-- Created: November 2, 2025
--
-- This migration creates the database schema for the free
-- consultation system where customers submit pet info for
-- expert advice via the Contact Expert form.
--
-- IDEMPOTENT: Safe to run multiple times, won't break existing data
-- =====================================================

-- =====================================================
-- TABLE: pet_profiles
-- Stores detailed information about customer pets
-- =====================================================
CREATE TABLE IF NOT EXISTS pet_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Customer link (nullable - pet can exist before customer account created)
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,

  -- Basic pet information
  name TEXT NOT NULL DEFAULT '',
  breed TEXT NOT NULL DEFAULT '',
  weight TEXT NOT NULL DEFAULT '',
  body_condition TEXT NOT NULL DEFAULT '',
  activity_level TEXT NOT NULL DEFAULT '',

  -- Health information
  recent_health_issues TEXT NOT NULL DEFAULT '',
  allergies TEXT NOT NULL DEFAULT '',
  supplements TEXT NOT NULL DEFAULT '',
  behavioral_changes TEXT NOT NULL DEFAULT '',

  -- Dietary information
  current_feeding TEXT NOT NULL DEFAULT '',
  health_goals TEXT NOT NULL DEFAULT '',
  protein_preferences TEXT NOT NULL DEFAULT '',
  include_bone_broth TEXT NOT NULL DEFAULT '',
  meal_type TEXT NOT NULL DEFAULT '',

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for customer lookups
CREATE INDEX IF NOT EXISTS idx_pet_profiles_customer_id
  ON pet_profiles(customer_id);

-- Index for name searches
CREATE INDEX IF NOT EXISTS idx_pet_profiles_name
  ON pet_profiles(name);

-- =====================================================
-- TABLE: consultation_requests
-- Stores free consultation requests from Contact Expert form
-- =====================================================
CREATE TABLE IF NOT EXISTS consultation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Customer link (nullable - consultation can exist before customer account created)
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,

  -- Contact information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  state TEXT NOT NULL DEFAULT '',
  zip_code TEXT NOT NULL DEFAULT '',

  -- Consultation details
  current_spending NUMERIC(10, 2),
  delivery_frequency TEXT NOT NULL DEFAULT '',
  additional_notes TEXT NOT NULL DEFAULT '',

  -- Pet associations (array of pet_profile IDs)
  pet_profile_ids TEXT[] NOT NULL DEFAULT '{}',

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending',
  -- Status values: pending, contacted, completed, cancelled

  -- GoHighLevel CRM integration
  ghl_contact_id TEXT,
  ghl_synced_at TIMESTAMPTZ,

  -- Admin notes (visible only to Christie)
  admin_notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for customer lookups
CREATE INDEX IF NOT EXISTS idx_consultation_requests_customer_id
  ON consultation_requests(customer_id);

-- Index for email searches
CREATE INDEX IF NOT EXISTS idx_consultation_requests_email
  ON consultation_requests(email);

-- Index for status filtering (admin dashboard)
CREATE INDEX IF NOT EXISTS idx_consultation_requests_status
  ON consultation_requests(status);

-- Index for GHL sync status
CREATE INDEX IF NOT EXISTS idx_consultation_requests_ghl_contact_id
  ON consultation_requests(ghl_contact_id);

-- Index for created_at (for sorting by date)
CREATE INDEX IF NOT EXISTS idx_consultation_requests_created_at
  ON consultation_requests(created_at DESC);

-- =====================================================
-- TRIGGERS: Auto-update updated_at timestamp
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for pet_profiles
DROP TRIGGER IF EXISTS update_pet_profiles_updated_at ON pet_profiles;
CREATE TRIGGER update_pet_profiles_updated_at
  BEFORE UPDATE ON pet_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for consultation_requests
DROP TRIGGER IF EXISTS update_consultation_requests_updated_at ON consultation_requests;
CREATE TRIGGER update_consultation_requests_updated_at
  BEFORE UPDATE ON consultation_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on both tables
ALTER TABLE pet_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can do anything
DROP POLICY IF EXISTS "Admins have full access to pet_profiles" ON pet_profiles;
CREATE POLICY "Admins have full access to pet_profiles"
  ON pet_profiles
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins have full access to consultation_requests" ON consultation_requests;
CREATE POLICY "Admins have full access to consultation_requests"
  ON consultation_requests
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Customers can view their own pet profiles
DROP POLICY IF EXISTS "Customers can view their own pet_profiles" ON pet_profiles;
CREATE POLICY "Customers can view their own pet_profiles"
  ON pet_profiles
  FOR SELECT
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Policy: Customers can view their own consultation requests
DROP POLICY IF EXISTS "Customers can view their own consultation_requests" ON consultation_requests;
CREATE POLICY "Customers can view their own consultation_requests"
  ON consultation_requests
  FOR SELECT
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE email = auth.jwt() ->> 'email'
    )
  );

-- =====================================================
-- COMMENTS: Documentation for future reference
-- =====================================================

COMMENT ON TABLE pet_profiles IS 'Stores detailed pet information submitted via Contact Expert form';
COMMENT ON TABLE consultation_requests IS 'Free consultation requests - customers submit pet info for expert advice';

COMMENT ON COLUMN consultation_requests.status IS 'Status values: pending (new), contacted (Christie reached out), completed (advice given), cancelled';
COMMENT ON COLUMN consultation_requests.pet_profile_ids IS 'Array of pet_profile UUIDs associated with this consultation';
COMMENT ON COLUMN consultation_requests.ghl_contact_id IS 'GoHighLevel CRM contact ID for marketing automation';
COMMENT ON COLUMN consultation_requests.admin_notes IS 'Internal notes visible only to Christie in admin dashboard';

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Free consultation system migration completed successfully';
  RAISE NOTICE '📋 Tables created/verified: pet_profiles, consultation_requests';
  RAISE NOTICE '🔒 Row Level Security (RLS) enabled on both tables';
  RAISE NOTICE '🔗 Indexes created for optimal query performance';
  RAISE NOTICE '⏰ Auto-update triggers configured for updated_at timestamps';
END $$;

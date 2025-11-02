-- =============================================
-- Create Consultation System Tables
-- Created: November 2, 2025
-- Purpose: Store free consultation requests with pet profiles and customer integration
-- =============================================

-- =============================================
-- 1. Pet Profiles Table
-- =============================================
CREATE TABLE IF NOT EXISTS pet_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Customer relationship
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,

  -- Basic pet information
  name TEXT NOT NULL,
  breed TEXT,
  weight TEXT, -- Storing as text to handle ranges like "45-50 lbs"
  age TEXT, -- Storing as text to handle ranges like "2-3 years"

  -- Health information
  body_condition TEXT CHECK (body_condition IN ('underweight', 'ideal', 'overweight', 'obese', '')),
  recent_health_issues TEXT,
  allergies TEXT,

  -- Current feeding
  current_feeding TEXT,
  activity_level TEXT CHECK (activity_level IN ('low', 'moderate', 'high', 'very_high', '')),

  -- Goals and preferences
  health_goals TEXT,
  supplements TEXT,
  behavioral_changes TEXT,
  protein_preferences TEXT,
  include_bone_broth TEXT,
  meal_type TEXT,

  -- Metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. Consultation Requests Table
-- =============================================
CREATE TABLE IF NOT EXISTS consultation_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Customer information
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,

  -- Address
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,

  -- Preferences
  current_spending DECIMAL(10,2),
  delivery_frequency TEXT,
  additional_notes TEXT,

  -- Pet profiles (array of UUIDs)
  pet_profile_ids UUID[] DEFAULT ARRAY[]::UUID[],

  -- Status tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'scheduled', 'completed', 'cancelled')),

  -- GoHighLevel integration
  ghl_contact_id TEXT, -- GoHighLevel contact ID for tracking
  ghl_synced_at TIMESTAMP WITH TIME ZONE,

  -- Admin notes
  admin_notes TEXT,
  assigned_to TEXT, -- Christie or staff member
  follow_up_date DATE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- =============================================
-- Create indexes for performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_pet_profiles_customer ON pet_profiles(customer_id);
CREATE INDEX IF NOT EXISTS idx_pet_profiles_active ON pet_profiles(is_active);

CREATE INDEX IF NOT EXISTS idx_consultation_requests_customer ON consultation_requests(customer_id);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_email ON consultation_requests(email);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_status ON consultation_requests(status);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_created ON consultation_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_ghl ON consultation_requests(ghl_contact_id);

-- =============================================
-- Add comments for documentation
-- =============================================
COMMENT ON TABLE pet_profiles IS 'Pet information collected from consultation forms and customer accounts';
COMMENT ON COLUMN pet_profiles.customer_id IS 'Links to customer account if they create one';
COMMENT ON COLUMN pet_profiles.weight IS 'Stored as text to handle ranges and units';
COMMENT ON COLUMN pet_profiles.is_active IS 'False if pet passes away or customer no longer has them';

COMMENT ON TABLE consultation_requests IS 'Free 15-minute consultation requests from contact-expert page';
COMMENT ON COLUMN consultation_requests.customer_id IS 'Links to customer account if created';
COMMENT ON COLUMN consultation_requests.pet_profile_ids IS 'Array of pet_profiles.id for this consultation';
COMMENT ON COLUMN consultation_requests.ghl_contact_id IS 'GoHighLevel contact ID for CRM automation';
COMMENT ON COLUMN consultation_requests.status IS 'Workflow: pending -> contacted -> scheduled -> completed';

-- =============================================
-- Create triggers for updated_at
-- =============================================
DROP TRIGGER IF EXISTS update_pet_profiles_updated_at ON pet_profiles;
CREATE TRIGGER update_pet_profiles_updated_at BEFORE UPDATE ON pet_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_consultation_requests_updated_at ON consultation_requests;
CREATE TRIGGER update_consultation_requests_updated_at BEFORE UPDATE ON consultation_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Success message
-- =============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Consultation system tables created successfully!';
  RAISE NOTICE '   - pet_profiles table ready';
  RAISE NOTICE '   - consultation_requests table ready';
  RAISE NOTICE '   - Indexes and triggers configured';
END $$;

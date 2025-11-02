-- =============================================
-- Create Paid Consultations System ($395)
-- Created: November 2, 2025
-- Purpose: Complete e-commerce consultation service with payment integration
-- =============================================

-- =============================================
-- 1. Paid Consultations Table
-- =============================================
CREATE TABLE IF NOT EXISTS paid_consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Order & Customer Links
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,

  -- Contact Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT,
  state TEXT,

  -- Dog Information (JSONB for flexible structure)
  dogs JSONB NOT NULL,
  -- Example structure:
  -- [{
  --   "name": "Max",
  --   "breed": "Golden Retriever",
  --   "age": "5 years",
  --   "weight": "60 lbs",
  --   "gender": "male",
  --   "spayedNeutered": "yes"
  -- }]

  -- Diet Information (JSONB)
  current_diet JSONB NOT NULL,
  -- {
  --   "currentFood": "Blue Buffalo Chicken",
  --   "durationOnDiet": "6 months",
  --   "portionSize": "2 cups",
  --   "feedingFrequency": "twice daily"
  -- }

  -- Health Information (JSONB)
  health_info JSONB,
  -- {
  --   "allergies": "chicken, wheat",
  --   "sensitivities": "dairy",
  --   "chronicConditions": "arthritis",
  --   "medications": "Carprofen 50mg twice daily",
  --   "recentVetVisits": "Annual checkup last month"
  -- }

  -- Goals & Preferences
  goals TEXT NOT NULL,
  preferred_format TEXT CHECK (preferred_format IN ('zoom', 'facetime', 'in-person', '')),
  special_requests TEXT,

  -- Consultation Status
  status TEXT DEFAULT 'questionnaire_pending' CHECK (
    status IN (
      'questionnaire_pending',  -- Waiting for questionnaire to be filled
      'payment_pending',         -- Questionnaire filled, waiting for payment
      'paid',                    -- Payment received, awaiting Christie's review
      'reviewed',                -- Christie reviewed, ready to schedule
      'scheduled',               -- Consultation scheduled
      'completed',               -- Consultation happened
      'delivered'                -- Meal plan & materials delivered
    )
  ),

  -- Scheduling
  scheduled_date TIMESTAMP WITH TIME ZONE,
  scheduled_duration INTEGER DEFAULT 120, -- minutes (default 2 hours)
  consultation_notes TEXT, -- Christie's notes during consultation

  -- Deliverables (URLs to Supabase Storage)
  meal_plan_url TEXT, -- PDF stored in Supabase Storage
  recommendations_url TEXT, -- Additional documents
  follow_up_dates TIMESTAMP WITH TIME ZONE[], -- Array of follow-up dates

  -- GHL Integration
  ghl_contact_id TEXT,
  ghl_synced_at TIMESTAMP WITH TIME ZONE,
  ghl_tags TEXT[] DEFAULT ARRAY[]::TEXT[], -- Array of tags applied

  -- Admin Tracking
  assigned_to TEXT DEFAULT 'Christie', -- Christie or staff member
  admin_notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  questionnaire_completed_at TIMESTAMP WITH TIME ZONE,
  payment_completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. Update Orders Table
-- =============================================
-- Add consultation-specific fields to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS is_consultation BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS consultation_id UUID REFERENCES paid_consultations(id);

-- =============================================
-- 3. Create Indexes for Performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_paid_consultations_order ON paid_consultations(order_id);
CREATE INDEX IF NOT EXISTS idx_paid_consultations_customer ON paid_consultations(customer_id);
CREATE INDEX IF NOT EXISTS idx_paid_consultations_email ON paid_consultations(email);
CREATE INDEX IF NOT EXISTS idx_paid_consultations_status ON paid_consultations(status);
CREATE INDEX IF NOT EXISTS idx_paid_consultations_scheduled ON paid_consultations(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_paid_consultations_ghl ON paid_consultations(ghl_contact_id);
CREATE INDEX IF NOT EXISTS idx_paid_consultations_created ON paid_consultations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_orders_consultation ON orders(consultation_id);
CREATE INDEX IF NOT EXISTS idx_orders_is_consultation ON orders(is_consultation);

-- =============================================
-- 4. Add Comments for Documentation
-- =============================================
COMMENT ON TABLE paid_consultations IS 'Paid $395 comprehensive canine nutrition consultations with full workflow tracking';
COMMENT ON COLUMN paid_consultations.order_id IS 'Links to order when payment is completed';
COMMENT ON COLUMN paid_consultations.customer_id IS 'Links to customer account if exists';
COMMENT ON COLUMN paid_consultations.dogs IS 'JSONB array of dog information (supports multiple dogs)';
COMMENT ON COLUMN paid_consultations.current_diet IS 'JSONB object with current feeding information';
COMMENT ON COLUMN paid_consultations.health_info IS 'JSONB object with allergies, medications, vet visits';
COMMENT ON COLUMN paid_consultations.status IS 'Workflow: questionnaire_pending -> payment_pending -> paid -> reviewed -> scheduled -> completed -> delivered';
COMMENT ON COLUMN paid_consultations.meal_plan_url IS 'URL to meal plan PDF in Supabase Storage';
COMMENT ON COLUMN paid_consultations.ghl_contact_id IS 'GoHighLevel contact ID for CRM automation';

COMMENT ON COLUMN orders.is_consultation IS 'True if this order is for a consultation service';
COMMENT ON COLUMN orders.consultation_id IS 'Links to paid_consultations table if this is a consultation order';

-- =============================================
-- 5. Create Triggers for updated_at
-- =============================================
DROP TRIGGER IF EXISTS update_paid_consultations_updated_at ON paid_consultations;
CREATE TRIGGER update_paid_consultations_updated_at
  BEFORE UPDATE ON paid_consultations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 6. Create Consultation Product
-- =============================================
-- Insert the $395 consultation product if it doesn't exist
INSERT INTO products (
  title,
  handle,
  description,
  price,
  compare_at_price,
  category,
  tags,
  is_published,
  is_featured,
  in_stock,
  images
)
SELECT
  'Comprehensive Canine Nutrition Consultation',
  'nutrition-consultation-395',
  'Up to 2 hours with certified nutritionist Christie Willett, M.A., M.S. Includes custom meal plan, supplement protocol, meal preparation guidance, and 2 follow-up consultations. Available via Zoom, FaceTime, or in-person (Asheville, NC area).',
  395.00,
  NULL,
  'consultation',
  ARRAY['consultation', 'service', 'nutrition', 'expert'],
  true,  -- Published
  true,  -- Featured
  true,  -- Always in stock (it's a service)
  ARRAY['/images/2025/09/Canine-Nutrtion-Services.webp']
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE handle = 'nutrition-consultation-395'
);

-- =============================================
-- 7. Create Travel Fee Products (Optional Upsells)
-- =============================================
INSERT INTO products (
  title,
  handle,
  description,
  price,
  category,
  tags,
  is_published,
  in_stock
)
SELECT
  'In-Person Consultation Travel Fee - Buncombe & Madison Counties',
  'consultation-travel-buncombe-madison',
  'Travel fee for in-person consultations in Buncombe & Madison Counties',
  50.00,
  'consultation',
  ARRAY['consultation', 'service', 'travel-fee'],
  true,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE handle = 'consultation-travel-buncombe-madison'
);

INSERT INTO products (
  title,
  handle,
  description,
  price,
  category,
  tags,
  is_published,
  in_stock
)
SELECT
  'In-Person Consultation Travel Fee - Hendersonville & Yancey Counties',
  'consultation-travel-hendersonville-yancey',
  'Travel fee for in-person consultations in Hendersonville & Yancey Counties',
  75.00,
  'consultation',
  ARRAY['consultation', 'service', 'travel-fee'],
  true,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE handle = 'consultation-travel-hendersonville-yancey'
);

INSERT INTO products (
  title,
  handle,
  description,
  price,
  category,
  tags,
  is_published,
  in_stock
)
SELECT
  'In-Person Consultation Travel Fee - Macon & Swain Counties',
  'consultation-travel-macon-swain',
  'Travel fee for in-person consultations in Macon & Swain Counties',
  115.00,
  'consultation',
  ARRAY['consultation', 'service', 'travel-fee'],
  true,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE handle = 'consultation-travel-macon-swain'
);

-- =============================================
-- Success message
-- =============================================
DO $$
BEGIN
  RAISE NOTICE 'Paid consultation system tables created successfully!';
  RAISE NOTICE '   - paid_consultations table ready';
  RAISE NOTICE '   - orders table updated with consultation fields';
  RAISE NOTICE '   - Indexes and triggers configured';
  RAISE NOTICE '   - Consultation products created';
  RAISE NOTICE '   - Travel fee products created';
END $$;

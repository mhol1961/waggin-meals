-- =============================================
-- CASE STUDIES TABLE SCHEMA
-- Success stories for Waggin Meals
-- =============================================

-- Case Studies Table
CREATE TABLE IF NOT EXISTS case_studies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Dog Information
  dog_name TEXT NOT NULL,
  breed TEXT NOT NULL,
  age INTEGER NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  sex TEXT NOT NULL CHECK (sex IN ('male', 'female', 'neutered-male', 'spayed-female')),

  -- Owner Information
  owner_name TEXT NOT NULL,
  location TEXT NOT NULL,

  -- Case Details
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,

  -- Health Issues
  health_issues TEXT[] DEFAULT '{}',
  symptoms TEXT[] DEFAULT '{}',
  diagnosis TEXT,

  -- Timeline
  problem_duration TEXT,
  time_to_results TEXT,

  -- Treatment
  products_used TEXT[] DEFAULT '{}',
  services_used TEXT[] DEFAULT '{}',
  custom_plan TEXT,

  -- Results
  results_achieved TEXT[] DEFAULT '{}',
  before_weight DECIMAL(5,2),
  after_weight DECIMAL(5,2),
  before_energy TEXT,
  after_energy TEXT,
  before_metrics JSONB,
  after_metrics JSONB,

  -- Story Content
  full_story TEXT NOT NULL,
  owner_quote TEXT NOT NULL,
  christie_notes TEXT,

  -- Media
  before_photos TEXT[] DEFAULT '{}',
  after_photos TEXT[] DEFAULT '{}',
  hero_image TEXT,

  -- Categorization
  category TEXT,
  tags TEXT[] DEFAULT '{}',

  -- Publishing
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,

  -- SEO
  seo_title TEXT,
  seo_description TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON case_studies(slug);
CREATE INDEX IF NOT EXISTS idx_case_studies_published ON case_studies(published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_case_studies_featured ON case_studies(featured, published);
CREATE INDEX IF NOT EXISTS idx_case_studies_category ON case_studies(category);
CREATE INDEX IF NOT EXISTS idx_case_studies_health_issues ON case_studies USING GIN(health_issues);
CREATE INDEX IF NOT EXISTS idx_case_studies_tags ON case_studies USING GIN(tags);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_case_studies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER case_studies_updated_at
  BEFORE UPDATE ON case_studies
  FOR EACH ROW
  EXECUTE FUNCTION update_case_studies_updated_at();

-- Enable Row Level Security
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;

-- Public can read published case studies
CREATE POLICY "Public can view published case studies"
  ON case_studies FOR SELECT
  USING (published = true);

-- Admins can do everything (you'll need to set up admin roles)
-- For now, allow all operations (you should restrict this in production)
CREATE POLICY "Allow all operations for now"
  ON case_studies FOR ALL
  USING (true)
  WITH CHECK (true);

-- Grant permissions
GRANT SELECT ON case_studies TO anon, authenticated;
GRANT ALL ON case_studies TO authenticated;

-- Comments for documentation
COMMENT ON TABLE case_studies IS 'Success stories and case studies for Waggin Meals';
COMMENT ON COLUMN case_studies.dog_name IS 'Name of the dog featured in this case study';
COMMENT ON COLUMN case_studies.slug IS 'URL-friendly identifier for the case study';
COMMENT ON COLUMN case_studies.full_story IS 'Complete case study story in HTML format';
COMMENT ON COLUMN case_studies.owner_quote IS 'Testimonial quote from the pet owner';
COMMENT ON COLUMN case_studies.christie_notes IS 'Professional notes from Christie about this case';

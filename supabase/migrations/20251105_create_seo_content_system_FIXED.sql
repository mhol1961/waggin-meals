-- SEO Content Management System
-- Creates tables for condition pages, SEO keywords, and AI content generation
-- FIXED VERSION: Uses 'seo_settings' instead of 'site_settings' (which already exists for tax)

-- =====================================================
-- CONDITION PAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS condition_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Basic Info
  condition_name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,

  -- SEO Metadata
  meta_title VARCHAR(60),
  meta_description VARCHAR(160),
  primary_keyword VARCHAR(255),
  secondary_keywords TEXT[],

  -- Content Structure (JSONB for flexibility)
  content JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Automatic SEO Data
  schema_markup JSONB,
  seo_score INTEGER DEFAULT 0 CHECK (seo_score >= 0 AND seo_score <= 100),
  keyword_density JSONB DEFAULT '{}'::jsonb,
  internal_links TEXT[],

  -- Images
  featured_image VARCHAR(255),
  image_alt_tags JSONB DEFAULT '{}'::jsonb,

  -- Publishing Workflow
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published')),
  ai_generated BOOLEAN DEFAULT false,
  ai_draft JSONB,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_condition_pages_slug ON condition_pages(slug);
CREATE INDEX IF NOT EXISTS idx_condition_pages_status ON condition_pages(status);
CREATE INDEX IF NOT EXISTS idx_condition_pages_published ON condition_pages(published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_condition_pages_condition_name ON condition_pages(condition_name);

-- =====================================================
-- SEO KEYWORDS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS seo_keywords (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Keyword Data
  keyword TEXT NOT NULL,
  search_volume INTEGER,
  cpc DECIMAL(10,2),
  difficulty INTEGER CHECK (difficulty >= 0 AND difficulty <= 100),
  related_keywords TEXT[],

  -- Tracking
  target_page_id UUID REFERENCES condition_pages(id) ON DELETE SET NULL,
  current_position INTEGER,
  last_checked TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_seo_keywords_keyword ON seo_keywords(keyword);
CREATE INDEX IF NOT EXISTS idx_seo_keywords_search_volume ON seo_keywords(search_volume DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_seo_keywords_target_page ON seo_keywords(target_page_id) WHERE target_page_id IS NOT NULL;

-- =====================================================
-- POPULATE WITH CSV DATA
-- =====================================================
INSERT INTO seo_keywords (keyword, search_volume, cpc, related_keywords) VALUES
  ('fresh food for dogs with allergies', 110, 18.38, ARRAY['hypoallergenic dog food', 'allergy friendly', 'food sensitivity', 'elimination diet']),
  ('best fresh food for dogs with allergies', 320, 19.12, ARRAY['allergy relief', 'itch free dog food', 'skin health']),
  ('fresh food for dogs with pancreatitis', 70, 6.78, ARRAY['low fat dog food', 'pancreatitis diet', 'digestive enzymes', 'easily digestible']),
  ('fresh food for dogs with kidney disease', 50, 3.70, ARRAY['renal diet', 'kidney friendly dog food', 'low protein', 'phosphorus control']),
  ('fresh food for dogs with sensitive stomachs', 20, 18.63, ARRAY['digestive health', 'bland diet', 'probiotics', 'gentle on stomach']),
  ('best fresh food for dogs with sensitive stomachs', 20, 13.52, ARRAY['gut health', 'easy to digest', 'food sensitivities']),
  ('fresh food for dogs near me', 70, 14.04, ARRAY['local dog food', 'fresh delivery', 'fresh dog food asheville', 'dog food delivery']),
  ('how to make fresh food for dogs', 90, 3.97, ARRAY['homemade dog food', 'dog food recipes', 'diy dog food', 'fresh feeding']),
  ('what fresh food is good for dogs', 20, 3.90, ARRAY['healthy dog food', 'whole food', 'natural ingredients', 'human grade']),
  ('how to cook fresh food for dogs', 20, 5.68, ARRAY['preparing dog food', 'cooking for dogs', 'meal prep'])
ON CONFLICT DO NOTHING;

-- =====================================================
-- SEO SETTINGS TABLE (renamed from site_settings)
-- =====================================================
CREATE TABLE IF NOT EXISTS seo_settings (
  key VARCHAR(50) PRIMARY KEY,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO seo_settings (key, value, description) VALUES
  ('openrouter_api_key', NULL, 'OpenRouter API key for AI content generation'),
  ('ai_generation_enabled', 'true', 'Enable/disable AI content generation feature'),
  ('default_ai_model', 'anthropic/claude-sonnet-4-5', 'Default AI model to use')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- UPDATE TIMESTAMP TRIGGERS
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS update_condition_pages_updated_at ON condition_pages;
CREATE TRIGGER update_condition_pages_updated_at
    BEFORE UPDATE ON condition_pages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_seo_keywords_updated_at ON seo_keywords;
CREATE TRIGGER update_seo_keywords_updated_at
    BEFORE UPDATE ON seo_keywords
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_seo_settings_updated_at ON seo_settings;
CREATE TRIGGER update_seo_settings_updated_at
    BEFORE UPDATE ON seo_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE condition_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

-- Policies for condition_pages
DROP POLICY IF EXISTS "Public can view published condition pages" ON condition_pages;
CREATE POLICY "Public can view published condition pages"
  ON condition_pages FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "Authenticated users can manage condition pages" ON condition_pages;
CREATE POLICY "Authenticated users can manage condition pages"
  ON condition_pages FOR ALL
  USING (auth.role() = 'authenticated');

-- Policies for seo_keywords
DROP POLICY IF EXISTS "Public can view seo keywords" ON seo_keywords;
CREATE POLICY "Public can view seo keywords"
  ON seo_keywords FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage seo keywords" ON seo_keywords;
CREATE POLICY "Authenticated users can manage seo keywords"
  ON seo_keywords FOR ALL
  USING (auth.role() = 'authenticated');

-- Policies for seo_settings
DROP POLICY IF EXISTS "Only authenticated users can access seo settings" ON seo_settings;
CREATE POLICY "Only authenticated users can access seo settings"
  ON seo_settings FOR ALL
  USING (auth.role() = 'authenticated');

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================
CREATE OR REPLACE FUNCTION generate_condition_slug(condition TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN 'fresh-food-for-dogs-with-' ||
         LOWER(REGEXP_REPLACE(TRIM(condition), '[^a-zA-Z0-9]+', '-', 'g'));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION get_related_keywords(condition_name TEXT)
RETURNS TABLE(keyword TEXT, search_volume INTEGER, cpc DECIMAL, related_keywords TEXT[]) AS $$
BEGIN
  RETURN QUERY
  SELECT sk.keyword, sk.search_volume, sk.cpc, sk.related_keywords
  FROM seo_keywords sk
  WHERE sk.keyword ILIKE '%' || condition_name || '%'
  ORDER BY sk.search_volume DESC NULLS LAST
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SAMPLE DATA
-- =====================================================
INSERT INTO condition_pages (
  condition_name,
  slug,
  meta_title,
  meta_description,
  primary_keyword,
  secondary_keywords,
  content,
  status,
  ai_generated,
  seo_score
) VALUES (
  'Sample - Pancreatitis',
  'sample-fresh-food-for-dogs-with-pancreatitis',
  'Fresh Food for Dogs with Pancreatitis (SAMPLE)',
  'Sample page. Board-certified nutritionist creates custom low-fat fresh food plans for dogs with pancreatitis.',
  'fresh food for dogs with pancreatitis',
  ARRAY['low fat dog food', 'pancreatitis diet', 'digestive enzymes'],
  jsonb_build_object(
    'h1', 'Fresh Food for Dogs with Pancreatitis',
    'hero_subheading', 'Science-Based, Low-Fat Meal Plans from a Board-Certified Canine Nutritionist',
    'sections', jsonb_build_array(
      jsonb_build_object(
        'heading', 'Why Pancreatitis Requires Specialized Nutrition',
        'content', '<p>Sample content about pancreatitis nutrition requirements...</p>',
        'layout', 'full-width',
        'order', 1
      )
    ),
    'faq', jsonb_build_array(
      jsonb_build_object(
        'question', 'Can fresh food help dogs with pancreatitis?',
        'answer', 'Yes! Low-fat fresh food formulated by a nutritionist can significantly help manage pancreatitis symptoms.',
        'order', 1
      )
    ),
    'cta_placements', jsonb_build_array('hero', 'middle', 'bottom')
  ),
  'draft',
  false,
  75
) ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- GRANTS
-- =====================================================
GRANT ALL ON condition_pages TO authenticated;
GRANT ALL ON seo_keywords TO authenticated;
GRANT ALL ON seo_settings TO authenticated;

GRANT SELECT ON condition_pages TO anon;
GRANT SELECT ON seo_keywords TO anon;

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE condition_pages IS 'SEO-optimized landing pages for specific health conditions';
COMMENT ON TABLE seo_keywords IS 'Keyword research data and tracking';
COMMENT ON TABLE seo_settings IS 'SEO system configuration settings (API keys, feature flags)';

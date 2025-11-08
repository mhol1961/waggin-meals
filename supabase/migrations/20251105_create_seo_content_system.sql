-- SEO Content Management System
-- Creates tables for condition pages, SEO keywords, and AI content generation

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
  secondary_keywords TEXT[], -- Array of keywords

  -- Content Structure (JSONB for flexibility)
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Structure: {
  --   "h1": "...",
  --   "hero_subheading": "...",
  --   "sections": [{heading, content, layout, order}],
  --   "faq": [{question, answer, order}],
  --   "cta_placements": ["hero", "middle", "bottom"]
  -- }

  -- Automatic SEO Data
  schema_markup JSONB, -- Auto-generated schema
  seo_score INTEGER DEFAULT 0 CHECK (seo_score >= 0 AND seo_score <= 100),
  keyword_density JSONB DEFAULT '{}'::jsonb, -- {keyword: density%}
  internal_links TEXT[], -- URLs to related pages

  -- Images
  featured_image VARCHAR(255),
  image_alt_tags JSONB DEFAULT '{}'::jsonb, -- {url: alt_text}

  -- Publishing Workflow
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published')),
  ai_generated BOOLEAN DEFAULT false,
  ai_draft JSONB, -- Original AI output (if used)

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
  cpc DECIMAL(10,2), -- Cost per click
  difficulty INTEGER CHECK (difficulty >= 0 AND difficulty <= 100), -- 0-100 (how hard to rank)
  related_keywords TEXT[], -- LSI keywords

  -- Tracking
  target_page_id UUID REFERENCES condition_pages(id) ON DELETE SET NULL,
  current_position INTEGER, -- Google ranking position
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
-- Insert keyword data from fresh food for dogs CSV

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
-- SITE SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS site_settings (
  key VARCHAR(50) PRIMARY KEY,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (key, value, description) VALUES
  ('openrouter_api_key', NULL, 'OpenRouter API key for AI content generation (Christie provides)'),
  ('ai_generation_enabled', 'true', 'Enable/disable AI content generation feature'),
  ('default_ai_model', 'anthropic/claude-sonnet-4-5', 'Default AI model to use (claude-sonnet-4-5, claude-3.7-sonnet, gpt-4o)')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- UPDATE TIMESTAMP TRIGGER
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables
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

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
-- Enable RLS
ALTER TABLE condition_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Policies for condition_pages
-- Public can read published pages
CREATE POLICY "Public can view published condition pages"
  ON condition_pages FOR SELECT
  USING (status = 'published');

-- Authenticated users (admin) can do everything
CREATE POLICY "Authenticated users can manage condition pages"
  ON condition_pages FOR ALL
  USING (auth.role() = 'authenticated');

-- Policies for seo_keywords
-- Public read access for keyword suggestions
CREATE POLICY "Public can view seo keywords"
  ON seo_keywords FOR SELECT
  USING (true);

-- Admin full access
CREATE POLICY "Authenticated users can manage seo keywords"
  ON seo_keywords FOR ALL
  USING (auth.role() = 'authenticated');

-- Policies for site_settings
-- Only authenticated (admin) can access
CREATE POLICY "Only authenticated users can access site settings"
  ON site_settings FOR ALL
  USING (auth.role() = 'authenticated');

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to generate slug from condition name
CREATE OR REPLACE FUNCTION generate_condition_slug(condition TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN 'fresh-food-for-dogs-with-' ||
         LOWER(REGEXP_REPLACE(TRIM(condition), '[^a-zA-Z0-9]+', '-', 'g'));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get related keywords for a condition
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
-- SAMPLE DATA (for testing)
-- =====================================================

-- Insert a sample condition page (for development/testing)
-- This can be deleted once real pages are created
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
  'Sample page showing the structure. Board-certified nutritionist creates custom low-fat fresh food plans for dogs with pancreatitis.',
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
-- Grant access to authenticated users (admins)
GRANT ALL ON condition_pages TO authenticated;
GRANT ALL ON seo_keywords TO authenticated;
GRANT ALL ON site_settings TO authenticated;

-- Grant read access to anon (public) for published pages
GRANT SELECT ON condition_pages TO anon;
GRANT SELECT ON seo_keywords TO anon;

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE condition_pages IS 'SEO-optimized landing pages for specific health conditions';
COMMENT ON TABLE seo_keywords IS 'Keyword research data and tracking';
COMMENT ON TABLE site_settings IS 'System configuration settings (API keys, feature flags)';

COMMENT ON COLUMN condition_pages.content IS 'JSONB structure: {h1, hero_subheading, sections[], faq[], cta_placements[]}';
COMMENT ON COLUMN condition_pages.schema_markup IS 'Auto-generated JSON-LD schema (MedicalCondition, FAQPage, Breadcrumbs)';
COMMENT ON COLUMN condition_pages.seo_score IS 'Calculated SEO score (0-100) based on keyword density, word count, structure, etc.';
COMMENT ON COLUMN seo_keywords.difficulty IS 'Keyword difficulty score 0-100 (higher = harder to rank)';
COMMENT ON COLUMN site_settings.key IS 'Unique setting key (e.g., openrouter_api_key, ai_generation_enabled)';

-- Migration: Add Collections and Enhance Products Table
-- Date: 2025-01-28
-- Description: Adds collections table and missing product fields to support full product catalog

-- =============================================
-- PART 1: Create Collections Table
-- =============================================

CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  is_published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_collections_slug ON collections(slug);
CREATE INDEX IF NOT EXISTS idx_collections_published ON collections(is_published, display_order);

COMMENT ON TABLE collections IS 'Product collections (Fresh Food, Meal Toppers, Treats, etc.)';
COMMENT ON COLUMN collections.slug IS 'URL-friendly identifier (e.g., "fresh-food")';
COMMENT ON COLUMN collections.display_order IS 'Sort order for displaying collections';

-- =============================================
-- PART 2: Add Missing Fields to Products Table
-- =============================================

-- Add collection_id foreign key
ALTER TABLE products
ADD COLUMN IF NOT EXISTS collection_id UUID REFERENCES collections(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_products_collection ON products(collection_id);

-- Add nutritional and product detail fields
ALTER TABLE products
ADD COLUMN IF NOT EXISTS ingredients TEXT,
ADD COLUMN IF NOT EXISTS nutritional_analysis TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived'));

COMMENT ON COLUMN products.ingredients IS 'Comma-separated ingredient list';
COMMENT ON COLUMN products.nutritional_analysis IS 'Guaranteed analysis (protein %, fat %, etc.)';
COMMENT ON COLUMN products.collection_id IS 'Links product to a collection';
COMMENT ON COLUMN products.status IS 'Product status: active, draft, or archived';

-- Update existing products to have 'active' status if they are published
UPDATE products
SET status = CASE
  WHEN is_published = true THEN 'active'
  ELSE 'draft'
END
WHERE status IS NULL;

-- =============================================
-- PART 3: Insert Default Collections
-- =============================================

INSERT INTO collections (name, slug, description, image, display_order)
VALUES
  (
    'Fresh Food Collection',
    'fresh-food',
    'Our signature farm-fresh meals made with human-grade ingredients, superfoods, and essential nutrients. Every meal is carefully crafted for complete and balanced nutrition.',
    '/images/products/ChickenandSweetPotatoBowl.jpg',
    1
  ),
  (
    'Meal Toppers & Add-ons',
    'meal-toppers',
    'Boost your dog''s meals with our superfood toppers, bone broths, and stews. Perfect for picky eaters or adding extra nutrition and flavor.',
    '/images/products/BeefTopper72.jpg',
    2
  ),
  (
    'Healthy Treats',
    'treats',
    'Nutritious treats made with superfoods and limited ingredients. Perfect for training, rewards, or just showing your pup some love.',
    '/images/products/meatballs.jpg',
    3
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();

-- =============================================
-- PART 4: Add Useful Views
-- =============================================

-- View: Products with collection information
CREATE OR REPLACE VIEW products_with_collections AS
SELECT
  p.*,
  c.name AS collection_name,
  c.slug AS collection_slug
FROM products p
LEFT JOIN collections c ON p.collection_id = c.id;

COMMENT ON VIEW products_with_collections IS 'Products joined with their collection details';

-- =============================================
-- PART 5: Update Triggers
-- =============================================

-- Trigger to auto-update updated_at on collections
CREATE OR REPLACE FUNCTION update_collections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_collections_updated_at
BEFORE UPDATE ON collections
FOR EACH ROW
EXECUTE FUNCTION update_collections_updated_at();

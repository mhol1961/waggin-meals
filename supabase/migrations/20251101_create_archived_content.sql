-- Create archived_content table for soft-delete functionality
-- This table stores snapshots of archived content that can be restored later

CREATE TABLE IF NOT EXISTS archived_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type VARCHAR(50) NOT NULL, -- 'blog_post', 'product', 'video', 'testimonial', 'case_study', 'event'
  content_id UUID NOT NULL, -- Original ID of the content
  content_data JSONB NOT NULL, -- Full snapshot of the content
  archived_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  archived_by VARCHAR(255), -- Admin username who archived it
  reason TEXT, -- Optional reason for archiving
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_archived_content_type ON archived_content(content_type);
CREATE INDEX IF NOT EXISTS idx_archived_content_id ON archived_content(content_id);
CREATE INDEX IF NOT EXISTS idx_archived_archived_at ON archived_content(archived_at);

-- Add archived flag to existing tables for soft-delete pattern
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE;
ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE;

-- Create indexes on archived flags for filtering
CREATE INDEX IF NOT EXISTS idx_blog_posts_archived ON blog_posts(archived);
CREATE INDEX IF NOT EXISTS idx_products_archived ON products(archived);
CREATE INDEX IF NOT EXISTS idx_videos_archived ON videos(archived);
CREATE INDEX IF NOT EXISTS idx_testimonials_archived ON testimonials(archived);
CREATE INDEX IF NOT EXISTS idx_case_studies_archived ON case_studies(archived);
CREATE INDEX IF NOT EXISTS idx_events_archived ON events(archived);

-- Add updated_at trigger for archived_content table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_archived_content_updated_at BEFORE UPDATE ON archived_content
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE archived_content IS 'Stores snapshots of archived content for soft-delete functionality';
COMMENT ON COLUMN archived_content.content_type IS 'Type of content: blog_post, product, video, testimonial, case_study, event';
COMMENT ON COLUMN archived_content.content_id IS 'Original ID of the archived content';
COMMENT ON COLUMN archived_content.content_data IS 'Full JSONB snapshot of the content at time of archiving';
COMMENT ON COLUMN archived_content.archived_by IS 'Username of the admin who archived this content';
COMMENT ON COLUMN archived_content.reason IS 'Optional reason for archiving this content';

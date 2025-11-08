--
-- GHL Tracking Columns Migration
-- Date: November 7, 2025
--
-- This migration adds GoHighLevel tracking columns to all customer-facing tables.
-- These columns enable us to track GHL sync status, contact IDs, tags, and errors.
--
-- Tables Updated:
-- - newsletter_subscribers
-- - customers
-- - consultation_requests
-- - paid_consultations
-- - subscriptions
--

-- Add GHL tracking columns to newsletter_subscribers
ALTER TABLE newsletter_subscribers
ADD COLUMN IF NOT EXISTS ghl_contact_id TEXT,
ADD COLUMN IF NOT EXISTS ghl_tags TEXT[],
ADD COLUMN IF NOT EXISTS ghl_last_sync_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS ghl_sync_error TEXT;

-- Create index on ghl_contact_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_ghl_contact_id ON newsletter_subscribers(ghl_contact_id);

-- Add comment
COMMENT ON COLUMN newsletter_subscribers.ghl_contact_id IS 'GoHighLevel contact ID for this subscriber';
COMMENT ON COLUMN newsletter_subscribers.ghl_tags IS 'Array of GHL tags applied to this contact (accumulates over time)';
COMMENT ON COLUMN newsletter_subscribers.ghl_last_sync_at IS 'Timestamp of last successful or failed GHL sync attempt';
COMMENT ON COLUMN newsletter_subscribers.ghl_sync_error IS 'Last error message if GHL sync failed, NULL if successful';

-- Add GHL tracking columns to customers
ALTER TABLE customers
ADD COLUMN IF NOT EXISTS ghl_contact_id TEXT,
ADD COLUMN IF NOT EXISTS ghl_tags TEXT[],
ADD COLUMN IF NOT EXISTS ghl_last_sync_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS ghl_sync_error TEXT;

CREATE INDEX IF NOT EXISTS idx_customers_ghl_contact_id ON customers(ghl_contact_id);

COMMENT ON COLUMN customers.ghl_contact_id IS 'GoHighLevel contact ID for this customer';
COMMENT ON COLUMN customers.ghl_tags IS 'Array of GHL tags (customer, first-order, repeat-customer, etc.)';
COMMENT ON COLUMN customers.ghl_last_sync_at IS 'Timestamp of last GHL sync attempt';
COMMENT ON COLUMN customers.ghl_sync_error IS 'Last GHL sync error, NULL if successful';

-- Add GHL tracking columns to consultation_requests (if not already present)
-- Note: consultation_requests may already have ghl_contact_id from earlier work
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='consultation_requests' AND column_name='ghl_tags') THEN
    ALTER TABLE consultation_requests ADD COLUMN ghl_tags TEXT[];
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='consultation_requests' AND column_name='ghl_last_sync_at') THEN
    ALTER TABLE consultation_requests ADD COLUMN ghl_last_sync_at TIMESTAMPTZ;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='consultation_requests' AND column_name='ghl_sync_error') THEN
    ALTER TABLE consultation_requests ADD COLUMN ghl_sync_error TEXT;
  END IF;
END $$;

COMMENT ON COLUMN consultation_requests.ghl_tags IS 'Array of GHL tags (free-consultation, contact-expert-form, etc.)';
COMMENT ON COLUMN consultation_requests.ghl_last_sync_at IS 'Timestamp of last GHL sync attempt';
COMMENT ON COLUMN consultation_requests.ghl_sync_error IS 'Last GHL sync error, NULL if successful';

-- Add GHL tracking columns to paid_consultations (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'paid_consultations') THEN
    ALTER TABLE paid_consultations
    ADD COLUMN IF NOT EXISTS ghl_contact_id TEXT,
    ADD COLUMN IF NOT EXISTS ghl_tags TEXT[],
    ADD COLUMN IF NOT EXISTS ghl_last_sync_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS ghl_sync_error TEXT;

    CREATE INDEX IF NOT EXISTS idx_paid_consultations_ghl_contact_id ON paid_consultations(ghl_contact_id);

    COMMENT ON COLUMN paid_consultations.ghl_contact_id IS 'GoHighLevel contact ID';
    COMMENT ON COLUMN paid_consultations.ghl_tags IS 'Array of GHL tags (paid-consultation-395, consultation-paid, etc.)';
    COMMENT ON COLUMN paid_consultations.ghl_last_sync_at IS 'Timestamp of last GHL sync attempt';
    COMMENT ON COLUMN paid_consultations.ghl_sync_error IS 'Last GHL sync error, NULL if successful';
  END IF;
END $$;

-- Add GHL tracking columns to subscriptions
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS ghl_contact_id TEXT,
ADD COLUMN IF NOT EXISTS ghl_tags TEXT[],
ADD COLUMN IF NOT EXISTS ghl_last_sync_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS ghl_sync_error TEXT;

CREATE INDEX IF NOT EXISTS idx_subscriptions_ghl_contact_id ON subscriptions(ghl_contact_id);

COMMENT ON COLUMN subscriptions.ghl_contact_id IS 'GoHighLevel contact ID for subscription owner';
COMMENT ON COLUMN subscriptions.ghl_tags IS 'Array of GHL tags (subscriber, subscription-active, subscription-customized, etc.)';
COMMENT ON COLUMN subscriptions.ghl_last_sync_at IS 'Timestamp of last GHL sync attempt';
COMMENT ON COLUMN subscriptions.ghl_sync_error IS 'Last GHL sync error, NULL if successful';

-- Grant appropriate permissions (if using RLS)
-- These columns should be readable by authenticated users for their own records
-- and writable by service role only

-- Migration complete
-- All tables now have GHL tracking columns for comprehensive contact lifecycle management

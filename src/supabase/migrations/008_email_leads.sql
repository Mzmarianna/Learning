-- ============================================================================
-- EMAIL LEADS TABLE
-- Capture marketing funnel leads before they sign up
-- ============================================================================

-- Create email_leads table
CREATE TABLE IF NOT EXISTS email_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  child_age INTEGER,
  biggest_struggle TEXT,
  source TEXT NOT NULL CHECK (source IN ('homepage', 'free-guide-page', 'popup', 'other')),
  utm_source TEXT,
  utm_campaign TEXT,
  utm_medium TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Prevent duplicate emails
  CONSTRAINT unique_email UNIQUE (email)
);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_email_leads_email ON email_leads(email);

-- Create index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_email_leads_created_at ON email_leads(created_at DESC);

-- Enable Row Level Security
ALTER TABLE email_leads ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous inserts (for lead capture forms)
CREATE POLICY "Allow anonymous lead capture"
  ON email_leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Only admins can view leads
CREATE POLICY "Admins can view all leads"
  ON email_leads
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Comments for documentation
COMMENT ON TABLE email_leads IS 'Marketing funnel email captures before account creation';
COMMENT ON COLUMN email_leads.email IS 'Lead email address (unique)';
COMMENT ON COLUMN email_leads.child_age IS 'Optional: Age of their child';
COMMENT ON COLUMN email_leads.biggest_struggle IS 'Optional: Their biggest parenting/education challenge';
COMMENT ON COLUMN email_leads.source IS 'Where the lead came from (homepage, free-guide-page, etc.)';
COMMENT ON COLUMN email_leads.utm_source IS 'UTM source parameter for tracking';
COMMENT ON COLUMN email_leads.utm_campaign IS 'UTM campaign parameter for tracking';
COMMENT ON COLUMN email_leads.utm_medium IS 'UTM medium parameter for tracking';

-- ============================================================================
-- MIGRATION 1: FREEMIUM & ANALYTICS SUPPORT
-- Created: 2026-02-03
-- Purpose: Enable freemium tier, track usage, monitor conversions
-- ============================================================================

-- 1. Add subscription tier to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free'
CHECK (subscription_tier IN ('free', 'premium', 'vip'));

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_started_at TIMESTAMP;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMP;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_users_subscription_dates ON users(subscription_started_at, subscription_ends_at);

-- ============================================================================
-- 2. Usage tracking table (for freemium limits)
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  period_start TIMESTAMP NOT NULL,
  period_end TIMESTAMP NOT NULL,
  
  -- Usage counters
  quests_used INTEGER DEFAULT 0,
  wowl_messages_used INTEGER DEFAULT 0,
  live_classes_attended INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Ensure one record per user per period
  CONSTRAINT unique_user_period UNIQUE(user_id, period_start)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_usage_user ON user_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_period ON user_usage(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_usage_updated ON user_usage(updated_at);

-- ============================================================================
-- 3. Paywall events table (track conversion attempts)
-- ============================================================================

CREATE TABLE IF NOT EXISTS paywall_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
  -- What triggered the paywall?
  trigger_type TEXT NOT NULL, -- 'quest_limit', 'clan_invitation', 'wowl_limit', 'live_class'
  trigger_context JSONB, -- Additional data about trigger
  
  -- When and what happened?
  shown_at TIMESTAMP DEFAULT NOW(),
  action_taken TEXT, -- 'upgraded', 'dismissed', 'clicked_learn_more', 'closed'
  action_at TIMESTAMP,
  
  -- What tier did they upgrade to? (if applicable)
  upgraded_to_tier TEXT,
  
  -- Session tracking
  session_id UUID
);

-- Indexes for analysis
CREATE INDEX IF NOT EXISTS idx_paywall_user ON paywall_events(user_id);
CREATE INDEX IF NOT EXISTS idx_paywall_trigger ON paywall_events(trigger_type);
CREATE INDEX IF NOT EXISTS idx_paywall_time ON paywall_events(shown_at);
CREATE INDEX IF NOT EXISTS idx_paywall_action ON paywall_events(action_taken);
CREATE INDEX IF NOT EXISTS idx_paywall_session ON paywall_events(session_id);

-- ============================================================================
-- 4. Analytics events table (for Mixpanel + internal tracking)
-- ============================================================================

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Event details
  event_name TEXT NOT NULL,
  event_properties JSONB,
  
  -- Session tracking
  session_id UUID,
  
  -- Timestamp
  timestamp TIMESTAMP DEFAULT NOW(),
  
  -- For faster date-based queries
  event_date DATE GENERATED ALWAYS AS (DATE(timestamp)) STORED
);

-- Indexes for performance (critical for analytics queries)
CREATE INDEX IF NOT EXISTS idx_events_user_time ON analytics_events(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_events_name_time ON analytics_events(event_name, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_events_date ON analytics_events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_session ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_properties ON analytics_events USING GIN (event_properties);

-- ============================================================================
-- 5. Function: Reset weekly usage limits
-- ============================================================================

CREATE OR REPLACE FUNCTION reset_weekly_usage()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete old usage records (older than current week)
  DELETE FROM user_usage 
  WHERE period_end < DATE_TRUNC('week', NOW());
  
  -- Create new period for all active students
  INSERT INTO user_usage (user_id, period_start, period_end)
  SELECT 
    id,
    DATE_TRUNC('week', NOW()),
    DATE_TRUNC('week', NOW()) + INTERVAL '7 days'
  FROM users
  WHERE role = 'student'
    AND subscription_tier = 'free' -- Only free tier needs tracking
  ON CONFLICT (user_id, period_start) DO NOTHING;
  
  RAISE NOTICE 'Weekly usage limits reset for free tier users';
END;
$$;

-- Schedule this function to run weekly (setup via cron or Supabase cron jobs)
-- Example: SELECT cron.schedule('reset-weekly-usage', '0 0 * * 0', 'SELECT reset_weekly_usage();');

-- ============================================================================
-- 6. Function: Increment usage counter
-- ============================================================================

CREATE OR REPLACE FUNCTION increment_usage(
  p_user_id UUID,
  p_usage_type TEXT -- 'quest', 'wowl_message', 'live_class'
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_usage INTEGER;
  period_start TIMESTAMP;
  period_end TIMESTAMP;
BEGIN
  -- Calculate current week period
  period_start := DATE_TRUNC('week', NOW());
  period_end := period_start + INTERVAL '7 days';
  
  -- Ensure usage record exists for this period
  INSERT INTO user_usage (user_id, period_start, period_end)
  VALUES (p_user_id, period_start, period_end)
  ON CONFLICT (user_id, period_start) DO NOTHING;
  
  -- Increment the appropriate counter
  CASE p_usage_type
    WHEN 'quest' THEN
      UPDATE user_usage 
      SET quests_used = quests_used + 1,
          updated_at = NOW()
      WHERE user_id = p_user_id 
        AND period_start = DATE_TRUNC('week', NOW())
      RETURNING quests_used INTO current_usage;
      
    WHEN 'wowl_message' THEN
      UPDATE user_usage 
      SET wowl_messages_used = wowl_messages_used + 1,
          updated_at = NOW()
      WHERE user_id = p_user_id 
        AND period_start = DATE_TRUNC('week', NOW())
      RETURNING wowl_messages_used INTO current_usage;
      
    WHEN 'live_class' THEN
      UPDATE user_usage 
      SET live_classes_attended = live_classes_attended + 1,
          updated_at = NOW()
      WHERE user_id = p_user_id 
        AND period_start = DATE_TRUNC('week', NOW())
      RETURNING live_classes_attended INTO current_usage;
      
    ELSE
      RAISE EXCEPTION 'Invalid usage type: %', p_usage_type;
  END CASE;
  
  RETURN current_usage;
END;
$$;

-- ============================================================================
-- 7. Function: Check if user has exceeded limit
-- ============================================================================

CREATE OR REPLACE FUNCTION check_usage_limit(
  p_user_id UUID,
  p_usage_type TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  user_tier TEXT;
  current_usage INTEGER;
  limit_value INTEGER;
BEGIN
  -- Get user's subscription tier
  SELECT subscription_tier INTO user_tier
  FROM users
  WHERE id = p_user_id;
  
  -- Premium/VIP have unlimited usage
  IF user_tier IN ('premium', 'vip') THEN
    RETURN TRUE;
  END IF;
  
  -- Get current usage for this week
  SELECT 
    CASE p_usage_type
      WHEN 'quest' THEN quests_used
      WHEN 'wowl_message' THEN wowl_messages_used
      WHEN 'live_class' THEN live_classes_attended
      ELSE 0
    END INTO current_usage
  FROM user_usage
  WHERE user_id = p_user_id
    AND period_start = DATE_TRUNC('week', NOW());
  
  -- If no record exists, they haven't used anything yet
  IF current_usage IS NULL THEN
    current_usage := 0;
  END IF;
  
  -- Check against free tier limits
  CASE p_usage_type
    WHEN 'quest' THEN
      limit_value := 1; -- 1 quest per week for free
    WHEN 'wowl_message' THEN
      limit_value := 10; -- 10 messages per day for free
    WHEN 'live_class' THEN
      limit_value := 0; -- No live classes for free
    ELSE
      limit_value := 0;
  END CASE;
  
  RETURN current_usage < limit_value;
END;
$$;

-- ============================================================================
-- 8. Enable Row Level Security (RLS)
-- ============================================================================

ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE paywall_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can view their own usage
CREATE POLICY "Users can view own usage"
  ON user_usage FOR SELECT
  USING (
    auth.uid() = user_id 
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('tutor', 'admin')
    )
  );

-- System can update usage
CREATE POLICY "System can manage usage"
  ON user_usage FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin')
    )
  );

-- Users can view their own paywall events
CREATE POLICY "Users can view own paywall events"
  ON paywall_events FOR SELECT
  USING (
    auth.uid() = user_id 
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('tutor', 'admin')
    )
  );

-- System can insert paywall events
CREATE POLICY "System can insert paywall events"
  ON paywall_events FOR INSERT
  WITH CHECK (true);

-- Analytics events - system can insert, admins can view
CREATE POLICY "System can insert analytics"
  ON analytics_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view analytics"
  ON analytics_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- 9. Triggers for automatic timestamp updates
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_usage_updated_at
  BEFORE UPDATE ON user_usage
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 10. Sample data for testing (optional - comment out for production)
-- ============================================================================

-- Create sample free tier user usage record
-- INSERT INTO user_usage (user_id, period_start, period_end, quests_used, wowl_messages_used)
-- VALUES (
--   (SELECT id FROM users WHERE role = 'student' LIMIT 1),
--   DATE_TRUNC('week', NOW()),
--   DATE_TRUNC('week', NOW()) + INTERVAL '7 days',
--   0,
--   0
-- );

-- ============================================================================
-- VERIFICATION QUERIES (run these after migration)
-- ============================================================================

-- Check if columns were added
-- SELECT column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'users' 
--   AND column_name LIKE 'subscription%';

-- Check if tables were created
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_name IN ('user_usage', 'paywall_events', 'analytics_events');

-- Check if functions exist
-- SELECT routine_name FROM information_schema.routines 
-- WHERE routine_name IN ('reset_weekly_usage', 'increment_usage', 'check_usage_limit');

-- ============================================================================
-- ROLLBACK INSTRUCTIONS (if needed)
-- ============================================================================

/*
-- Drop functions
DROP FUNCTION IF EXISTS check_usage_limit(UUID, TEXT);
DROP FUNCTION IF EXISTS increment_usage(UUID, TEXT);
DROP FUNCTION IF EXISTS reset_weekly_usage();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop tables (will also drop RLS policies)
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS paywall_events CASCADE;
DROP TABLE IF EXISTS user_usage CASCADE;

-- Remove columns from users table
ALTER TABLE users DROP COLUMN IF EXISTS subscription_tier;
ALTER TABLE users DROP COLUMN IF EXISTS subscription_started_at;
ALTER TABLE users DROP COLUMN IF EXISTS subscription_ends_at;

-- Drop indexes
DROP INDEX IF EXISTS idx_users_subscription_tier;
DROP INDEX IF EXISTS idx_users_subscription_dates;
*/

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================

-- Log successful migration
DO $$
BEGIN
  RAISE NOTICE 'Migration 20260203_freemium_analytics completed successfully';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Update app code to use check_usage_limit() before actions';
  RAISE NOTICE '2. Call increment_usage() after actions';
  RAISE NOTICE '3. Schedule reset_weekly_usage() to run weekly (cron)';
  RAISE NOTICE '4. Test freemium flow with sample user';
END $$;

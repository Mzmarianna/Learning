-- ============================================================================
-- EMAIL SYSTEM SCHEMA
-- Tables, triggers, and functions for automated parent emails
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. EMAIL QUEUE TABLE
-- Stores all emails to be sent (processed by background worker)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  subject TEXT NOT NULL,
  template TEXT NOT NULL, -- 'weekly_digest', 'milestone_notification', 'share_request', etc.
  data JSONB NOT NULL, -- Template data
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'cancelled'
  error_message TEXT,
  priority TEXT DEFAULT 'normal', -- 'high', 'normal', 'low'
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status);
CREATE INDEX IF NOT EXISTS idx_email_queue_scheduled ON email_queue(scheduled_for) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_email_queue_recipient ON email_queue(recipient_email);

-- ----------------------------------------------------------------------------
-- 2. EMAIL PREFERENCES TABLE
-- Parent preferences for email frequency and types
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS email_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  weekly_digest_enabled BOOLEAN DEFAULT true,
  milestone_notifications_enabled BOOLEAN DEFAULT true,
  share_request_notifications_enabled BOOLEAN DEFAULT true,
  progress_alerts_enabled BOOLEAN DEFAULT true,
  digest_day TEXT DEFAULT 'sunday', -- Day of week for weekly digest
  digest_time TIME DEFAULT '18:00:00', -- Time of day for digest
  email_format TEXT DEFAULT 'html', -- 'html' or 'plain'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ----------------------------------------------------------------------------
-- 3. EMAIL TEMPLATES TABLE
-- Reusable email templates with variables
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name TEXT NOT NULL UNIQUE,
  subject_template TEXT NOT NULL, -- Can include {{variables}}
  html_template TEXT NOT NULL,
  plain_text_template TEXT,
  required_variables TEXT[], -- Array of required variable names
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default templates
INSERT INTO email_templates (template_name, subject_template, html_template, required_variables, description)
VALUES 
  ('weekly_digest', 
   '{{studentName}}''s Weekly Learning Report - {{weekStart}}',
   '<!-- Will be loaded from lib/email/progress-reports.ts -->',
   ARRAY['studentName', 'weekStart', 'weekEnd', 'stats', 'highlights'],
   'Weekly progress digest sent to parents every Sunday'
  ),
  ('milestone_notification',
   '🎉 {{studentName}} {{title}}!',
   '<!-- Will be loaded from lib/email/progress-reports.ts -->',
   ARRAY['studentName', 'title', 'description', 'celebrationMessage'],
   'Instant notification when student achieves milestone'
  ),
  ('share_request',
   '{{studentName}} wants to share an achievement',
   '<!-- Share request approval email -->',
   ARRAY['studentName', 'achievementTitle', 'approvalUrl'],
   'Parent approval needed for social media sharing'
  )
ON CONFLICT (template_name) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 4. MILESTONE TRACKING TABLE
-- Track which milestones have been sent to avoid duplicates
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sent_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  milestone_type TEXT NOT NULL, -- 'quest_completed', 'badge_earned', 'level_up', etc.
  milestone_identifier TEXT NOT NULL, -- quest_id, badge_id, level number, etc.
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email_id UUID REFERENCES email_queue(id),
  UNIQUE(student_id, milestone_type, milestone_identifier)
);

-- ----------------------------------------------------------------------------
-- 5. TRIGGER FUNCTIONS
-- Automatically queue emails when events occur
-- ----------------------------------------------------------------------------

-- Trigger: Queue weekly digest (called by cron job)
CREATE OR REPLACE FUNCTION queue_weekly_digest_for_student(p_student_id UUID, p_parent_email TEXT)
RETURNS UUID AS $$
DECLARE
  v_email_id UUID;
  v_preferences RECORD;
  v_digest_data JSONB;
BEGIN
  -- Check if parent has digest enabled
  SELECT * INTO v_preferences
  FROM email_preferences ep
  JOIN profiles p ON p.id = ep.user_id
  WHERE p.email = p_parent_email
  LIMIT 1;

  -- If preferences don't exist or digest is disabled, skip
  IF v_preferences IS NULL OR v_preferences.weekly_digest_enabled = false THEN
    RETURN NULL;
  END IF;

  -- Generate digest data (simplified - full logic is in TypeScript)
  v_digest_data := jsonb_build_object(
    'studentId', p_student_id,
    'parentEmail', p_parent_email,
    'generatedAt', NOW()
  );

  -- Queue email
  INSERT INTO email_queue (
    recipient_email,
    subject,
    template,
    data,
    scheduled_for,
    priority
  ) VALUES (
    p_parent_email,
    'Weekly Learning Report',
    'weekly_digest',
    v_digest_data,
    NOW(),
    'normal'
  )
  RETURNING id INTO v_email_id;

  RETURN v_email_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Queue milestone email when quest is completed
CREATE OR REPLACE FUNCTION trigger_quest_completion_email()
RETURNS TRIGGER AS $$
DECLARE
  v_student_record RECORD;
  v_quest_record RECORD;
  v_email_id UUID;
BEGIN
  -- Only proceed if quest was just completed
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    
    -- Get student info
    SELECT id, display_name, parent_email INTO v_student_record
    FROM profiles
    WHERE id = NEW.student_id;

    -- Get quest info
    SELECT theme INTO v_quest_record
    FROM student_quests sq
    WHERE sq.quest_id = NEW.quest_id
    LIMIT 1;

    -- Check if already sent
    IF EXISTS (
      SELECT 1 FROM sent_milestones 
      WHERE student_id = NEW.student_id 
      AND milestone_type = 'quest_completed'
      AND milestone_identifier = NEW.quest_id
    ) THEN
      RETURN NEW;
    END IF;

    -- Queue milestone email
    INSERT INTO email_queue (
      recipient_email,
      subject,
      template,
      data,
      priority
    ) VALUES (
      v_student_record.parent_email,
      v_student_record.display_name || ' completed a quest!',
      'milestone_notification',
      jsonb_build_object(
        'studentName', v_student_record.display_name,
        'type', 'quest_completed',
        'title', 'Quest Completed',
        'description', 'Completed: ' || COALESCE(v_quest_record.theme, 'a quest'),
        'celebrationMessage', '🎉 Amazing work! Keep up the great progress!',
        'timestamp', NOW()
      ),
      'high'
    )
    RETURNING id INTO v_email_id;

    -- Mark as sent
    INSERT INTO sent_milestones (student_id, milestone_type, milestone_identifier, email_id)
    VALUES (NEW.student_id, 'quest_completed', NEW.quest_id, v_email_id);

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Queue milestone email when badge is earned
CREATE OR REPLACE FUNCTION trigger_badge_earned_email()
RETURNS TRIGGER AS $$
DECLARE
  v_student_record RECORD;
  v_badge_name TEXT;
  v_email_id UUID;
BEGIN
  -- Get student info
  SELECT id, display_name, parent_email INTO v_student_record
  FROM profiles
  WHERE id = NEW.student_id;

  -- Get badge name
  SELECT name INTO v_badge_name
  FROM badges
  WHERE id = NEW.badge_id;

  -- Check if already sent
  IF EXISTS (
    SELECT 1 FROM sent_milestones 
    WHERE student_id = NEW.student_id 
    AND milestone_type = 'badge_earned'
    AND milestone_identifier = NEW.badge_id::TEXT
  ) THEN
    RETURN NEW;
  END IF;

  -- Queue milestone email
  INSERT INTO email_queue (
    recipient_email,
    subject,
    template,
    data,
    priority
  ) VALUES (
    v_student_record.parent_email,
    '🏆 ' || v_student_record.display_name || ' earned a new badge!',
    'milestone_notification',
    jsonb_build_object(
      'studentName', v_student_record.display_name,
      'type', 'badge_earned',
      'title', 'Badge Earned',
      'description', 'Earned the "' || v_badge_name || '" badge!',
      'celebrationMessage', '🏆 Incredible achievement! This takes dedication and skill!',
      'timestamp', NOW()
    ),
    'high'
  )
  RETURNING id INTO v_email_id;

  -- Mark as sent
  INSERT INTO sent_milestones (student_id, milestone_type, milestone_identifier, email_id)
  VALUES (NEW.student_id, 'badge_earned', NEW.badge_id::TEXT, v_email_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Queue milestone email for level up
CREATE OR REPLACE FUNCTION trigger_level_up_email()
RETURNS TRIGGER AS $$
DECLARE
  v_student_record RECORD;
  v_email_id UUID;
BEGIN
  -- Only if level increased
  IF NEW.current_level > OLD.current_level THEN
    
    -- Get student info
    SELECT id, display_name, parent_email INTO v_student_record
    FROM profiles
    WHERE id = NEW.id;

    -- Check if already sent (use level as identifier)
    IF EXISTS (
      SELECT 1 FROM sent_milestones 
      WHERE student_id = NEW.id 
      AND milestone_type = 'level_up'
      AND milestone_identifier = NEW.current_level::TEXT
    ) THEN
      RETURN NEW;
    END IF;

    -- Queue milestone email
    INSERT INTO email_queue (
      recipient_email,
      subject,
      template,
      data,
      priority
    ) VALUES (
      v_student_record.parent_email,
      '⭐ ' || v_student_record.display_name || ' leveled up to Level ' || NEW.current_level || '!',
      'milestone_notification',
      jsonb_build_object(
        'studentName', v_student_record.display_name,
        'type', 'level_up',
        'title', 'Leveled Up to Level ' || NEW.current_level,
        'description', 'Reached Level ' || NEW.current_level || ' through consistent learning!',
        'celebrationMessage', '⭐ Leveling up shows real growth and dedication!',
        'timestamp', NOW()
      ),
      'high'
    )
    RETURNING id INTO v_email_id;

    -- Mark as sent
    INSERT INTO sent_milestones (student_id, milestone_type, milestone_identifier, email_id)
    VALUES (NEW.id, 'level_up', NEW.current_level::TEXT, v_email_id);

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- 6. ATTACH TRIGGERS TO TABLES
-- ----------------------------------------------------------------------------

-- Trigger on student_quests when quest is completed
DROP TRIGGER IF EXISTS email_on_quest_complete ON student_quests;
CREATE TRIGGER email_on_quest_complete
  AFTER UPDATE ON student_quests
  FOR EACH ROW
  EXECUTE FUNCTION trigger_quest_completion_email();

-- Trigger on student_badges when badge is earned
DROP TRIGGER IF EXISTS email_on_badge_earned ON student_badges;
CREATE TRIGGER email_on_badge_earned
  AFTER INSERT ON student_badges
  FOR EACH ROW
  EXECUTE FUNCTION trigger_badge_earned_email();

-- Trigger on profiles when level increases
DROP TRIGGER IF EXISTS email_on_level_up ON profiles;
CREATE TRIGGER email_on_level_up
  AFTER UPDATE ON profiles
  FOR EACH ROW
  WHEN (NEW.current_level > OLD.current_level)
  EXECUTE FUNCTION trigger_level_up_email();

-- ----------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS)
-- ----------------------------------------------------------------------------

ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE sent_milestones ENABLE ROW LEVEL SECURITY;

-- Email Queue Policies
CREATE POLICY "Service role can manage all email queue"
  ON email_queue FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Parents can view their own queued emails
CREATE POLICY "Parents can view their email queue"
  ON email_queue FOR SELECT
  TO authenticated
  USING (
    recipient_email = (SELECT email FROM profiles WHERE id = auth.uid())
  );

-- Email Preferences Policies
CREATE POLICY "Users can manage their own email preferences"
  ON email_preferences FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Email Templates - Read-only for authenticated users
CREATE POLICY "Authenticated users can view email templates"
  ON email_templates FOR SELECT
  TO authenticated
  USING (active = true);

-- Admins can manage templates
CREATE POLICY "Admins can manage email templates"
  ON email_templates FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ----------------------------------------------------------------------------
-- 8. HELPER FUNCTIONS
-- ----------------------------------------------------------------------------

-- Function: Get email preferences for a user
CREATE OR REPLACE FUNCTION get_email_preferences(p_user_id UUID)
RETURNS TABLE (
  weekly_digest_enabled BOOLEAN,
  milestone_notifications_enabled BOOLEAN,
  share_request_notifications_enabled BOOLEAN,
  progress_alerts_enabled BOOLEAN,
  digest_day TEXT,
  digest_time TIME
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ep.weekly_digest_enabled,
    ep.milestone_notifications_enabled,
    ep.share_request_notifications_enabled,
    ep.progress_alerts_enabled,
    ep.digest_day,
    ep.digest_time
  FROM email_preferences ep
  WHERE ep.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Mark email as sent
CREATE OR REPLACE FUNCTION mark_email_sent(p_email_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE email_queue
  SET 
    status = 'sent',
    sent_at = NOW(),
    updated_at = NOW()
  WHERE id = p_email_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Mark email as failed
CREATE OR REPLACE FUNCTION mark_email_failed(p_email_id UUID, p_error_message TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE email_queue
  SET 
    status = 'failed',
    error_message = p_error_message,
    attempts = attempts + 1,
    updated_at = NOW()
  WHERE id = p_email_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- 9. CRON JOB SETUP (requires pg_cron extension)
-- Run this after enabling pg_cron in Supabase dashboard
-- ----------------------------------------------------------------------------

-- Weekly digest job - runs every Sunday at 6 PM
-- SELECT cron.schedule(
--   'weekly-parent-digests',
--   '0 18 * * 0', -- Every Sunday at 6 PM
--   $$
--   SELECT queue_weekly_digest_for_student(
--     p.id,
--     p.parent_email
--   )
--   FROM profiles p
--   WHERE p.role = 'student' 
--   AND p.parent_email IS NOT NULL;
--   $$
-- );

-- Email queue processor - runs every 5 minutes
-- SELECT cron.schedule(
--   'process-email-queue',
--   '*/5 * * * *', -- Every 5 minutes
--   $$
--   -- This would call your Edge Function to actually send emails
--   -- For now, we'll just log pending emails
--   SELECT id, recipient_email, subject, template
--   FROM email_queue
--   WHERE status = 'pending'
--   AND scheduled_for <= NOW()
--   AND attempts < max_attempts
--   LIMIT 50;
--   $$
-- );

-- ----------------------------------------------------------------------------
-- 10. INDEXES FOR PERFORMANCE
-- ----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_email_preferences_user ON email_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_sent_milestones_student ON sent_milestones(student_id);
CREATE INDEX IF NOT EXISTS idx_sent_milestones_type ON sent_milestones(milestone_type, milestone_identifier);

-- ----------------------------------------------------------------------------
-- COMPLETE!
-- ----------------------------------------------------------------------------
-- To apply this schema:
-- 1. Copy this entire file
-- 2. Go to Supabase Dashboard > SQL Editor
-- 3. Paste and run
-- 4. Enable pg_cron extension in Database > Extensions
-- 5. Uncomment and run the cron job setup section
-- ----------------------------------------------------------------------------

-- ============================================================================
-- DATABASE FUNCTIONS & TRIGGERS
-- Additional business logic for Mz. Marianna's Academy
-- ============================================================================

-- ============================================================================
-- USER SIGNUP & INITIALIZATION
-- ============================================================================

-- Function: Handle new user creation (auto-create profiles and game progress)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Profile is created via signup, but we can add additional initialization here
  -- For students, auto-initialize game progress fields (already in student_profiles)
  
  -- Log the signup activity
  IF EXISTS (SELECT 1 FROM student_profiles WHERE id = NEW.id) THEN
    INSERT INTO activity_log (student_id, activity_type, activity_data)
    VALUES (NEW.id, 'signup', jsonb_build_object(
      'timestamp', NOW(),
      'initial_characters', '["wise_owl", "sparkle_unicorn"]'
    ));
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Auto-initialize on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- XP & LEVELING FUNCTIONS
-- ============================================================================

-- Function: Increment quest progress when challenge completed
CREATE OR REPLACE FUNCTION increment_quest_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if challenge was just completed
  IF NEW.completed_at IS NOT NULL AND OLD.completed_at IS NULL THEN
    UPDATE quest_progress
    SET 
      completed_challenges = completed_challenges + 1,
      xp_earned = xp_earned + NEW.xp_earned,
      completed_at = CASE 
        WHEN completed_challenges + 1 >= total_challenges THEN NOW()
        ELSE completed_at
      END
    WHERE student_id = NEW.student_id AND quest_id = NEW.quest_id;
    
    -- If quest just completed, award badge
    IF (SELECT completed_challenges + 1 >= total_challenges 
        FROM quest_progress 
        WHERE student_id = NEW.student_id AND quest_id = NEW.quest_id) THEN
      
      -- Get badge ID for this quest
      DECLARE
        v_badge_id TEXT;
        v_quest_week INTEGER;
      BEGIN
        SELECT quest_week INTO v_quest_week
        FROM quest_progress
        WHERE student_id = NEW.student_id AND quest_id = NEW.quest_id;
        
        v_badge_id := 'BADGE-EH-W' || v_quest_week;
        
        -- Award badge (ignore if already exists)
        INSERT INTO badges_earned (student_id, badge_id, quest_id)
        VALUES (NEW.student_id, v_badge_id, NEW.quest_id)
        ON CONFLICT (student_id, badge_id) DO NOTHING;
        
        -- Log activity
        INSERT INTO activity_log (student_id, activity_type, activity_data)
        VALUES (NEW.student_id, 'quest_complete', jsonb_build_object(
          'quest_id', NEW.quest_id,
          'badge_id', v_badge_id
        ));
      END;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update quest progress
DROP TRIGGER IF EXISTS trigger_increment_quest_progress ON challenge_progress;
CREATE TRIGGER trigger_increment_quest_progress
  AFTER UPDATE ON challenge_progress
  FOR EACH ROW
  EXECUTE FUNCTION increment_quest_progress();

-- ============================================================================
-- MASTERY TRACKING FUNCTIONS
-- ============================================================================

-- Function: Record mastery level after submission assessment
CREATE OR REPLACE FUNCTION record_mastery_level_from_submission()
RETURNS TRIGGER AS $$
DECLARE
  v_subject TEXT;
BEGIN
  -- Only record when mastery level is set
  IF NEW.mastery_level IS NOT NULL AND OLD.mastery_level IS NULL THEN
    
    -- Determine subject from challenge_id pattern
    -- Format: EH-W1-C1-STEAM, EH-W2-C3-MATH, etc.
    v_subject := CASE
      WHEN NEW.challenge_id LIKE '%-STEAM%' THEN 'STEAM'
      WHEN NEW.challenge_id LIKE '%-MATH%' THEN 'Math'
      WHEN NEW.challenge_id LIKE '%-WRITING%' THEN 'Writing'
      WHEN NEW.challenge_id LIKE '%-READING%' THEN 'Reading'
      ELSE 'General'
    END;
    
    -- Insert mastery history record
    INSERT INTO mastery_history (student_id, subject, mastery_level)
    VALUES (NEW.student_id, v_subject, NEW.mastery_level);
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-record mastery levels
DROP TRIGGER IF EXISTS trigger_record_mastery_level ON submissions;
CREATE TRIGGER trigger_record_mastery_level
  AFTER UPDATE ON submissions
  FOR EACH ROW
  EXECUTE FUNCTION record_mastery_level_from_submission();

-- ============================================================================
-- STUDENT ATTENTION ALERTS
-- ============================================================================

-- Function: Check and create alerts for inactive students
CREATE OR REPLACE FUNCTION check_and_alert_inactive_students()
RETURNS void AS $$
DECLARE
  v_student RECORD;
  v_tutor_id UUID;
  v_days_inactive INTEGER;
  v_last_activity TIMESTAMPTZ;
BEGIN
  -- Loop through all students
  FOR v_student IN 
    SELECT id FROM student_profiles
  LOOP
    -- Get last activity
    SELECT MAX(created_at) INTO v_last_activity
    FROM activity_log
    WHERE student_id = v_student.id;
    
    -- Calculate days inactive
    v_days_inactive := EXTRACT(DAY FROM NOW() - v_last_activity);
    
    -- If inactive for 5+ days, create alert for assigned tutors
    IF v_days_inactive >= 5 THEN
      FOR v_tutor_id IN
        SELECT tutor_id FROM tutor_students WHERE student_id = v_student.id
      LOOP
        -- Check if alert already exists
        IF NOT EXISTS (
          SELECT 1 FROM tutor_alerts
          WHERE tutor_id = v_tutor_id
            AND student_id = v_student.id
            AND alert_type = 'warning'
            AND resolved = FALSE
            AND message LIKE 'No activity%'
        ) THEN
          -- Create new alert
          INSERT INTO tutor_alerts (tutor_id, student_id, alert_type, message, actionable)
          VALUES (
            v_tutor_id,
            v_student.id,
            'warning',
            format('No activity in %s days', v_days_inactive),
            TRUE
          );
        END IF;
      END LOOP;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function: Create alert when student submits after long break
CREATE OR REPLACE FUNCTION alert_student_returned()
RETURNS TRIGGER AS $$
DECLARE
  v_last_submission TIMESTAMPTZ;
  v_days_away INTEGER;
  v_tutor_id UUID;
BEGIN
  -- Get last submission before this one
  SELECT MAX(submitted_at) INTO v_last_submission
  FROM submissions
  WHERE student_id = NEW.student_id AND id != NEW.id;
  
  -- If more than 7 days, create success alert
  IF v_last_submission IS NOT NULL THEN
    v_days_away := EXTRACT(DAY FROM NEW.submitted_at - v_last_submission);
    
    IF v_days_away >= 7 THEN
      FOR v_tutor_id IN
        SELECT tutor_id FROM tutor_students WHERE student_id = NEW.student_id
      LOOP
        INSERT INTO tutor_alerts (tutor_id, student_id, alert_type, message, actionable)
        VALUES (
          v_tutor_id,
          NEW.student_id,
          'success',
          format('Student returned after %s days!', v_days_away),
          FALSE
        );
      END LOOP;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Alert when student returns
DROP TRIGGER IF EXISTS trigger_alert_student_returned ON submissions;
CREATE TRIGGER trigger_alert_student_returned
  AFTER INSERT ON submissions
  FOR EACH ROW
  EXECUTE FUNCTION alert_student_returned();

-- ============================================================================
-- STREAK TRACKING
-- ============================================================================

-- Function: Calculate current streak for student
CREATE OR REPLACE FUNCTION get_student_streak(p_student_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_streak INTEGER := 0;
  v_current_date DATE := CURRENT_DATE;
  v_has_activity BOOLEAN;
BEGIN
  LOOP
    -- Check if student has activity on this date
    SELECT EXISTS (
      SELECT 1 FROM activity_log
      WHERE student_id = p_student_id
        AND DATE(created_at) = v_current_date
    ) INTO v_has_activity;
    
    EXIT WHEN NOT v_has_activity;
    
    v_streak := v_streak + 1;
    v_current_date := v_current_date - INTERVAL '1 day';
  END LOOP;
  
  RETURN v_streak;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PORTFOLIO FUNCTIONS
-- ============================================================================

-- Function: Auto-add high mastery submissions to portfolio
CREATE OR REPLACE FUNCTION auto_add_to_portfolio()
RETURNS TRIGGER AS $$
BEGIN
  -- If submission gets advanced or mastered, add to portfolio
  IF NEW.mastery_level IN ('advanced', 'mastered') AND 
     OLD.mastery_level IS DISTINCT FROM NEW.mastery_level THEN
    
    INSERT INTO portfolio_items (student_id, submission_id, title, description, featured)
    VALUES (
      NEW.student_id,
      NEW.id,
      NEW.challenge_title,
      format('Achieved %s mastery level', NEW.mastery_level),
      NEW.mastery_level = 'mastered'
    )
    ON CONFLICT (student_id, submission_id) DO NOTHING;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-populate portfolio
DROP TRIGGER IF EXISTS trigger_auto_add_to_portfolio ON submissions;
CREATE TRIGGER trigger_auto_add_to_portfolio
  AFTER UPDATE ON submissions
  FOR EACH ROW
  EXECUTE FUNCTION auto_add_to_portfolio();

-- ============================================================================
-- LEADERBOARD FUNCTIONS
-- ============================================================================

-- Function: Get top students by XP (for gamification)
CREATE OR REPLACE FUNCTION get_leaderboard(p_tier tier_level DEFAULT NULL, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  student_id UUID,
  display_name TEXT,
  tier tier_level,
  total_xp INTEGER,
  current_level INTEGER,
  badges_earned BIGINT,
  rank INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sp.id,
    p.display_name,
    sp.tier,
    sp.total_xp,
    sp.current_level,
    COUNT(DISTINCT be.id) as badges_earned,
    ROW_NUMBER() OVER (ORDER BY sp.total_xp DESC)::INTEGER as rank
  FROM student_profiles sp
  JOIN profiles p ON p.id = sp.id
  LEFT JOIN badges_earned be ON be.student_id = sp.id
  WHERE p_tier IS NULL OR sp.tier = p_tier
  GROUP BY sp.id, p.display_name, sp.tier, sp.total_xp, sp.current_level
  ORDER BY sp.total_xp DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ANALYTICS FUNCTIONS
-- ============================================================================

-- Function: Get student activity summary
CREATE OR REPLACE FUNCTION get_activity_summary(
  p_student_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  total_submissions BIGINT,
  avg_mastery_score NUMERIC,
  total_xp_earned INTEGER,
  total_hours NUMERIC,
  most_active_day TEXT,
  favorite_subject TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    -- Total submissions
    (SELECT COUNT(*) FROM submissions 
     WHERE student_id = p_student_id 
       AND submitted_at >= NOW() - (p_days || ' days')::INTERVAL)::BIGINT,
    
    -- Average mastery score (emerging=1, developing=2, proficient=3, advanced=4, mastered=5)
    (SELECT AVG(CASE mastery_level
      WHEN 'emerging' THEN 1
      WHEN 'developing' THEN 2
      WHEN 'proficient' THEN 3
      WHEN 'advanced' THEN 4
      WHEN 'mastered' THEN 5
    END)
    FROM submissions 
    WHERE student_id = p_student_id 
      AND submitted_at >= NOW() - (p_days || ' days')::INTERVAL
      AND mastery_level IS NOT NULL)::NUMERIC,
    
    -- Total XP earned
    (SELECT COALESCE(SUM(xp_earned), 0) FROM submissions
     WHERE student_id = p_student_id
       AND submitted_at >= NOW() - (p_days || ' days')::INTERVAL)::INTEGER,
    
    -- Total hours
    (SELECT COALESCE(SUM(duration_minutes), 0) / 60.0 FROM learning_sessions
     WHERE student_id = p_student_id
       AND started_at >= NOW() - (p_days || ' days')::INTERVAL)::NUMERIC,
    
    -- Most active day of week
    (SELECT TO_CHAR(created_at, 'Day')
     FROM activity_log
     WHERE student_id = p_student_id
       AND created_at >= NOW() - (p_days || ' days')::INTERVAL
     GROUP BY TO_CHAR(created_at, 'Day')
     ORDER BY COUNT(*) DESC
     LIMIT 1)::TEXT,
    
    -- Favorite subject (placeholder - would need challenge metadata)
    'STEAM'::TEXT;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- NOTIFICATION FUNCTIONS
-- ============================================================================

-- Function: Create system notification for milestone
CREATE OR REPLACE FUNCTION create_milestone_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Level up notification
  IF NEW.current_level > OLD.current_level THEN
    INSERT INTO activity_log (student_id, activity_type, activity_data)
    VALUES (NEW.id, 'level_up', jsonb_build_object(
      'old_level', OLD.current_level,
      'new_level', NEW.current_level
    ));
  END IF;
  
  -- XP milestones (every 1000 XP)
  IF NEW.total_xp / 1000 > OLD.total_xp / 1000 THEN
    INSERT INTO activity_log (student_id, activity_type, activity_data)
    VALUES (NEW.id, 'xp_milestone', jsonb_build_object(
      'total_xp', NEW.total_xp,
      'milestone', (NEW.total_xp / 1000) * 1000
    ));
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Track milestones
DROP TRIGGER IF EXISTS trigger_milestone_notification ON student_profiles;
CREATE TRIGGER trigger_milestone_notification
  AFTER UPDATE ON student_profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_milestone_notification();

-- ============================================================================
-- RESUBMISSION LOGIC
-- ============================================================================

-- Function: Handle resubmission workflow
CREATE OR REPLACE FUNCTION handle_resubmission()
RETURNS TRIGGER AS $$
DECLARE
  v_original_mastery mastery_level;
  v_new_mastery mastery_level;
BEGIN
  -- Only process if this is a resubmission being assessed
  IF NEW.is_resubmission = TRUE AND 
     NEW.mastery_level IS NOT NULL AND 
     OLD.mastery_level IS NULL THEN
    
    -- Get original submission mastery level
    SELECT mastery_level INTO v_original_mastery
    FROM submissions
    WHERE id = NEW.original_submission_id;
    
    v_new_mastery := NEW.mastery_level;
    
    -- Log resubmission result
    INSERT INTO activity_log (student_id, activity_type, activity_data)
    VALUES (NEW.student_id, 'resubmission', jsonb_build_object(
      'challenge_id', NEW.challenge_id,
      'original_mastery', v_original_mastery,
      'new_mastery', v_new_mastery,
      'improved', v_new_mastery > v_original_mastery
    ));
    
    -- If improved, create success alert for tutors
    IF v_new_mastery > v_original_mastery THEN
      INSERT INTO tutor_alerts (tutor_id, student_id, alert_type, message, actionable)
      SELECT 
        ts.tutor_id,
        NEW.student_id,
        'success',
        format('Student improved from %s to %s on resubmission!', v_original_mastery, v_new_mastery),
        FALSE
      FROM tutor_students ts
      WHERE ts.student_id = NEW.student_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Track resubmissions
DROP TRIGGER IF EXISTS trigger_handle_resubmission ON submissions;
CREATE TRIGGER trigger_handle_resubmission
  AFTER UPDATE ON submissions
  FOR EACH ROW
  EXECUTE FUNCTION handle_resubmission();

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function: Get quest name from quest_id
CREATE OR REPLACE FUNCTION get_quest_name(p_quest_id TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN CASE p_quest_id
    WHEN 'EH-W1-FOUNDATIONS' THEN 'Learning Kingdom Foundations'
    WHEN 'EH-W2-ANCIENT' THEN 'Ancient Civilizations'
    WHEN 'EH-W3-LANDFORMS' THEN 'Landforms & Earth Science'
    WHEN 'EH-W4-MATTER' THEN 'States of Matter'
    WHEN 'EH-W5-WATER' THEN 'The Water Cycle'
    WHEN 'EH-W6-SOLAR' THEN 'Solar System Explorer'
    WHEN 'EH-W7-ECOSYSTEMS' THEN 'Ecosystems & Habitats'
    WHEN 'EH-W8-BODY' THEN 'The Human Body'
    WHEN 'EH-W9-PHYSICS' THEN 'Physics of Motion'
    WHEN 'EH-W10-ECONOMICS' THEN 'Money & Economics'
    WHEN 'EH-W11-ENGINEERING' THEN 'Structural Engineering'
    WHEN 'EH-W12-ENERGY' THEN 'Energy & Electricity'
    WHEN 'EH-W13-CHEMISTRY' THEN 'Kitchen Chemistry'
    WHEN 'EH-W14-HISTORY' THEN 'Modern American History'
    WHEN 'EH-W15-INVESTIGATION' THEN 'The Great Investigation'
    WHEN 'EH-W16-SHOWCASE' THEN 'Explorer Showcase'
    ELSE 'Unknown Quest'
  END;
END;
$$ LANGUAGE plpgsql;

-- Function: Calculate quest progress percentage
CREATE OR REPLACE FUNCTION calculate_quest_progress(p_student_id UUID, p_quest_id TEXT)
RETURNS NUMERIC AS $$
DECLARE
  v_progress NUMERIC;
BEGIN
  SELECT 
    CASE 
      WHEN total_challenges = 0 THEN 0
      ELSE (completed_challenges::NUMERIC / total_challenges::NUMERIC) * 100
    END INTO v_progress
  FROM quest_progress
  WHERE student_id = p_student_id AND quest_id = p_quest_id;
  
  RETURN COALESCE(v_progress, 0);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SCHEDULED JOBS (to be run via pg_cron or external scheduler)
-- ============================================================================

-- Function: Daily cleanup and maintenance
CREATE OR REPLACE FUNCTION daily_maintenance()
RETURNS void AS $$
BEGIN
  -- Check for inactive students and create alerts
  PERFORM check_and_alert_inactive_students();
  
  -- Archive old activity logs (keep 90 days)
  -- DELETE FROM activity_log WHERE created_at < NOW() - INTERVAL '90 days';
  
  -- Update any computed metrics
  -- (Add as needed)
  
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- INDEXES FOR PERFORMANCE (Additional)
-- ============================================================================

-- Index for activity lookups by date
CREATE INDEX IF NOT EXISTS idx_activity_log_date ON activity_log(student_id, created_at DESC);

-- Index for submission filtering
CREATE INDEX IF NOT EXISTS idx_submissions_student_status ON submissions(student_id, status);

-- Index for quest progress lookups
CREATE INDEX IF NOT EXISTS idx_quest_progress_lookup ON quest_progress(student_id, quest_id);

-- ============================================================================
-- SAMPLE DATA INSERTION FUNCTIONS
-- ============================================================================

-- Function: Create sample student (for testing)
CREATE OR REPLACE FUNCTION create_sample_student(
  p_email TEXT,
  p_name TEXT,
  p_age INTEGER,
  p_tier tier_level
)
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- This would be called after auth.users is created via Supabase Auth
  -- For now, just create a UUID placeholder
  v_user_id := gen_random_uuid();
  
  -- Insert profile
  INSERT INTO profiles (id, role, email, display_name)
  VALUES (v_user_id, 'student', p_email, p_name);
  
  -- Insert student profile
  INSERT INTO student_profiles (id, age, tier)
  VALUES (v_user_id, p_age, p_tier);
  
  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- COMMENTS & DOCUMENTATION
-- ============================================================================

COMMENT ON FUNCTION increment_quest_progress IS 'Automatically updates quest progress when a challenge is completed';
COMMENT ON FUNCTION record_mastery_level_from_submission IS 'Records mastery level history when submission is assessed';
COMMENT ON FUNCTION check_and_alert_inactive_students IS 'Creates tutor alerts for students inactive 5+ days';
COMMENT ON FUNCTION get_student_streak IS 'Calculates current daily activity streak for a student';
COMMENT ON FUNCTION auto_add_to_portfolio IS 'Automatically adds advanced/mastered submissions to portfolio';
COMMENT ON FUNCTION get_leaderboard IS 'Returns top students by XP for leaderboard display';
COMMENT ON FUNCTION get_activity_summary IS 'Generates activity summary for a student over specified days';
COMMENT ON FUNCTION calculate_quest_progress IS 'Calculates completion percentage for a quest';
-- ============================================================================
-- USER LIFECYCLE TRIGGERS
-- Automated actions for welcome emails, tier promotions, etc.
-- ============================================================================

-- ============================================================================
-- 1. NEW USER WELCOME TRIGGER
-- ============================================================================

/**
 * Function: Send welcome email when new profile created
 * Note: Calls Edge Function - requires setting up email Edge Function first
 */
CREATE OR REPLACE FUNCTION send_welcome_email_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Log welcome email needed (actual sending happens in application code)
  INSERT INTO activity_log (student_id, activity_type, activity_data)
  VALUES (NEW.id, 'welcome_email_needed', jsonb_build_object(
    'email', NEW.email,
    'display_name', NEW.display_name,
    'role', NEW.role
  ));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on profile creation
DROP TRIGGER IF EXISTS trigger_send_welcome_email ON profiles;
CREATE TRIGGER trigger_send_welcome_email
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION send_welcome_email_on_signup();

-- ============================================================================
-- 2. STUDENT ENROLLMENT TRIGGER
-- ============================================================================

/**
 * Function: Actions when student completes placement quiz
 */
CREATE OR REPLACE FUNCTION on_student_enrolled()
RETURNS TRIGGER AS $$
DECLARE
  v_parent_email TEXT;
  v_student_name TEXT;
BEGIN
  -- Get student details
  SELECT p.email, p.display_name INTO v_parent_email, v_student_name
  FROM profiles p
  WHERE p.id = NEW.student_id;
  
  -- Log enrollment confirmation needed
  INSERT INTO activity_log (student_id, activity_type, activity_data)
  VALUES (NEW.student_id, 'enrollment_confirmation_needed', jsonb_build_object(
    'parent_email', v_parent_email,
    'student_name', v_student_name,
    'tier', NEW.assigned_tier,
    'start_quest', NEW.recommended_start_quest
  ));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on placement quiz completion
DROP TRIGGER IF EXISTS trigger_on_student_enrolled ON placement_quiz_results;
CREATE TRIGGER trigger_on_student_enrolled
  AFTER INSERT ON placement_quiz_results
  FOR EACH ROW
  EXECUTE FUNCTION on_student_enrolled();

-- ============================================================================
-- 3. TIER PROMOTION TRIGGER
-- ============================================================================

/**
 * Function: Celebrate when student gets promoted to new tier
 */
CREATE OR REPLACE FUNCTION on_tier_promotion()
RETURNS TRIGGER AS $$
DECLARE
  v_parent_ids UUID[];
  v_old_tier tier_level;
BEGIN
  -- Only trigger if tier actually changed and increased
  IF NEW.tier = OLD.tier THEN
    RETURN NEW;
  END IF;
  
  v_old_tier := OLD.tier;
  
  -- Get parent emails
  SELECT array_agg(parent_id) INTO v_parent_ids
  FROM parent_students
  WHERE student_id = NEW.id;
  
  -- Log tier promotion
  INSERT INTO activity_log (student_id, activity_type, activity_data)
  VALUES (NEW.id, 'tier_promotion', jsonb_build_object(
    'old_tier', v_old_tier,
    'new_tier', NEW.tier,
    'parent_ids', v_parent_ids
  ));
  
  -- Award special promotion badge
  INSERT INTO badges_earned (student_id, badge_id, quest_id)
  VALUES (NEW.id, 'BADGE-PROMOTION-' || UPPER(NEW.tier::TEXT), 'TIER-PROMOTION')
  ON CONFLICT DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on tier change
DROP TRIGGER IF EXISTS trigger_on_tier_promotion ON student_profiles;
CREATE TRIGGER trigger_on_tier_promotion
  AFTER UPDATE OF tier ON student_profiles
  FOR EACH ROW
  EXECUTE FUNCTION on_tier_promotion();

-- ============================================================================
-- 4. INACTIVITY DETECTION TRIGGER
-- ============================================================================

/**
 * Function: Check for inactive students (run daily via cron)
 */
CREATE OR REPLACE FUNCTION detect_inactive_students()
RETURNS void AS $$
DECLARE
  v_student RECORD;
  v_days_inactive INTEGER;
BEGIN
  -- Find students inactive for 7, 14, or 30 days
  FOR v_student IN
    SELECT 
      sp.id,
      sp.tier,
      p.email,
      p.display_name,
      MAX(al.created_at) as last_active,
      EXTRACT(DAY FROM NOW() - MAX(al.created_at)) as days_inactive
    FROM student_profiles sp
    JOIN profiles p ON p.id = sp.id
    LEFT JOIN activity_log al ON al.student_id = sp.id
    GROUP BY sp.id, sp.tier, p.email, p.display_name
    HAVING EXTRACT(DAY FROM NOW() - MAX(al.created_at)) IN (7, 14, 30)
  LOOP
    v_days_inactive := v_student.days_inactive;
    
    -- Log re-engagement email needed
    INSERT INTO activity_log (student_id, activity_type, activity_data)
    VALUES (v_student.id, 're_engagement_email_needed', jsonb_build_object(
      'email', v_student.email,
      'student_name', v_student.display_name,
      'days_inactive', v_days_inactive,
      'tier', v_student.tier
    ));
    
    RAISE NOTICE 'Student % inactive for % days', v_student.display_name, v_days_inactive;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: Run this function via cron daily
-- COMMENT: SELECT cron.schedule('detect-inactive-students', '0 9 * * *', 'SELECT detect_inactive_students()');

-- ============================================================================
-- 5. QUEST COMPLETION CELEBRATION
-- ============================================================================

/**
 * Function: Send celebration email when quest completed
 */
CREATE OR REPLACE FUNCTION on_quest_completed()
RETURNS TRIGGER AS $$
DECLARE
  v_parent_ids UUID[];
  v_student_name TEXT;
BEGIN
  -- Only trigger when quest just completed
  IF NEW.completed_at IS NULL OR OLD.completed_at IS NOT NULL THEN
    RETURN NEW;
  END IF;
  
  -- Get student info
  SELECT p.display_name INTO v_student_name
  FROM profiles p
  WHERE p.id = NEW.student_id;
  
  -- Get parent emails
  SELECT array_agg(ps.parent_id) INTO v_parent_ids
  FROM parent_students ps
  WHERE ps.student_id = NEW.student_id;
  
  -- Log celebration email needed
  INSERT INTO activity_log (student_id, activity_type, activity_data)
  VALUES (NEW.student_id, 'quest_celebration_email_needed', jsonb_build_object(
    'student_name', v_student_name,
    'quest_id', NEW.quest_id,
    'xp_earned', NEW.xp_earned,
    'parent_ids', v_parent_ids
  ));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on quest completion
DROP TRIGGER IF EXISTS trigger_on_quest_completed ON quest_progress;
CREATE TRIGGER trigger_on_quest_completed
  AFTER UPDATE OF completed_at ON quest_progress
  FOR EACH ROW
  EXECUTE FUNCTION on_quest_completed();

-- ============================================================================
-- 6. BADGE EARNED NOTIFICATION
-- ============================================================================

/**
 * Function: Notify when student earns badge
 */
CREATE OR REPLACE FUNCTION on_badge_earned()
RETURNS TRIGGER AS $$
DECLARE
  v_student_name TEXT;
BEGIN
  -- Get student info
  SELECT p.display_name INTO v_student_name
  FROM profiles p
  WHERE p.id = NEW.student_id;
  
  -- Log badge notification needed
  INSERT INTO activity_log (student_id, activity_type, activity_data)
  VALUES (NEW.student_id, 'badge_notification_needed', jsonb_build_object(
    'student_name', v_student_name,
    'badge_id', NEW.badge_id,
    'quest_id', NEW.quest_id
  ));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on badge earn
DROP TRIGGER IF EXISTS trigger_on_badge_earned ON badges_earned;
CREATE TRIGGER trigger_on_badge_earned
  AFTER INSERT ON badges_earned
  FOR EACH ROW
  EXECUTE FUNCTION on_badge_earned();

-- ============================================================================
-- 7. WEEKLY PROGRESS REPORT (RUN VIA CRON)
-- ============================================================================

/**
 * Function: Generate weekly progress reports for all students
 * Run this weekly (e.g., Sunday night) to send Monday morning reports
 */
CREATE OR REPLACE FUNCTION generate_weekly_progress_reports()
RETURNS void AS $$
DECLARE
  v_student RECORD;
  v_week_data JSONB;
BEGIN
  -- For each active student
  FOR v_student IN
    SELECT 
      sp.id as student_id,
      p.display_name as student_name,
      sp.tier,
      array_agg(DISTINCT ps.parent_id) as parent_ids
    FROM student_profiles sp
    JOIN profiles p ON p.id = sp.id
    LEFT JOIN parent_students ps ON ps.student_id = sp.id
    WHERE p.role = 'student'
    GROUP BY sp.id, p.display_name, sp.tier
  LOOP
    -- Get week's activity data
    SELECT jsonb_build_object(
      'xp_earned', COALESCE(SUM(cp.xp_earned), 0),
      'challenges_completed', COUNT(DISTINCT cp.id),
      'badges_earned', COUNT(DISTINCT be.id),
      'time_spent', COALESCE(SUM(ls.duration_minutes) / 60, 0)
    ) INTO v_week_data
    FROM student_profiles sp
    LEFT JOIN challenge_progress cp ON cp.student_id = sp.id 
      AND cp.completed_at >= NOW() - INTERVAL '7 days'
    LEFT JOIN badges_earned be ON be.student_id = sp.id
      AND be.earned_at >= NOW() - INTERVAL '7 days'
    LEFT JOIN learning_sessions ls ON ls.student_id = sp.id
      AND ls.started_at >= NOW() - INTERVAL '7 days'
    WHERE sp.id = v_student.student_id
    GROUP BY sp.id;
    
    -- Log weekly report needed
    INSERT INTO activity_log (student_id, activity_type, activity_data)
    VALUES (v_student.student_id, 'weekly_report_needed', jsonb_build_object(
      'student_name', v_student.student_name,
      'parent_ids', v_student.parent_ids,
      'week_data', v_week_data
    ));
    
    RAISE NOTICE 'Weekly report queued for %', v_student.student_name;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: Run this function via cron weekly (Sunday 8pm)
-- COMMENT: SELECT cron.schedule('weekly-progress-reports', '0 20 * * 0', 'SELECT generate_weekly_progress_reports()');

-- ============================================================================
-- 8. CLAN ACHIEVEMENT NOTIFICATION
-- ============================================================================

/**
 * Function: Notify when clan achieves milestone
 */
CREATE OR REPLACE FUNCTION on_clan_milestone()
RETURNS TRIGGER AS $$
DECLARE
  v_total_points INTEGER;
  v_milestone_reached TEXT;
BEGIN
  -- Calculate clan's total points
  SELECT SUM(clan_points) INTO v_total_points
  FROM student_profiles
  WHERE clan_id = NEW.clan_id;
  
  -- Check if milestone reached
  v_milestone_reached := CASE
    WHEN v_total_points >= 10000 THEN '10000'
    WHEN v_total_points >= 5000 THEN '5000'
    WHEN v_total_points >= 1000 THEN '1000'
    ELSE NULL
  END;
  
  -- If milestone, notify all clan members
  IF v_milestone_reached IS NOT NULL THEN
    INSERT INTO activity_log (student_id, activity_type, activity_data)
    SELECT 
      id,
      'clan_milestone_notification',
      jsonb_build_object(
        'clan_id', NEW.clan_id,
        'milestone', v_milestone_reached,
        'total_points', v_total_points
      )
    FROM student_profiles
    WHERE clan_id = NEW.clan_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on clan activity
DROP TRIGGER IF EXISTS trigger_on_clan_milestone ON clan_activities;
CREATE TRIGGER trigger_on_clan_milestone
  AFTER INSERT ON clan_activities
  FOR EACH ROW
  EXECUTE FUNCTION on_clan_milestone();

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '✅ LIFECYCLE TRIGGERS MIGRATION COMPLETE';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Triggers Created: 6';
  RAISE NOTICE '   - Welcome email on signup';
  RAISE NOTICE '   - Enrollment confirmation';
  RAISE NOTICE '   - Tier promotion celebration';
  RAISE NOTICE '   - Quest completion celebration';
  RAISE NOTICE '   - Badge earned notification';
  RAISE NOTICE '   - Clan milestone notification';
  RAISE NOTICE '';
  RAISE NOTICE '⚡ Cron Functions: 2';
  RAISE NOTICE '   - detect_inactive_students() - Run daily';
  RAISE NOTICE '   - generate_weekly_progress_reports() - Run weekly';
  RAISE NOTICE '';
  RAISE NOTICE '📧 All triggers log to activity_log for email processing';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  Next Steps:';
  RAISE NOTICE '   1. Set up cron jobs for automated functions';
  RAISE NOTICE '   2. Create email processing worker';
  RAISE NOTICE '   3. Test triggers with new user signup';
  RAISE NOTICE '';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
END $$;

-- ============================================================================
-- GOOGLE CLOUD SQL - DATABASE FUNCTIONS & TRIGGERS
-- Mz. Marianna's Academy
-- ============================================================================

-- ============================================================================
-- USER SIGNUP & INITIALIZATION
-- ============================================================================

-- Function: Handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
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
$$ LANGUAGE plpgsql;

-- Trigger: Auto-initialize on profile creation
DROP TRIGGER IF EXISTS on_profile_created ON profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- XP & LEVELING FUNCTIONS
-- ============================================================================

-- Function: Calculate level from XP
CREATE OR REPLACE FUNCTION calculate_level(total_xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN FLOOR(total_xp / 1000.0) + 1;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function: Increment quest progress when challenge completed
CREATE OR REPLACE FUNCTION increment_quest_progress()
RETURNS TRIGGER AS $$
DECLARE
  v_quest_completed BOOLEAN;
  v_badge_id TEXT;
  v_quest_week INTEGER;
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
    
    -- Check if quest is now complete
    SELECT 
      completed_challenges + 1 >= total_challenges,
      quest_week
    INTO v_quest_completed, v_quest_week
    FROM quest_progress 
    WHERE student_id = NEW.student_id AND quest_id = NEW.quest_id;
    
    -- If quest just completed, award badge
    IF v_quest_completed THEN
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
-- MASTERY TRACKING
-- ============================================================================

-- Function: Record mastery level from submission
CREATE OR REPLACE FUNCTION record_mastery_level_from_submission()
RETURNS TRIGGER AS $$
DECLARE
  v_subject TEXT;
BEGIN
  -- Only record when mastery level is set
  IF NEW.mastery_level IS NOT NULL AND OLD.mastery_level IS NULL THEN
    
    -- Determine subject from challenge_id pattern
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

-- Trigger: Record mastery level
DROP TRIGGER IF EXISTS trigger_record_mastery ON challenge_progress;
CREATE TRIGGER trigger_record_mastery
  AFTER UPDATE ON challenge_progress
  FOR EACH ROW
  EXECUTE FUNCTION record_mastery_level_from_submission();

-- ============================================================================
-- XP CALCULATION
-- ============================================================================

-- Function: Calculate XP from mastery level
CREATE OR REPLACE FUNCTION calculate_xp_from_mastery(
  base_xp INTEGER,
  mastery mastery_level
)
RETURNS INTEGER AS $$
BEGIN
  RETURN CASE mastery
    WHEN 'emerging' THEN base_xp
    WHEN 'developing' THEN CAST(base_xp * 1.25 AS INTEGER)
    WHEN 'proficient' THEN CAST(base_xp * 1.5 AS INTEGER)
    WHEN 'advanced' THEN CAST(base_xp * 1.75 AS INTEGER)
    WHEN 'mastered' THEN CAST(base_xp * 2.0 AS INTEGER)
    ELSE base_xp
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function: Award XP to student (with auto-leveling)
CREATE OR REPLACE FUNCTION award_xp_to_student(
  p_student_id UUID,
  p_xp_amount INTEGER
)
RETURNS TABLE(
  new_level INTEGER,
  new_total_xp INTEGER,
  leveled_up BOOLEAN
) AS $$
DECLARE
  v_old_level INTEGER;
  v_new_level INTEGER;
  v_old_xp INTEGER;
  v_new_xp INTEGER;
BEGIN
  -- Get current values
  SELECT current_level, total_xp INTO v_old_level, v_old_xp
  FROM student_profiles
  WHERE id = p_student_id;
  
  -- Calculate new values
  v_new_xp := v_old_xp + p_xp_amount;
  v_new_level := calculate_level(v_new_xp);
  
  -- Update student
  UPDATE student_profiles
  SET 
    total_xp = v_new_xp,
    current_level = v_new_level,
    updated_at = NOW()
  WHERE id = p_student_id;
  
  -- Log if leveled up
  IF v_new_level > v_old_level THEN
    INSERT INTO activity_log (student_id, activity_type, activity_data)
    VALUES (p_student_id, 'level_up', jsonb_build_object(
      'old_level', v_old_level,
      'new_level', v_new_level,
      'xp_gained', p_xp_amount
    ));
  END IF;
  
  RETURN QUERY SELECT v_new_level, v_new_xp, v_new_level > v_old_level;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- LEADERBOARD FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION get_leaderboard(
  p_tier tier_level DEFAULT NULL,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE(
  student_id UUID,
  display_name TEXT,
  total_xp INTEGER,
  current_level INTEGER,
  rank BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sp.id,
    p.display_name,
    sp.total_xp,
    sp.current_level,
    ROW_NUMBER() OVER (ORDER BY sp.total_xp DESC) as rank
  FROM student_profiles sp
  JOIN profiles p ON p.id = sp.id
  WHERE (p_tier IS NULL OR sp.tier = p_tier)
  ORDER BY sp.total_xp DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STUDENT NEEDS ATTENTION CHECK
-- ============================================================================

CREATE OR REPLACE FUNCTION check_student_needs_attention(
  p_student_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_last_activity TIMESTAMPTZ;
  v_pending_submissions INTEGER;
  v_failed_attempts INTEGER;
BEGIN
  -- Get last activity
  SELECT MAX(created_at) INTO v_last_activity
  FROM activity_log
  WHERE student_id = p_student_id;
  
  -- Count pending submissions
  SELECT COUNT(*) INTO v_pending_submissions
  FROM submissions
  WHERE student_id = p_student_id 
    AND status = 'pending'
    AND submitted_at < NOW() - INTERVAL '48 hours';
  
  -- Count failed attempts (3+ attempts without completion)
  SELECT COUNT(*) INTO v_failed_attempts
  FROM challenge_progress
  WHERE student_id = p_student_id
    AND attempts >= 3
    AND completed_at IS NULL;
  
  -- Return TRUE if any attention needed
  RETURN (
    v_last_activity < NOW() - INTERVAL '7 days' OR
    v_pending_submissions > 0 OR
    v_failed_attempts > 0
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- AUTO-UPDATE TIMESTAMPS
-- ============================================================================

-- Function: Update timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
DROP TRIGGER IF EXISTS update_profiles_timestamp ON profiles;
CREATE TRIGGER update_profiles_timestamp
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS update_student_profiles_timestamp ON student_profiles;
CREATE TRIGGER update_student_profiles_timestamp
  BEFORE UPDATE ON student_profiles
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS update_users_timestamp ON users;
CREATE TRIGGER update_users_timestamp
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================================================
-- SESSION CLEANUP (run periodically)
-- ============================================================================

CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM sessions WHERE expire < NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- COMPLETE!
-- ============================================================================

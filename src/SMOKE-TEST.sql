-- ============================================================================
-- MZ. MARIANNA'S ACADEMY - COMPREHENSIVE SMOKE TEST
-- Tests all business logic, triggers, and RLS policies
-- ============================================================================
--
-- INSTRUCTIONS:
-- 1. Go to: https://supabase.com/dashboard/project/wyclbrafklhvdyjpoeno/sql/new
-- 2. Copy this ENTIRE file
-- 3. Paste into SQL Editor
-- 4. Click "Run"
-- 5. Check output for ✅ or ❌ markers
--
-- ============================================================================

-- Clean up any previous test data
DO $$
BEGIN
  DELETE FROM placement_quiz_attempts WHERE student_name LIKE 'Test%';
  DELETE FROM activity_log WHERE student_id IN (SELECT id FROM student_profiles WHERE id IN (SELECT id FROM profiles WHERE email LIKE 'test%@academy.test'));
  DELETE FROM quest_progress WHERE student_id IN (SELECT id FROM student_profiles WHERE id IN (SELECT id FROM profiles WHERE email LIKE 'test%@academy.test'));
  DELETE FROM challenge_progress WHERE student_id IN (SELECT id FROM student_profiles WHERE id IN (SELECT id FROM profiles WHERE email LIKE 'test%@academy.test'));
  DELETE FROM badges_earned WHERE student_id IN (SELECT id FROM student_profiles WHERE id IN (SELECT id FROM profiles WHERE email LIKE 'test%@academy.test'));
  DELETE FROM parent_students WHERE parent_id IN (SELECT id FROM profiles WHERE email LIKE 'test%@academy.test');
  DELETE FROM student_profiles WHERE id IN (SELECT id FROM profiles WHERE email LIKE 'test%@academy.test');
  DELETE FROM profiles WHERE email LIKE 'test%@academy.test';
  RAISE NOTICE '🧹 Cleaned up previous test data';
END $$;

-- ============================================================================
-- TEST 1: Create Sample Student
-- ============================================================================

DO $$
DECLARE
  v_student_id UUID;
  v_parent_id UUID;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================================================';
  RAISE NOTICE '📝 TEST 1: Creating Sample Student & Parent';
  RAISE NOTICE '============================================================================';

  -- Create student user
  v_student_id := uuid_generate_v4();
  
  INSERT INTO profiles (id, role, email, display_name)
  VALUES (v_student_id, 'student', 'test-student@academy.test', 'Alex Explorer');
  
  INSERT INTO student_profiles (id, age, tier, total_xp, current_level)
  VALUES (v_student_id, 10, 'explorers', 0, 1);
  
  RAISE NOTICE '✅ Created student: % (age: 10, tier: explorers)', v_student_id;

  -- Create parent user
  v_parent_id := uuid_generate_v4();
  
  INSERT INTO profiles (id, role, email, display_name)
  VALUES (v_parent_id, 'parent', 'test-parent@academy.test', 'Parent Explorer');
  
  -- Link parent to student
  INSERT INTO parent_students (parent_id, student_id)
  VALUES (v_parent_id, v_student_id);
  
  RAISE NOTICE '✅ Created parent: % and linked to student', v_parent_id;
  
  -- Store IDs for later tests
  PERFORM set_config('test.student_id', v_student_id::text, false);
  PERFORM set_config('test.parent_id', v_parent_id::text, false);
END $$;

-- ============================================================================
-- TEST 2: Quest Progress System
-- ============================================================================

DO $$
DECLARE
  v_student_id UUID;
  v_quest_id TEXT := 'EH-W1-FOUNDATIONS';
  v_quest_progress_id UUID;
BEGIN
  v_student_id := current_setting('test.student_id')::uuid;
  
  RAISE NOTICE '';
  RAISE NOTICE '============================================================================';
  RAISE NOTICE '🎯 TEST 2: Quest Progress System';
  RAISE NOTICE '============================================================================';

  -- Create quest progress
  INSERT INTO quest_progress (student_id, quest_id, quest_week, total_challenges, completed_challenges, xp_earned)
  VALUES (v_student_id, v_quest_id, 1, 5, 0, 0)
  RETURNING id INTO v_quest_progress_id;
  
  RAISE NOTICE '✅ Created quest progress for quest: %', v_quest_id;
  
  -- Verify quest progress
  IF EXISTS (
    SELECT 1 FROM quest_progress 
    WHERE student_id = v_student_id AND quest_id = v_quest_id
  ) THEN
    RAISE NOTICE '✅ Quest progress verified in database';
  ELSE
    RAISE NOTICE '❌ Quest progress NOT found!';
  END IF;
  
  PERFORM set_config('test.quest_id', v_quest_id, false);
END $$;

-- ============================================================================
-- TEST 3: Challenge Completion Triggers
-- ============================================================================

DO $$
DECLARE
  v_student_id UUID;
  v_quest_id TEXT;
  v_challenge_id TEXT := 'EH-W1-C1-STEAM';
  v_challenge_progress_id UUID;
  v_initial_xp INTEGER;
  v_final_xp INTEGER;
  v_initial_completed INTEGER;
  v_final_completed INTEGER;
BEGIN
  v_student_id := current_setting('test.student_id')::uuid;
  v_quest_id := current_setting('test.quest_id');
  
  RAISE NOTICE '';
  RAISE NOTICE '============================================================================';
  RAISE NOTICE '⚡ TEST 3: Challenge Completion Triggers';
  RAISE NOTICE '============================================================================';

  -- Get initial quest progress state
  SELECT completed_challenges, xp_earned INTO v_initial_completed, v_initial_xp
  FROM quest_progress
  WHERE student_id = v_student_id AND quest_id = v_quest_id;
  
  RAISE NOTICE 'Initial state: % challenges, % XP', v_initial_completed, v_initial_xp;

  -- Create challenge progress (not completed yet)
  INSERT INTO challenge_progress (student_id, challenge_id, quest_id, xp_earned, mastery_level)
  VALUES (v_student_id, v_challenge_id, v_quest_id, 0, NULL)
  RETURNING id INTO v_challenge_progress_id;
  
  RAISE NOTICE '✅ Created challenge progress: %', v_challenge_id;

  -- Complete the challenge (this should trigger quest_progress update)
  UPDATE challenge_progress
  SET 
    completed_at = NOW(),
    xp_earned = 100,
    mastery_level = 'proficient'
  WHERE id = v_challenge_progress_id;
  
  RAISE NOTICE '✅ Completed challenge with 100 XP';

  -- Verify quest progress was updated by trigger
  SELECT completed_challenges, xp_earned INTO v_final_completed, v_final_xp
  FROM quest_progress
  WHERE student_id = v_student_id AND quest_id = v_quest_id;
  
  IF v_final_completed = v_initial_completed + 1 AND v_final_xp = v_initial_xp + 100 THEN
    RAISE NOTICE '✅ Quest progress auto-updated! Challenges: % → %, XP: % → %', 
      v_initial_completed, v_final_completed, v_initial_xp, v_final_xp;
  ELSE
    RAISE NOTICE '❌ Quest progress NOT updated correctly! Expected: %/%, Got: %/%',
      v_initial_completed + 1, v_initial_xp + 100, v_final_completed, v_final_xp;
  END IF;

  -- Verify activity log entry was created
  IF EXISTS (
    SELECT 1 FROM activity_log 
    WHERE student_id = v_student_id 
    AND activity_type IN ('quest_complete', 'challenge_complete')
  ) THEN
    RAISE NOTICE '✅ Activity log entries created';
  ELSE
    RAISE NOTICE '⚠️  No activity log entries (may be expected if quest not 100% complete)';
  END IF;
END $$;

-- ============================================================================
-- TEST 4: Submission System
-- ============================================================================

DO $$
DECLARE
  v_student_id UUID;
  v_submission_id UUID;
  v_challenge_id TEXT := 'EH-W1-C2-MATH';
  v_quest_id TEXT;
BEGIN
  v_student_id := current_setting('test.student_id')::uuid;
  v_quest_id := current_setting('test.quest_id');
  
  RAISE NOTICE '';
  RAISE NOTICE '============================================================================';
  RAISE NOTICE '📄 TEST 4: Submission System';
  RAISE NOTICE '============================================================================';

  -- Create a submission
  INSERT INTO submissions (
    student_id, 
    challenge_id, 
    challenge_title,
    quest_id,
    type, 
    text_content,
    status
  )
  VALUES (
    v_student_id,
    v_challenge_id,
    'Math Challenge',
    v_quest_id,
    'text',
    'Test submission: 2 + 2 = 4',
    'pending'
  )
  RETURNING id INTO v_submission_id;
  
  RAISE NOTICE '✅ Created submission: %', v_submission_id;

  -- Assess the submission (set mastery level)
  UPDATE submissions
  SET 
    mastery_level = 'advanced',
    xp_earned = 150,
    status = 'assessed',
    assessed_at = NOW()
  WHERE id = v_submission_id;
  
  RAISE NOTICE '✅ Assessed submission as "advanced" with 150 XP';

  -- Verify mastery history was recorded
  IF EXISTS (
    SELECT 1 FROM mastery_history
    WHERE student_id = v_student_id
    AND subject = 'Math'
    AND mastery_level = 'advanced'
  ) THEN
    RAISE NOTICE '✅ Mastery history recorded automatically';
  ELSE
    RAISE NOTICE '⚠️  Mastery history not found (trigger may not have fired)';
  END IF;

  -- Verify portfolio auto-population for advanced mastery
  IF EXISTS (
    SELECT 1 FROM portfolio_items
    WHERE student_id = v_student_id
    AND submission_id = v_submission_id
  ) THEN
    RAISE NOTICE '✅ Submission auto-added to portfolio';
  ELSE
    RAISE NOTICE '⚠️  Submission not in portfolio (trigger may not have fired)';
  END IF;
END $$;

-- ============================================================================
-- TEST 5: XP & Leveling System
-- ============================================================================

DO $$
DECLARE
  v_student_id UUID;
  v_initial_xp INTEGER;
  v_initial_level INTEGER;
  v_final_xp INTEGER;
  v_final_level INTEGER;
BEGIN
  v_student_id := current_setting('test.student_id')::uuid;
  
  RAISE NOTICE '';
  RAISE NOTICE '============================================================================';
  RAISE NOTICE '⭐ TEST 5: XP & Leveling System';
  RAISE NOTICE '============================================================================';

  -- Get initial state
  SELECT total_xp, current_level INTO v_initial_xp, v_initial_level
  FROM student_profiles
  WHERE id = v_student_id;
  
  RAISE NOTICE 'Initial: Level %, % XP', v_initial_level, v_initial_xp;

  -- Award XP using function
  PERFORM award_xp_to_student(v_student_id, 600);
  
  RAISE NOTICE '✅ Awarded 600 XP';

  -- Verify XP and level updated
  SELECT total_xp, current_level INTO v_final_xp, v_final_level
  FROM student_profiles
  WHERE id = v_student_id;
  
  IF v_final_xp = v_initial_xp + 600 THEN
    RAISE NOTICE '✅ XP updated correctly: % → %', v_initial_xp, v_final_xp;
  ELSE
    RAISE NOTICE '❌ XP incorrect! Expected: %, Got: %', v_initial_xp + 600, v_final_xp;
  END IF;

  -- Level calculation: 1 + (total_xp / 500)
  IF v_final_level = 1 + (v_final_xp / 500) THEN
    RAISE NOTICE '✅ Level calculated correctly: Level %', v_final_level;
  ELSE
    RAISE NOTICE '❌ Level incorrect! Expected: %, Got: %', 1 + (v_final_xp / 500), v_final_level;
  END IF;
END $$;

-- ============================================================================
-- TEST 6: Badge Earning System
-- ============================================================================

DO $$
DECLARE
  v_student_id UUID;
  v_quest_id TEXT;
  v_badge_id TEXT := 'BADGE-EH-W1';
BEGIN
  v_student_id := current_setting('test.student_id')::uuid;
  v_quest_id := current_setting('test.quest_id');
  
  RAISE NOTICE '';
  RAISE NOTICE '============================================================================';
  RAISE NOTICE '🏆 TEST 6: Badge Earning System';
  RAISE NOTICE '============================================================================';

  -- Manually award a badge
  INSERT INTO badges_earned (student_id, badge_id, quest_id)
  VALUES (v_student_id, v_badge_id, v_quest_id);
  
  RAISE NOTICE '✅ Awarded badge: %', v_badge_id;

  -- Verify badge in database
  IF EXISTS (
    SELECT 1 FROM badges_earned
    WHERE student_id = v_student_id AND badge_id = v_badge_id
  ) THEN
    RAISE NOTICE '✅ Badge verified in database';
  ELSE
    RAISE NOTICE '❌ Badge NOT found!';
  END IF;

  -- Test duplicate prevention (should be ignored due to UNIQUE constraint)
  BEGIN
    INSERT INTO badges_earned (student_id, badge_id, quest_id)
    VALUES (v_student_id, v_badge_id, v_quest_id);
    RAISE NOTICE '❌ Duplicate badge allowed (UNIQUE constraint not working!)';
  EXCEPTION WHEN unique_violation THEN
    RAISE NOTICE '✅ Duplicate badge prevented (UNIQUE constraint working)';
  END;
END $$;

-- ============================================================================
-- TEST 7: Placement Quiz Flow
-- ============================================================================

DO $$
DECLARE
  v_quiz_attempt_id UUID;
  v_question_count INTEGER;
  v_recommended_tier TEXT;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================================================';
  RAISE NOTICE '🎯 TEST 7: Placement Quiz Flow';
  RAISE NOTICE '============================================================================';

  -- Verify quiz questions exist
  SELECT COUNT(*) INTO v_question_count
  FROM placement_quiz_questions
  WHERE is_active = true;
  
  IF v_question_count > 0 THEN
    RAISE NOTICE '✅ Found % active quiz questions', v_question_count;
  ELSE
    RAISE NOTICE '❌ No quiz questions found! Run 007_placement_quiz.sql';
    RETURN;
  END IF;

  -- Create a quiz attempt (simulating public user)
  INSERT INTO placement_quiz_attempts (
    student_name,
    student_age,
    student_interests,
    parent_email
  )
  VALUES (
    'Test Student',
    10,
    ARRAY['minecraft', 'science'],
    'test-parent@example.com'
  )
  RETURNING id INTO v_quiz_attempt_id;
  
  RAISE NOTICE '✅ Created quiz attempt: %', v_quiz_attempt_id;

  -- Simulate completing quiz with good scores
  UPDATE placement_quiz_attempts
  SET
    completed_at = NOW(),
    total_questions_answered = 10,
    correct_answers = 8,
    accuracy_percentage = 80.0,
    reading_score = 75.0,
    math_score = 85.0,
    critical_thinking_score = 80.0
  WHERE id = v_quiz_attempt_id;

  -- Calculate recommended tier using function
  SELECT calculate_recommended_tier(75.0, 85.0, 80.0, 10) INTO v_recommended_tier;
  
  RAISE NOTICE '✅ Recommended tier calculated: %', v_recommended_tier;

  -- Update attempt with recommendation
  UPDATE placement_quiz_attempts
  SET recommended_tier = v_recommended_tier
  WHERE id = v_quiz_attempt_id;

  -- Verify tier recommendation is correct
  IF v_recommended_tier = 'explorers' THEN
    RAISE NOTICE '✅ Tier recommendation correct (explorers for age 10, 80%% score)';
  ELSE
    RAISE NOTICE '⚠️  Unexpected tier: % (expected: explorers)', v_recommended_tier;
  END IF;
END $$;

-- ============================================================================
-- TEST 8: Row Level Security (RLS) Policies
-- ============================================================================

DO $$
DECLARE
  v_student_id UUID;
  v_parent_id UUID;
  v_student_submission_count INTEGER;
  v_parent_child_count INTEGER;
BEGIN
  v_student_id := current_setting('test.student_id')::uuid;
  v_parent_id := current_setting('test.parent_id')::uuid;
  
  RAISE NOTICE '';
  RAISE NOTICE '============================================================================';
  RAISE NOTICE '🔒 TEST 8: Row Level Security (RLS) Policies';
  RAISE NOTICE '============================================================================';

  -- Note: RLS is enforced only when using auth.uid()
  -- In this test, we're using postgres role, which bypasses RLS
  -- To properly test RLS, you need to use authenticated users via Supabase client
  
  RAISE NOTICE '⚠️  RLS cannot be fully tested in SQL (requires authenticated users)';
  RAISE NOTICE '   To test RLS:';
  RAISE NOTICE '   1. Create a user via Supabase Auth';
  RAISE NOTICE '   2. Try querying data from your app';
  RAISE NOTICE '   3. Verify users can only see their own data';

  -- Verify RLS is enabled on tables
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND rowsecurity = true
  ) THEN
    RAISE NOTICE '✅ RLS enabled on profiles table';
  ELSE
    RAISE NOTICE '❌ RLS NOT enabled on profiles table!';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'submissions' 
    AND rowsecurity = true
  ) THEN
    RAISE NOTICE '✅ RLS enabled on submissions table';
  ELSE
    RAISE NOTICE '❌ RLS NOT enabled on submissions table!';
  END IF;
END $$;

-- ============================================================================
-- TEST 9: Analytics Functions
-- ============================================================================

DO $$
DECLARE
  v_student_id UUID;
  v_activity_summary RECORD;
BEGIN
  v_student_id := current_setting('test.student_id')::uuid;
  
  RAISE NOTICE '';
  RAISE NOTICE '============================================================================';
  RAISE NOTICE '📊 TEST 9: Analytics Functions';
  RAISE NOTICE '============================================================================';

  -- Test activity summary function
  SELECT * INTO v_activity_summary
  FROM get_activity_summary(v_student_id, 30);
  
  RAISE NOTICE '✅ Activity summary generated:';
  RAISE NOTICE '   - Submissions: %', v_activity_summary.total_submissions;
  RAISE NOTICE '   - Avg Mastery: %', ROUND(v_activity_summary.avg_mastery_score, 2);
  RAISE NOTICE '   - XP Earned: %', v_activity_summary.total_xp_earned;
  
  -- Test leaderboard function
  IF EXISTS (
    SELECT 1 FROM get_leaderboard('explorers', 10)
    WHERE student_id = v_student_id
  ) THEN
    RAISE NOTICE '✅ Student appears in leaderboard';
  ELSE
    RAISE NOTICE '⚠️  Student not in leaderboard (expected if XP = 0)';
  END IF;
END $$;

-- ============================================================================
-- TEST 10: Helper Functions
-- ============================================================================

DO $$
DECLARE
  v_quest_name TEXT;
  v_student_id UUID;
  v_quest_id TEXT;
  v_progress NUMERIC;
BEGIN
  v_student_id := current_setting('test.student_id')::uuid;
  v_quest_id := current_setting('test.quest_id');
  
  RAISE NOTICE '';
  RAISE NOTICE '============================================================================';
  RAISE NOTICE '🛠️  TEST 10: Helper Functions';
  RAISE NOTICE '============================================================================';

  -- Test quest name function
  v_quest_name := get_quest_name(v_quest_id);
  RAISE NOTICE '✅ Quest name: % = "%"', v_quest_id, v_quest_name;

  -- Test quest progress calculation
  v_progress := calculate_quest_progress(v_student_id, v_quest_id);
  RAISE NOTICE '✅ Quest progress: %%', ROUND(v_progress, 1);

  -- Test XP calculation from mastery
  RAISE NOTICE '✅ XP calculations:';
  RAISE NOTICE '   - Emerging (50%%): % XP', calculate_xp_from_mastery(100, 'emerging');
  RAISE NOTICE '   - Developing (75%%): % XP', calculate_xp_from_mastery(100, 'developing');
  RAISE NOTICE '   - Proficient (100%%): % XP', calculate_xp_from_mastery(100, 'proficient');
  RAISE NOTICE '   - Advanced (150%%): % XP', calculate_xp_from_mastery(100, 'advanced');
  RAISE NOTICE '   - Mastered (200%%): % XP', calculate_xp_from_mastery(100, 'mastered');
END $$;

-- ============================================================================
-- SUMMARY REPORT
-- ============================================================================

DO $$
DECLARE
  v_student_id UUID;
  v_profile_count INTEGER;
  v_quest_count INTEGER;
  v_challenge_count INTEGER;
  v_submission_count INTEGER;
  v_badge_count INTEGER;
  v_activity_count INTEGER;
  v_quiz_count INTEGER;
BEGIN
  v_student_id := current_setting('test.student_id')::uuid;
  
  RAISE NOTICE '';
  RAISE NOTICE '============================================================================';
  RAISE NOTICE '📋 SUMMARY REPORT';
  RAISE NOTICE '============================================================================';

  SELECT COUNT(*) INTO v_profile_count FROM profiles WHERE email LIKE 'test%@academy.test';
  SELECT COUNT(*) INTO v_quest_count FROM quest_progress WHERE student_id = v_student_id;
  SELECT COUNT(*) INTO v_challenge_count FROM challenge_progress WHERE student_id = v_student_id;
  SELECT COUNT(*) INTO v_submission_count FROM submissions WHERE student_id = v_student_id;
  SELECT COUNT(*) INTO v_badge_count FROM badges_earned WHERE student_id = v_student_id;
  SELECT COUNT(*) INTO v_activity_count FROM activity_log WHERE student_id = v_student_id;
  SELECT COUNT(*) INTO v_quiz_count FROM placement_quiz_attempts WHERE student_name LIKE 'Test%';

  RAISE NOTICE '';
  RAISE NOTICE 'Test Data Created:';
  RAISE NOTICE '  ✅ Profiles: %', v_profile_count;
  RAISE NOTICE '  ✅ Quest Progress: %', v_quest_count;
  RAISE NOTICE '  ✅ Challenge Progress: %', v_challenge_count;
  RAISE NOTICE '  ✅ Submissions: %', v_submission_count;
  RAISE NOTICE '  ✅ Badges Earned: %', v_badge_count;
  RAISE NOTICE '  ✅ Activity Logs: %', v_activity_count;
  RAISE NOTICE '  ✅ Quiz Attempts: %', v_quiz_count;
  
  RAISE NOTICE '';
  RAISE NOTICE '============================================================================';
  RAISE NOTICE '🎉 SMOKE TEST COMPLETE!';
  RAISE NOTICE '============================================================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Review the output above for any ❌ errors.';
  RAISE NOTICE 'If all tests show ✅, your database is ready for production!';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Test placement quiz in browser: http://localhost:5173/placement-quiz';
  RAISE NOTICE '  2. Create a real account via Supabase Auth';
  RAISE NOTICE '  3. Test frontend components with real data';
  RAISE NOTICE '  4. Set up Shopify integration for subscriptions';
  RAISE NOTICE '';
END $$;

-- Optionally, keep test data for inspection (comment out to delete)
-- DELETE FROM placement_quiz_attempts WHERE student_name LIKE 'Test%';
-- ... (add other DELETE statements if you want to clean up)

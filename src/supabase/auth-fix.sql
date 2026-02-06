-- ============================================================================
-- AUTHENTICATION FIX - RUN THIS IF YOU'RE GETTING AUTH ERRORS
-- ============================================================================
-- This adds the missing policies that allow users to sign up and log in
-- Run this in Supabase SQL Editor if you're getting "RLS policy violation" errors
-- ============================================================================

-- Allow users to create their own profile during signup
CREATE POLICY "Users can insert own profile during signup"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow students to create their own student profile
CREATE POLICY "Students can insert own student profile"
  ON student_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow students to update their own student profile
CREATE POLICY "Students can update own student profile"
  ON student_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Allow students to update their own progress
CREATE POLICY "Students can insert own quest progress"
  ON quest_progress FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own quest progress"
  ON quest_progress FOR UPDATE
  USING (student_id = auth.uid());

CREATE POLICY "Students can insert own challenge progress"
  ON challenge_progress FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own challenge progress"
  ON challenge_progress FOR UPDATE
  USING (student_id = auth.uid());

-- Allow students to view their own quest progress
CREATE POLICY "Students can view own quest progress"
  ON quest_progress FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Students can view own challenge progress"
  ON challenge_progress FOR SELECT
  USING (student_id = auth.uid());

-- Allow students to view and earn badges
CREATE POLICY "Students can view own badges"
  ON badges_earned FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Students can insert own badges"
  ON badges_earned FOR INSERT
  WITH CHECK (student_id = auth.uid());

-- Allow students to view their activity log
CREATE POLICY "Students can view own activity"
  ON activity_log FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Students can insert own activity"
  ON activity_log FOR INSERT
  WITH CHECK (student_id = auth.uid());

-- Allow students to view learning sessions
CREATE POLICY "Students can view own sessions"
  ON learning_sessions FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Students can insert own sessions"
  ON learning_sessions FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own sessions"
  ON learning_sessions FOR UPDATE
  USING (student_id = auth.uid());

-- Allow students to view mastery history
CREATE POLICY "Students can view own mastery history"
  ON mastery_history FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Students can insert own mastery history"
  ON mastery_history FOR INSERT
  WITH CHECK (student_id = auth.uid());

-- Allow students to view assessment scores
CREATE POLICY "Students can view own assessment scores"
  ON assessment_scores FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Students can insert own assessment scores"
  ON assessment_scores FOR INSERT
  WITH CHECK (student_id = auth.uid());

-- Allow students to view portfolio items
CREATE POLICY "Students can view own portfolio"
  ON portfolio_items FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Students can insert own portfolio items"
  ON portfolio_items FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own portfolio items"
  ON portfolio_items FOR UPDATE
  USING (student_id = auth.uid());

CREATE POLICY "Students can delete own portfolio items"
  ON portfolio_items FOR DELETE
  USING (student_id = auth.uid());

-- ============================================================================
-- PLACEMENT QUIZ - ALLOW PUBLIC ACCESS (NO AUTH REQUIRED)
-- ============================================================================

-- Option 1: Disable RLS completely (simplest for placement quiz)
ALTER TABLE placement_quiz_leads DISABLE ROW LEVEL SECURITY;

-- Option 2: If you want to keep RLS enabled, use this instead of above:
-- CREATE POLICY "Anyone can submit placement quiz"
--   ON placement_quiz_leads FOR INSERT
--   WITH CHECK (true);
--
-- CREATE POLICY "Users can view own quiz submissions"
--   ON placement_quiz_leads FOR SELECT
--   USING (email = (SELECT email FROM profiles WHERE id = auth.uid()));

-- ============================================================================
-- PLACEMENT QUIZ ATTEMPTS - ALLOW PUBLIC ACCESS
-- ============================================================================

ALTER TABLE placement_quiz_attempts DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

-- If you see this, the policies were added successfully!
SELECT 'Authentication policies added successfully! ✅' as message;

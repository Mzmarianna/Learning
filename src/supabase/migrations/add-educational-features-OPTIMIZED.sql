-- ============================================================================
-- MZ. MARIANNA'S ACADEMY - EDUCATIONAL FEATURES MIGRATION (OPTIMIZED)
-- Version: 1.0 - Production Ready
-- Adds: Clan System, IB Competencies, Theme-Based Curriculum
-- ============================================================================

-- ============================================================================
-- 1. ENUM TYPES (Create all enums first)
-- ============================================================================

-- Clan types
CREATE TYPE clan_type AS ENUM ('explorers', 'creators', 'helpers', 'champions');

-- Clan activity types (enum instead of TEXT CHECK for performance)
CREATE TYPE clan_activity_type AS ENUM ('help_peer', 'complete_challenge', 'creative_project', 'persistence', 'collaboration');

-- Developmental areas
CREATE TYPE developmental_area AS ENUM (
  'health_physical',
  'language_literacy',
  'numeracy_cognitive',
  'social_emotional',
  'life_skills',
  'creative_thinking',
  'play_exploration'
);

-- Competency progress status
CREATE TYPE competency_status AS ENUM ('not_started', 'emerging', 'developing', 'proficient', 'mastered');

-- Challenge type for clan challenges
CREATE TYPE clan_challenge_type AS ENUM ('collaborative', 'creative', 'helpful', 'persistent');

-- ============================================================================
-- 2. EXTEND EXISTING TABLES
-- ============================================================================

-- Add clan fields to student_profiles
ALTER TABLE student_profiles 
ADD COLUMN IF NOT EXISTS clan_id clan_type,
ADD COLUMN IF NOT EXISTS clan_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS weekly_clan_contribution INTEGER DEFAULT 0;

-- ============================================================================
-- 3. CLAN SYSTEM TABLES
-- ============================================================================

-- Clan activities (track all clan participation)
CREATE TABLE IF NOT EXISTS clan_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  clan_id clan_type NOT NULL,
  activity_type clan_activity_type NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clan challenges (weekly team challenges)
CREATE TABLE IF NOT EXISTS clan_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  challenge_type clan_challenge_type NOT NULL,
  required_members INTEGER DEFAULT 1 CHECK (required_members > 0),
  clan_points_reward INTEGER NOT NULL CHECK (clan_points_reward >= 0),
  individual_xp_reward INTEGER NOT NULL CHECK (individual_xp_reward >= 0),
  badge_reward TEXT,
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clan challenge participants
CREATE TABLE IF NOT EXISTS clan_challenge_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID NOT NULL REFERENCES clan_challenges(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  clan_id clan_type NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(challenge_id, student_id)
);

-- ============================================================================
-- 4. COMPETENCY SYSTEM TABLES
-- ============================================================================

-- Competencies reference table (IB framework)
CREATE TABLE IF NOT EXISTS competencies (
  id TEXT PRIMARY KEY,
  developmental_area developmental_area NOT NULL,
  competency_name TEXT NOT NULL,
  description TEXT NOT NULL,
  age_range TEXT NOT NULL,
  examples JSONB DEFAULT '[]',
  assessment_criteria JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student competency progress
CREATE TABLE IF NOT EXISTS student_competency_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  competency_id TEXT NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
  status competency_status DEFAULT 'not_started',
  evidence_notes JSONB DEFAULT '[]',
  last_assessed TIMESTAMPTZ,
  next_steps TEXT,
  assessed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, competency_id)
);

-- ============================================================================
-- 5. THEME-BASED CURRICULUM TABLES
-- ============================================================================

-- Weekly themes
CREATE TABLE IF NOT EXISTS weekly_themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  age_range TEXT NOT NULL,
  duration TEXT DEFAULT 'week' CHECK (duration IN ('week', 'two-weeks', 'month')),
  big_idea TEXT NOT NULL,
  essential_questions JSONB DEFAULT '[]',
  developmental_areas JSONB DEFAULT '[]',
  pedagogical_approaches JSONB DEFAULT '[]',
  vocabulary JSONB DEFAULT '[]',
  materials JSONB DEFAULT '[]',
  start_date DATE,
  end_date DATE,
  tier tier_level,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily activities
CREATE TABLE IF NOT EXISTS daily_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  theme_id UUID NOT NULL REFERENCES weekly_themes(id) ON DELETE CASCADE,
  day_of_week TEXT NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday')),
  subject_focus TEXT NOT NULL CHECK (subject_focus IN ('math', 'reading', 'writing', 'steam', 'flexible')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('structured-play', 'exploration', 'teacher-guided', 'peer-tutoring', 'small-group')),
  duration TEXT,
  developmental_areas JSONB DEFAULT '[]',
  multisensory JSONB DEFAULT '{}',
  materials JSONB DEFAULT '[]',
  teacher_role TEXT,
  child_leadership TEXT,
  differentiation JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Learning centers (exploration zones)
CREATE TABLE IF NOT EXISTS learning_centers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  center_type TEXT NOT NULL CHECK (center_type IN ('exploration', 'activity', 'project', 'quiet', 'movement')),
  description TEXT NOT NULL,
  materials JSONB DEFAULT '[]',
  suggested_activities JSONB DEFAULT '[]',
  developmental_areas JSONB DEFAULT '[]',
  setup_instructions TEXT,
  
  -- Support both permanent and theme-specific centers
  is_permanent BOOLEAN DEFAULT FALSE,
  theme_id UUID REFERENCES weekly_themes(id) ON DELETE CASCADE,
  
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure proper relationship
  CHECK (
    (is_permanent = TRUE AND theme_id IS NULL) OR
    (is_permanent = FALSE AND theme_id IS NOT NULL)
  )
);

-- ============================================================================
-- 6. INDEXES FOR PERFORMANCE
-- ============================================================================

-- Clan activity indexes
CREATE INDEX IF NOT EXISTS idx_clan_activities_student ON clan_activities(student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clan_activities_clan ON clan_activities(clan_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clan_activities_type ON clan_activities(activity_type, created_at DESC);

-- Student profiles clan index
CREATE INDEX IF NOT EXISTS idx_student_profiles_clan ON student_profiles(clan_id) WHERE clan_id IS NOT NULL;

-- Competency progress indexes
CREATE INDEX IF NOT EXISTS idx_competency_progress_student ON student_competency_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_competency_progress_status ON student_competency_progress(status);
CREATE INDEX IF NOT EXISTS idx_competency_progress_assessed ON student_competency_progress(last_assessed DESC NULLS LAST);

-- Competencies index
CREATE INDEX IF NOT EXISTS idx_competencies_area ON competencies(developmental_area);

-- Theme indexes
CREATE INDEX IF NOT EXISTS idx_weekly_themes_active ON weekly_themes(active, start_date DESC) WHERE active = TRUE;
CREATE INDEX IF NOT EXISTS idx_weekly_themes_tier ON weekly_themes(tier, active, start_date DESC);

-- Daily activities indexes
CREATE INDEX IF NOT EXISTS idx_daily_activities_theme ON daily_activities(theme_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_daily_activities_focus ON daily_activities(subject_focus);

-- Learning centers indexes
CREATE INDEX IF NOT EXISTS idx_learning_centers_active ON learning_centers(active) WHERE active = TRUE;
CREATE INDEX IF NOT EXISTS idx_learning_centers_theme ON learning_centers(theme_id) WHERE theme_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_learning_centers_permanent ON learning_centers(is_permanent) WHERE is_permanent = TRUE;

-- Clan challenges indexes
CREATE INDEX IF NOT EXISTS idx_clan_challenges_status ON clan_challenges(status, start_date DESC);

-- ============================================================================
-- 7. ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Clan activities
ALTER TABLE clan_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own clan activities" ON clan_activities
  FOR SELECT USING (
    auth.uid() = student_id OR
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('tutor', 'admin'))
  );

CREATE POLICY "Students can insert own clan activities" ON clan_activities
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Tutors can manage clan activities" ON clan_activities
  FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('tutor', 'admin')));

-- Clan challenges
ALTER TABLE clan_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view clan challenges" ON clan_challenges
  FOR SELECT USING (TRUE);

CREATE POLICY "Tutors can manage clan challenges" ON clan_challenges
  FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('tutor', 'admin')));

-- Clan challenge participants
ALTER TABLE clan_challenge_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own participation" ON clan_challenge_participants
  FOR SELECT USING (
    auth.uid() = student_id OR
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('tutor', 'admin'))
  );

CREATE POLICY "Students can join challenges" ON clan_challenge_participants
  FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Competencies (reference data - public read)
ALTER TABLE competencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view competencies" ON competencies
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage competencies" ON competencies
  FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Student competency progress
ALTER TABLE student_competency_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own progress" ON student_competency_progress
  FOR SELECT USING (
    auth.uid() = student_id OR
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('tutor', 'admin', 'parent'))
  );

CREATE POLICY "Tutors can manage competency progress" ON student_competency_progress
  FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('tutor', 'admin')));

-- Weekly themes
ALTER TABLE weekly_themes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view active themes" ON weekly_themes
  FOR SELECT USING (active = TRUE);

CREATE POLICY "Tutors can manage themes" ON weekly_themes
  FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('tutor', 'admin')));

-- Daily activities
ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view daily activities" ON daily_activities
  FOR SELECT USING (TRUE);

CREATE POLICY "Tutors can manage activities" ON daily_activities
  FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('tutor', 'admin')));

-- Learning centers
ALTER TABLE learning_centers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view active centers" ON learning_centers
  FOR SELECT USING (active = TRUE);

CREATE POLICY "Tutors can manage centers" ON learning_centers
  FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('tutor', 'admin')));

-- ============================================================================
-- 8. HELPER FUNCTIONS
-- ============================================================================

-- Calculate student's rank within their clan
CREATE OR REPLACE FUNCTION get_student_clan_rank(student_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  student_clan clan_type;
  student_rank INTEGER;
BEGIN
  -- Get student's clan
  SELECT clan_id INTO student_clan
  FROM student_profiles
  WHERE id = student_uuid;
  
  IF student_clan IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Calculate rank based on weekly contribution
  SELECT COUNT(*) + 1 INTO student_rank
  FROM student_profiles
  WHERE clan_id = student_clan
    AND weekly_clan_contribution > (
      SELECT weekly_clan_contribution
      FROM student_profiles
      WHERE id = student_uuid
    );
  
  RETURN student_rank;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Reset weekly clan contributions (run via cron weekly)
CREATE OR REPLACE FUNCTION reset_weekly_clan_contributions()
RETURNS void AS $$
BEGIN
  UPDATE student_profiles
  SET weekly_clan_contribution = 0
  WHERE clan_id IS NOT NULL;
  
  RAISE NOTICE 'Weekly clan contributions reset for % students', 
    (SELECT COUNT(*) FROM student_profiles WHERE clan_id IS NOT NULL);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Award clan points (atomic transaction)
CREATE OR REPLACE FUNCTION award_clan_points(
  p_student_id UUID,
  p_activity_type clan_activity_type,
  p_points INTEGER,
  p_description TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_clan_id clan_type;
  v_activity_id UUID;
BEGIN
  -- Get student's clan
  SELECT clan_id INTO v_clan_id
  FROM student_profiles
  WHERE id = p_student_id;
  
  IF v_clan_id IS NULL THEN
    RAISE EXCEPTION 'Student % is not assigned to a clan', p_student_id;
  END IF;
  
  -- Insert clan activity
  INSERT INTO clan_activities (student_id, clan_id, activity_type, points, description)
  VALUES (p_student_id, v_clan_id, p_activity_type, p_points, p_description)
  RETURNING id INTO v_activity_id;
  
  -- Update student's points
  UPDATE student_profiles
  SET 
    clan_points = clan_points + p_points,
    weekly_clan_contribution = weekly_clan_contribution + p_points,
    updated_at = NOW()
  WHERE id = p_student_id;
  
  RETURN v_activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get competency summary by developmental area
CREATE OR REPLACE FUNCTION get_competency_summary(student_uuid UUID)
RETURNS TABLE (
  developmental_area developmental_area,
  total_competencies BIGINT,
  not_started BIGINT,
  emerging BIGINT,
  developing BIGINT,
  proficient BIGINT,
  mastered BIGINT,
  progress_percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.developmental_area,
    COUNT(*)::BIGINT as total_competencies,
    COUNT(*) FILTER (WHERE COALESCE(scp.status, 'not_started') = 'not_started')::BIGINT as not_started,
    COUNT(*) FILTER (WHERE scp.status = 'emerging')::BIGINT as emerging,
    COUNT(*) FILTER (WHERE scp.status = 'developing')::BIGINT as developing,
    COUNT(*) FILTER (WHERE scp.status = 'proficient')::BIGINT as proficient,
    COUNT(*) FILTER (WHERE scp.status = 'mastered')::BIGINT as mastered,
    ROUND(
      (COUNT(*) FILTER (WHERE scp.status = 'mastered')::NUMERIC / COUNT(*)::NUMERIC) * 100,
      2
    ) as progress_percentage
  FROM competencies c
  LEFT JOIN student_competency_progress scp 
    ON c.id = scp.competency_id AND scp.student_id = student_uuid
  GROUP BY c.developmental_area
  ORDER BY c.developmental_area;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================================
-- 9. SEED DATA (Minimal - just examples)
-- ============================================================================

-- Insert 2 sample competencies (full data should be seeded separately)
INSERT INTO competencies (id, developmental_area, competency_name, description, age_range, examples, assessment_criteria)
VALUES
  (
    'hp-1',
    'health_physical',
    'Gross Motor Development',
    'Demonstrates coordination, balance, and body awareness through movement',
    '4-7',
    '["Runs, jumps, and climbs confidently", "Participates in active play", "Shows body control"]'::jsonb,
    '["Can hop on one foot for 5 seconds", "Catches a ball with two hands", "Navigates obstacles"]'::jsonb
  ),
  (
    'll-1',
    'language_literacy',
    'Oral Communication',
    'Expresses ideas, thoughts, and feelings through spoken language',
    '4-7',
    '["Shares stories with others", "Asks questions to learn", "Participates in conversations"]'::jsonb,
    '["Speaks in complete sentences", "Age-appropriate vocabulary", "Listens and responds"]'::jsonb
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 10. TRIGGERS
-- ============================================================================

-- Auto-update student_competency_progress.updated_at
CREATE OR REPLACE FUNCTION update_competency_progress_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_competency_progress_timestamp
  BEFORE UPDATE ON student_competency_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_competency_progress_timestamp();

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '✅ EDUCATIONAL FEATURES MIGRATION COMPLETE (OPTIMIZED)';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '';
  RAISE NOTICE '📚 Features Added:';
  RAISE NOTICE '  ✓ Clan System (4 clans, activities, challenges)';
  RAISE NOTICE '  ✓ IB Competency Framework (7 areas, ready for 21+ competencies)';
  RAISE NOTICE '  ✓ Theme-Based Curriculum (themes, activities, learning centers)';
  RAISE NOTICE '';
  RAISE NOTICE '🗄️  Tables Created: 8';
  RAISE NOTICE '📊 Indexes Created: 17 (optimized for performance)';
  RAISE NOTICE '🔒 RLS Policies: Enabled on all tables';
  RAISE NOTICE '⚡ Helper Functions: 4';
  RAISE NOTICE '🎯 Enum Types: 5';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  Next Steps:';
  RAISE NOTICE '  1. Seed full competency data (21+ competencies)';
  RAISE NOTICE '  2. Assign students to clans';
  RAISE NOTICE '  3. Create first weekly theme';
  RAISE NOTICE '  4. Test API endpoints';
  RAISE NOTICE '';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
END $$;

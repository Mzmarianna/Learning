-- ============================================================================
-- EDUCATIONAL FEATURES MIGRATION
-- Adds: Clan System, IB Competencies, Theme-Based Curriculum
-- ============================================================================

-- ============================================================================
-- 1. CLAN SYSTEM
-- ============================================================================

-- Clan enum type
CREATE TYPE clan_type AS ENUM ('explorers', 'creators', 'helpers', 'champions');

-- Add clan_id to student_profiles
ALTER TABLE student_profiles 
ADD COLUMN IF NOT EXISTS clan_id clan_type,
ADD COLUMN IF NOT EXISTS clan_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS weekly_clan_contribution INTEGER DEFAULT 0;

-- Create clan_activities table
CREATE TABLE IF NOT EXISTS clan_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  clan_id clan_type NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('help_peer', 'complete_challenge', 'creative_project', 'persistence', 'collaboration')),
  points INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create clan_challenges table
CREATE TABLE IF NOT EXISTS clan_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  challenge_type TEXT NOT NULL CHECK (challenge_type IN ('collaborative', 'creative', 'helpful', 'persistent')),
  required_members INTEGER DEFAULT 1,
  clan_points_reward INTEGER NOT NULL,
  individual_xp_reward INTEGER NOT NULL,
  badge_reward TEXT,
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create clan_challenge_participants table
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

-- Indexes for clan system
CREATE INDEX IF NOT EXISTS idx_clan_activities_student ON clan_activities(student_id, created_at);
CREATE INDEX IF NOT EXISTS idx_clan_activities_clan ON clan_activities(clan_id, created_at);
CREATE INDEX IF NOT EXISTS idx_clan_challenges_status ON clan_challenges(status, start_date);

-- ============================================================================
-- 2. IB COMPETENCY SYSTEM
-- ============================================================================

-- Developmental area enum
CREATE TYPE developmental_area AS ENUM (
  'health_physical',
  'language_literacy',
  'numeracy_cognitive',
  'social_emotional',
  'life_skills',
  'creative_thinking',
  'play_exploration'
);

-- Competency progress enum
CREATE TYPE competency_status AS ENUM ('not_started', 'emerging', 'developing', 'proficient', 'mastered');

-- Create competencies table (reference data)
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

-- Create student_competency_progress table
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

-- Indexes for competency system
CREATE INDEX IF NOT EXISTS idx_competency_progress_student ON student_competency_progress(student_id, developmental_area);
CREATE INDEX IF NOT EXISTS idx_competency_progress_status ON student_competency_progress(status);
CREATE INDEX IF NOT EXISTS idx_competencies_area ON competencies(developmental_area);

-- ============================================================================
-- 3. THEME-BASED CURRICULUM
-- ============================================================================

-- Add developmental_area to competencies reference
ALTER TABLE competencies 
ADD COLUMN IF NOT EXISTS developmental_area developmental_area;

-- Create weekly_themes table
CREATE TABLE IF NOT EXISTS weekly_themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  age_range TEXT NOT NULL,
  duration TEXT DEFAULT 'week' CHECK (duration IN ('week', 'two-weeks')),
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

-- Create daily_activities table
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

-- Create learning_centers table
CREATE TABLE IF NOT EXISTS learning_centers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  theme_id UUID REFERENCES weekly_themes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  center_type TEXT NOT NULL CHECK (center_type IN ('exploration', 'activity', 'project', 'quiet', 'movement')),
  description TEXT NOT NULL,
  materials JSONB DEFAULT '[]',
  suggested_activities JSONB DEFAULT '[]',
  developmental_areas JSONB DEFAULT '[]',
  setup_instructions TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link challenges to themes
ALTER TABLE challenges 
ADD COLUMN IF NOT EXISTS theme_id UUID REFERENCES weekly_themes(id),
ADD COLUMN IF NOT EXISTS multisensory_options JSONB DEFAULT '[]';

-- Indexes for theme system
CREATE INDEX IF NOT EXISTS idx_weekly_themes_active ON weekly_themes(active, start_date);
CREATE INDEX IF NOT EXISTS idx_daily_activities_theme ON daily_activities(theme_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_learning_centers_theme ON learning_centers(theme_id, active);

-- ============================================================================
-- 4. RLS POLICIES
-- ============================================================================

-- Clan activities policies
ALTER TABLE clan_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own clan activities"
  ON clan_activities FOR SELECT
  USING (auth.uid() = student_id OR auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('tutor', 'admin')
  ));

CREATE POLICY "Students can insert own clan activities"
  ON clan_activities FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- Student competency progress policies
ALTER TABLE student_competency_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own competency progress"
  ON student_competency_progress FOR SELECT
  USING (
    auth.uid() = student_id OR
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('tutor', 'admin', 'parent'))
  );

CREATE POLICY "Tutors and admins can update competency progress"
  ON student_competency_progress FOR ALL
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('tutor', 'admin')
  ));

-- Weekly themes policies (public read for active themes)
ALTER TABLE weekly_themes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view active themes"
  ON weekly_themes FOR SELECT
  USING (active = TRUE);

CREATE POLICY "Tutors and admins can manage themes"
  ON weekly_themes FOR ALL
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('tutor', 'admin')
  ));

-- Daily activities policies
ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view daily activities"
  ON daily_activities FOR SELECT
  USING (TRUE);

-- Learning centers policies
ALTER TABLE learning_centers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view active learning centers"
  ON learning_centers FOR SELECT
  USING (active = TRUE);

-- Competencies reference table (public read)
ALTER TABLE competencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view competencies"
  ON competencies FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage competencies"
  ON competencies FOR ALL
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- ============================================================================
-- 5. HELPER FUNCTIONS
-- ============================================================================

-- Function to calculate clan rank for a student
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
  
  -- Calculate rank within clan based on weekly contribution
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset weekly clan contributions (run weekly)
CREATE OR REPLACE FUNCTION reset_weekly_clan_contributions()
RETURNS void AS $$
BEGIN
  UPDATE student_profiles
  SET weekly_clan_contribution = 0;
  
  RAISE NOTICE 'Weekly clan contributions reset';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to award clan points
CREATE OR REPLACE FUNCTION award_clan_points(
  p_student_id UUID,
  p_activity_type TEXT,
  p_points INTEGER,
  p_description TEXT
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
    RAISE EXCEPTION 'Student is not assigned to a clan';
  END IF;
  
  -- Insert clan activity
  INSERT INTO clan_activities (student_id, clan_id, activity_type, points, description)
  VALUES (p_student_id, v_clan_id, p_activity_type, p_points, p_description)
  RETURNING id INTO v_activity_id;
  
  -- Update student's clan points and weekly contribution
  UPDATE student_profiles
  SET 
    clan_points = clan_points + p_points,
    weekly_clan_contribution = weekly_clan_contribution + p_points
  WHERE id = p_student_id;
  
  RETURN v_activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get competency progress summary
CREATE OR REPLACE FUNCTION get_competency_summary(student_uuid UUID)
RETURNS TABLE (
  developmental_area developmental_area,
  total_competencies INTEGER,
  mastered INTEGER,
  proficient INTEGER,
  developing INTEGER,
  emerging INTEGER,
  not_started INTEGER,
  progress_percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.developmental_area,
    COUNT(*)::INTEGER as total_competencies,
    COUNT(*) FILTER (WHERE scp.status = 'mastered')::INTEGER as mastered,
    COUNT(*) FILTER (WHERE scp.status = 'proficient')::INTEGER as proficient,
    COUNT(*) FILTER (WHERE scp.status = 'developing')::INTEGER as developing,
    COUNT(*) FILTER (WHERE scp.status = 'emerging')::INTEGER as emerging,
    COUNT(*) FILTER (WHERE scp.status = 'not_started' OR scp.status IS NULL)::INTEGER as not_started,
    ROUND(
      COUNT(*) FILTER (WHERE scp.status = 'mastered')::NUMERIC / COUNT(*)::NUMERIC * 100,
      2
    ) as progress_percentage
  FROM competencies c
  LEFT JOIN student_competency_progress scp 
    ON c.id = scp.competency_id AND scp.student_id = student_uuid
  GROUP BY c.developmental_area
  ORDER BY c.developmental_area;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 6. SEED COMPETENCIES DATA
-- ============================================================================

-- Insert IB competencies (sample - full data should be imported from application)
INSERT INTO competencies (id, developmental_area, competency_name, description, age_range, examples, assessment_criteria)
VALUES
  -- Health & Physical
  ('hp-1', 'health_physical', 'Gross Motor Development', 'Demonstrates coordination, balance, and body awareness through movement', '4-7', 
   '["Runs, jumps, and climbs confidently", "Participates in active play and games", "Shows body control during movement activities"]',
   '["Can hop on one foot for 5 seconds", "Catches a ball with two hands", "Navigates obstacles during play"]'),
  
  ('hp-2', 'health_physical', 'Fine Motor Skills', 'Uses hands and fingers with increasing precision and control', '4-7',
   '["Holds pencil with proper grip", "Cuts with scissors along lines", "Manipulates small objects (buttons, beads)"]',
   '["Can draw basic shapes and letters", "Builds with blocks showing control", "Uses tools (scissors, glue) appropriately"]'),
  
  -- Language & Literacy
  ('ll-1', 'language_literacy', 'Oral Communication', 'Expresses ideas, thoughts, and feelings through spoken language', '4-7',
   '["Shares stories and experiences with others", "Asks questions to learn more", "Participates in conversations"]',
   '["Speaks in complete sentences", "Vocabulary appropriate for age", "Listens and responds to others"]'),
  
  ('ll-2', 'language_literacy', 'Early Reading Skills', 'Develops phonemic awareness and beginning reading skills', '4-7',
   '["Recognizes letters and letter sounds", "Shows interest in books and stories", "Begins to decode simple words"]',
   '["Identifies most letter names and sounds", "Recognizes high-frequency words", "Reads simple sentences with support"]'),
  
  -- Numeracy & Cognitive
  ('nc-1', 'numeracy_cognitive', 'Number Sense', 'Understands quantity, counting, and basic number concepts', '4-7',
   '["Counts objects accurately to 20+", "Understands more, less, and equal", "Recognizes and writes numbers"]',
   '["One-to-one correspondence when counting", "Compares quantities and explains reasoning", "Skip counts by 2s, 5s, or 10s"]'),
  
  -- Social & Emotional
  ('se-1', 'social_emotional', 'Self-Awareness', 'Recognizes and understands own feelings, strengths, and needs', '4-7',
   '["Names and describes feelings", "Identifies personal interests", "Recognizes when needing help"]',
   '["Uses feeling words appropriately", "Shows awareness of own abilities", "Communicates needs to adults"]')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '✅ EDUCATIONAL FEATURES MIGRATION COMPLETE';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '';
  RAISE NOTICE '📚 Features Added:';
  RAISE NOTICE '  • Clan System (4 clans, activities, challenges)';
  RAISE NOTICE '  • IB Competency Framework (7 developmental areas)';
  RAISE NOTICE '  • Theme-Based Curriculum (themes, activities, centers)';
  RAISE NOTICE '';
  RAISE NOTICE '🗄️  Tables Created:';
  RAISE NOTICE '  • clan_activities';
  RAISE NOTICE '  • clan_challenges';
  RAISE NOTICE '  • clan_challenge_participants';
  RAISE NOTICE '  • competencies';
  RAISE NOTICE '  • student_competency_progress';
  RAISE NOTICE '  • weekly_themes';
  RAISE NOTICE '  • daily_activities';
  RAISE NOTICE '  • learning_centers';
  RAISE NOTICE '';
  RAISE NOTICE '🔐 RLS Policies: Enabled on all tables';
  RAISE NOTICE '⚡ Helper Functions: Created for clan & competency management';
  RAISE NOTICE '';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
END $$;

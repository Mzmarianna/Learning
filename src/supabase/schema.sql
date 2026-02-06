-- ============================================================================
-- MZ. MARIANNA'S ACADEMY - COMPLETE DATABASE SCHEMA
-- Backend: Supabase (PostgreSQL)
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS & PROFILES
-- ============================================================================

-- User Roles Enum
CREATE TYPE user_role AS ENUM ('student', 'parent', 'tutor', 'admin');

-- Tier Enum
CREATE TYPE tier_level AS ENUM ('early-explorers', 'explorers', 'warriors');

-- Mastery Level Enum
CREATE TYPE mastery_level AS ENUM ('emerging', 'developing', 'proficient', 'advanced', 'mastered');

-- Profiles Table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student Profiles
CREATE TABLE student_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  age INTEGER NOT NULL CHECK (age >= 4 AND age <= 18),
  tier tier_level NOT NULL,
  current_level INTEGER DEFAULT 1,
  total_xp INTEGER DEFAULT 0,
  gems INTEGER DEFAULT 0,
  unlocked_characters JSONB DEFAULT '["wise_owl", "sparkle_unicorn"]'::jsonb,
  current_quest_id TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Parent-Student Relationships
CREATE TABLE parent_students (
  parent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
  relationship TEXT DEFAULT 'parent', -- parent, guardian, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (parent_id, student_id)
);

-- Tutor-Student Assignments
CREATE TABLE tutor_students (
  tutor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  PRIMARY KEY (tutor_id, student_id)
);

-- ============================================================================
-- CURRICULUM & PROGRESS
-- ============================================================================

-- Quest Progress
CREATE TABLE quest_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
  quest_id TEXT NOT NULL,
  quest_week INTEGER NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  total_challenges INTEGER NOT NULL,
  completed_challenges INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  UNIQUE(student_id, quest_id)
);

-- Challenge Progress
CREATE TABLE challenge_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL,
  quest_id TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  mastery_level mastery_level,
  xp_earned INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  UNIQUE(student_id, challenge_id)
);

-- Badges Earned
CREATE TABLE badges_earned (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  quest_id TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, badge_id)
);

-- ============================================================================
-- SUBMISSIONS & ASSESSMENTS
-- ============================================================================

-- Submission Type Enum
CREATE TYPE submission_type AS ENUM ('text', 'image', 'video', 'multiple', 'screenshot', 'digital');

-- Submission Status Enum
CREATE TYPE submission_status AS ENUM ('pending', 'assessed', 'needs-review', 'resubmitted');

-- Submissions
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL,
  challenge_title TEXT NOT NULL,
  quest_id TEXT NOT NULL,
  type submission_type NOT NULL,
  status submission_status DEFAULT 'pending',
  
  -- Content
  text_content TEXT,
  image_urls TEXT[], -- Array of storage URLs
  video_url TEXT,
  
  -- Assessment
  mastery_level mastery_level,
  xp_earned INTEGER DEFAULT 0,
  feedback JSONB, -- Wowl's full feedback object
  
  -- Metadata
  attempt_number INTEGER DEFAULT 1,
  is_resubmission BOOLEAN DEFAULT FALSE,
  original_submission_id UUID REFERENCES submissions(id),
  
  -- Timestamps
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  assessed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES profiles(id), -- Tutor who reviewed (if manual)
  
  -- Flags
  needs_manual_review BOOLEAN DEFAULT FALSE,
  flagged_for_tutor BOOLEAN DEFAULT FALSE
);

-- Assessment Criteria Scores
CREATE TABLE assessment_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  criterion_id TEXT NOT NULL,
  criterion_name TEXT NOT NULL,
  score DECIMAL(3,2) CHECK (score >= 0 AND score <= 1), -- 0.0 to 1.0
  feedback TEXT,
  weight DECIMAL(3,2) DEFAULT 1.0
);

-- ============================================================================
-- LEARNING ANALYTICS
-- ============================================================================

-- Daily Activity Log
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'login', 'submission', 'challenge_start', 'quest_complete', etc.
  activity_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Learning Sessions
CREATE TABLE learning_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_minutes INTEGER,
  challenges_worked_on TEXT[],
  xp_earned_in_session INTEGER DEFAULT 0
);

-- Mastery History (track progress over time)
CREATE TABLE mastery_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL, -- 'STEAM', 'Math', 'Writing', etc.
  mastery_level mastery_level NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- COMMUNICATION
-- ============================================================================

-- Message Type Enum
CREATE TYPE message_type AS ENUM ('parent-tutor', 'tutor-parent', 'system', 'wowl');

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES student_profiles(id), -- Context: which student is this about
  type message_type NOT NULL,
  subject TEXT,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alerts for Tutors
CREATE TABLE tutor_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL, -- 'warning', 'info', 'success'
  message TEXT NOT NULL,
  actionable BOOLEAN DEFAULT FALSE,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- LESSONS & SCHEDULING (Tutor Tools)
-- ============================================================================

-- Lesson Type Enum
CREATE TYPE lesson_type AS ENUM ('one-on-one', 'small-group', 'workshop', 'assessment');

-- Lessons
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type lesson_type NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lesson Participants
CREATE TABLE lesson_participants (
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
  attended BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (lesson_id, student_id)
);

-- ============================================================================
-- PORTFOLIO & SHOWCASE
-- ============================================================================

-- Portfolio Items
CREATE TABLE portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  added_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Profiles
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- Student Profiles
CREATE INDEX idx_student_profiles_tier ON student_profiles(tier);
CREATE INDEX idx_student_profiles_current_quest ON student_profiles(current_quest_id);

-- Quest Progress
CREATE INDEX idx_quest_progress_student ON quest_progress(student_id);
CREATE INDEX idx_quest_progress_quest ON quest_progress(quest_id);

-- Challenge Progress
CREATE INDEX idx_challenge_progress_student ON challenge_progress(student_id);
CREATE INDEX idx_challenge_progress_challenge ON challenge_progress(challenge_id);

-- Submissions
CREATE INDEX idx_submissions_student ON submissions(student_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_challenge ON submissions(challenge_id);
CREATE INDEX idx_submissions_needs_review ON submissions(needs_manual_review) WHERE needs_manual_review = TRUE;

-- Activity Log
CREATE INDEX idx_activity_log_student ON activity_log(student_id);
CREATE INDEX idx_activity_log_created ON activity_log(created_at DESC);

-- Messages
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_unread ON messages(read_at) WHERE read_at IS NULL;

-- Tutor Alerts
CREATE INDEX idx_tutor_alerts_tutor ON tutor_alerts(tutor_id);
CREATE INDEX idx_tutor_alerts_unresolved ON tutor_alerts(resolved) WHERE resolved = FALSE;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges_earned ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mastery_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- PROFILES: Users can read their own profile, admins can read all
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- STUDENT PROFILES: Students see their own, parents see their children's, tutors see assigned students
CREATE POLICY "Students can view own profile"
  ON student_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Parents can view their children's profiles"
  ON student_profiles FOR SELECT
  USING (
    id IN (
      SELECT student_id FROM parent_students WHERE parent_id = auth.uid()
    )
  );

CREATE POLICY "Tutors can view assigned students"
  ON student_profiles FOR SELECT
  USING (
    id IN (
      SELECT student_id FROM tutor_students WHERE tutor_id = auth.uid()
    )
  );

-- SUBMISSIONS: Students see their own, parents see their children's, tutors see assigned students'
CREATE POLICY "Students can view own submissions"
  ON submissions FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Students can create submissions"
  ON submissions FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Parents can view their children's submissions"
  ON submissions FOR SELECT
  USING (
    student_id IN (
      SELECT student_id FROM parent_students WHERE parent_id = auth.uid()
    )
  );

CREATE POLICY "Tutors can view assigned students' submissions"
  ON submissions FOR SELECT
  USING (
    student_id IN (
      SELECT student_id FROM tutor_students WHERE tutor_id = auth.uid()
    )
  );

CREATE POLICY "Tutors can update submissions (for manual review)"
  ON submissions FOR UPDATE
  USING (
    student_id IN (
      SELECT student_id FROM tutor_students WHERE tutor_id = auth.uid()
    )
  );

-- MESSAGES: Users can see messages sent to them or by them
CREATE POLICY "Users can view their messages"
  ON messages FOR SELECT
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (sender_id = auth.uid());

-- TUTOR ALERTS: Tutors can see their own alerts
CREATE POLICY "Tutors can view their alerts"
  ON tutor_alerts FOR SELECT
  USING (tutor_id = auth.uid());

-- LESSONS: Tutors can manage their own lessons
CREATE POLICY "Tutors can view their lessons"
  ON lessons FOR SELECT
  USING (tutor_id = auth.uid());

CREATE POLICY "Tutors can create lessons"
  ON lessons FOR INSERT
  WITH CHECK (tutor_id = auth.uid());

CREATE POLICY "Tutors can update their lessons"
  ON lessons FOR UPDATE
  USING (tutor_id = auth.uid());

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_profiles_updated_at
  BEFORE UPDATE ON student_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function: Calculate XP from mastery level
CREATE OR REPLACE FUNCTION calculate_xp_from_mastery(
  base_xp INTEGER,
  mastery mastery_level
)
RETURNS INTEGER AS $$
BEGIN
  RETURN CASE mastery
    WHEN 'emerging' THEN (base_xp * 0.5)::INTEGER
    WHEN 'developing' THEN (base_xp * 0.75)::INTEGER
    WHEN 'proficient' THEN base_xp
    WHEN 'advanced' THEN (base_xp * 1.5)::INTEGER
    WHEN 'mastered' THEN (base_xp * 2.0)::INTEGER
  END;
END;
$$ LANGUAGE plpgsql;

-- Function: Award XP to student
CREATE OR REPLACE FUNCTION award_xp_to_student(
  p_student_id UUID,
  p_xp_amount INTEGER
)
RETURNS VOID AS $$
BEGIN
  UPDATE student_profiles
  SET total_xp = total_xp + p_xp_amount,
      current_level = 1 + (total_xp + p_xp_amount) / 500 -- Level up every 500 XP
  WHERE id = p_student_id;
END;
$$ LANGUAGE plpgsql;

-- Function: Check if student needs attention (no activity in 5+ days)
CREATE OR REPLACE FUNCTION check_student_needs_attention(p_student_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  last_activity TIMESTAMPTZ;
BEGIN
  SELECT MAX(created_at) INTO last_activity
  FROM activity_log
  WHERE student_id = p_student_id;
  
  RETURN last_activity IS NULL OR last_activity < NOW() - INTERVAL '5 days';
END;
$$ LANGUAGE plpgsql;

-- Function: Create tutor alert for inactive student
CREATE OR REPLACE FUNCTION create_inactivity_alert()
RETURNS TRIGGER AS $$
DECLARE
  tutor_record RECORD;
  days_inactive INTEGER;
BEGIN
  -- Check if student has been inactive for 5+ days
  IF NEW.created_at > OLD.created_at + INTERVAL '5 days' THEN
    days_inactive := EXTRACT(DAY FROM NEW.created_at - OLD.created_at);
    
    -- Create alert for each assigned tutor
    FOR tutor_record IN
      SELECT tutor_id FROM tutor_students WHERE student_id = NEW.student_id
    LOOP
      INSERT INTO tutor_alerts (tutor_id, student_id, alert_type, message, actionable)
      VALUES (
        tutor_record.tutor_id,
        NEW.student_id,
        'warning',
        format('Student has been inactive for %s days', days_inactive),
        TRUE
      );
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Student Dashboard View
CREATE OR REPLACE VIEW student_dashboard_view AS
SELECT 
  sp.id,
  p.display_name,
  p.avatar_url,
  sp.age,
  sp.tier,
  sp.current_level,
  sp.total_xp,
  sp.current_quest_id,
  COUNT(DISTINCT cp.id) as challenges_completed,
  COUNT(DISTINCT be.id) as badges_earned,
  COALESCE(
    (SELECT COUNT(*) FROM activity_log 
     WHERE student_id = sp.id 
     AND created_at >= NOW() - INTERVAL '7 days'), 
    0
  ) as activities_this_week
FROM student_profiles sp
JOIN profiles p ON p.id = sp.id
LEFT JOIN challenge_progress cp ON cp.student_id = sp.id AND cp.completed_at IS NOT NULL
LEFT JOIN badges_earned be ON be.student_id = sp.id
GROUP BY sp.id, p.display_name, p.avatar_url, sp.age, sp.tier, sp.current_level, sp.total_xp, sp.current_quest_id;

-- Parent Dashboard View (for each child)
CREATE OR REPLACE VIEW parent_child_view AS
SELECT 
  ps.parent_id,
  sp.id as student_id,
  p.display_name,
  sp.age,
  sp.tier,
  sp.current_level,
  sp.total_xp,
  sp.current_quest_id,
  COUNT(DISTINCT cp.id) as challenges_completed,
  COUNT(DISTINCT be.id) as badges_earned,
  MAX(al.created_at) as last_active
FROM parent_students ps
JOIN student_profiles sp ON sp.id = ps.student_id
JOIN profiles p ON p.id = sp.id
LEFT JOIN challenge_progress cp ON cp.student_id = sp.id AND cp.completed_at IS NOT NULL
LEFT JOIN badges_earned be ON be.student_id = sp.id
LEFT JOIN activity_log al ON al.student_id = sp.id
GROUP BY ps.parent_id, sp.id, p.display_name, sp.age, sp.tier, sp.current_level, sp.total_xp, sp.current_quest_id;

-- Tutor Student Overview
CREATE OR REPLACE VIEW tutor_student_overview AS
SELECT 
  ts.tutor_id,
  sp.id as student_id,
  p.display_name,
  sp.age,
  sp.tier,
  sp.current_level,
  sp.total_xp,
  sp.current_quest_id,
  COUNT(DISTINCT cp.id) as challenges_completed,
  MAX(al.created_at) as last_active,
  check_student_needs_attention(sp.id) as needs_attention
FROM tutor_students ts
JOIN student_profiles sp ON sp.id = ts.student_id
JOIN profiles p ON p.id = sp.id
LEFT JOIN challenge_progress cp ON cp.student_id = sp.id AND cp.completed_at IS NOT NULL
LEFT JOIN activity_log al ON al.student_id = sp.id
GROUP BY ts.tutor_id, sp.id, p.display_name, sp.age, sp.tier, sp.current_level, sp.total_xp, sp.current_quest_id;

-- ============================================================================
-- SEED DATA (Optional - for testing)
-- ============================================================================

-- Note: Actual users are created via Supabase Auth
-- This is just reference data structure

-- Example: Insert a test student after auth signup
-- INSERT INTO profiles (id, role, email, display_name)
-- VALUES ('user-uuid', 'student', 'student@example.com', 'Alex Explorer');

-- INSERT INTO student_profiles (id, age, tier)
-- VALUES ('user-uuid', 10, 'explorers');
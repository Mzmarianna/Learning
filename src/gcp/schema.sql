-- ============================================================================
-- MZ. MARIANNA'S ACADEMY - GOOGLE CLOUD SQL SCHEMA
-- Backend: Google Cloud SQL for PostgreSQL 15
-- Migrated from Supabase to GCP
-- ============================================================================

-- ============================================================================
-- ENABLE EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE user_role AS ENUM ('student', 'parent', 'tutor', 'admin');
CREATE TYPE tier_level AS ENUM ('early-explorers', 'explorers', 'warriors');
CREATE TYPE mastery_level AS ENUM ('emerging', 'developing', 'proficient', 'advanced', 'mastered');
CREATE TYPE submission_type AS ENUM ('text', 'image', 'video', 'multiple', 'screenshot', 'digital');
CREATE TYPE submission_status AS ENUM ('pending', 'assessed', 'needs-review', 'resubmitted');
CREATE TYPE message_type AS ENUM ('parent-tutor', 'tutor-parent', 'system', 'wowl');
CREATE TYPE lesson_type AS ENUM ('one-on-one', 'small-group', 'workshop', 'assessment');
CREATE TYPE alert_type AS ENUM ('warning', 'info', 'success');

-- ============================================================================
-- USERS & AUTHENTICATION (replaces Supabase auth.users)
-- ============================================================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL, -- bcrypt hashed
  email_verified BOOLEAN DEFAULT FALSE,
  verification_token TEXT,
  reset_token TEXT,
  reset_token_expires TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_verification_token ON users(verification_token);
CREATE INDEX idx_users_reset_token ON users(reset_token);

-- ============================================================================
-- PROFILES
-- ============================================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- ============================================================================
-- STUDENT PROFILES
-- ============================================================================

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

CREATE INDEX idx_student_profiles_tier ON student_profiles(tier);
CREATE INDEX idx_student_profiles_current_level ON student_profiles(current_level);
CREATE INDEX idx_student_profiles_total_xp ON student_profiles(total_xp);

-- ============================================================================
-- RELATIONSHIPS
-- ============================================================================

CREATE TABLE parent_students (
  parent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
  relationship TEXT DEFAULT 'parent',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (parent_id, student_id)
);

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

CREATE INDEX idx_quest_progress_student_id ON quest_progress(student_id);
CREATE INDEX idx_quest_progress_quest_id ON quest_progress(quest_id);

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

CREATE INDEX idx_challenge_progress_student_id ON challenge_progress(student_id);
CREATE INDEX idx_challenge_progress_challenge_id ON challenge_progress(challenge_id);

CREATE TABLE badges_earned (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  quest_id TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, badge_id)
);

CREATE INDEX idx_badges_earned_student_id ON badges_earned(student_id);

-- ============================================================================
-- SUBMISSIONS & ASSESSMENTS
-- ============================================================================

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
  image_urls TEXT[],
  video_url TEXT,
  
  -- Assessment
  mastery_level mastery_level,
  xp_earned INTEGER DEFAULT 0,
  feedback JSONB,
  
  -- Metadata
  attempt_number INTEGER DEFAULT 1,
  is_resubmission BOOLEAN DEFAULT FALSE,
  original_submission_id UUID REFERENCES submissions(id),
  
  -- Timestamps
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  assessed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES profiles(id),
  
  -- Flags
  needs_manual_review BOOLEAN DEFAULT FALSE,
  flagged_for_tutor BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_submissions_student_id ON submissions(student_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_challenge_id ON submissions(challenge_id);

CREATE TABLE assessment_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  criterion_id TEXT NOT NULL,
  criterion_name TEXT NOT NULL,
  score DECIMAL(3,2) CHECK (score >= 0 AND score <= 1),
  feedback TEXT,
  weight DECIMAL(3,2) DEFAULT 1.0
);

CREATE INDEX idx_assessment_scores_submission_id ON assessment_scores(submission_id);

-- ============================================================================
-- ANALYTICS & LOGGING
-- ============================================================================

CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  activity_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_log_student_id ON activity_log(student_id);
CREATE INDEX idx_activity_log_activity_type ON activity_log(activity_type);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at);

CREATE TABLE learning_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_minutes INTEGER,
  challenges_worked_on TEXT[],
  xp_earned_in_session INTEGER DEFAULT 0
);

CREATE INDEX idx_learning_sessions_student_id ON learning_sessions(student_id);

CREATE TABLE mastery_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  mastery_level mastery_level NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mastery_history_student_id ON mastery_history(student_id);
CREATE INDEX idx_mastery_history_subject ON mastery_history(subject);

-- ============================================================================
-- COMMUNICATION
-- ============================================================================

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES profiles(id),
  recipient_id UUID REFERENCES profiles(id) NOT NULL,
  student_id UUID REFERENCES student_profiles(id),
  type message_type NOT NULL,
  subject TEXT,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

CREATE TABLE tutor_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
  alert_type alert_type NOT NULL,
  message TEXT NOT NULL,
  actionable BOOLEAN DEFAULT FALSE,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tutor_alerts_tutor_id ON tutor_alerts(tutor_id);
CREATE INDEX idx_tutor_alerts_resolved ON tutor_alerts(resolved);

-- ============================================================================
-- LESSONS & SCHEDULING
-- ============================================================================

CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type lesson_type NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lessons_tutor_id ON lessons(tutor_id);
CREATE INDEX idx_lessons_scheduled_at ON lessons(scheduled_at);

CREATE TABLE lesson_participants (
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
  attended BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (lesson_id, student_id)
);

-- ============================================================================
-- PORTFOLIO
-- ============================================================================

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

CREATE INDEX idx_portfolio_items_student_id ON portfolio_items(student_id);
CREATE INDEX idx_portfolio_items_display_order ON portfolio_items(display_order);

-- ============================================================================
-- SESSIONS (for Express session storage)
-- ============================================================================

CREATE TABLE sessions (
  sid TEXT PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_sessions_expire ON sessions(expire);

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Student Dashboard View
CREATE VIEW student_dashboard_view AS
SELECT 
  p.id,
  p.display_name,
  p.avatar_url,
  sp.age,
  sp.tier,
  sp.current_level,
  sp.total_xp,
  sp.gems,
  sp.unlocked_characters,
  sp.current_quest_id,
  (SELECT COUNT(*) FROM challenge_progress WHERE student_id = sp.id AND completed_at IS NOT NULL) as challenges_completed,
  (SELECT COUNT(*) FROM badges_earned WHERE student_id = sp.id) as badges_earned,
  (SELECT COUNT(*) FROM activity_log WHERE student_id = sp.id AND created_at > NOW() - INTERVAL '7 days') as activities_this_week
FROM profiles p
JOIN student_profiles sp ON p.id = sp.id
WHERE p.role = 'student';

-- Parent Children View
CREATE VIEW parent_child_view AS
SELECT
  ps.parent_id,
  ps.student_id,
  p.display_name,
  sp.age,
  sp.tier,
  sp.current_level,
  sp.total_xp,
  sp.gems,
  sp.current_quest_id,
  (SELECT COUNT(*) FROM challenge_progress WHERE student_id = sp.id AND completed_at IS NOT NULL) as challenges_completed,
  (SELECT COUNT(*) FROM badges_earned WHERE student_id = sp.id) as badges_earned,
  u.last_sign_in_at as last_active
FROM parent_students ps
JOIN profiles p ON p.id = ps.student_id
JOIN student_profiles sp ON sp.id = ps.student_id
JOIN users u ON u.id = ps.student_id;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Note: In Cloud SQL, implement RLS using application-level logic or database roles
-- ============================================================================

-- Grant permissions to app user
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;

-- Grant read-only to admin for analytics
GRANT SELECT ON ALL TABLES IN SCHEMA public TO admin_user;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE users IS 'Authentication table (replaces Supabase auth.users)';
COMMENT ON TABLE profiles IS 'User profiles with role-based access';
COMMENT ON TABLE student_profiles IS 'Student-specific data including game progress';
COMMENT ON TABLE submissions IS 'Student work submissions for assessment';
COMMENT ON TABLE activity_log IS 'Audit trail of all student activities';
COMMENT ON COLUMN student_profiles.gems IS 'In-game currency earned through achievements';
COMMENT ON COLUMN student_profiles.unlocked_characters IS 'Array of unlocked companion character IDs';

-- ============================================================================
-- COMPLETE!
-- ============================================================================

-- ============================================================================
-- GOOGLE SHEETS FORM INTEGRATION - DATABASE SCHEMA
-- Additional tables for intake form processing and assessment scheduling
-- ============================================================================

-- Form Submissions Table (tracks processed Google Sheets entries)
CREATE TABLE form_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sheet_row_number INTEGER UNIQUE, -- To prevent duplicate processing
  timestamp TIMESTAMPTZ NOT NULL,
  email TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  child_name_and_grade TEXT NOT NULL,
  biggest_struggles TEXT,
  programs_interested JSONB, -- Array of programs
  tutoring_preference TEXT,
  child_strengths TEXT,
  child_likes TEXT,
  payment_method TEXT,
  availability JSONB, -- {monday: [...], tuesday: [...], etc}
  questions TEXT,
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  student_id UUID REFERENCES student_profiles(id),
  parent_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student Intake Data (expanded profile information from form)
CREATE TABLE student_intake (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID UNIQUE REFERENCES student_profiles(id) ON DELETE CASCADE,
  form_submission_id UUID REFERENCES form_submissions(id),
  
  -- Parsed child information
  grade INTEGER,
  age_estimated INTEGER,
  
  -- Learning profile
  biggest_struggles TEXT[],
  strengths TEXT[],
  interests TEXT[],
  learning_style_notes TEXT,
  
  -- Program preferences
  programs_interested TEXT[],
  tutoring_preference TEXT, -- 'one-on-one', 'small-group', 'online', 'in-person'
  payment_method TEXT,
  
  -- Availability schedule
  availability_schedule JSONB, -- {day: [time_slots]}
  
  -- Parent questions/notes
  parent_questions TEXT,
  special_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessment Records
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
  form_submission_id UUID REFERENCES form_submissions(id),
  
  -- Assessment details
  assessment_type TEXT DEFAULT 'initial', -- 'initial', 'placement', 'progress'
  scheduled_date TIMESTAMPTZ,
  completed_date TIMESTAMPTZ,
  duration_minutes INTEGER DEFAULT 30,
  
  -- Assessment results
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled', 'no-show'
  grade_level_assessed INTEGER,
  recommended_tier tier_level,
  recommended_level INTEGER,
  
  -- Common Core standards assessed
  standards_assessed JSONB,
  mastery_scores JSONB, -- {subject: {standard: score}}
  
  -- Action plan
  strengths_identified TEXT[],
  areas_for_improvement TEXT[],
  recommended_focus TEXT[],
  action_plan TEXT,
  
  -- Assignment
  conducted_by UUID REFERENCES profiles(id), -- Tutor who conducted assessment
  tutor_notes TEXT,
  
  -- Communication
  results_sent_to_parent BOOLEAN DEFAULT FALSE,
  results_sent_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_form_submissions_email ON form_submissions(email);
CREATE INDEX idx_form_submissions_processed ON form_submissions(processed);
CREATE INDEX idx_form_submissions_timestamp ON form_submissions(timestamp DESC);
CREATE INDEX idx_student_intake_student_id ON student_intake(student_id);
CREATE INDEX idx_assessments_student_id ON assessments(student_id);
CREATE INDEX idx_assessments_scheduled_date ON assessments(scheduled_date);
CREATE INDEX idx_assessments_status ON assessments(status);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_student_intake_updated_at BEFORE UPDATE ON student_intake
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE form_submissions IS 'Tracks Google Sheets form submissions from intake questionnaire';
COMMENT ON TABLE student_intake IS 'Expanded student profile data collected during intake process';
COMMENT ON TABLE assessments IS 'Assessment records including initial placement and progress assessments';

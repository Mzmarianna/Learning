-- ============================================================================
-- PLACEMENT QUIZ SYSTEM
-- Stores quiz results and tier assignments
-- ============================================================================

-- Placement quiz results table
CREATE TABLE IF NOT EXISTS placement_quiz_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Tier assignment
  assigned_tier tier_level NOT NULL,
  recommended_start_quest TEXT NOT NULL,
  
  -- Skill levels (1-10)
  math_level INTEGER NOT NULL CHECK (math_level >= 1 AND math_level <= 10),
  reading_level INTEGER NOT NULL CHECK (reading_level >= 1 AND reading_level <= 10),
  writing_level INTEGER NOT NULL CHECK (writing_level >= 1 AND writing_level <= 10),
  overall_level INTEGER NOT NULL CHECK (overall_level >= 1 AND overall_level <= 10),
  
  -- Learning profile
  learning_style TEXT NOT NULL CHECK (learning_style IN ('visual', 'kinesthetic', 'auditory', 'mixed')),
  strengths JSONB DEFAULT '[]',
  growth_areas JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  neurodivergent_supports JSONB DEFAULT '[]',
  
  -- Raw quiz data
  quiz_answers JSONB NOT NULL, -- Array of {questionId, answer, isCorrect}
  quiz_version TEXT DEFAULT '1.0',
  
  -- Metadata
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Only one quiz result per student (can retake and replace)
  UNIQUE(student_id)
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_placement_results_student ON placement_quiz_results(student_id);
CREATE INDEX IF NOT EXISTS idx_placement_results_tier ON placement_quiz_results(assigned_tier);
CREATE INDEX IF NOT EXISTS idx_placement_results_completed ON placement_quiz_results(completed_at DESC);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

ALTER TABLE placement_quiz_results ENABLE ROW LEVEL SECURITY;

-- Students can view own results
CREATE POLICY "Students can view own placement results" ON placement_quiz_results
  FOR SELECT USING (auth.uid() = student_id);

-- Parents can view their children's results
CREATE POLICY "Parents can view children placement results" ON placement_quiz_results
  FOR SELECT USING (
    student_id IN (SELECT student_id FROM parent_students WHERE parent_id = auth.uid())
  );

-- Tutors and admins can view all results
CREATE POLICY "Tutors can view all placement results" ON placement_quiz_results
  FOR SELECT USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('tutor', 'admin')));

-- Students can insert their own results
CREATE POLICY "Students can insert own placement results" ON placement_quiz_results
  FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Students can update their own results (for retakes)
CREATE POLICY "Students can update own placement results" ON placement_quiz_results
  FOR UPDATE USING (auth.uid() = student_id);

-- Tutors/admins can manage all results
CREATE POLICY "Tutors can manage placement results" ON placement_quiz_results
  FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('tutor', 'admin')));

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

/**
 * Save placement quiz results and update student profile
 */
CREATE OR REPLACE FUNCTION save_placement_quiz_result(
  p_student_id UUID,
  p_assigned_tier tier_level,
  p_math_level INTEGER,
  p_reading_level INTEGER,
  p_writing_level INTEGER,
  p_overall_level INTEGER,
  p_learning_style TEXT,
  p_strengths JSONB,
  p_growth_areas JSONB,
  p_recommendations JSONB,
  p_neurodivergent_supports JSONB,
  p_recommended_start_quest TEXT,
  p_quiz_answers JSONB
)
RETURNS UUID AS $$
DECLARE
  v_result_id UUID;
BEGIN
  -- Insert or update quiz results
  INSERT INTO placement_quiz_results (
    student_id,
    assigned_tier,
    recommended_start_quest,
    math_level,
    reading_level,
    writing_level,
    overall_level,
    learning_style,
    strengths,
    growth_areas,
    recommendations,
    neurodivergent_supports,
    quiz_answers
  ) VALUES (
    p_student_id,
    p_assigned_tier,
    p_recommended_start_quest,
    p_math_level,
    p_reading_level,
    p_writing_level,
    p_overall_level,
    p_learning_style,
    p_strengths,
    p_growth_areas,
    p_recommendations,
    p_neurodivergent_supports,
    p_quiz_answers
  )
  ON CONFLICT (student_id) DO UPDATE SET
    assigned_tier = EXCLUDED.assigned_tier,
    recommended_start_quest = EXCLUDED.recommended_start_quest,
    math_level = EXCLUDED.math_level,
    reading_level = EXCLUDED.reading_level,
    writing_level = EXCLUDED.writing_level,
    overall_level = EXCLUDED.overall_level,
    learning_style = EXCLUDED.learning_style,
    strengths = EXCLUDED.strengths,
    growth_areas = EXCLUDED.growth_areas,
    recommendations = EXCLUDED.recommendations,
    neurodivergent_supports = EXCLUDED.neurodivergent_supports,
    quiz_answers = EXCLUDED.quiz_answers,
    completed_at = NOW()
  RETURNING id INTO v_result_id;
  
  -- Update student profile with tier
  UPDATE student_profiles
  SET 
    tier = p_assigned_tier,
    current_quest_id = p_recommended_start_quest,
    updated_at = NOW()
  WHERE id = p_student_id;
  
  -- Log activity
  INSERT INTO activity_log (student_id, activity_type, activity_data)
  VALUES (p_student_id, 'placement_quiz_complete', jsonb_build_object(
    'tier', p_assigned_tier,
    'overall_level', p_overall_level,
    'result_id', v_result_id
  ));
  
  RETURN v_result_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

/**
 * Get placement quiz result for student
 */
CREATE OR REPLACE FUNCTION get_placement_result(p_student_id UUID)
RETURNS TABLE (
  id UUID,
  assigned_tier tier_level,
  math_level INTEGER,
  reading_level INTEGER,
  writing_level INTEGER,
  overall_level INTEGER,
  learning_style TEXT,
  strengths JSONB,
  growth_areas JSONB,
  recommendations JSONB,
  neurodivergent_supports JSONB,
  recommended_start_quest TEXT,
  completed_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pqr.id,
    pqr.assigned_tier,
    pqr.math_level,
    pqr.reading_level,
    pqr.writing_level,
    pqr.overall_level,
    pqr.learning_style,
    pqr.strengths,
    pqr.growth_areas,
    pqr.recommendations,
    pqr.neurodivergent_supports,
    pqr.recommended_start_quest,
    pqr.completed_at
  FROM placement_quiz_results pqr
  WHERE pqr.student_id = p_student_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '✅ PLACEMENT QUIZ SYSTEM MIGRATION COMPLETE';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Tables Created: 1';
  RAISE NOTICE '   - placement_quiz_results';
  RAISE NOTICE '';
  RAISE NOTICE '⚡ Functions Created: 2';
  RAISE NOTICE '   - save_placement_quiz_result()';
  RAISE NOTICE '   - get_placement_result()';
  RAISE NOTICE '';
  RAISE NOTICE '🔒 RLS Policies: 7';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Ready to use!';
  RAISE NOTICE '';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
END $$;

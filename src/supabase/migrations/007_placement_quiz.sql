-- ============================================================================
-- PLACEMENT QUIZ SYSTEM
-- Adaptive quiz to determine student's skill tier (Early Explorers, Explorers, Warriors)
-- ============================================================================

-- Placement Quiz Questions Table
CREATE TABLE IF NOT EXISTS placement_quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('reading', 'math', 'critical_thinking', 'writing')),
  difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('early_explorers', 'explorers', 'warriors')),
  
  -- Multiple choice options (JSON array)
  options JSONB NOT NULL, -- ["Option A", "Option B", "Option C", "Option D"]
  correct_answer INTEGER NOT NULL, -- Index of correct answer (0-3)
  
  -- Age appropriateness (for UI presentation)
  min_age INTEGER DEFAULT 4,
  max_age INTEGER DEFAULT 18,
  
  -- Explanation shown after answer
  explanation TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  
  -- Order within difficulty level
  sort_order INTEGER DEFAULT 0
);

-- Student Placement Quiz Attempts Table
CREATE TABLE IF NOT EXISTS placement_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Student info (before account creation)
  student_name TEXT NOT NULL,
  student_age INTEGER NOT NULL,
  student_interests TEXT[], -- ["minecraft", "art", "animals"]
  parent_email TEXT,
  
  -- Quiz session
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Results
  recommended_tier TEXT CHECK (recommended_tier IN ('early_explorers', 'explorers', 'warriors')),
  total_questions_answered INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  accuracy_percentage DECIMAL(5,2),
  
  -- Detailed results by category
  reading_score DECIMAL(5,2),
  math_score DECIMAL(5,2),
  critical_thinking_score DECIMAL(5,2),
  
  -- Answers (for review)
  answers JSONB, -- [{"question_id": "uuid", "answer": 2, "correct": true, "time_seconds": 15}]
  
  -- Conversion tracking
  converted_to_subscription BOOLEAN DEFAULT false,
  subscription_created_at TIMESTAMP WITH TIME ZONE,
  
  -- Link to actual profile once created
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_quiz_questions_difficulty ON placement_quiz_questions(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_type ON placement_quiz_questions(question_type);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_email ON placement_quiz_attempts(parent_email);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_completed ON placement_quiz_attempts(completed_at);

-- Enable RLS
ALTER TABLE placement_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE placement_quiz_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can read active questions (for public quiz)
CREATE POLICY "Anyone can read active quiz questions"
  ON placement_quiz_questions FOR SELECT
  USING (is_active = true);

-- Only admins can modify questions
CREATE POLICY "Only admins can modify quiz questions"
  ON placement_quiz_questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Anyone can create quiz attempts (before login)
CREATE POLICY "Anyone can create quiz attempts"
  ON placement_quiz_attempts FOR INSERT
  WITH CHECK (true);

-- Users can read their own attempts
CREATE POLICY "Users can read own quiz attempts"
  ON placement_quiz_attempts FOR SELECT
  USING (
    parent_email = (SELECT email FROM profiles WHERE id = auth.uid())
    OR profile_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'tutor')
    )
  );

-- Users can update their own attempts (to complete quiz)
CREATE POLICY "Users can update own quiz attempts"
  ON placement_quiz_attempts FOR UPDATE
  USING (
    parent_email = (SELECT email FROM profiles WHERE id = auth.uid())
    OR profile_id = auth.uid()
  );

-- ============================================================================
-- SEED PLACEMENT QUIZ QUESTIONS
-- ============================================================================

-- EARLY EXPLORERS (PreK-2nd Grade) - Reading
INSERT INTO placement_quiz_questions (question_text, question_type, difficulty_level, options, correct_answer, explanation, min_age, max_age, sort_order)
VALUES
  (
    'Which word rhymes with "cat"?',
    'reading',
    'early_explorers',
    '["dog", "hat", "fish", "bird"]'::jsonb,
    1,
    'Great job! "Cat" and "hat" rhyme because they both end with "-at".',
    4, 7, 1
  ),
  (
    'What sound does the letter "B" make?',
    'reading',
    'early_explorers',
    '["buh", "cuh", "duh", "fuh"]'::jsonb,
    0,
    'Awesome! B makes the "buh" sound, like in "ball" or "banana".',
    4, 7, 2
  ),
  (
    'How many syllables are in the word "butterfly"?',
    'reading',
    'early_explorers',
    '["1", "2", "3", "4"]'::jsonb,
    2,
    'Excellent! But-ter-fly has 3 syllables. You can clap them out!',
    5, 8, 3
  );

-- EARLY EXPLORERS - Math
INSERT INTO placement_quiz_questions (question_text, question_type, difficulty_level, options, correct_answer, explanation, min_age, max_age, sort_order)
VALUES
  (
    'If you have 3 apples and get 2 more, how many apples do you have?',
    'math',
    'early_explorers',
    '["4", "5", "6", "3"]'::jsonb,
    1,
    'Perfect! 3 + 2 = 5 apples. You can count on your fingers!',
    4, 7, 1
  ),
  (
    'Which shape has 4 equal sides?',
    'math',
    'early_explorers',
    '["triangle", "square", "circle", "rectangle"]'::jsonb,
    1,
    'Great work! A square has 4 sides that are all the same length.',
    4, 7, 2
  ),
  (
    'What number comes after 9?',
    'math',
    'early_explorers',
    '["8", "10", "11", "12"]'::jsonb,
    1,
    'Nice! 10 comes right after 9 when counting.',
    4, 6, 3
  );

-- EXPLORERS (3rd-5th Grade) - Reading
INSERT INTO placement_quiz_questions (question_text, question_type, difficulty_level, options, correct_answer, explanation, min_age, max_age, sort_order)
VALUES
  (
    'What does the word "enormous" mean?',
    'reading',
    'explorers',
    '["very small", "very large", "very fast", "very slow"]'::jsonb,
    1,
    'Excellent! "Enormous" means extremely large or huge.',
    8, 12, 1
  ),
  (
    'In the sentence "The brave knight fought the dragon," what is the verb?',
    'reading',
    'explorers',
    '["brave", "knight", "fought", "dragon"]'::jsonb,
    2,
    'Perfect! "Fought" is the action word (verb) in this sentence.',
    8, 12, 2
  ),
  (
    'What is the main idea of a paragraph about lions hunting in packs?',
    'reading',
    'explorers',
    '["Lions are dangerous", "Lions work together to hunt", "Lions live in Africa", "Lions are cats"]'::jsonb,
    1,
    'Great thinking! The main idea focuses on HOW lions hunt together.',
    9, 13, 3
  );

-- EXPLORERS - Math
INSERT INTO placement_quiz_questions (question_text, question_type, difficulty_level, options, correct_answer, explanation, min_age, max_age, sort_order)
VALUES
  (
    'What is 7 × 8?',
    'math',
    'explorers',
    '["54", "56", "64", "48"]'::jsonb,
    1,
    'Awesome! 7 × 8 = 56. This is a key multiplication fact!',
    8, 12, 1
  ),
  (
    'If a pizza has 8 slices and you eat 3, what fraction is left?',
    'math',
    'explorers',
    '["3/8", "5/8", "3/5", "1/2"]'::jsonb,
    1,
    'Perfect! 5 slices out of 8 total = 5/8 remaining.',
    9, 13, 2
  ),
  (
    'A rectangle has a length of 6 and width of 4. What is its area?',
    'math',
    'explorers',
    '["10", "20", "24", "28"]'::jsonb,
    2,
    'Excellent! Area = length × width, so 6 × 4 = 24.',
    9, 13, 3
  );

-- WARRIORS (6th-8th Grade) - Reading
INSERT INTO placement_quiz_questions (question_text, question_type, difficulty_level, options, correct_answer, explanation, min_age, max_age, sort_order)
VALUES
  (
    'What literary device is used in "The wind whispered through the trees"?',
    'reading',
    'warriors',
    '["simile", "metaphor", "personification", "alliteration"]'::jsonb,
    2,
    'Great! Personification gives human qualities (whispering) to non-human things (wind).',
    11, 18, 1
  ),
  (
    'In an argument, what is a "counterargument"?',
    'reading',
    'warriors',
    '["Your main point", "A point against your position", "Supporting evidence", "The conclusion"]'::jsonb,
    1,
    'Perfect! A counterargument presents an opposing viewpoint that you need to address.',
    12, 18, 2
  ),
  (
    'Which word is a synonym for "meticulous"?',
    'reading',
    'warriors',
    '["careless", "careful", "messy", "quick"]'::jsonb,
    1,
    'Excellent vocabulary! "Meticulous" means extremely careful and precise.',
    11, 18, 3
  );

-- WARRIORS - Math
INSERT INTO placement_quiz_questions (question_text, question_type, difficulty_level, options, correct_answer, explanation, min_age, max_age, sort_order)
VALUES
  (
    'Solve for x: 2x + 5 = 13',
    'math',
    'warriors',
    '["2", "4", "6", "8"]'::jsonb,
    1,
    'Great algebra! Subtract 5 from both sides (2x = 8), then divide by 2 (x = 4).',
    11, 18, 1
  ),
  (
    'What is 30% of 80?',
    'math',
    'warriors',
    '["20", "24", "26", "30"]'::jsonb,
    1,
    'Perfect! 30% = 0.30, and 0.30 × 80 = 24.',
    11, 18, 2
  ),
  (
    'A triangle has angles of 60° and 70°. What is the third angle?',
    'math',
    'warriors',
    '["40°", "50°", "60°", "70°"]'::jsonb,
    1,
    'Excellent geometry! Triangle angles sum to 180°, so 180 - 60 - 70 = 50°.',
    12, 18, 3
  );

-- CRITICAL THINKING (Mixed levels)
INSERT INTO placement_quiz_questions (question_text, question_type, difficulty_level, options, correct_answer, explanation, min_age, max_age, sort_order)
VALUES
  (
    'If all dogs are animals, and Rex is a dog, then...',
    'critical_thinking',
    'explorers',
    '["Rex is not an animal", "Rex is an animal", "Some animals are dogs", "Rex is a cat"]'::jsonb,
    1,
    'Great logic! If all dogs are animals, and Rex is a dog, Rex must be an animal.',
    8, 12, 1
  ),
  (
    'What comes next in the pattern? 2, 4, 8, 16, __',
    'critical_thinking',
    'warriors',
    '["20", "24", "28", "32"]'::jsonb,
    3,
    'Excellent pattern recognition! Each number doubles: 2×2=4, 4×2=8, 8×2=16, 16×2=32.',
    11, 18, 1
  );

-- ============================================================================
-- HELPER FUNCTION: Calculate Recommended Tier
-- ============================================================================

CREATE OR REPLACE FUNCTION calculate_recommended_tier(
  p_reading_score DECIMAL,
  p_math_score DECIMAL,
  p_critical_thinking_score DECIMAL,
  p_student_age INTEGER
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_avg_score DECIMAL;
  v_recommended_tier TEXT;
BEGIN
  -- Calculate average score
  v_avg_score := (p_reading_score + p_math_score + COALESCE(p_critical_thinking_score, 0)) / 3;
  
  -- Determine tier based on average score and age
  IF v_avg_score >= 75 AND p_student_age >= 11 THEN
    v_recommended_tier := 'warriors';
  ELSIF v_avg_score >= 60 AND p_student_age >= 8 THEN
    v_recommended_tier := 'explorers';
  ELSIF v_avg_score >= 40 OR p_student_age < 8 THEN
    v_recommended_tier := 'early_explorers';
  ELSE
    -- If struggling, start at early explorers regardless of age
    v_recommended_tier := 'early_explorers';
  END IF;
  
  RETURN v_recommended_tier;
END;
$$;

-- ============================================================================
-- TRIGGER: Auto-update updated_at timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION update_quiz_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quiz_questions_updated_at
  BEFORE UPDATE ON placement_quiz_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_quiz_updated_at();
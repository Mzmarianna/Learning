-- ============================================================================
-- MIGRATION: Add Game Progress Fields to Student Profiles
-- Date: 2026-02-03
-- Description: Adds gems and unlocked_characters to existing student_profiles
-- ============================================================================

-- Add gems column (default 0)
ALTER TABLE student_profiles 
ADD COLUMN IF NOT EXISTS gems INTEGER DEFAULT 0;

-- Add unlocked_characters column (default starter characters)
ALTER TABLE student_profiles 
ADD COLUMN IF NOT EXISTS unlocked_characters JSONB 
DEFAULT '["wise_owl", "sparkle_unicorn"]'::jsonb;

-- Update existing students to have starter characters if null
UPDATE student_profiles 
SET unlocked_characters = '["wise_owl", "sparkle_unicorn"]'::jsonb
WHERE unlocked_characters IS NULL;

-- Ensure all existing students have 0 gems if null
UPDATE student_profiles 
SET gems = 0
WHERE gems IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN student_profiles.gems IS 'In-game currency earned through achievements';
COMMENT ON COLUMN student_profiles.unlocked_characters IS 'Array of unlocked companion character IDs';

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify the migration worked
SELECT 
  COUNT(*) as total_students,
  COUNT(*) FILTER (WHERE gems IS NOT NULL) as students_with_gems,
  COUNT(*) FILTER (WHERE unlocked_characters IS NOT NULL) as students_with_characters
FROM student_profiles;

-- ============================================================================
-- ROLLBACK (if needed)
-- ============================================================================

-- To rollback this migration, run:
-- ALTER TABLE student_profiles DROP COLUMN IF EXISTS gems;
-- ALTER TABLE student_profiles DROP COLUMN IF EXISTS unlocked_characters;

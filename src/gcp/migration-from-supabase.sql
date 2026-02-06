-- ============================================================================
-- MIGRATION FROM SUPABASE TO GOOGLE CLOUD SQL
-- Mz. Marianna's Academy
-- ============================================================================
-- 
-- This script helps migrate data from Supabase to Google Cloud SQL
-- 
-- INSTRUCTIONS:
-- 1. Export data from Supabase using pg_dump
-- 2. Transform auth.users to users table
-- 3. Import into Cloud SQL
-- ============================================================================

-- ============================================================================
-- STEP 1: EXPORT FROM SUPABASE
-- ============================================================================

-- Run this in your terminal (not in SQL editor):
-- 
-- pg_dump -h db.<your-project>.supabase.co \
--   -U postgres \
--   -d postgres \
--   -t public.* \
--   --data-only \
--   --column-inserts \
--   -f supabase_data.sql

-- ============================================================================
-- STEP 2: TRANSFORM auth.users TO users
-- ============================================================================

-- If you exported auth.users from Supabase, transform it to match Cloud SQL schema
-- 
-- Supabase auth.users structure:
-- id, email, encrypted_password, email_confirmed_at, last_sign_in_at, created_at, updated_at
--
-- Cloud SQL users structure:
-- id, email, password_hash, email_verified, last_sign_in_at, created_at, updated_at

-- Example transformation (run after importing Supabase data):

-- Create temporary table for Supabase auth.users
CREATE TEMPORARY TABLE temp_auth_users (
  id UUID,
  email TEXT,
  encrypted_password TEXT,
  email_confirmed_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

-- After loading temp_auth_users, insert into users table:
INSERT INTO users (
  id,
  email,
  password_hash,
  email_verified,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT
  id,
  email,
  encrypted_password,
  (email_confirmed_at IS NOT NULL),
  last_sign_in_at,
  created_at,
  updated_at
FROM temp_auth_users
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STEP 3: VERIFY MIGRATION
-- ============================================================================

-- Check user counts
SELECT 'users' as table_name, COUNT(*) FROM users
UNION ALL
SELECT 'profiles', COUNT(*) FROM profiles
UNION ALL
SELECT 'student_profiles', COUNT(*) FROM student_profiles
UNION ALL
SELECT 'quest_progress', COUNT(*) FROM quest_progress
UNION ALL
SELECT 'challenge_progress', COUNT(*) FROM challenge_progress
UNION ALL
SELECT 'badges_earned', COUNT(*) FROM badges_earned
UNION ALL
SELECT 'submissions', COUNT(*) FROM submissions;

-- Check for orphaned records
SELECT 'Profiles without users' as issue, COUNT(*) 
FROM profiles p 
WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.id = p.id);

SELECT 'Student profiles without profiles' as issue, COUNT(*) 
FROM student_profiles sp 
WHERE NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = sp.id);

-- ============================================================================
-- STEP 4: FIX DATA INCONSISTENCIES
-- ============================================================================

-- Ensure all student_profiles have gems and unlocked_characters
UPDATE student_profiles 
SET gems = 0
WHERE gems IS NULL;

UPDATE student_profiles 
SET unlocked_characters = '["wise_owl", "sparkle_unicorn"]'::jsonb
WHERE unlocked_characters IS NULL OR unlocked_characters = '[]'::jsonb;

-- Recalculate levels based on total_xp
UPDATE student_profiles
SET current_level = calculate_level(total_xp);

-- ============================================================================
-- STEP 5: SETUP ADMIN USER
-- ============================================================================

-- Insert admin user if not exists
DO $$
DECLARE
  v_admin_id UUID;
BEGIN
  -- Check if admin exists
  SELECT id INTO v_admin_id FROM users WHERE email = 'mariannav920@gmail.com';
  
  IF v_admin_id IS NULL THEN
    -- Create admin user
    -- Note: You'll need to set the actual password hash using bcrypt
    INSERT INTO users (id, email, password_hash, email_verified)
    VALUES (
      uuid_generate_v4(),
      'mariannav920@gmail.com',
      '$2b$10$YourBcryptHashHere', -- Replace with actual bcrypt hash
      true
    )
    RETURNING id INTO v_admin_id;
    
    -- Create admin profile
    INSERT INTO profiles (id, role, email, display_name)
    VALUES (
      v_admin_id,
      'admin',
      'mariannav920@gmail.com',
      'Marianna (Admin)'
    );
  END IF;
END $$;

-- ============================================================================
-- STEP 6: MIGRATE FILE STORAGE REFERENCES
-- ============================================================================

-- Update image URLs from Supabase Storage to Google Cloud Storage
-- Old format: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
-- New format: https://storage.googleapis.com/<bucket>/<path>

-- Update submission image URLs
UPDATE submissions
SET image_urls = ARRAY(
  SELECT regexp_replace(
    url,
    'https://[^/]+\.supabase\.co/storage/v1/object/public/([^/]+)/(.*)',
    'https://storage.googleapis.com/\1/\2'
  )
  FROM unnest(image_urls) AS url
)
WHERE image_urls IS NOT NULL;

-- Update avatar URLs
UPDATE profiles
SET avatar_url = regexp_replace(
  avatar_url,
  'https://[^/]+\.supabase\.co/storage/v1/object/public/([^/]+)/(.*)',
  'https://storage.googleapis.com/\1/\2'
)
WHERE avatar_url IS NOT NULL;

-- ============================================================================
-- STEP 7: CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Additional indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_submissions_student_challenge ON submissions(student_id, challenge_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_student_type ON activity_log(student_id, activity_type);
CREATE INDEX IF NOT EXISTS idx_quest_progress_student_quest ON quest_progress(student_id, quest_id);

-- ============================================================================
-- STEP 8: GRANT PERMISSIONS
-- ============================================================================

-- Grant all permissions to app_user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO app_user;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO app_user;

-- Grant read-only to admin_user for analytics
GRANT SELECT ON ALL TABLES IN SCHEMA public TO admin_user;
GRANT EXECUTE ON FUNCTION get_leaderboard TO admin_user;
GRANT EXECUTE ON FUNCTION check_student_needs_attention TO admin_user;

-- ============================================================================
-- COMPLETE!
-- ============================================================================

SELECT 'Migration complete! Next steps:' as status;
SELECT '1. Verify all data counts match Supabase' as step;
SELECT '2. Test authentication with new users table' as step;
SELECT '3. Update application connection strings' as step;
SELECT '4. Test file uploads to GCS buckets' as step;
SELECT '5. Deploy backend to Cloud Run' as step;

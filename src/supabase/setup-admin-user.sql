-- ============================================================================
-- ADMIN USER SETUP - MZ. MARIANNA'S ACADEMY
-- ============================================================================
-- This script sets up the admin user for production deployment
-- Run this AFTER creating the auth user in Supabase Dashboard
-- ============================================================================

-- ============================================================================
-- STEP 1: CREATE ADMIN AUTH USER (DO THIS IN SUPABASE DASHBOARD FIRST!)
-- ============================================================================
-- 
-- 1. Go to: https://supabase.com/dashboard → Your Project
-- 2. Click: Authentication → Users
-- 3. Click: "Add user" button
-- 4. Fill in:
--    - Email: mariannav920@gmail.com
--    - Password: marianna2026
--    - Auto Confirm User: ✅ CHECK THIS BOX
--    - Email Confirm: ✅ CHECK THIS BOX
-- 5. Click "Create user"
-- 6. COPY THE USER UUID (you'll need it below)
-- 
-- ============================================================================

-- ============================================================================
-- STEP 2: RUN THIS SQL (Replace UUID below)
-- ============================================================================

DO $$
DECLARE
  -- REPLACE THIS UUID with the one from the auth user you just created
  admin_user_id UUID := 'YOUR_ADMIN_USER_UUID_HERE';
  
BEGIN
  -- Verify this is a valid auth user
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = admin_user_id) THEN
    RAISE EXCEPTION 'User with UUID % does not exist in auth.users. Please create the auth user first.', admin_user_id;
  END IF;

  -- Create admin profile
  INSERT INTO profiles (id, email, role, display_name, avatar_url, created_at, updated_at)
  VALUES (
    admin_user_id,
    'mariannav920@gmail.com',
    'admin',
    'Mz. Marianna',
    NULL,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    role = 'admin',
    display_name = EXCLUDED.display_name,
    updated_at = NOW();

  RAISE NOTICE '✅ Admin user profile created successfully!';
  RAISE NOTICE '📧 Email: mariannav920@gmail.com';
  RAISE NOTICE '👤 Display Name: Mz. Marianna';
  RAISE NOTICE '🔑 Role: admin';
  
END $$;

-- ============================================================================
-- STEP 3: VERIFY ADMIN USER
-- ============================================================================

SELECT 
  p.id,
  p.email,
  p.role,
  p.display_name,
  p.created_at,
  au.email_confirmed_at,
  au.last_sign_in_at
FROM profiles p
JOIN auth.users au ON p.id = au.id
WHERE p.email = 'mariannav920@gmail.com';

-- You should see:
-- ✅ role = 'admin'
-- ✅ email = 'mariannav920@gmail.com'
-- ✅ display_name = 'Mz. Marianna'
-- ✅ email_confirmed_at is NOT NULL

-- ============================================================================
-- STEP 4: TEST LOGIN
-- ============================================================================
-- 
-- Now you can log in to the app with:
-- Email: mariannav920@gmail.com
-- Password: marianna2026
-- 
-- You will be redirected to: /dashboard/admin
-- 
-- ============================================================================

-- ============================================================================
-- OPTIONAL: Create Additional Test Users
-- ============================================================================

-- Create test student (manual - must create auth user first)
-- DO $$
-- DECLARE
--   student_user_id UUID := 'STUDENT_UUID_HERE';
-- BEGIN
--   INSERT INTO profiles (id, email, role, display_name)
--   VALUES (student_user_id, 'test.student@academy.com', 'student', 'Test Student')
--   ON CONFLICT (id) DO NOTHING;
--   
--   INSERT INTO student_profiles (id, age, tier, xp_total, current_level)
--   VALUES (student_user_id, 10, 'explorers', 500, 2)
--   ON CONFLICT (id) DO NOTHING;
-- END $$;

-- Create test parent (manual - must create auth user first)
-- DO $$
-- DECLARE
--   parent_user_id UUID := 'PARENT_UUID_HERE';
-- BEGIN
--   INSERT INTO profiles (id, email, role, display_name)
--   VALUES (parent_user_id, 'test.parent@academy.com', 'parent', 'Test Parent')
--   ON CONFLICT (id) DO NOTHING;
-- END $$;

-- Create test tutor (manual - must create auth user first)
-- DO $$
-- DECLARE
--   tutor_user_id UUID := 'TUTOR_UUID_HERE';
-- BEGIN
--   INSERT INTO profiles (id, email, role, display_name)
--   VALUES (tutor_user_id, 'test.tutor@academy.com', 'tutor', 'Test Tutor')
--   ON CONFLICT (id) DO NOTHING;
-- END $$;

-- ============================================================================
-- SECURITY NOTES
-- ============================================================================
-- 
-- ⚠️  IMPORTANT: Never commit passwords to version control!
-- ⚠️  This file should be deleted from Git after running in production
-- ⚠️  Change the admin password immediately after first login
-- 
-- To change password after first login:
-- 1. Log in as admin
-- 2. Go to profile settings
-- 3. Click "Change Password"
-- 4. Set a new strong password
-- 
-- ============================================================================

-- ============================================================================
-- AUTOMATED ADMIN CHECK (For Monitoring)
-- ============================================================================

-- Function to verify admin user exists and is properly configured
CREATE OR REPLACE FUNCTION verify_admin_user()
RETURNS TABLE (
  admin_exists BOOLEAN,
  admin_email TEXT,
  admin_confirmed BOOLEAN,
  last_login TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    EXISTS(SELECT 1 FROM profiles WHERE role = 'admin') AS admin_exists,
    p.email AS admin_email,
    (au.email_confirmed_at IS NOT NULL) AS admin_confirmed,
    au.last_sign_in_at AS last_login
  FROM profiles p
  LEFT JOIN auth.users au ON p.id = au.id
  WHERE p.role = 'admin'
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run this check anytime:
-- SELECT * FROM verify_admin_user();

-- ============================================================================
-- ADMIN PERMISSIONS VERIFICATION
-- ============================================================================

-- Verify admin has access to all necessary tables
DO $$
BEGIN
  -- Check if RLS policies allow admin access
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname LIKE '%admin%'
  ) THEN
    RAISE WARNING 'Admin policies may not be configured correctly';
  END IF;
  
  RAISE NOTICE '✅ Admin permissions check complete';
END $$;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '✅ ADMIN USER SETUP COMPLETE';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '';
  RAISE NOTICE '📧 Login Email: mariannav920@gmail.com';
  RAISE NOTICE '🔐 Password: (set in Supabase Dashboard)';
  RAISE NOTICE '🎯 Dashboard URL: /dashboard/admin';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  NEXT STEPS:';
  RAISE NOTICE '1. Test login with the credentials above';
  RAISE NOTICE '2. Change password after first login';
  RAISE NOTICE '3. Delete this SQL file from version control';
  RAISE NOTICE '';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
END $$;

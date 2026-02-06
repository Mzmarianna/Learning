-- ============================================================================
-- CREATE TEST USER IN SUPABASE
-- ============================================================================
-- Run this SQL in your Supabase SQL Editor to create a test user
-- Dashboard → SQL Editor → New Query → Paste this → Run
-- ============================================================================

-- Step 1: Create the auth user (REPLACE WITH YOUR OWN PASSWORD!)
-- NOTE: Supabase Auth is managed differently, so we'll create the profile directly
-- You'll need to create the auth user via the Supabase Dashboard first

-- ============================================================================
-- OPTION 1: If you already created a user in Auth dashboard
-- ============================================================================
-- Just copy the UUID from the user and use it below to create profiles

-- ============================================================================
-- OPTION 2: Use this SQL to create profiles for an existing auth user
-- ============================================================================

-- Replace 'YOUR_USER_UUID_HERE' with the actual UUID from your auth user
DO $$
DECLARE
  user_uuid UUID := 'YOUR_USER_UUID_HERE'; -- REPLACE THIS!
BEGIN
  -- Create profile
  INSERT INTO profiles (id, email, role, display_name)
  VALUES (
    user_uuid,
    'test@mariannasacademy.com',
    'student',
    'Test Student'
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    display_name = EXCLUDED.display_name;

  -- Create student profile
  INSERT INTO student_profiles (id, age, tier, xp_total, current_level)
  VALUES (
    user_uuid,
    10,
    'explorers',
    0,
    1
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    age = EXCLUDED.age,
    tier = EXCLUDED.tier,
    xp_total = EXCLUDED.xp_total,
    current_level = EXCLUDED.current_level;

  RAISE NOTICE 'Test user created successfully!';
END $$;

-- ============================================================================
-- VERIFY THE USER WAS CREATED
-- ============================================================================

SELECT 
  p.id,
  p.email,
  p.role,
  p.display_name,
  sp.tier,
  sp.age,
  sp.xp_total,
  sp.current_level
FROM profiles p
LEFT JOIN student_profiles sp ON p.id = sp.id
WHERE p.email = 'test@mariannasacademy.com';

-- ============================================================================
-- HOW TO USE THIS SCRIPT
-- ============================================================================
-- 
-- 1. First, create an auth user in Supabase Dashboard:
--    - Go to: Authentication → Users
--    - Click "Add user"
--    - Email: test@mariannasacademy.com
--    - Password: Test1234 (or your choice)
--    - Check "Auto Confirm User"
--    - Click "Create user"
--    - COPY THE UUID!
-- 
-- 2. Then run this script:
--    - Go to: SQL Editor
--    - Replace 'YOUR_USER_UUID_HERE' with the UUID you copied
--    - Click "Run"
-- 
-- 3. Now you can log in with:
--    - Email: test@mariannasacademy.com
--    - Password: Test1234 (or whatever you set)
-- 
-- ============================================================================

#!/usr/bin/env node

/**
 * AUTOMATED ADMIN USER CREATION SCRIPT
 * 
 * This script creates the admin user in Supabase programmatically.
 * Use this for automated deployments and CI/CD pipelines.
 * 
 * Usage:
 *   node scripts/create-admin-user.js
 * 
 * Environment variables required:
 *   - SUPABASE_URL or VITE_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY (not the anon key!)
 *   - ADMIN_EMAIL (optional, defaults to mariannav920@gmail.com)
 *   - ADMIN_PASSWORD (optional, defaults to marianna2026)
 */

import { createClient } from '@supabase/supabase-js';

// ============================================================================
// CONFIGURATION
// ============================================================================

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'mariannav920@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'marianna2026';
const ADMIN_DISPLAY_NAME = 'Mz. Marianna';

// ============================================================================
// VALIDATION
// ============================================================================

if (!SUPABASE_URL) {
  console.error('❌ ERROR: SUPABASE_URL environment variable is required');
  console.error('   Set it with: export SUPABASE_URL=https://your-project.supabase.co');
  process.exit(1);
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ ERROR: SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  console.error('   Get it from: Supabase Dashboard → Settings → API → service_role key');
  console.error('   ⚠️  WARNING: This is a SECRET key - never commit it to Git!');
  process.exit(1);
}

// ============================================================================
// SUPABASE CLIENT (with service role for admin operations)
// ============================================================================

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// ============================================================================
// MAIN FUNCTION
// ============================================================================

async function createAdminUser() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔧 ADMIN USER CREATION SCRIPT');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('📊 Configuration:');
  console.log(`   Supabase URL: ${SUPABASE_URL}`);
  console.log(`   Admin Email: ${ADMIN_EMAIL}`);
  console.log(`   Admin Name: ${ADMIN_DISPLAY_NAME}\n`);

  try {
    // Step 1: Check if admin user already exists
    console.log('🔍 Step 1: Checking if admin user already exists...');
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, email, role')
      .eq('email', ADMIN_EMAIL)
      .single();

    if (existingProfile) {
      console.log('⚠️  Admin user already exists!');
      console.log(`   User ID: ${existingProfile.id}`);
      console.log(`   Email: ${existingProfile.email}`);
      console.log(`   Role: ${existingProfile.role}`);

      if (existingProfile.role !== 'admin') {
        console.log('\n🔄 Updating user role to admin...');
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', existingProfile.id);

        if (updateError) {
          console.error('❌ Failed to update role:', updateError.message);
          return false;
        }
        console.log('✅ User role updated to admin');
      }

      console.log('\n✅ Admin user is already configured correctly');
      return true;
    }

    // Step 2: Create auth user
    console.log('👤 Step 2: Creating auth user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        display_name: ADMIN_DISPLAY_NAME,
        role: 'admin',
      },
    });

    if (authError) {
      // Check if user already exists in auth but not in profiles
      if (authError.message.includes('already registered')) {
        console.log('ℹ️  Auth user exists, checking profile...');
        
        // Try to get the user ID
        const { data: users } = await supabase.auth.admin.listUsers();
        const existingAuthUser = users?.users?.find(u => u.email === ADMIN_EMAIL);
        
        if (existingAuthUser) {
          console.log(`   Found auth user: ${existingAuthUser.id}`);
          
          // Create profile for existing auth user
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: existingAuthUser.id,
              email: ADMIN_EMAIL,
              role: 'admin',
              display_name: ADMIN_DISPLAY_NAME,
            });

          if (profileError && !profileError.message.includes('duplicate')) {
            console.error('❌ Failed to create profile:', profileError.message);
            return false;
          }

          console.log('✅ Profile created for existing auth user');
          return true;
        }
      }

      console.error('❌ Failed to create auth user:', authError.message);
      return false;
    }

    if (!authData.user) {
      console.error('❌ No user returned from auth creation');
      return false;
    }

    console.log(`✅ Auth user created: ${authData.user.id}`);

    // Step 3: Create profile
    console.log('📝 Step 3: Creating profile...');
    const { error: profileError } = await supabase.from('profiles').insert({
      id: authData.user.id,
      email: ADMIN_EMAIL,
      role: 'admin',
      display_name: ADMIN_DISPLAY_NAME,
    });

    if (profileError) {
      console.error('❌ Failed to create profile:', profileError.message);
      
      // Clean up: delete auth user if profile creation failed
      console.log('🧹 Cleaning up: deleting auth user...');
      await supabase.auth.admin.deleteUser(authData.user.id);
      
      return false;
    }

    console.log('✅ Profile created successfully');

    // Step 4: Verify creation
    console.log('🔍 Step 4: Verifying admin user...');
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email, role, display_name')
      .eq('id', authData.user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      console.error('❌ Verification failed: Profile not found or role incorrect');
      return false;
    }

    console.log('✅ Verification successful!');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ ADMIN USER CREATED SUCCESSFULLY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📧 Login Email:', ADMIN_EMAIL);
    console.log('🔐 Password:', ADMIN_PASSWORD);
    console.log('👤 Display Name:', ADMIN_DISPLAY_NAME);
    console.log('🆔 User ID:', authData.user.id);
    console.log('\n⚠️  NEXT STEPS:');
    console.log('1. Test login at your app URL');
    console.log('2. Change the password after first login');
    console.log('3. Keep the service role key secure\n');

    return true;
  } catch (error) {
    console.error('\n❌ UNEXPECTED ERROR:', error.message);
    console.error(error);
    return false;
  }
}

// ============================================================================
// RUN SCRIPT
// ============================================================================

createAdminUser()
  .then((success) => {
    if (success) {
      console.log('✅ Script completed successfully\n');
      process.exit(0);
    } else {
      console.log('❌ Script failed\n');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });

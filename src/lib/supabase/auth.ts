/**
 * AUTHENTICATION SERVICE
 * Handle user authentication and role-based access
 */

import { supabase } from './client';
import type { UserRole, TierLevel } from '../database.types';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

// ============================================================================
// SIGN UP
// ============================================================================

/**
 * Sign up as student
 */
export async function signUpStudent(data: {
  email: string;
  password: string;
  displayName: string;
  age: number;
  tier: TierLevel;
}) {
  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        display_name: data.displayName,
        role: 'student',
      },
    },
  });

  if (authError) {
    console.error('Error signing up:', authError);
    throw authError;
  }

  if (!authData.user) {
    throw new Error('No user returned from signup');
  }

  // Create profile
  const { error: profileError } = await supabase.from('profiles').insert({
    id: authData.user.id,
    role: 'student',
    email: data.email,
    display_name: data.displayName,
  });

  if (profileError) {
    console.error('Error creating profile:', profileError);
    throw profileError;
  }

  // Create student profile
  const { error: studentError } = await supabase.from('student_profiles').insert({
    id: authData.user.id,
    age: data.age,
    tier: data.tier,
  });

  if (studentError) {
    console.error('Error creating student profile:', studentError);
    throw studentError;
  }

  return authData.user;
}

/**
 * Sign up as parent
 */
export async function signUpParent(data: {
  email: string;
  password: string;
  displayName: string;
}) {
  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        display_name: data.displayName,
        role: 'parent',
      },
    },
  });

  if (authError) {
    console.error('Error signing up:', authError);
    throw authError;
  }

  if (!authData.user) {
    throw new Error('No user returned from signup');
  }

  // Create profile
  const { error: profileError } = await supabase.from('profiles').insert({
    id: authData.user.id,
    role: 'parent',
    email: data.email,
    display_name: data.displayName,
  });

  if (profileError) {
    console.error('Error creating profile:', profileError);
    throw profileError;
  }

  return authData.user;
}

/**
 * Sign up as tutor (requires admin approval)
 */
export async function signUpTutor(data: {
  email: string;
  password: string;
  displayName: string;
  credentials?: string;
}) {
  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        display_name: data.displayName,
        role: 'tutor',
      },
    },
  });

  if (authError) {
    console.error('Error signing up:', authError);
    throw authError;
  }

  if (!authData.user) {
    throw new Error('No user returned from signup');
  }

  // Create profile
  const { error: profileError } = await supabase.from('profiles').insert({
    id: authData.user.id,
    role: 'tutor',
    email: data.email,
    display_name: data.displayName,
  });

  if (profileError) {
    console.error('Error creating profile:', profileError);
    throw profileError;
  }

  return authData.user;
}

// ============================================================================
// SIGN IN
// ============================================================================

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Error signing in:', error);
    throw error;
  }

  return data.user;
}

/**
 * Sign out
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

// ============================================================================
// PASSWORD MANAGEMENT
// ============================================================================

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  if (error) {
    console.error('Error sending password reset:', error);
    throw error;
  }
}

/**
 * Update password
 */
export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    console.error('Error updating password:', error);
    throw error;
  }
}

// ============================================================================
// USER SESSION
// ============================================================================

/**
 * Get current user
 */
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    // Don't log "Auth session missing" as an error - it's expected when logged out
    if (error.message !== 'Auth session missing!' && !error.message.includes('session missing')) {
      console.error('Error getting user:', error);
    }
    return null;
  }

  return user;
}

/**
 * Get current session
 */
export async function getCurrentSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error('Error getting session:', error);
    return null;
  }

  return session;
}

/**
 * Get user profile with role
 */
export async function getUserProfile() {
  const user = await getCurrentUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

/**
 * Get user profile with extended data based on role
 */
export async function getUserFullProfile() {
  const profile = await getUserProfile();

  if (!profile) return null;

  // If student, get student profile
  if (profile.role === 'student') {
    const { data: studentProfile } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('id', profile.id)
      .single();

    return { ...profile, studentProfile };
  }

  return profile;
}

// ============================================================================
// ROLE CHECKING
// ============================================================================

/**
 * Check if user has role
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const profile = await getUserProfile();
  return profile?.role === role;
}

/**
 * Require role (throws if user doesn't have role)
 */
export async function requireRole(role: UserRole) {
  const hasRequiredRole = await hasRole(role);

  if (!hasRequiredRole) {
    throw new Error(`Access denied. Required role: ${role}`);
  }
}

/**
 * Check if user is student
 */
export async function isStudent(): Promise<boolean> {
  return await hasRole('student');
}

/**
 * Check if user is parent
 */
export async function isParent(): Promise<boolean> {
  return await hasRole('parent');
}

/**
 * Check if user is tutor
 */
export async function isTutor(): Promise<boolean> {
  return await hasRole('tutor');
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  return await hasRole('admin');
}

// ============================================================================
// PROFILE UPDATES
// ============================================================================

/**
 * Update display name
 */
export async function updateDisplayName(displayName: string) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('No user logged in');
  }

  const { error } = await supabase
    .from('profiles')
    .update({ display_name: displayName })
    .eq('id', user.id);

  if (error) {
    console.error('Error updating display name:', error);
    throw error;
  }

  // Also update auth metadata
  await supabase.auth.updateUser({
    data: { display_name: displayName },
  });
}

/**
 * Update avatar
 */
export async function updateAvatar(avatarUrl: string) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('No user logged in');
  }

  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url: avatarUrl })
    .eq('id', user.id);

  if (error) {
    console.error('Error updating avatar:', error);
    throw error;
  }
}

// ============================================================================
// AUTH STATE LISTENER
// ============================================================================

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(
  callback: (
    event: AuthChangeEvent,
    session: Session | null
  ) => void | Promise<void>
) {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
  
  return data;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if email is already registered
 */
export async function isEmailRegistered(email: string): Promise<boolean> {
  const { data } = await supabase
    .from('profiles')
    .select('email')
    .eq('email', email)
    .single();

  return !!data;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generate random password
 */
export function generateRandomPassword(length: number = 12): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}
/**
 * SERVER-SIDE SUPABASE CLIENT
 * 
 * ⚠️ WARNING: This file uses the SERVICE ROLE KEY which has FULL DATABASE ACCESS.
 * - ONLY use in server-side code (API routes, serverless functions, backend scripts)
 * - NEVER import this file in client-side code (it won't work due to process.env)
 * - The service role key BYPASSES Row Level Security (RLS)
 * 
 * Use cases:
 * - Form processing that creates profiles and relationships
 * - Administrative operations
 * - Batch data processing
 * - Webhook handlers
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';

/**
 * Create a server-side Supabase client with service role privileges.
 * 
 * This client bypasses RLS and should only be used for:
 * - Creating user profiles and relationships
 * - Administrative operations
 * - Server-side data processing
 * 
 * @throws {Error} If SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY are not configured
 */
export function createServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      'SUPABASE_URL or VITE_SUPABASE_URL environment variable is required for server-side operations'
    );
  }

  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY environment variable is required for server-side operations. ' +
      'This key should NEVER have the VITE_ prefix and should only be used in server-side code.'
    );
  }

  // Validate that the service role key looks correct
  if (!serviceRoleKey.startsWith('eyJ')) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY does not appear to be a valid JWT token. ' +
      'Please check your environment variables.'
    );
  }

  // Create and return the server client
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Validate that server environment is properly configured.
 * Call this at the start of API routes to fail fast if misconfigured.
 */
export function validateServerEnvironment(): void {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const errors: string[] = [];

  if (!supabaseUrl) {
    errors.push('SUPABASE_URL or VITE_SUPABASE_URL is not set');
  }

  if (!serviceRoleKey) {
    errors.push('SUPABASE_SERVICE_ROLE_KEY is not set');
  } else if (!serviceRoleKey.startsWith('eyJ')) {
    errors.push('SUPABASE_SERVICE_ROLE_KEY does not appear to be a valid JWT token');
  }

  if (errors.length > 0) {
    throw new Error(
      'Server environment validation failed:\n' + 
      errors.map(e => `  - ${e}`).join('\n')
    );
  }
}

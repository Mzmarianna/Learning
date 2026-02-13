/**
 * SERVER-SIDE SUPABASE CLIENT
 * 
 * This client uses the service role key and bypasses Row Level Security (RLS).
 * 
 * ⚠️ SECURITY WARNING:
 * - This client should ONLY be used in server-side code (API routes, Vercel functions)
 * - NEVER import this in client-side code (pages, components)
 * - The service role key must NEVER be exposed to the browser
 * 
 * Use cases:
 * - Creating user profiles from server-side form processing
 * - Admin operations that need to bypass RLS
 * - Background jobs and cron tasks
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';

/**
 * Get the Supabase URL from environment
 */
function getSupabaseUrl(): string {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  
  if (!url) {
    throw new Error(
      'VITE_SUPABASE_URL or SUPABASE_URL environment variable is required for server-side Supabase client'
    );
  }
  
  return url;
}

/**
 * Get the Supabase service role key from environment
 */
function getSupabaseServiceRoleKey(): string {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY environment variable is required for server-side operations. ' +
      'This key should NEVER be prefixed with VITE_ and should only be used in server-side code.'
    );
  }
  
  return serviceRoleKey;
}

/**
 * Create a server-side Supabase client with service role privileges
 * 
 * This client:
 * - Uses the service role key (bypasses RLS)
 * - Should only be used in server-side code
 * - Has full database access
 * 
 * @throws Error if required environment variables are not set
 */
export function createServerSupabaseClient() {
  const supabaseUrl = getSupabaseUrl();
  const serviceRoleKey = getSupabaseServiceRoleKey();
  
  const client = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  
  // Debug logging (only in development for security)
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ Server-side Supabase client initialized with service role key');
  }
  
  return client;
}

/**
 * Singleton server client instance
 * Lazy-loaded to ensure environment variables are available
 */
let serverClient: ReturnType<typeof createServerSupabaseClient> | null = null;

/**
 * Get the singleton server Supabase client
 * 
 * This creates a single instance that's reused across requests
 */
export function getServerSupabaseClient() {
  if (!serverClient) {
    serverClient = createServerSupabaseClient();
  }
  
  return serverClient;
}

/**
 * Type export for the server client
 */
export type ServerSupabaseClient = ReturnType<typeof createServerSupabaseClient>;

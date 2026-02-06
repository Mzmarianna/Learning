/**
 * CONFIGURATION FILE
 * 
 * INSTRUCTIONS FOR FIGMA MAKE:
 * Since Figma Make doesn't support .env files, you need to hardcode your
 * Supabase credentials here. This is ONLY for development/demo purposes.
 * 
 * FOR PRODUCTION: Use proper environment variables when deploying.
 * 
 * ⚠️  SECURITY WARNING:
 * - Do NOT commit real credentials to public repositories
 * - For production deployments, use environment variables
 * - This file is for local development only
 */

// Helper to get environment variables (works in both Vite and Node.js)
function getEnv(key: string): string | undefined {
  // Vite uses import.meta.env
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key];
  }
  // Node.js uses process.env (for server-side/build scripts)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  return undefined;
}

export const config = {
  // ============================================================================
  // SUPABASE CONFIGURATION
  // ============================================================================
  // Get these from: https://supabase.com/dashboard → Settings → API
  
  supabase: {
    // For production: These will be overridden by environment variables
    // For local dev: Add your credentials here temporarily
    url: getEnv('VITE_SUPABASE_URL') || 'https://wyclbrafklhvdyjpoeno.supabase.co',
    anonKey: getEnv('VITE_SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5Y2xicmFma2xodmR5anBvZW5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNjE5NTksImV4cCI6MjA4MzczNzk1OX0.m5-k4PKsusRyKYeZSyOeUKb5Y_jm3ZhXNC0GXWzC2CM',
  },

  // ============================================================================
  // OPENAI CONFIGURATION (Optional - for Wowl AI)
  // ============================================================================
  // Get from: https://platform.openai.com/api-keys
  
  openai: {
    apiKey: getEnv('OPENAI_API_KEY') || 'REPLACE_WITH_YOUR_OPENAI_KEY',
  },

  // ============================================================================
  // SHOPIFY CONFIGURATION (Optional - for payments)
  // ============================================================================
  
  shopify: {
    storeUrl: getEnv('SHOPIFY_STORE_URL') || 'REPLACE_WITH_YOUR_SHOPIFY_STORE',
    storefrontToken: getEnv('SHOPIFY_STOREFRONT_TOKEN') || 'REPLACE_WITH_STOREFRONT_TOKEN',
  },

  // ============================================================================
  // APPLICATION CONFIGURATION
  // ============================================================================
  
  app: {
    name: 'Mz. Marianna\'s Academy',
    supportEmail: 'mariannav920@gmail.com',
    baseUrl: getEnv('VITE_APP_URL') || 'http://localhost:5173',
  },

  // ============================================================================
  // FEATURE FLAGS
  // ============================================================================
  
  features: {
    enableWowlAI: getEnv('VITE_ENABLE_WOWL_AI') === 'true',
    enableShopifyIntegration: getEnv('VITE_ENABLE_SHOPIFY') === 'true',
    enableEmailNotifications: getEnv('VITE_ENABLE_EMAIL') === 'true',
    enableRobloxIntegration: true, // Always enabled
  },
};

// Helper to check if config is set up
export const isConfigured = 
  config.supabase.url !== 'REPLACE_WITH_YOUR_SUPABASE_URL' &&
  config.supabase.url !== '' &&
  !config.supabase.url.includes('REPLACE_WITH') &&
  !config.supabase.url.includes('your-project') &&
  config.supabase.anonKey !== 'REPLACE_WITH_YOUR_SUPABASE_ANON_KEY' &&
  config.supabase.anonKey !== '' &&
  !config.supabase.anonKey.includes('REPLACE_WITH');

// Helper to check if we're in production
export const isProduction = getEnv('NODE_ENV') === 'production' || 
  getEnv('VERCEL_ENV') === 'production';

// Helper to validate required environment variables in production
export function validateProductionConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!isProduction) {
    return { valid: true, errors: [] };
  }
  
  // Required in production
  if (!getEnv('VITE_SUPABASE_URL')) {
    errors.push('VITE_SUPABASE_URL environment variable is required in production');
  }
  
  if (!getEnv('VITE_SUPABASE_ANON_KEY')) {
    errors.push('VITE_SUPABASE_ANON_KEY environment variable is required in production');
  }
  
  // Warn if still using development credentials
  if (config.supabase.url.includes('wyclbrafklhvdyjpoeno')) {
    errors.push('WARNING: Still using development Supabase credentials in production');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
/**
 * ENVIRONMENT VARIABLE VALIDATION
 * 
 * Validates that all required environment variables are set before the app starts.
 * This prevents runtime errors and helps catch configuration issues early.
 */

import { config, isProduction, validateProductionConfig } from '../config';

// ============================================================================
// VALIDATION TYPES
// ============================================================================

interface EnvValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

interface RequiredEnv {
  key: string;
  description: string;
  required: 'always' | 'production' | 'optional';
  validate?: (value: string) => boolean;
}

// ============================================================================
// ENVIRONMENT VARIABLE DEFINITIONS
// ============================================================================

const ENV_VARS: RequiredEnv[] = [
  // Supabase (Required in production)
  {
    key: 'VITE_SUPABASE_URL',
    description: 'Supabase project URL',
    required: 'production',
    validate: (val) => val.startsWith('https://') && val.includes('.supabase.co'),
  },
  {
    key: 'VITE_SUPABASE_ANON_KEY',
    description: 'Supabase anonymous (public) key',
    required: 'production',
    validate: (val) => val.startsWith('eyJ') && val.length > 100,
  },
  {
    key: 'SUPABASE_SERVICE_ROLE_KEY',
    description: 'Supabase service role key (for server-side operations)',
    required: 'optional',
    validate: (val) => val.startsWith('eyJ') && val.length > 100,
  },

  // Application
  {
    key: 'VITE_APP_URL',
    description: 'Base URL of the application',
    required: 'optional',
    validate: (val) => val.startsWith('http://') || val.startsWith('https://'),
  },

  // OpenAI (Optional - for Wowl AI)
  {
    key: 'OPENAI_API_KEY',
    description: 'OpenAI API key for Wowl AI tutor',
    required: 'optional',
    validate: (val) => val.startsWith('sk-'),
  },

  // Shopify (Optional - for payments)
  {
    key: 'SHOPIFY_STORE_URL',
    description: 'Shopify store URL',
    required: 'optional',
    validate: (val) => val.includes('.myshopify.com') || val.includes('shopify.com'),
  },
  {
    key: 'SHOPIFY_ADMIN_API_TOKEN',
    description: 'Shopify Admin API token',
    required: 'optional',
    validate: (val) => val.startsWith('shpat_'),
  },
  {
    key: 'SHOPIFY_WEBHOOK_SECRET',
    description: 'Shopify webhook secret for signature verification',
    required: 'optional',
  },
  {
    key: 'SHOPIFY_STOREFRONT_TOKEN',
    description: 'Shopify Storefront API token',
    required: 'optional',
  },

  // Email (Optional)
  {
    key: 'RESEND_API_KEY',
    description: 'Resend API key for sending emails',
    required: 'optional',
    validate: (val) => val.startsWith('re_'),
  },

  // Cron jobs
  {
    key: 'CRON_API_KEY',
    description: 'API key for protecting cron job endpoints',
    required: 'optional',
  },

  // Feature flags
  {
    key: 'VITE_ENABLE_WOWL_AI',
    description: 'Enable Wowl AI tutor features',
    required: 'optional',
    validate: (val) => val === 'true' || val === 'false',
  },
  {
    key: 'VITE_ENABLE_SHOPIFY',
    description: 'Enable Shopify payment integration',
    required: 'optional',
    validate: (val) => val === 'true' || val === 'false',
  },
  {
    key: 'VITE_ENABLE_EMAIL',
    description: 'Enable email notifications',
    required: 'optional',
    validate: (val) => val === 'true' || val === 'false',
  },
];

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Get environment variable value (supports both process.env and import.meta.env)
 */
function getEnvVar(key: string): string | undefined {
  // Check Vite's import.meta.env (client-side)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const value = import.meta.env[key];
    if (value !== undefined) return value;
  }

  // Check Node.js process.env (server-side/build time)
  if (typeof process !== 'undefined' && process.env) {
    const value = process.env[key];
    if (value !== undefined) return value;
  }

  return undefined;
}

/**
 * Validate all environment variables
 */
export function validateEnvironment(): EnvValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const isProd = isProduction;

  console.log(`\n🔍 Validating environment variables (${isProd ? 'PRODUCTION' : 'DEVELOPMENT'} mode)...\n`);

  for (const envVar of ENV_VARS) {
    const value = getEnvVar(envVar.key);
    const isSet = value !== undefined && value !== '';

    // Check if required
    const isRequired =
      envVar.required === 'always' ||
      (envVar.required === 'production' && isProd);

    if (isRequired && !isSet) {
      errors.push(
        `❌ ${envVar.key} is required ${envVar.required === 'always' ? 'always' : 'in production'}: ${envVar.description}`
      );
      continue;
    }

    // Validate format if value is set
    if (isSet && envVar.validate && !envVar.validate(value!)) {
      errors.push(
        `❌ ${envVar.key} has invalid format: ${envVar.description}`
      );
      continue;
    }

    // Check optional vars
    if (envVar.required === 'optional' && !isSet) {
      warnings.push(
        `⚠️  ${envVar.key} is not set: ${envVar.description} (optional)`
      );
      continue;
    }

    if (isSet) {
      console.log(`✅ ${envVar.key} - configured`);
    }
  }

  // Additional validation from config
  const configValidation = validateProductionConfig();
  errors.push(...configValidation.errors);

  // Display results
  if (warnings.length > 0) {
    console.log('\n📋 Warnings:');
    warnings.forEach(w => console.log(w));
  }

  if (errors.length > 0) {
    console.log('\n🚨 Errors:');
    errors.forEach(e => console.log(e));
  }

  const valid = errors.length === 0;

  if (valid) {
    console.log('\n✅ All required environment variables are configured!\n');
  } else {
    console.log('\n❌ Environment validation failed!\n');
  }

  return {
    valid,
    errors,
    warnings,
  };
}

/**
 * Validate and throw error if invalid (for build-time checks)
 */
export function validateEnvironmentOrThrow(): void {
  const result = validateEnvironment();

  if (!result.valid) {
    throw new Error(
      `Environment validation failed:\n${result.errors.join('\n')}`
    );
  }
}

/**
 * Check if a specific feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof config.features): boolean {
  return config.features[feature] || false;
}

/**
 * Get a safe environment variable with fallback
 */
export function getEnvOrThrow(key: string, fallback?: string): string {
  const value = getEnvVar(key) || fallback;

  if (!value) {
    throw new Error(
      `Required environment variable ${key} is not set and no fallback provided`
    );
  }

  return value;
}

/**
 * Check if running in development mode
 */
export function isDevelopment(): boolean {
  return !isProduction;
}

/**
 * Get current environment name
 */
export function getEnvironmentName(): string {
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.VERCEL_ENV === 'production') return 'production';
    if (process.env.VERCEL_ENV === 'preview') return 'preview';
    if (process.env.NODE_ENV === 'production') return 'production';
    if (process.env.NODE_ENV === 'test') return 'test';
  }
  return 'development';
}

// ============================================================================
// STARTUP VALIDATION (runs automatically in production)
// ============================================================================

// Only validate in production builds
if (isProduction) {
  const result = validateEnvironment();
  
  if (!result.valid) {
    console.error('\n❌ CRITICAL: Environment validation failed in production!');
    console.error('The application may not function correctly.');
    console.error('Please configure the required environment variables.\n');
    
    // In production, we log errors but don't throw to allow the app to start
    // (some features may be degraded but basic functionality should work)
  }
} else {
  // In development, just log the validation results
  validateEnvironment();
}

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

export const env = {
  // Supabase
  supabaseUrl: config.supabase.url,
  supabaseAnonKey: config.supabase.anonKey,
  
  // App
  appName: config.app.name,
  appUrl: config.app.baseUrl,
  supportEmail: config.app.supportEmail,
  
  // Environment
  isProd: isProduction,
  isDev: isDevelopment(),
  envName: getEnvironmentName(),
  
  // Features
  features: config.features,
};
# Form Processing Security Guide

## Overview

The form processing system integrates Google Sheets submissions with the Supabase database. This guide explains the security architecture and proper setup.

## Architecture

```
Google Sheets → API Endpoint → Server-Side Client → Supabase Database
                (Vercel)      (Service Role Key)    (Bypasses RLS)
```

### Components

1. **Google Sheets**: Collects form submissions from parents
2. **API Endpoint** (`api/process-form-submissions.ts`): Vercel serverless function
3. **Server-Side Client** (`src/lib/supabase/server-client.ts`): Supabase client with service role key
4. **Form Processing Service** (`src/lib/services/form-processing-service.ts`): Business logic

## Security Requirements

### ✅ Correct Setup

The form processing system **requires** privileged operations:
- Creating parent profiles
- Creating student profiles
- Creating relationships between parents and students
- Creating intake records and assessments

These operations **must** use the Supabase service role key because they:
1. Create profiles for users who haven't signed up yet
2. Bypass Row Level Security (RLS) policies
3. Run in a secure server-side environment

### ⚠️ Critical Security Rules

1. **Service Role Key Must Stay Server-Side**
   - ✅ Use in: `api/*` endpoints, Node.js scripts, Supabase Edge Functions
   - ❌ Never use in: React components, frontend code, client-side bundles

2. **Environment Variable Naming**
   - ✅ Correct: `SUPABASE_SERVICE_ROLE_KEY` (no VITE_ prefix)
   - ❌ Wrong: `VITE_SUPABASE_SERVICE_ROLE_KEY` (would expose to browser)

3. **Import Protection**
   - The `createServerClient()` function has runtime checks
   - Throws error if called in browser context
   - Validates service role key vs anon key

## Setup Instructions

### 1. Get the Service Role Key

1. Go to your Supabase project dashboard
2. Navigate to: **Settings → API**
3. Copy the `service_role` key (NOT the `anon` key)
4. Keep this key secret - it bypasses all security policies

### 2. Configure Environment Variables

Add to your `.env` file (local development):

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ... (public anon key)
SUPABASE_SERVICE_ROLE_KEY=eyJ... (secret service role key)

# Google Sheets Integration
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_SHEETS_SHEET_NAME=Form Responses 1

# Form Processing Security
FORM_PROCESSING_SECRET=generate-random-secret-with-openssl
```

### 3. Configure Vercel Environment Variables

In your Vercel project settings:

1. Go to: **Settings → Environment Variables**
2. Add all the variables from step 2
3. Set `SUPABASE_SERVICE_ROLE_KEY` to **Production** only (not Preview)
4. Never commit these values to git

### 4. Generate Secrets

```bash
# Generate FORM_PROCESSING_SECRET
openssl rand -base64 32
```

## Usage

### API Endpoint

The form processing endpoint is protected by:
1. Authorization header check
2. POST method only
3. Server-side execution

```typescript
// api/process-form-submissions.ts
import { createServerClient } from '../src/lib/supabase/server-client';

const supabase = createServerClient(); // ✅ Server-side only
const result = await processFormSubmission(supabase, submission);
```

### Calling the Endpoint

```bash
curl -X POST https://your-domain.com/api/process-form-submissions \
  -H "Authorization: Bearer YOUR_FORM_PROCESSING_SECRET" \
  -H "Content-Type: application/json"
```

## Verification

### Check 1: Build Output

After running `npm run build`, verify the service role key is NOT in the bundle:

```bash
grep -r "SUPABASE_SERVICE_ROLE_KEY" dist/
# Should return nothing
```

### Check 2: Runtime Protection

Try importing server-client in a React component:

```typescript
// This will throw an error at runtime:
import { createServerClient } from '@/lib/supabase/server-client';

const supabase = createServerClient();
// Error: SECURITY ERROR: createServerClient() cannot be called in browser code
```

## RLS Policies

While the service role key bypasses RLS, you should still have proper RLS policies:

1. **profiles table**: Public read, authenticated write (own profile)
2. **student_profiles table**: Parent/tutor can read their students
3. **parent_students table**: Parents can read their own relationships
4. **form_submissions table**: Admin/tutor only

The service role operations are limited to:
- Initial profile creation from form submissions
- Creating relationships during onboarding
- One-time data imports

Regular application features use the anon key with RLS policies.

## Troubleshooting

### Error: Missing SUPABASE_SERVICE_ROLE_KEY

**Cause**: Environment variable not set

**Fix**: Add to `.env` (local) or Vercel settings (production)

### Error: Service role key appears to be anon key

**Cause**: Using anon key instead of service role key

**Fix**: Get the correct `service_role` key from Supabase dashboard

### Error: Cannot call createServerClient in browser

**Cause**: Trying to import server-client in frontend code

**Fix**: Only use in `api/*` endpoints or server-side scripts

## References

- [Supabase Service Role Key Docs](https://supabase.com/docs/guides/api/api-keys)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)

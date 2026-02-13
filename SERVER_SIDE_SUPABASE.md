# Server-Side Supabase Client Usage Guide

## Overview

This project uses two types of Supabase clients:

1. **Client-side client** (`src/lib/supabase/client.ts`) - Uses the public anon key, respects RLS policies
2. **Server-side client** (`src/lib/supabase/server-client.ts`) - Uses the service role key, bypasses RLS policies

## When to Use Each Client

### Client-Side Client (Anon Key)

**Use for:**
- Frontend components and pages
- User authentication flows
- User-initiated queries (where RLS should apply)
- Any code that runs in the browser

**Located at:** `src/lib/supabase/client.ts`

**Import:**
```typescript
import { supabase } from '@/lib/supabase/client';
```

### Server-Side Client (Service Role Key)

**Use for:**
- API routes and Vercel serverless functions
- Background jobs and cron tasks
- Admin operations that need to bypass RLS
- Creating/modifying data on behalf of users (e.g., form processing)

**Located at:** `src/lib/supabase/server-client.ts`

**Import:**
```typescript
import { getServerSupabaseClient } from '@/lib/supabase/server-client';

// In your API handler
const supabase = getServerSupabaseClient();
```

## Security Rules

### ⚠️ CRITICAL SECURITY REQUIREMENTS

1. **NEVER import server-client.ts in client-side code**
   - Do NOT import in `src/pages/`
   - Do NOT import in `src/components/`
   - ONLY import in `api/` directory

2. **Service role key must NEVER be exposed to the browser**
   - Never prefix with `VITE_` in environment variables
   - Keep as `SUPABASE_SERVICE_ROLE_KEY` (no VITE_ prefix)
   - Only accessible in server-side code

3. **Always validate inputs in API routes**
   - Never trust client-supplied data
   - Validate payment types, amounts, and user permissions
   - Log all privileged operations

## Example: Form Processing Service

The form processing service demonstrates proper usage:

```typescript
// src/lib/services/form-processing-service.ts
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';

// Accept client as parameter instead of importing directly
export async function processFormSubmission(
  supabase: SupabaseClient<Database>,
  submission: FormSubmission
) {
  // Performs privileged operations using passed-in client
  await supabase.from('profiles').insert({ ... });
}
```

```typescript
// api/process-form-submissions.ts
import { getServerSupabaseClient } from '../src/lib/supabase/server-client';

export default async function handler(req, res) {
  // Get server client with service role key
  const supabase = getServerSupabaseClient();
  
  // Pass to service function
  await processFormSubmission(supabase, submission);
}
```

## Environment Variables

### Required for Production

```bash
# Client-side (prefixed with VITE_)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...

# Server-side (NO VITE_ prefix - never exposed to browser)
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
```

### Deployment Configuration

1. **Netlify/Vercel:** Add to environment variables in dashboard
2. **Local development:** Add to `.env` file (gitignored)
3. **CI/CD:** Add as encrypted secrets

## Testing Server-Side Operations

When testing API endpoints locally:

1. Ensure `.env` has `SUPABASE_SERVICE_ROLE_KEY` set
2. Test endpoint: `curl -X POST http://localhost:3000/api/process-form-submissions`
3. Check logs for "Server-side Supabase client initialized with service role key"

## Common Mistakes to Avoid

❌ **DON'T:**
```typescript
// In a React component (client-side code)
import { getServerSupabaseClient } from '@/lib/supabase/server-client';
```

❌ **DON'T:**
```typescript
// Using anon client for privileged operations
import { supabase } from '@/lib/supabase/client';

// This will fail due to RLS policies
await supabase.from('profiles').insert({ role: 'admin' });
```

✅ **DO:**
```typescript
// In API route (server-side code)
import { getServerSupabaseClient } from '../src/lib/supabase/server-client';

const supabase = getServerSupabaseClient();
await supabase.from('profiles').insert({ role: 'admin' });
```

## Troubleshooting

### Error: "SUPABASE_SERVICE_ROLE_KEY environment variable is required"

**Solution:** Add `SUPABASE_SERVICE_ROLE_KEY` to your environment variables (without VITE_ prefix)

### Error: "new row violates row-level security policy"

**Cause:** Using anon client for privileged operations

**Solution:** Use server-side client with service role key

### Build Error: "Cannot find module 'server-client'"

**Cause:** Trying to import server-client in client-side code

**Solution:** Only import server-client in API routes (`api/` directory)

## References

- [Supabase Service Role Key Documentation](https://supabase.com/docs/guides/api/api-keys)
- [Row Level Security (RLS) Guide](https://supabase.com/docs/guides/auth/row-level-security)
- Custom Instructions: `.github/instructions/`

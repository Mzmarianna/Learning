# Server-Only Libraries

This directory contains server-side utilities and services that should **never** be imported into client-side code.

## Files

- **google-sheets-service.ts**: Google Sheets API integration for fetching form submissions. Uses server-only credentials (`GOOGLE_SHEETS_*` environment variables).
- **form-processing-service.ts**: Processes form submissions from Google Sheets and creates student profiles in Supabase.

## Security Notice

⚠️ **These files contain server-only logic and use sensitive environment variables.**

- DO NOT import these files from `src/` (client code)
- These files are only meant to be imported by Netlify Functions
- Server-only credentials (like `GOOGLE_SHEETS_CLIENT_EMAIL`, `GOOGLE_SHEETS_PRIVATE_KEY`) are used here

## Usage

These services are used by Netlify Functions such as:
- `netlify/functions/process-form-submissions.ts`

Example:
```typescript
// In a Netlify Function
const { fetchNewSubmissions } = await import('./lib/google-sheets-service');
const { processFormSubmission } = await import('./lib/form-processing-service');
```

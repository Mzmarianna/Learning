# Google Sheets Form Integration - Setup Guide

## Overview

This guide explains how to set up the Google Sheets form integration to automatically process intake form submissions and create student profiles.

## Prerequisites

1. Google Cloud Project with Sheets API enabled
2. Service Account with access to the Google Sheet
3. Supabase database with migration applied
4. Netlify deployment (for serverless functions)

## Setup Steps

### 1. Google Sheets API Setup

#### Create Service Account
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Sheets API
4. Create a Service Account:
   - Go to IAM & Admin → Service Accounts
   - Click "Create Service Account"
   - Name it "form-processor" or similar
   - Grant role: "Service Account User"
5. Create JSON key:
   - Click on service account
   - Keys → Add Key → Create New Key → JSON
   - Download the JSON file

#### Share Sheet with Service Account
1. Open the Google Sheet: https://docs.google.com/spreadsheets/d/1MHSmxDUdTrc9SIBDCl_hiHNxqoOHMv19nHeMN1_MVUo/
2. Click "Share"
3. Add the service account email (from JSON: `client_email`)
4. Grant "Viewer" access
5. Click "Send"

### 2. Database Migration

Run the migration to create required tables:

```bash
# Apply migration to Supabase
supabase migration up

# Or manually run the SQL file
psql <connection-string> < supabase/migrations/002_form_integration.sql
```

This creates:
- `form_submissions` - Tracks processed form entries
- `student_intake` - Stores detailed intake information
- `assessments` - Manages assessment scheduling and results

### 3. Environment Variables

Add these to your `.env` file and Netlify environment:

```bash
# Google Sheets API (from service account JSON)
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Form Processing Security
FORM_PROCESSING_SECRET=your-random-secret-key-here

# Existing Supabase vars (should already be set)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-key
```

**Generate secure secret:**
```bash
openssl rand -base64 32
```

### 4. Netlify Configuration

Add environment variables via Netlify Dashboard or CLI:

**Via Netlify Dashboard:**
1. Go to Site Settings → Environment Variables
2. Add the following variables:
   - `GOOGLE_SHEETS_CLIENT_EMAIL`
   - `GOOGLE_SHEETS_PRIVATE_KEY`
   - `FORM_PROCESSING_SECRET`
   - `GOOGLE_SHEETS_SPREADSHEET_ID`
   - `GOOGLE_SHEETS_SHEET_NAME`

**Via Netlify CLI:**

```bash
netlify env:set GOOGLE_SHEETS_CLIENT_EMAIL "your-service-account@project.iam.gserviceaccount.com"
netlify env:set GOOGLE_SHEETS_PRIVATE_KEY "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
netlify env:set FORM_PROCESSING_SECRET "your-random-secret"
netlify env:set GOOGLE_SHEETS_SPREADSHEET_ID "1MHSmxDUdTrc9SIBDCl_hiHNxqoOHMv19nHeMN1_MVUo"
netlify env:set GOOGLE_SHEETS_SHEET_NAME "Form Responses 1"
```

### 5. Install Dependencies

Add required npm packages:

```bash
npm install googleapis @google-cloud/local-auth
```

Update `package.json`:

```json
{
  "dependencies": {
    "googleapis": "^118.0.0"
  }
}
```

## Usage

### Manual Processing

Call the API endpoint manually:

```bash
curl -X POST https://www.mzmarianna.com/.netlify/functions/process-form-submissions \
  -H "Authorization: Bearer YOUR_FORM_PROCESSING_SECRET" \
  -H "Content-Type: application/json"
```

### Automated Processing (Cron Job)

#### Option 1: Netlify Scheduled Functions (Recommended)

Netlify supports scheduled functions using the `@netlify/functions` package. See [Netlify Scheduled Functions documentation](https://docs.netlify.com/functions/scheduled-functions/).

#### Option 2: External Cron Service

Use services like:
- Cron-job.org
- EasyCron
- GitHub Actions

Example GitHub Action (`.github/workflows/process-forms.yml`):

```yaml
name: Process Form Submissions
on:
  schedule:
    - cron: '0 */2 * * *'  # Every 2 hours
  workflow_dispatch:  # Manual trigger

jobs:
  process:
    runs-on: ubuntu-latest
    steps:
      - name: Call API
        run: |
          curl -X POST https://www.mzmarianna.com/.netlify/functions/process-form-submissions \
            -H "Authorization: Bearer ${{ secrets.FORM_PROCESSING_SECRET }}"
```

#### Option 3: Google Apps Script Trigger

Add to Google Sheets:

```javascript
function onFormSubmit(e) {
  const url = 'https://www.mzmarianna.com/.netlify/functions/process-form-submissions';
  const options = {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_SECRET_HERE'
    }
  };
  
  UrlFetchApp.fetch(url, options);
}
```

Set trigger: Edit → Current project's triggers → Add Trigger → From spreadsheet → On form submit

## Monitoring

### Check Processing Status

Query the database:

```sql
-- See processed submissions
SELECT * FROM form_submissions 
WHERE processed = true 
ORDER BY timestamp DESC;

-- See pending submissions
SELECT * FROM form_submissions 
WHERE processed = false 
ORDER BY timestamp DESC;

-- See recent assessments
SELECT 
  a.*,
  p.display_name as student_name,
  si.grade
FROM assessments a
JOIN student_profiles sp ON a.student_id = sp.id
JOIN profiles p ON sp.id = p.id
JOIN student_intake si ON a.student_id = si.student_id
ORDER BY a.created_at DESC;
```

### Logs

Check Netlify function logs:

```bash
netlify functions:log process-form-submissions
```

Or via Netlify Dashboard → Functions → View Logs

## Troubleshooting

### Error: "Authentication failed"

- Check service account email is correct
- Verify private key includes `\n` for line breaks
- Ensure sheet is shared with service account

### Error: "Submission already processed"

- This is normal - prevents duplicates
- Check `form_submissions` table for existing record

### Error: "Missing required fields"

- Verify form column mapping in `google-sheets-service.ts`
- Check that Google Form questions match expected structure
- Ensure all required fields are filled in form

### No new submissions detected

- Check sheet has new rows
- Verify `lastRow` parameter or check last processed row in database
- Ensure sheet name matches: "Form Responses 1"

## Data Flow

```
Google Form Submission
  ↓
Google Sheets (auto-save)
  ↓
Cron Job triggers API endpoint
  ↓
API fetches new rows via Google Sheets API
  ↓
Process each submission:
  1. Save to form_submissions
  2. Create parent profile
  3. Create student profile
  4. Create student_intake record
  5. Create assessment record
  6. Mark as processed
  ↓
Send notification emails
  ↓
Student appears in admin dashboard
```

## Testing

### Test with Sample Data

1. Fill out the Google Form with test data
2. Wait for cron job OR manually trigger endpoint
3. Check database for new records:

```sql
SELECT 
  fs.*,
  p.display_name as student_name
FROM form_submissions fs
LEFT JOIN student_profiles sp ON fs.student_id = sp.id
LEFT JOIN profiles p ON sp.id = p.id
ORDER BY fs.timestamp DESC
LIMIT 5;
```

4. Verify student appears in dashboard
5. Check assessment is created

### Manual Test API

```bash
# Test endpoint is accessible
curl https://www.mzmarianna.com/.netlify/functions/process-form-submissions

# Should return: 401 Unauthorized (good - auth working)

# Test with auth
curl -X POST https://www.mzmarianna.com/.netlify/functions/process-form-submissions \
  -H "Authorization: Bearer YOUR_SECRET" \
  -v
```

## Production Checklist

- [ ] Service account created and JSON downloaded
- [ ] Google Sheet shared with service account email
- [ ] Database migration applied
- [ ] Environment variables set in Vercel
- [ ] Dependencies installed
- [ ] Cron job configured
- [ ] Test submission processed successfully
- [ ] Monitoring/alerts set up
- [ ] Parent notification emails working
- [ ] Admin dashboard shows new students

## Support

For issues:
1. Check Vercel function logs
2. Query database for errors
3. Verify environment variables
4. Test Google Sheets API access
5. Contact: mariannav920@gmail.com

## Security Notes

- Never commit service account JSON to git
- Use environment variables for all secrets
- Rotate FORM_PROCESSING_SECRET periodically
- Limit service account permissions to read-only on sheet
- Use HTTPS for all API calls
- Verify authorization header on every request

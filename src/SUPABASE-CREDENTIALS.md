# 🔑 Your Supabase Configuration - Complete Reference

**Project:** Mz. Marianna's Academy  
**Supabase Project:** wyclbrafklhvdyjpoeno  
**Status:** ✅ Already Configured

---

## 📋 **YOUR SUPABASE CREDENTIALS**

### **✅ Already Set Up in Your Code:**

```bash
# Primary Supabase URL (Data API)
VITE_SUPABASE_URL=https://wyclbrafklhvdyjpoeno.supabase.co

# Anon/Public Key (Safe for frontend)
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5Y2xicmFma2xodmR5anBvZW5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNjE5NTksImV4cCI6MjA4MzczNzk1OX0.m5-k4PKsusRyKYeZSyOeUKb5Y_jm3ZhXNC0GXWzC2CM
```

**Where it's configured:**
- ✅ `/config.ts` (fallback values for local dev)
- ✅ Environment variables override these in production

---

## 🔗 **QUICK LINKS**

### **Supabase Dashboard:**
```
Main Dashboard:
https://supabase.com/dashboard/project/wyclbrafklhvdyjpoeno

Table Editor:
https://supabase.com/dashboard/project/wyclbrafklhvdyjpoeno/editor

SQL Editor:
https://supabase.com/dashboard/project/wyclbrafklhvdyjpoeno/sql/new

API Keys:
https://supabase.com/dashboard/project/wyclbrafklhvdyjpoeno/settings/api

Database Settings:
https://supabase.com/dashboard/project/wyclbrafklhvdyjpoeno/settings/database
```

---

## 🎯 **FOR NETLIFY DEPLOYMENT**

### **Environment Variables to Add in Netlify:**

Go to: **Netlify Dashboard → Your Site → Site settings → Environment variables**

**Add these variables:**

```bash
# Required for Production
VITE_SUPABASE_URL=https://wyclbrafklhvdyjpoeno.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5Y2xicmFma2xodmR5anBvZW5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNjE5NTksImV4cCI6MjA4MzczNzk1OX0.m5-k4PKsusRyKYeZSyOeUKb5Y_jm3ZhXNC0GXWzC2CM
```

**Note:** The Service Role Key is already set in your Netlify environment based on the system info.

---

## 📊 **YOUR DATABASE TABLES**

Based on your platform setup, you should have these tables:

### **Core Tables:**
- ✅ `users` - User accounts (admin, students, parents)
- ✅ `students` - Student profiles
- ✅ `email_leads` - Free guide signups
- ✅ `placement_quiz_results` - Quiz submissions
- ✅ `quests` - Learning quests/modules
- ✅ `challenges` - Individual challenges
- ✅ `submissions` - Student work submissions
- ✅ `student_progress` - XP, levels, achievements
- ✅ `payments` - Stripe payment records
- ✅ `invoices` - Payment invoices

### **Verify Tables Exist:**
```
1. Go to: https://supabase.com/dashboard/project/wyclbrafklhvdyjpoeno/editor
2. Check left sidebar - you should see all tables listed
3. If tables are missing, run migrations (see DATABASE-SETUP.md)
```

---

## 🔐 **SECURITY - ROW LEVEL SECURITY (RLS)**

Your tables should have RLS policies enabled:

### **Check RLS Status:**
```
1. Go to Table Editor
2. Click on any table
3. Look for "RLS" badge or tab
4. Should show "RLS enabled" ✅
```

### **Common RLS Policies:**

**Users Table:**
- Users can read their own data
- Admins can read all data
- Users can update their own profile

**Students Table:**
- Parents can read their own students
- Admins can read/write all students
- Public cannot access

**Email Leads:**
- Anyone can insert (for free guide signups)
- Only admins can read

**Payments:**
- Users can read their own payments
- Admins can read all payments

---

## 🧪 **TEST YOUR SUPABASE CONNECTION**

### **Quick Test (Browser Console):**

1. **Open your deployed site** (or localhost)
2. **Open browser console** (F12 → Console)
3. **Run this:**

```javascript
// Test Supabase connection
import { supabase } from './lib/supabase/client';

// Test 1: Check if client exists
console.log('Supabase client:', supabase);

// Test 2: Try a simple query
const testConnection = async () => {
  const { data, error } = await supabase
    .from('email_leads')
    .select('count');
  
  if (error) {
    console.error('❌ Connection failed:', error);
  } else {
    console.log('✅ Connection successful!', data);
  }
};

testConnection();
```

---

## 🔧 **YOUR CURRENT SETUP**

### **Configuration File: `/config.ts`**

Your app uses a centralized config with fallback values:

```typescript
// From /config.ts
supabase: {
  url: getEnv('VITE_SUPABASE_URL') || 'https://wyclbrafklhvdyjpoeno.supabase.co',
  anonKey: getEnv('VITE_SUPABASE_ANON_KEY') || 'eyJhbGci...',
}
```

**How it works:**
1. First tries to load from environment variables (production)
2. Falls back to hardcoded values (local development)
3. This means your app works locally WITHOUT .env file

### **Supabase Client:**

Your app likely creates the Supabase client in `/lib/supabase/client.ts` or similar:

```typescript
import { createClient } from '@supabase/supabase-js';
import { config } from '../config';

export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey
);
```

---

## 📦 **DATABASE MIGRATIONS**

If you need to set up or update your database:

### **Option 1: Using SQL Editor (Recommended)**

1. **Go to:** https://supabase.com/dashboard/project/wyclbrafklhvdyjpoeno/sql/new

2. **Run migrations in order:**
   - Look in `/supabase/migrations/` folder
   - Copy each .sql file
   - Paste into SQL Editor
   - Click "Run"

3. **Or use consolidated SQL:**
   - Run script: `./scripts/consolidate-sql.sh`
   - Generates: `COMPLETE-DATABASE.sql`
   - Copy entire file → Paste in SQL Editor → Run

### **Option 2: Using Supabase CLI**

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref wyclbrafklhvdyjpoeno

# Push migrations
supabase db push
```

---

## 🎨 **TESTING DIFFERENT ENDPOINTS**

### **REST API Endpoint:**
```
https://wyclbrafklhvdyjpoeno.supabase.co/rest/v1/
```

Test with curl:
```bash
curl https://wyclbrafklhvdyjpoeno.supabase.co/rest/v1/email_leads?select=count \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

### **Auth Endpoint:**
```
https://wyclbrafklhvdyjpoeno.supabase.co/auth/v1/
```

### **Storage Endpoint:**
```
https://wyclbrafklhvdyjpoeno.supabase.co/storage/v1/
```

---

## 🔍 **DEBUGGING SUPABASE ISSUES**

### **If You Get "Invalid API Key":**

**Check:**
1. Are you using the ANON key (not service role key) in frontend?
2. Is the key correctly copied (no extra spaces)?
3. Is the environment variable named correctly (`VITE_SUPABASE_ANON_KEY`)?

**Fix:**
```bash
# Verify your key
echo $VITE_SUPABASE_ANON_KEY

# Should start with: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
```

---

### **If You Get "Invalid Schema Public":**

**See:** `/FIX-SCHEMA-PUBLIC-ERROR.md`

**Quick fix:**
1. Check tables exist in Supabase
2. Verify RLS policies are valid
3. Make sure you're querying tables correctly (no `public.` prefix)

---

### **If Queries Return Empty:**

**Check:**
1. Does the table have data? (View in Table Editor)
2. Are RLS policies allowing access?
3. Is the user authenticated (for protected tables)?

**Test RLS:**
```sql
-- In SQL Editor, temporarily disable RLS to test
ALTER TABLE email_leads DISABLE ROW LEVEL SECURITY;

-- Try your query again
-- Then re-enable:
ALTER TABLE email_leads ENABLE ROW LEVEL SECURITY;
```

---

## 💾 **BACKUP YOUR DATABASE**

### **Manual Backup:**
```
1. Go to: https://supabase.com/dashboard/project/wyclbrafklhvdyjpoeno/database/backups
2. Click "Create backup"
3. Wait for backup to complete
4. Download backup file
```

### **Automated Backups:**
- Supabase Pro plan includes daily automated backups
- Free tier: Manual backups only

---

## 🌍 **API PERFORMANCE**

Your Supabase instance location: **(Check in dashboard)**

**To check region:**
```
1. Go to: https://supabase.com/dashboard/project/wyclbrafklhvdyjpoeno/settings/general
2. Look for "Region"
3. Example: us-east-1, eu-west-1, etc.
```

**For best performance:**
- Deploy Netlify site to same region as Supabase
- Use Supabase CDN for static assets
- Enable PostgREST caching

---

## 📊 **MONITORING**

### **Check API Usage:**
```
https://supabase.com/dashboard/project/wyclbrafklhvdyjpoeno/settings/billing
```

**Free Tier Limits:**
- Database: 500 MB
- API requests: 500 MB
- Bandwidth: 2 GB
- File storage: 1 GB

### **View Logs:**
```
https://supabase.com/dashboard/project/wyclbrafklhvdyjpoeno/logs/edge-functions
```

**Check for:**
- Failed queries
- Authentication errors
- Rate limit warnings

---

## ✅ **DEPLOYMENT CHECKLIST**

Before deploying to Netlify:

- [ ] Database tables exist in Supabase
- [ ] RLS policies are configured
- [ ] Test data added (at least 1 record per table)
- [ ] Admin account created (mariannav920@gmail.com)
- [ ] Environment variables set in Netlify:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] Test Supabase connection locally
- [ ] Verify API keys are correct

---

## 🆘 **NEED DIFFERENT KEYS?**

### **Get All Your Keys:**

Go to: https://supabase.com/dashboard/project/wyclbrafklhvdyjpoeno/settings/api

**You'll find:**

1. **Project URL** (same as above)
   ```
   https://wyclbrafklhvdyjpoeno.supabase.co
   ```

2. **anon/public key** (safe for frontend) ✅
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **service_role key** (NEVER expose to frontend) ⚠️
   - Use ONLY in backend/server code
   - Has full database access
   - Bypasses RLS policies

4. **JWT Secret** (for custom auth)
   - Used to verify JWTs
   - Keep secret!

---

## 🔐 **SECURITY BEST PRACTICES**

### **DO:**
- ✅ Use anon key in frontend code
- ✅ Store service role key in Netlify environment variables
- ✅ Enable RLS on all tables
- ✅ Use Supabase auth for user authentication
- ✅ Validate data on backend
- ✅ Set up proper CORS policies

### **DON'T:**
- ❌ Commit .env files to Git
- ❌ Expose service role key in frontend
- ❌ Disable RLS in production
- ❌ Store sensitive data unencrypted
- ❌ Use service role key for client-side operations
- ❌ Allow public access to user data

---

## 🚀 **YOU'RE ALL SET!**

Your Supabase is configured and ready to use:

**Primary URL:** `https://wyclbrafklhvdyjpoeno.supabase.co`  
**Status:** ✅ Active and configured  
**Next Step:** Deploy to Netlify and go live!

---

## 📖 **RELATED GUIDES:**

- **Deployment:** `/YOUR-ACTION-PLAN.md`
- **Database Setup:** `/DATABASE-SETUP.md`
- **Fix Schema Errors:** `/FIX-SCHEMA-PUBLIC-ERROR.md`
- **Squarespace DNS:** `/SQUARESPACE-DNS-SETUP.md`

---

**🎯 Ready to deploy? Follow YOUR-ACTION-PLAN.md!**

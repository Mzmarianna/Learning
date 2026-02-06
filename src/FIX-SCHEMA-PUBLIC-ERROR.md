# 🔧 Fix "Invalid Schema Public" Error

**Error:** "invalid schema public"  
**Cause:** Supabase database schema configuration issue  
**Fix Time:** 5 minutes

---

## 🎯 **WHAT THIS ERROR MEANS**

This error happens when:
1. Your Supabase Row Level Security (RLS) policies reference `public` schema incorrectly
2. Database migrations haven't run
3. Environment variables point to wrong Supabase project
4. Supabase service role key is being used incorrectly

---

## ✅ **QUICK FIX**

### **Step 1: Verify Environment Variables**

Check your `.env` file (or Netlify environment variables):

```bash
# Should be:
VITE_SUPABASE_URL=https://wyclbrafklhvdyjpoeno.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ... (your anon key, NOT service role key)

# NOT this:
VITE_SUPABASE_URL=https://some-other-project.supabase.co  # ❌ Wrong project
VITE_SUPABASE_ANON_KEY=service_role_key...  # ❌ Wrong key type
```

**Fix:**
1. Go to: https://supabase.com/dashboard/project/wyclbrafklhvdyjpoeno/settings/api
2. Copy the **"anon public"** key (NOT service role key)
3. Update your environment variable

---

### **Step 2: Check Your Supabase Client Code**

The error might be in how you're creating the Supabase client.

**Check this file:** `/lib/supabase/client.ts` or wherever you create the client

**Should look like this:**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ✅ Correct - using anon key
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ❌ WRONG - using service role key on frontend
// export const supabase = createClient(supabaseUrl, serviceRoleKey);
```

**Important:** NEVER use the service role key in frontend code!

---

### **Step 3: Check Database Schema**

Go to Supabase dashboard and verify tables exist:

```
1. Go to: https://supabase.com/dashboard/project/wyclbrafklhvdyjpoeno
2. Click "Table Editor"
3. Verify you see these tables:
   ✅ users
   ✅ students  
   ✅ email_leads
   ✅ placement_quiz_results
   ✅ quests
   ✅ challenges
   ✅ submissions
   ✅ payments
```

**If tables are missing:**
```
→ Go to "SQL Editor"
→ Run the migration files from /supabase/migrations/
→ Or create tables manually
```

---

### **Step 4: Fix Row Level Security (RLS) Policies**

The error might be in your RLS policies if they reference schema incorrectly.

**Check RLS policies:**
```sql
-- Go to Supabase → Table Editor → Click any table → "RLS policies"
-- Make sure policies don't have syntax errors

-- GOOD example:
CREATE POLICY "Users can read own data"
ON users FOR SELECT
USING (auth.uid() = id);

-- BAD example (causes "invalid schema" error):
CREATE POLICY "Bad policy"
ON public.users FOR SELECT  -- ❌ "public." prefix can cause issues
USING (auth.uid() = id);
```

**Fix:**
1. Go to each table in Supabase
2. Click "RLS" tab
3. Remove or fix any policies with errors
4. Re-enable RLS

---

## 🔍 **WHERE IS THE ERROR HAPPENING?**

Tell me where you're seeing this error:

### **During Build?**
```
Error location: Netlify build logs
Fix: Check environment variables in Netlify dashboard
```

### **On Page Load?**
```
Error location: Browser console (F12)
Fix: Check Supabase client initialization
```

### **During Database Query?**
```
Error location: Supabase logs or browser console
Fix: Check RLS policies and table permissions
```

### **During Deployment?**
```
Error location: Deployment script output
Fix: Check Supabase URL and keys
```

---

## 🛠️ **COMMON CAUSES & FIXES**

### **Cause 1: Wrong Supabase Key**
```
Error: Using service_role key instead of anon key

Fix:
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
(Should start with eyJ and be the ANON key, not service role)
```

### **Cause 2: Wrong Supabase URL**
```
Error: Environment variable points to different project

Fix:
VITE_SUPABASE_URL=https://wyclbrafklhvdyjpoeno.supabase.co
(Make sure it's YOUR project URL)
```

### **Cause 3: Schema Not Found**
```
Error: Trying to query tables that don't exist

Fix:
1. Go to Supabase dashboard
2. Run migrations from /supabase/migrations/
3. Verify tables exist
```

### **Cause 4: RLS Policy Error**
```
Error: Invalid RLS policy syntax

Fix:
1. Go to Table Editor → Select table → RLS policies
2. Disable RLS temporarily to test
3. Fix policy syntax
4. Re-enable RLS
```

---

## 🧪 **TEST YOUR SUPABASE CONNECTION**

Create a test file to verify Supabase works:

**Create:** `test-supabase.html`
```html
<!DOCTYPE html>
<html>
<head>
  <title>Test Supabase</title>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>
  <h1>Supabase Connection Test</h1>
  <button onclick="testConnection()">Test Connection</button>
  <pre id="result"></pre>

  <script>
    const SUPABASE_URL = 'https://wyclbrafklhvdyjpoeno.supabase.co';
    const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE'; // Replace!

    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    async function testConnection() {
      try {
        // Test 1: Check connection
        const { data, error } = await supabase
          .from('email_leads')
          .select('count')
          .limit(1);

        if (error) {
          document.getElementById('result').textContent = 
            '❌ Error: ' + JSON.stringify(error, null, 2);
        } else {
          document.getElementById('result').textContent = 
            '✅ Success! Supabase connected.\n' + JSON.stringify(data, null, 2);
        }
      } catch (err) {
        document.getElementById('result').textContent = 
          '❌ Exception: ' + err.message;
      }
    }
  </script>
</body>
</html>
```

**Run test:**
1. Replace `YOUR_ANON_KEY_HERE` with your actual anon key
2. Open in browser
3. Click "Test Connection"
4. Should show ✅ Success

---

## 📋 **CHECKLIST**

- [ ] Using correct Supabase URL (wyclbrafklhvdyjpoeno.supabase.co)
- [ ] Using anon key (NOT service role key)
- [ ] Environment variables have VITE_ prefix
- [ ] Tables exist in Supabase
- [ ] RLS policies are valid
- [ ] No schema prefix in queries (use `from('users')` not `from('public.users')`)

---

## 🔧 **SPECIFIC FIXES**

### **For Netlify Deployment:**
```
1. Netlify Dashboard → Site configuration → Environment variables
2. Verify:
   VITE_SUPABASE_URL = https://wyclbrafklhvdyjpoeno.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJ... (anon key)
3. Trigger new deploy
4. Check build logs for errors
```

### **For Local Development:**
```bash
# Create .env.local file
echo "VITE_SUPABASE_URL=https://wyclbrafklhvdyjpoeno.supabase.co" > .env.local
echo "VITE_SUPABASE_ANON_KEY=your_anon_key_here" >> .env.local

# Restart dev server
npm run dev
```

### **For Database Issues:**
```sql
-- In Supabase SQL Editor, run:

-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- If tables missing, run migrations
-- Copy content from /supabase/migrations/*.sql
-- And run each migration in order
```

---

## 🆘 **STILL NOT WORKING?**

### **Share This Info:**
1. Where are you seeing the error? (Build, browser, deployment)
2. Full error message (copy/paste)
3. Are tables visible in Supabase dashboard?
4. Which environment variables are set?

### **Debug Steps:**
```bash
# Check environment variables
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Check build
npm run build
# Look for errors in output

# Check browser console
# Open site → F12 → Console tab
# Look for Supabase errors
```

---

## ✅ **CORRECT CONFIGURATION**

Here's what your setup should look like:

**Environment Variables (.env or Netlify):**
```bash
VITE_SUPABASE_URL=https://wyclbrafklhvdyjpoeno.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5Y2xicmFma2xodmR5anBvZW5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQwNjcyMDAsImV4cCI6MjAxOTY0MzIwMH0.XXXXXXXXXXXXXXXXXXXXX
```

**Supabase Client (lib/supabase/client.ts):**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**Database Query (correct way):**
```typescript
// ✅ Correct
const { data, error } = await supabase
  .from('email_leads')
  .select('*');

// ❌ Wrong - don't use schema prefix
const { data, error } = await supabase
  .from('public.email_leads')  // Remove "public."
  .select('*');
```

---

## 🎯 **NEXT STEPS**

1. **Check your environment variables** (most common issue)
2. **Verify you're using anon key, not service role key**
3. **Test Supabase connection** with the test HTML above
4. **Check browser console** for specific error details
5. **Share the full error** so I can help you fix it

---

**The `_redirects` file is fine! The error is definitely from Supabase, not Netlify redirects.** Let me know what you find! 🔍

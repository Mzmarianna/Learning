# 🔧 SUPABASE QUICK FIX GUIDE

## 🚨 Are You Getting One of These Errors?

---

### ❌ Error: "Invalid API Key"

**Cause:** The anon key wasn't copied completely

**Fix:**
1. Go to Supabase → Settings → API
2. Find **"anon"** key under "Project API keys"
3. Click the copy icon (📋) - don't manually select/copy
4. The key should start with: `eyJ` and be 200+ characters long
5. Paste in `/config.ts` - make sure no line breaks or spaces

**Example of CORRECT format:**
```typescript
anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjk1MDAwMDAwLCJleHAiOjIwMTA1NzYwMDB9.a-long-signature-here',
```

---

### ❌ Error: "Failed to fetch" or "Network Error"

**Cause:** Wrong URL or project not started

**Fix:**
1. Check your Supabase dashboard - is project "Active" or "Paused"?
2. If paused, click "Resume project" (takes 1 min)
3. Verify URL format: `https://[project-ref].supabase.co`
4. NO trailing slash: ❌ `https://xxx.supabase.co/` 
5. WITH https: ✅ `https://xxx.supabase.co`

---

### ❌ SQL Error: "type user_role already exists"

**Cause:** You already ran the schema before

**Fix Option 1 - Fresh Start (Recommended):**
1. Supabase Dashboard → Settings → General
2. Scroll to "Danger Zone"
3. Click "Pause project" then "Delete project"
4. Create a new project
5. Run schema.sql again

**Fix Option 2 - Continue with existing:**
- Your tables might already be there!
- Check: Table Editor → see if tables exist
- If yes, you're done! Skip the SQL step.

---

### ❌ SQL Error: "permission denied for schema"

**Cause:** Using wrong SQL editor or wrong user

**Fix:**
1. Make sure you're in the **SQL Editor** tab (not Table Editor)
2. Click "New query" 
3. Paste the FULL schema.sql content
4. Click "Run" or press Ctrl/Cmd + Enter
5. If still fails, try running in smaller chunks:
   - First: Lines 1-50 (extensions and enums)
   - Then: Lines 51-150 (tables)
   - Then: Remaining lines (indexes and policies)

---

### ❌ App Error: "Cannot read properties of undefined"

**Cause:** Config not set up properly in app

**Fix:**
1. Open `/config.ts`
2. Make sure you replaced BOTH:
   - ✅ `url: 'https://YOUR-ACTUAL-URL.supabase.co'`
   - ✅ `anonKey: 'eyJ...'` (your actual key)
3. Check for typos - no quotes inside quotes!
4. Save file and refresh browser

**Wrong ❌:**
```typescript
url: ''REPLACE_WITH_YOUR_SUPABASE_URL'', // double quotes
url: 'https://YOUR-PROJECT.supabase.co', // still has placeholder
```

**Right ✅:**
```typescript
url: 'https://xyzabc123.supabase.co',
anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
```

---

### ❌ "Project Database is Paused"

**Cause:** Free tier projects pause after 7 days inactive

**Fix:**
1. Go to Supabase Dashboard
2. You'll see banner: "Project is paused"
3. Click "Resume project"
4. Wait 30-60 seconds
5. Refresh page

**Prevent this:**
- Supabase keeps active projects running
- Set up a free cron job to ping it weekly
- Or upgrade to Pro plan ($25/month) for always-on

---

### ❌ "Could not find table: placement_quiz_leads"

**Cause:** Schema SQL didn't run successfully

**Fix:**
1. Go to: Table Editor in Supabase
2. Do you see ANY tables? 
   - **No tables?** → Run the schema.sql file
   - **Some tables?** → Schema partially ran, see which are missing
3. To run schema:
   - SQL Editor → New query
   - Copy ALL content from `/supabase/schema.sql`
   - Click Run

---

### ❌ Placement Quiz Leads Not Saving

**Cause:** RLS (Row Level Security) policies might be blocking

**Quick Test:**
1. Supabase → Table Editor
2. Click `placement_quiz_leads` table
3. Top right: Click "RLS" toggle - turn it OFF temporarily
4. Try submitting quiz again
5. Check if data appears in table

**If that works:**
- The schema has the right policies
- Might need to adjust `/lib/supabase/client.ts`
- Or create a service role for server-side inserts

---

### ❌ "Row Level Security Policy Violation"

**Cause:** Tables have RLS enabled but missing policies

**Fix:**
1. Go to: Authentication → Policies in Supabase
2. Find your table (e.g., `placement_quiz_leads`)
3. Make sure these policies exist:
   - `Allow public insert` (for anonymous form submissions)
   - `Allow authenticated read` (for logged-in users)

**Or Temporarily Disable RLS (for testing only):**
```sql
ALTER TABLE placement_quiz_leads DISABLE ROW LEVEL SECURITY;
```

---

## ✅ QUICK VERIFICATION CHECKLIST

Test your setup with these checks:

### 1. Config File Check
- [ ] Open `/config.ts`
- [ ] URL is YOUR actual Supabase URL (not placeholder)
- [ ] Anon key is YOUR actual key (starts with `eyJ`)
- [ ] No extra quotes or spaces
- [ ] File is saved

### 2. Supabase Dashboard Check
- [ ] Project status is "Active" (not paused)
- [ ] Can access SQL Editor
- [ ] Can access Table Editor
- [ ] Under "API" settings, you see your keys

### 3. Database Check
- [ ] SQL Editor → Run: `SELECT * FROM profiles LIMIT 1;`
- [ ] Should return "Success" (even if 0 rows)
- [ ] Table Editor shows multiple tables (profiles, student_profiles, etc.)

### 4. Connection Test
- [ ] In your app, open browser console (F12)
- [ ] Go to placement quiz page
- [ ] Submit a test entry
- [ ] No red errors in console
- [ ] Check Table Editor → `placement_quiz_leads` for new row

---

## 🆘 STILL NOT WORKING?

### Tell me EXACTLY where you're stuck:

**Copy/paste your error message:**
```
Example: "Error: Invalid API key"
```

**What step are you on?**
- [ ] Creating Supabase account
- [ ] Finding API keys
- [ ] Copying keys to config.ts
- [ ] Running SQL schema
- [ ] Testing the connection
- [ ] Other: _______________

**What have you tried?**
- List what you've already done

**Screenshots help!** (if possible)
- Screenshot of your Supabase dashboard
- Screenshot of error message
- Screenshot of config.ts (hide the actual keys!)

---

## 💡 ALTERNATIVE: Skip Supabase for Now

If you just want to test the app without database:

**Demo Mode Works Without Supabase!**
- ✅ Go to `/demo/student` or `/demo/parent`
- ✅ Data saves to browser localStorage
- ✅ Placement quiz shows sample questions
- ✅ Full app functionality for testing

**Limitation:** Data clears on browser refresh

**When you're ready**, come back and set up Supabase for real persistence!

---

## 📞 Get Help

1. **Discord/Slack**: Share your issue
2. **Supabase Docs**: https://supabase.com/docs
3. **Supabase Support**: support@supabase.io
4. **This Project**: I'm here to help! Tell me your specific error.

---

I'm here to help you get this working! Just tell me:
- What error you're seeing
- What step you're stuck on
- Any error messages

We'll get it working! 🚀

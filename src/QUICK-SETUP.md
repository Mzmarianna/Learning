# ⚡ QUICK SETUP - Get Everything Running in 20 Minutes

**Follow these exact steps. No thinking required.**

---

## ✅ **CHECKLIST**

- [ ] Supabase account created
- [ ] Database tables created
- [ ] Admin account setup
- [ ] Storage buckets created
- [ ] App deployed to Netlify
- [ ] Test student created
- [ ] Everything works!

---

## 🚀 **STEP 1: SUPABASE DATABASE (10 minutes)**

### **1.1 Create Supabase Project** (2 min)
1. Go to https://supabase.com
2. Sign up / Login
3. Click "New Project"
4. Name: `mz-marianna-academy`
5. Database Password: **Save this!**
6. Region: Choose closest to you
7. Click "Create project"
8. Wait 2 minutes...

### **1.2 Get Your Credentials** (1 min)
1. Go to Project Settings → API
2. **Copy these 2 values:**
   - `Project URL` → Save as `VITE_SUPABASE_URL`
   - `anon public` key → Save as `VITE_SUPABASE_ANON_KEY`

### **1.3 Create Database Tables** (5 min)
1. Go to SQL Editor (left sidebar)
2. Click "New query"
3. Open `supabase/schema.sql` on your computer
4. **Copy ALL the SQL** (⌘+A / Ctrl+A)
5. **Paste** into Supabase SQL Editor
6. Click **"Run"** (bottom right)
7. Wait 10 seconds...
8. ✅ Should say "Success" with no errors

### **1.4 Setup Your Admin Account** (2 min)

**First, create the auth user:**
1. Go to Authentication → Users (left sidebar)
2. Click "Add user"
3. Email: `mariannav920@gmail.com`
4. Password: `marianna2026`
5. Check ✅ "Auto Confirm User"
6. Click "Create user"
7. **COPY THE UUID** (long string like `a1b2c3d4-...`)

**Then, create the profile:**
1. Go back to SQL Editor
2. New query
3. Paste this (replace `YOUR_UUID_HERE`):

```sql
-- Replace YOUR_UUID_HERE with the UUID you copied!
INSERT INTO profiles (id, email, role, display_name)
VALUES (
  'YOUR_UUID_HERE',
  'mariannav920@gmail.com',
  'admin',
  'Marianna Vasquez'
)
ON CONFLICT (id) DO UPDATE
SET role = 'admin';
```

4. Click "Run"
5. ✅ Should say "Success"

---

## 🚀 **STEP 2: DEPLOY TO NETLIFY (10 minutes)**

### **2.1 Build Your App** (2 min)

```bash
# In your project folder

# Create .env file with your Supabase credentials
cat > .env << EOF
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_GEMINI_API_KEY=your_gemini_key
VITE_RESEND_API_KEY=your_resend_key
EOF

# Build
npm install
npm run build
```

This creates a `dist` folder.

### **2.2 Deploy to Netlify** (3 min)

1. Go to https://app.netlify.com
2. Sign up (free - use Google/GitHub)
3. Click "Add new site" → "Deploy manually"
4. **Drag your `dist` folder** into the upload area
5. Wait 30 seconds...
6. ✅ Your site is live! (random URL like `random-name.netlify.app`)

### **2.3 Add Environment Variables** (3 min)

1. Click "Site settings"
2. Click "Environment variables"
3. Add these 4 variables:

```
VITE_SUPABASE_URL = https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY = your_anon_key
VITE_GEMINI_API_KEY = your_gemini_key
VITE_RESEND_API_KEY = your_resend_key
```

4. Click "Deploys" → "Trigger deploy" → "Deploy site"
5. Wait 1 minute...
6. ✅ Site rebuilds with env vars!

### **2.4 Add Redirects** (2 min)

Your site needs redirects for React Router.

**Option A: Via Netlify Dashboard**
1. Site settings → Build & deploy → Post processing
2. Add rewrite rule:
   - From: `/*`
   - To: `/index.html`
   - Status: `200`

**Option B: Via netlify.toml file**
1. Create `netlify.toml` in your project root:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. Rebuild and re-upload

---

## 🧪 **STEP 3: TEST EVERYTHING (5 minutes)**

### **Test 1: Admin Login** (1 min)

1. Go to your Netlify URL
2. Click "Login"
3. Email: `mariannav920@gmail.com`
4. Password: `marianna2026`
5. Should redirect to `/dashboard/admin`
6. ✅ Success if you see admin dashboard!

### **Test 2: Create Test Student** (2 min)

**Option A: Via Signup Page**
1. Logout
2. Go to `/signup`
3. Create a test student:
   - Email: `test@test.com`
   - Password: `Test1234`
   - Name: `Test Student`
   - Age: `10`
   - Tier: `Explorers`
4. Click "Sign Up"
5. ✅ Should redirect to student dashboard!

**Option B: Via Admin Dashboard**
1. Login as admin
2. Go to admin dashboard
3. Click "Create Student"
4. Fill out form
5. ✅ Student created!

### **Test 3: Submit Work** (2 min)

1. Login as test student
2. Dashboard should show challenges
3. Click on any challenge
4. Click "Submit Work"
5. Upload a test image or write text
6. Click "Submit"
7. Wait 2 seconds...
8. ✅ Should see Wowl feedback!

---

## ✅ **YOU'RE DONE!**

**What's now working:**
- ✅ Student registration
- ✅ Student login
- ✅ Student dashboard
- ✅ Challenge submission
- ✅ AI assessment (Wowl)
- ✅ Progress tracking
- ✅ Admin dashboard
- ✅ Parent dashboard (if you create parent accounts)

---

## 🔧 **TROUBLESHOOTING**

### **Problem: "Blank page after login"**
**Solution:** Add redirects (see Step 2.4)

### **Problem: "Can't connect to Supabase"**
**Solution:**
1. Check `.env` file has correct values
2. Check you added env vars to Netlify
3. Rebuild site after adding env vars

### **Problem: "Admin login doesn't work"**
**Solution:**
1. Check you created the auth user
2. Check you created the profile in SQL
3. Check the UUID matches

### **Problem: "Submissions don't save"**
**Solution:**
1. Check database tables were created
2. Check Row Level Security policies
3. Check browser console for errors

---

## 📊 **VERIFY DATABASE**

Check tables were created:

```sql
-- Run in Supabase SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Should see:
- ✅ profiles
- ✅ student_profiles
- ✅ parent_students
- ✅ tutor_students
- ✅ quest_progress
- ✅ challenge_progress
- ✅ submissions
- ✅ assessment_scores
- ✅ badges_earned
- ✅ activity_log

---

## 🎯 **WHAT'S NEXT**

After everything works:

1. **Create real student accounts**
   - Invite your first students
   - Or create demo accounts

2. **Assign quests/challenges**
   - Use admin dashboard
   - Or use API

3. **Test parent dashboard**
   - Create parent account
   - Link to students
   - View progress

4. **Customize domain**
   - Go to Netlify → Domain settings
   - Add `www.mzmarianna.com`
   - Update DNS at Squarespace

5. **Launch!** 🚀
   - Share with students
   - Start marketing
   - Grow your academy!

---

## 📝 **QUICK REFERENCE**

### **Your Credentials**

**Admin Account:**
- URL: `your-site.netlify.app/login`
- Email: `mariannav920@gmail.com`
- Password: `marianna2026`
- Dashboard: `/dashboard/admin`

**Supabase:**
- URL: `https://YOUR_PROJECT.supabase.co`
- Dashboard: `https://supabase.com/dashboard`

**Netlify:**
- URL: `your-site.netlify.app`
- Dashboard: `https://app.netlify.com`

### **Important Files**

- `supabase/schema.sql` - Database structure
- `.env` - Local environment variables
- `netlify.toml` - Netlify configuration

### **Useful Commands**

```bash
# Rebuild
npm run build

# Deploy (if using CLI)
netlify deploy --prod

# Check env vars
netlify env:list
```

---

## 🆘 **NEED HELP?**

**If something doesn't work:**

1. Check browser console for errors (F12)
2. Check Supabase logs (Dashboard → Logs)
3. Check Netlify deploy logs (Deploys → View log)
4. Read error messages carefully
5. Check this guide again step-by-step

**Common issues:**
- Missing environment variables
- Wrong Supabase URL/key
- Database tables not created
- Redirects not configured

---

**Your platform is ready! Time to serve students! 🎓✨**

Follow these steps exactly and you'll be live in 20 minutes!

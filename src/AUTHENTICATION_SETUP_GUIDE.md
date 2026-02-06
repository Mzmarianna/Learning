# 🔐 SUPABASE AUTHENTICATION - COMPLETE FIX GUIDE

## 🚨 Common Authentication Errors & Solutions

---

## ✅ STEP 1: Enable Email Auth in Supabase (2 minutes)

### Go to your Supabase Dashboard:

1. **Click "Authentication"** in left sidebar
2. **Click "Providers"** tab
3. Find **"Email"** provider
4. Make sure it's **ENABLED** (toggle should be green/on)

### Critical Settings to Check:

**Enable Email Confirmations:**
- Scroll down to **"Email"** settings
- You'll see: **"Enable email confirmations"**
- For TESTING: **TURN THIS OFF** ⚠️
- For PRODUCTION: Keep it on (users get confirmation email)

**Why turn off for testing?**
- Without SMTP configured, users can't confirm emails
- Turning it off lets you test login/signup immediately
- You can enable it later when you set up email service

### How to Disable Email Confirmations:
```
Authentication → Providers → Email → 
  ☐ Enable email confirmations (UNCHECK THIS BOX)
```

Click **"Save"** at bottom of page

---

## ✅ STEP 2: Configure Email Templates (Optional but Recommended)

### Still in Authentication → Email Templates:

1. Click **"Email Templates"** tab
2. You'll see templates for:
   - Confirm signup
   - Magic link
   - Password reset

### For Testing (Quick Fix):
- You can skip this step if you disabled email confirmations

### For Production:
- Customize these templates with your branding
- Use your own SMTP server (SendGrid, Mailgun, etc.)

---

## ✅ STEP 3: Fix Row Level Security Policies

### The Problem:
Your schema has RLS enabled, but new users can't create their profile automatically.

### The Solution:
Run this SQL to allow user registration:

1. Go to: **SQL Editor** in Supabase
2. Click **"New query"**
3. Paste this code:

```sql
-- Allow authenticated users to create their own profile
CREATE POLICY "Users can insert own profile during signup"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow authenticated users to create student profile
CREATE POLICY "Students can insert own student profile"
  ON student_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow students to update their own profile
CREATE POLICY "Students can update own student profile"
  ON student_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Allow public to submit placement quiz (no auth required)
ALTER TABLE placement_quiz_leads DISABLE ROW LEVEL SECURITY;

-- If you want to keep RLS on placement_quiz_leads, use this instead:
-- CREATE POLICY "Anyone can submit placement quiz"
--   ON placement_quiz_leads FOR INSERT
--   WITH CHECK (true);
```

4. Click **"Run"** (or Cmd/Ctrl + Enter)
5. Should see: ✅ "Success. No rows returned"

---

## ✅ STEP 4: Test with Demo Credentials

### Your app has built-in demo mode, but let's create a REAL test user:

### Option A: Create User in Supabase Dashboard
1. Go to: **Authentication → Users**
2. Click **"Add user"** button (top right)
3. Choose **"Create new user"**
4. Fill in:
   ```
   Email: test@example.com
   Password: TestPassword123!
   ```
5. Check **"Auto Confirm User"** (important!)
6. Click **"Create user"**

### Option B: Use Your Signup Page
1. In your app, go to `/signup`
2. Fill out the form
3. If you get errors, read the error message carefully

---

## ✅ STEP 5: Verify Config is Correct

### Double-check `/config.ts`:

```typescript
export const config = {
  supabase: {
    url: 'https://abcdefghij.supabase.co',  // ← YOUR actual URL
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',  // ← YOUR actual key
  },
};
```

### Check for these mistakes:
- ❌ Still has placeholder text
- ❌ Extra spaces or line breaks in the key
- ❌ Key is truncated (should be 200+ characters)
- ❌ URL doesn't end with `.supabase.co`
- ❌ Has `http://` instead of `https://`

---

## 🐛 TROUBLESHOOTING SPECIFIC ERRORS

---

### ❌ Error: "Invalid login credentials"

**Causes:**
1. Wrong email/password
2. User doesn't exist
3. Email not confirmed (if you have confirmations enabled)

**Fix:**
1. **Check Supabase → Authentication → Users**
   - Is your user in the list?
   - If yes, is there a green checkmark? (confirmed)
   - If no checkmark, you need to disable email confirmations (see Step 1)

2. **Reset the user's password:**
   - Authentication → Users
   - Click on the user
   - Click "Send Password Reset"
   - Or manually set password in UI

3. **Create a fresh test user:**
   - Use the dashboard to create user manually
   - Check "Auto Confirm User"

---

### ❌ Error: "Failed to fetch" or "Network request failed"

**Cause:** Can't connect to Supabase

**Fix:**
1. Check your internet connection
2. Verify Supabase project is "Active" (not paused)
3. Check URL in `/config.ts` is correct
4. Open browser console (F12) and look for CORS errors
5. Make sure you're using `https://` not `http://`

**Test Connection:**
```javascript
// Paste this in browser console on your app:
console.log(window.location.origin);
// Should match your app's URL
```

---

### ❌ Error: "Email not confirmed"

**Cause:** Email confirmations are enabled but user hasn't clicked link

**Quick Fix (for testing):**
1. Supabase → Authentication → Providers
2. Find "Enable email confirmations"
3. **Turn it OFF**
4. Save changes
5. Try logging in again

**OR manually confirm the user:**
1. Authentication → Users
2. Find your user
3. Click the three dots (⋮)
4. Select "Confirm email"

---

### ❌ Error: "new row violates row level security policy"

**Cause:** RLS is blocking user creation

**Fix:**
Run the SQL from Step 3 above to add the missing policies.

**Quick Test - Temporarily Disable RLS:**
```sql
-- TESTING ONLY - DO NOT USE IN PRODUCTION
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles DISABLE ROW LEVEL SECURITY;
```

If signup works after this, you know it's an RLS issue. Re-enable RLS and add proper policies.

---

### ❌ Error: "User already registered"

**Cause:** Email is already in the database

**Fix:**
1. **Option A:** Use a different email
2. **Option B:** Delete the existing user:
   - Authentication → Users
   - Find the user
   - Click three dots (⋮)
   - Select "Delete user"
3. **Option C:** Just log in with existing credentials

---

### ❌ Error: "Anonymous sign-ins are disabled"

**Cause:** Trying to access without authentication

**Fix:**
- This app requires authentication
- Go to `/login` or `/signup`
- Or use demo mode: `/demo/student`

---

### ❌ Error: "Password should be at least 6 characters"

**Cause:** Supabase has minimum password length

**Fix:**
- Use passwords with at least 6 characters
- For best security, use 8+ characters
- Include uppercase, lowercase, numbers

**Change Supabase's password requirements:**
1. Authentication → Policies
2. Look for password settings
3. Adjust as needed

---

### ❌ Error: "Email rate limit exceeded"

**Cause:** Too many signup/login attempts

**Fix:**
- Wait 1 hour
- Or use a different email
- Or disable rate limiting in Supabase:
  - Authentication → Rate Limits
  - Increase limits for testing

---

## ✅ COMPLETE TESTING CHECKLIST

### Test Signup Flow:

- [ ] Go to `/signup`
- [ ] Fill out form with NEW email
- [ ] Click "Sign Up"
- [ ] Should redirect to dashboard (or confirmation page)
- [ ] Check Supabase → Authentication → Users for new user
- [ ] Check Supabase → Table Editor → `profiles` for profile row
- [ ] Check `student_profiles` table for student data

### Test Login Flow:

- [ ] Sign out if logged in
- [ ] Go to `/login`
- [ ] Enter email and password
- [ ] Click "Sign In"
- [ ] Should redirect to appropriate dashboard
- [ ] No errors in browser console (F12)

### Test Authentication Persistence:

- [ ] Log in successfully
- [ ] Refresh the page
- [ ] Should stay logged in (not redirect to login)
- [ ] Check browser → DevTools → Application → Local Storage
- [ ] Should see `supabase.auth.token`

### Test Logout:

- [ ] While logged in, find logout button
- [ ] Click logout
- [ ] Should redirect to home or login page
- [ ] Refresh page
- [ ] Should stay logged out

---

## 🔐 SECURITY CHECKLIST (Before Launch)

Before going to production:

- [ ] Enable email confirmations
- [ ] Set up proper SMTP (SendGrid, Mailgun, etc.)
- [ ] Enable Row Level Security on all tables
- [ ] Review and test all RLS policies
- [ ] Enable rate limiting (prevent spam signups)
- [ ] Set up password reset flow
- [ ] Configure auth email templates with branding
- [ ] Set redirect URLs for auth flows
- [ ] Enable MFA (multi-factor auth) if needed
- [ ] Set session timeout appropriately
- [ ] Enable audit logs
- [ ] Set up monitoring for failed login attempts

---

## 📊 HOW TO VIEW YOUR USERS

### In Supabase Dashboard:

1. **Authentication → Users**
   - See all registered users
   - View email, created date, last sign in
   - Manually confirm/delete users

2. **Table Editor → profiles**
   - See user profiles with roles
   - View display names, avatars, etc.

3. **Table Editor → student_profiles**
   - See student-specific data
   - XP, tier, level, current quest

---

## 🎯 WORKING AUTH FLOW (What Should Happen)

### Signup:
1. User fills form → Clicks "Sign Up"
2. App calls `signUpStudent()` from `/lib/supabase/auth.ts`
3. Supabase creates user in `auth.users` table
4. App creates profile in `profiles` table
5. App creates student profile in `student_profiles` table
6. User is automatically logged in
7. App redirects to student dashboard

### Login:
1. User enters email/password → Clicks "Sign In"
2. App calls `signIn()` from `/lib/supabase/auth.ts`
3. Supabase verifies credentials
4. Supabase returns session token
5. Token stored in browser localStorage
6. App redirects to appropriate dashboard based on role

### Session Persistence:
1. User refreshes page
2. App checks for existing session in `App.tsx`
3. If valid session exists, user stays logged in
4. If no session, redirect to login

---

## 🆘 STILL GETTING ERRORS?

### Share These Details:

1. **Exact error message:**
   ```
   Copy/paste the full error here
   ```

2. **Where it happens:**
   - [ ] During signup
   - [ ] During login
   - [ ] After refresh
   - [ ] Other: ___________

3. **Browser console errors:**
   - Press F12 → Console tab
   - Screenshot or copy red errors

4. **Supabase settings:**
   - Is email confirmation enabled?
   - Can you see the user in Auth → Users?
   - Is your project "Active" (not paused)?

5. **Your config.ts setup:**
   - Is URL filled in correctly?
   - Is anonKey filled in correctly?
   - (Don't share the actual keys!)

---

## 💡 TEMPORARY WORKAROUND: Use Demo Mode

While debugging auth issues, you can use demo mode:

### Demo Access:
- **Student Demo:** `/demo/student`
- **Parent Demo:** `/demo/parent`
- **Admin Demo:** `/demo/admin`

### Features:
- ✅ Full app functionality
- ✅ Mock data that looks real
- ✅ Test all features without authentication
- ✅ Data persists during session (lost on refresh)

### When to use demo mode:
- Testing features before auth is set up
- Showing the app to stakeholders
- Debugging non-auth issues
- Creating screenshots/videos for marketing

---

## 📞 Get Help

If you're still stuck after trying everything:

1. **Tell me:**
   - Exact error message
   - What step you're on
   - What you've already tried
   - Screenshots (hide sensitive data)

2. **Check Supabase Docs:**
   - [Auth Documentation](https://supabase.com/docs/guides/auth)
   - [RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)
   - [Email Auth Setup](https://supabase.com/docs/guides/auth/auth-email)

3. **Supabase Community:**
   - [Discord](https://discord.supabase.com)
   - [GitHub Discussions](https://github.com/supabase/supabase/discussions)

---

I'm here to help! Just tell me:
- What specific error you're seeing
- At what point (signup, login, etc.)
- Any error messages from the browser console

We'll get your authentication working! 🚀

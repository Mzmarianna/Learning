# 🔍 AUTHENTICATION ERROR FLOWCHART

## Start Here: What Error Are You Getting?

---

### 🔴 "Invalid login credentials"

**Is this on signup or login?**

#### SIGNUP:
→ Error shouldn't say "invalid credentials" on signup
→ You might be trying to sign up with existing email
→ **Fix:** Use different email OR go to login page

#### LOGIN:
→ Wrong password?
  → **Fix:** Try password reset OR create new user

→ User doesn't exist?
  → Go to Supabase → Authentication → Users
  → Is your user in the list?
    → **YES, user exists:**
      → Check if user has green checkmark (confirmed)
        → **NO checkmark:**
          → Supabase → Auth → Providers
          → Disable "Enable email confirmations"
          → OR manually confirm user in Users list
        → **YES checkmark:**
          → Reset password in Supabase dashboard
          → Or verify you're using correct password
    → **NO, user doesn't exist:**
      → Sign up first at `/signup`
      → Or create user manually in dashboard

---

### 🔴 "Failed to fetch" / "Network error"

**Check your Supabase project status:**
→ Open Supabase dashboard
→ Is project "Active" or "Paused"?

#### PAUSED:
→ Click "Resume project"
→ Wait 1 minute
→ Try again

#### ACTIVE:
→ Check `/config.ts`
→ Is URL correct?
  → Should be: `https://xxx.supabase.co`
  → NO trailing slash
  → Must have `https://`

→ Is anon key correct?
  → Should start with `eyJ`
  → Should be 200+ characters
  → No line breaks

→ Still failing?
  → Check browser console (F12)
  → Look for CORS errors
  → Check internet connection
  → Try different browser

---

### 🔴 "Email not confirmed"

**Quick Fix:**
→ Supabase → Authentication → Providers
→ Find "Enable email confirmations"
→ **TURN IT OFF**
→ Save
→ Try logging in again

**OR manually confirm:**
→ Supabase → Authentication → Users
→ Find your user
→ Click three dots (⋮)
→ Select "Confirm email"

**For production:**
→ Set up SMTP server
→ Configure email templates
→ Re-enable confirmations

---

### 🔴 "Row level security policy violation"

**This means RLS is blocking the action**

→ Did you run `/supabase/auth-fix.sql`?
  → **NO:**
    → SQL Editor → New query
    → Paste all content from auth-fix.sql
    → Run it
    → Try again
  
  → **YES, already ran it:**
    → Check if it ran successfully (no errors)
    → Try running it again
    → Still failing? Temporarily disable RLS:

```sql
-- TESTING ONLY - Run in SQL Editor
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles DISABLE ROW LEVEL SECURITY;
```

→ Works now?
  → RLS was the issue
  → Re-enable RLS
  → Add proper policies (see auth-fix.sql)

→ Still doesn't work?
  → Share the full error message
  → Check browser console for details

---

### 🔴 "User already registered"

**This email is already in the database**

**Option 1 - Use existing account:**
→ Go to `/login`
→ Log in with existing credentials
→ Forgot password? Use password reset

**Option 2 - Delete and recreate:**
→ Supabase → Authentication → Users
→ Find the user with that email
→ Click three dots (⋮)
→ Select "Delete user"
→ Now sign up again

**Option 3 - Use different email:**
→ Sign up with new email address

---

### 🔴 "No user returned from signup"

**Signup succeeded but profile creation failed**

→ Run `/supabase/auth-fix.sql` (see Step 2 in Quick Start)
→ This adds policies that allow profile creation

→ Check if user exists:
  → Supabase → Authentication → Users
  → User is there?
    → **YES:** Profile creation failed
      → Run auth-fix.sql
      → Check RLS policies
    → **NO:** Signup itself failed
      → Check Supabase logs
      → Check for validation errors

---

### 🔴 "Password should be at least 6 characters"

**Supabase requires minimum 6 character passwords**

→ Use longer password (8+ recommended)
→ Include uppercase, lowercase, numbers
→ Example: `Test123!`

**To change requirement:**
→ Supabase → Authentication → Policies
→ Adjust password rules

---

### 🔴 "Email rate limit exceeded"

**Too many attempts in short time**

**Quick fix:**
→ Wait 1 hour
→ Use different email for testing

**Permanent fix:**
→ Supabase → Authentication → Rate Limits
→ Increase limits (only for development!)
→ For production, keep limits for security

---

### 🔴 Other Error / Not Listed Above

**Debug steps:**

1. **Check browser console (F12):**
   → Any red errors?
   → Copy error message

2. **Check Supabase logs:**
   → Supabase → Logs
   → Look for recent errors

3. **Verify all setup steps:**
   → Email confirmations disabled? ☐
   → auth-fix.sql ran? ☐
   → config.ts filled in? ☐
   → Test user created? ☐

4. **Try demo mode:**
   → Go to `/demo/student`
   → Does the app work in demo?
   → **YES:** Auth issue
   → **NO:** Bigger problem

5. **Get help:**
   → Share exact error message
   → Say which step you're on
   → Screenshot if possible

---

## ✅ QUICK HEALTH CHECK

Run through this checklist:

### Supabase Project:
- [ ] Project is "Active" (not paused)
- [ ] Can access dashboard
- [ ] Tables exist (check Table Editor)
- [ ] Auth provider enabled

### Configuration:
- [ ] `/config.ts` has real URL (not placeholder)
- [ ] `/config.ts` has real anon key (200+ chars)
- [ ] No typos in config
- [ ] File is saved

### SQL Setup:
- [ ] Ran `/supabase/schema.sql` (creates tables)
- [ ] Ran `/supabase/auth-fix.sql` (adds policies)
- [ ] Both ran without errors
- [ ] Can see tables in Table Editor

### Auth Settings:
- [ ] Email provider enabled
- [ ] Email confirmations disabled (for testing)
- [ ] Test user created
- [ ] User has green checkmark (confirmed)

### App Testing:
- [ ] Can access `/login` page
- [ ] Can access `/signup` page
- [ ] No console errors on these pages (F12)
- [ ] Form submits without freezing

### All checked?
→ Try signing up/logging in again
→ Should work now!

---

## 🆘 STUCK? TRY THESE:

### Nuclear Option #1: Fresh Start
1. Supabase → Settings → General
2. "Pause project" → "Delete project"
3. Create new project
4. Run schema.sql
5. Run auth-fix.sql
6. Update config.ts with new URL/key
7. Try again

### Nuclear Option #2: Use Demo Mode
→ `/demo/student` works immediately
→ No auth needed
→ Test all features
→ Fix auth later when ready

### Nuclear Option #3: Ask for Help
Share these details:
1. Exact error message
2. Where it happens (signup/login/other)
3. What you've already tried
4. Browser console errors (F12)
5. Screenshot (hide sensitive data)

---

## 💡 PREVENTION: Avoid These Common Mistakes

❌ **Don't:** Copy only part of the anon key
✅ **Do:** Use the copy button in Supabase

❌ **Don't:** Have email confirmations on without SMTP
✅ **Do:** Disable them for testing

❌ **Don't:** Forget to run auth-fix.sql
✅ **Do:** Run it right after schema.sql

❌ **Don't:** Use same password for testing in production
✅ **Do:** Use strong, unique passwords

❌ **Don't:** Disable RLS in production
✅ **Do:** Only disable for testing, then add policies

❌ **Don't:** Skip the Quick Start guide
✅ **Do:** Follow AUTH_QUICK_START.md step by step

---

## 🎯 GOAL: SEE THIS!

**When everything works:**

1. Go to `/login`
2. Enter credentials
3. Click "Sign In"
4. → Redirects to dashboard
5. → No errors in console
6. → Can see user data
7. → Refresh works (stays logged in)

**That's success! 🎉**

If you're not seeing this, go back through the flowchart.

---

## 📚 MORE HELP

- **Quick Start:** `/AUTH_QUICK_START.md`
- **Full Guide:** `/AUTHENTICATION_SETUP_GUIDE.md`
- **Supabase Setup:** `/SUPABASE_SETUP_GUIDE.md`
- **Quick Fixes:** `/SUPABASE_QUICK_FIX.md`

One of these will solve your issue! 🚀

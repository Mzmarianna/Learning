# 🔧 Create Test User - Quick Fix Guide

## Problem: "Invalid credentials" error when trying to log in

Your Supabase is configured correctly, but you need to create your first user!

---

## ✅ **SOLUTION 1: Use the Sign-Up Page** (Recommended)

### Step 1: Go to Sign-Up Page
Navigate to: `http://localhost:5173/signup`
(Or wherever your app is running - check the terminal)

### Step 2: Fill Out the Form
- **User Type:** Select **Student**
- **Display Name:** `Test Student`
- **Email:** `test@mariannasacademy.com`
- **Password:** `Test1234`
- **Confirm Password:** `Test1234`
- **Age:** `10`
- **Skill Tier:** `Explorers`

### Step 3: Click "Create Account"

### Step 4: Check Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/wyclbrafklhvdyjpoeno
2. Click **"Authentication"** → **"Users"**
3. You should see your new user!

### Step 5: Confirm the User (IMPORTANT!)
If you see **"Waiting for verification"** next to the user:
1. Click on the user email
2. Find the **"Confirm User"** button
3. Click it to manually confirm

### Step 6: Log In!
- Go to `/login`
- Email: `test@mariannasacademy.com`
- Password: `Test1234`
- Click "Sign In"

✅ **You should now be logged in!**

---

## 🛠️ **SOLUTION 2: Disable Email Confirmations** (If sign-up keeps failing)

If the sign-up page gives errors, email confirmations might be blocking you.

### Disable Email Confirmations in Supabase:

1. Go to: https://supabase.com/dashboard/project/wyclbrafklhvdyjpoeno
2. Click **"Authentication"** in left sidebar
3. Click **"Providers"** tab
4. Scroll to **"Email"** section
5. Find **"Confirm email"** toggle
6. **Turn it OFF** (disable)
7. Click **"Save"**

Now try creating an account again via the sign-up page!

---

## 🚨 **SOLUTION 3: Create User Manually** (Last resort)

If sign-up still doesn't work, create the user manually:

### Step 1: Create Auth User
1. Go to: https://supabase.com/dashboard/project/wyclbrafklhvdyjpoeno
2. Click **"Authentication"** → **"Users"**
3. Click **"Add user"** button
4. Fill in:
   - **Email:** `test@mariannasacademy.com`
   - **Password:** `Test1234`
   - **Auto Confirm User:** ✅ **CHECK THIS BOX**
5. Click **"Create user"**
6. **Copy the UUID** from the user (you'll need it)

### Step 2: Create Profile
1. Go to **"Table Editor"** → **"profiles"** table
2. Click **"Insert"** → **"Insert row"**
3. Fill in:
   - **id:** (paste the UUID you copied)
   - **email:** `test@mariannasacademy.com`
   - **role:** `student`
   - **display_name:** `Test Student`
4. Click **"Save"**

### Step 3: Create Student Profile
1. Go to **"Table Editor"** → **"student_profiles"** table
2. Click **"Insert"** → **"Insert row"**
3. Fill in:
   - **id:** (paste the same UUID)
   - **age:** `10`
   - **tier:** `explorers`
   - **xp_total:** `0`
   - **current_level:** `1`
4. Click **"Save"**

### Step 4: Log In!
- Go to `/login`
- Email: `test@mariannasacademy.com`
- Password: `Test1234`

---

## 🎮 **ALTERNATIVE: Use Demo Mode**

If you just want to test the app without setting up auth:

1. Navigate to: `http://localhost:5173/demo/student`
2. You'll see a fully functional student dashboard with mock data
3. No login required!

---

## 📊 **Verify It Worked**

After logging in successfully, you should see:
- ✅ Redirected to Student Dashboard
- ✅ Your display name in the top right
- ✅ "Test Student" profile
- ✅ XP and level stats
- ✅ Weekly lesson schedule

---

## ❓ **Still Having Issues?**

### Check Browser Console (F12):
Look for error messages that say:
- ✅ **Good:** "Supabase client initialized successfully"
- ❌ **Bad:** "Invalid credentials"
- ❌ **Bad:** "User not found"

### Verify Supabase Connection:
Open browser console and check for:
```
✅ Supabase client initialized successfully
🔗 Connected to: https://wyclbrafklhvdyjpoeno.supabase.co
```

If you see this, your connection is working! You just need to create a user.

---

## 🎉 **Next Steps After Login**

Once you're logged in, you can:
- ✅ Explore the student dashboard
- ✅ View quests and challenges
- ✅ Take the placement quiz
- ✅ Customize your avatar
- ✅ Track XP and badges

---

**Need more help?** Check your browser console (F12) for specific error messages!

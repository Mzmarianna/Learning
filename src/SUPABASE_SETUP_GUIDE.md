# 🚀 SUPABASE SETUP - SIMPLE 5-MINUTE GUIDE

## ✅ STEP 1: Create Supabase Account (2 minutes)

1. Go to: **https://supabase.com**
2. Click **"Start your project"** (green button)
3. Sign up with GitHub, Google, or Email
4. Confirm your email if needed

---

## ✅ STEP 2: Create New Project (1 minute)

1. Once logged in, click **"New project"**
2. Fill in:
   - **Name**: `mz-mariannas-academy` (or any name you want)
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to you (e.g., `US East` or `US West`)
   - **Pricing Plan**: Select **FREE** tier
3. Click **"Create new project"**
4. **WAIT 2 minutes** while Supabase sets up your database
   - You'll see a loading screen - this is normal!
   - Get a coffee ☕ while it provisions

---

## ✅ STEP 3: Get Your API Keys (1 minute)

### Once your project is ready:

1. In the left sidebar, click **"Settings"** (gear icon at bottom)
2. Click **"API"** in the settings menu
3. You'll see a page with these sections:

### 📋 Copy These 2 Things:

**A) Project URL**
```
Example: https://abcdefghijklmnop.supabase.co
```
- Look for the section labeled **"Project URL"**
- Click the 📋 copy icon
- Paste it somewhere safe (like Notepad)

**B) Anon Public Key**
```
Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi...
```
- Look for **"Project API keys"** section
- Find the key labeled **"anon" "public"** 
- Click the 📋 copy icon (it's a LONG key - that's normal!)
- Paste it somewhere safe

---

## ✅ STEP 4: Add Keys to Your App (30 seconds)

1. In this project, open the file: **`/config.ts`**
2. Find these lines:
```typescript
supabase: {
  url: 'REPLACE_WITH_YOUR_SUPABASE_URL',
  anonKey: 'REPLACE_WITH_YOUR_SUPABASE_ANON_KEY',
},
```

3. Replace with YOUR keys:
```typescript
supabase: {
  url: 'https://abcdefghijklmnop.supabase.co',  // ← Paste your URL here
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',  // ← Paste your key here
},
```

4. Save the file

---

## ✅ STEP 5: Create Database Tables (1 minute)

### Go back to Supabase:

1. In the left sidebar, click **"SQL Editor"** (icon looks like `</>`)
2. Click **"New query"** button (top right)
3. Open this file in your project: **`/supabase/schema.sql`**
4. **Copy ALL the SQL code** from that file
5. **Paste it** into the Supabase SQL Editor
6. Click **"Run"** button (bottom right, or press Cmd/Ctrl + Enter)
7. You should see: ✅ **"Success. No rows returned"** - This is GOOD!

---

## 🎉 DONE! Test Your Connection

### Your app should now:
- ✅ Store placement quiz leads in the database
- ✅ Save student progress and XP
- ✅ Remember completed lessons
- ✅ Track badge achievements

### How to Verify It Works:

1. Go to `/placement-quiz` page
2. Fill out the quiz
3. Go back to Supabase → Click **"Table Editor"** in sidebar
4. Click on **"placement_quiz_leads"** table
5. You should see your quiz submission! 🎉

---

## 🆘 TROUBLESHOOTING

### Problem: "Can't connect to Supabase"
- ✅ Check that you copied the FULL anon key (it's very long!)
- ✅ Make sure there are no extra spaces in `/config.ts`
- ✅ Verify your project URL ends with `.supabase.co`

### Problem: "Error running SQL"
- ✅ Make sure you copied ALL the code from `/supabase/schema.sql`
- ✅ Try running it in sections (copy 50 lines at a time)
- ✅ Check if you have any previous tables - might need to delete first

### Problem: "Project is paused"
- ✅ Supabase pauses free projects after 7 days of inactivity
- ✅ Just click "Resume project" - takes 1 minute
- ✅ Set up a free cron job to ping it weekly if needed

---

## 📊 View Your Data

Once set up, you can view all your app data in Supabase:

- **Table Editor**: See all data in spreadsheet format
- **Auth**: Manage student/parent accounts
- **Database**: View structure and relationships
- **API Docs**: Auto-generated API for your tables

---

## 🔐 Security Notes

### For Development (Figma Make):
- ✅ Keys in `/config.ts` are OK for testing

### For Production (Vercel):
- ❌ DON'T commit keys to GitHub
- ✅ Use Vercel Environment Variables instead:
  1. Vercel Dashboard → Your Project → Settings → Environment Variables
  2. Add: `VITE_SUPABASE_URL` = your URL
  3. Add: `VITE_SUPABASE_ANON_KEY` = your key
  4. Redeploy

---

## 💡 Next Steps After Setup

1. **Enable Row Level Security (RLS)**
   - Supabase → Authentication → Policies
   - The schema.sql includes basic policies

2. **Set up Email Auth** (optional)
   - Supabase → Authentication → Providers
   - Enable Email provider (already on by default)

3. **Connect Shopify** (when ready)
   - Use Supabase Edge Functions or webhooks
   - Store subscription status in `profiles` table

---

## 🎓 Learn More

- [Supabase Docs](https://supabase.com/docs)
- [Video Tutorial](https://www.youtube.com/watch?v=dU7GwCOgvNY) (Supabase in 100 Seconds)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

## ❓ Still Stuck?

Tell me specifically where you're stuck:
- "I can't find the API keys"
- "The SQL won't run"
- "I don't understand step X"

I'll walk you through it! 🤝

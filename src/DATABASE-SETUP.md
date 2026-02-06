# 🗄️ Database Setup - SUPER SIMPLE

**3 steps. No scripts. No CLI.**

---

## Step 1: Copy SQL Files (one at a time)

Go to Supabase SQL Editor:  
👉 **https://supabase.com/dashboard/project/wyclbrafklhvdyjpoeno/sql/new**

Then copy/paste these files **in order:**

### 1️⃣ Core Schema (copy `/supabase/schema.sql`)
- Open `/supabase/schema.sql` in your project
- Copy everything (Ctrl+A, Ctrl+C)
- Paste into Supabase SQL Editor
- Click **RUN**

### 2️⃣ Business Functions (copy `/supabase/functions.sql`)  
- Open `/supabase/functions.sql`
- Copy everything
- Paste into Supabase SQL Editor
- Click **RUN**

### 3️⃣ Placement Quiz (copy `/supabase/migrations/007_placement_quiz.sql`)
- Open `/supabase/migrations/007_placement_quiz.sql`
- Copy everything
- Paste into Supabase SQL Editor
- Click **RUN**

### 4️⃣ Email System (copy `/supabase/schema/email-system.sql`)
- Open `/supabase/schema/email-system.sql`
- Copy everything
- Paste into Supabase SQL Editor
- Click **RUN**

✅ **Done!** Your database is live.

---

## Step 2: Test It

Copy/paste `/SMOKE-TEST.sql` into Supabase SQL Editor and click **RUN**.

If you see ✅ results, you're good to go!

---

## Step 3: Get Your API Keys

1. Go to: https://supabase.com/dashboard/project/wyclbrafklhvdyjpoeno/settings/api
2. Copy:
   - **Project URL** → Put in `.env.local` as `VITE_SUPABASE_URL`
   - **anon/public key** → Put in `.env.local` as `VITE_SUPABASE_ANON_KEY`

---

## ❓ Troubleshooting

**"Already exists" errors?**  
→ Ignore them! Means you already ran that file before.

**Need to reset everything?**  
→ Supabase Dashboard → Database → Replication → Reset Database

---

That's it! 🚀

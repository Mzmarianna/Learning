# 🐛 FIX: "Invalid schema: public" Error on Placement Quiz

**Error:** "Error starting quiz: Invalid schema: public"  
**Location:** https://gas-rally-80073543.figma.site/placement-quiz  
**Cause:** Database tables missing or RLS policies blocking access

---

## 🎯 **THE REAL ISSUE**

You have TWO different deployments:

### **1. Figma Make Prototype** (What's showing the error)
- URL: `https://gas-rally-80073543.figma.site/placement-quiz`
- Status: This is a Figma-hosted preview
- Problem: Not connected to your Supabase database

### **2. Production Codebase** (What we're deploying)
- URL: Will be `https://www.mzmarianna.com`
- Status: 165+ files, fully coded, ready to deploy
- Database: Configured with your Supabase

---

## ✅ **SOLUTION: Deploy Your Real App**

The Figma prototype is just a preview. You need to deploy your actual codebase to fix this!

### **Quick Fix Steps:**

**1. Make sure your Supabase tables exist**
```bash
# Go to Supabase SQL Editor:
# https://supabase.com/dashboard/project/wyclbrafklhvdyjpoeno/sql/new

# Run this migration:
# Copy the content from: /supabase/migrations/007_placement_quiz.sql
# Paste it in SQL Editor
# Click "Run"
```

**2. Deploy your production app**
```bash
# Deploy to Netlify (your real app)
./deploy-netlify.sh

# Or manually:
npm run build
netlify deploy --prod
```

**3. Once deployed, your quiz will work at:**
```
https://www.mzmarianna.com/placement-quiz
```

---

## 🔧 **IF YOU WANT TO FIX THE FIGMA PROTOTYPE**

If you want the Figma prototype to work (not recommended - just deploy the real app instead):

### **Option 1: Use Figma's Supabase Integration** (What you mentioned)

**In Figma Make:**
1. Open your project in Figma Make
2. Click **"Make settings"** (top-right)
3. Go to **"Integrations"** → **"Supabase"**
4. Click **"Connect Supabase"**
5. Authorize and select project: `wyclbrafklhvdyjpoeno`
6. Tell Figma AI:
   ```
   "Connect this app to my Supabase project wyclbrafklhvdyjpoeno 
   and use the placement_quiz_attempts table"
   ```

**Note:** This only works for the Figma prototype, not your production app.

### **Option 2: Just Deploy Your Production App** ✅ (Recommended)

Your production codebase is complete and ready. Deploy that instead:

```bash
# Follow YOUR-ACTION-PLAN.md
./deploy-netlify.sh
```

---

## 📋 **DATABASE SETUP (For Production App)**

### **Step 1: Verify Tables Exist**

**Check in Supabase:**
1. Go to: https://supabase.com/dashboard/project/wyclbrafklhvdyjpoeno/editor
2. Look for these tables:
   - ✅ `placement_quiz_questions`
   - ✅ `placement_quiz_attempts`

### **Step 2: If Tables Don't Exist, Run Migration**

**Copy this SQL and run it:**

```sql
-- ============================================================================
-- PLACEMENT QUIZ SYSTEM
-- ============================================================================

-- Placement Quiz Questions Table
CREATE TABLE IF NOT EXISTS placement_quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('reading', 'math', 'critical_thinking', 'writing')),
  difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('early_explorers', 'explorers', 'warriors')),
  
  -- Answer options (array of strings)
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  
  -- Age range this question is appropriate for
  min_age INTEGER NOT NULL DEFAULT 4,
  max_age INTEGER NOT NULL DEFAULT 18,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  
  -- Order within difficulty level
  sort_order INTEGER DEFAULT 0
);

-- Student Placement Quiz Attempts Table
CREATE TABLE IF NOT EXISTS placement_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Student info (before account creation)
  student_name TEXT NOT NULL,
  student_age INTEGER NOT NULL,
  student_interests TEXT[] DEFAULT '{}',
  parent_email TEXT,
  
  -- Quiz progress
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- Results
  recommended_tier TEXT CHECK (recommended_tier IN ('early_explorers', 'explorers', 'warriors')),
  total_questions_answered INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  accuracy_percentage NUMERIC(5,2) DEFAULT 0,
  
  -- Scores by category
  reading_score NUMERIC(5,2) DEFAULT 0,
  math_score NUMERIC(5,2) DEFAULT 0,
  critical_thinking_score NUMERIC(5,2) DEFAULT 0,
  
  -- Store answers as JSONB array
  answers JSONB DEFAULT '[]'::jsonb
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_quiz_questions_difficulty ON placement_quiz_questions(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_type ON placement_quiz_questions(question_type);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_email ON placement_quiz_attempts(parent_email);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_completed ON placement_quiz_attempts(completed_at);

-- Enable RLS
ALTER TABLE placement_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE placement_quiz_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can read active questions (for public quiz)
CREATE POLICY "Anyone can read active quiz questions"
  ON placement_quiz_questions FOR SELECT
  USING (is_active = true);

-- Only admins can modify questions
CREATE POLICY "Only admins can modify quiz questions"
  ON placement_quiz_questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Anyone can create quiz attempts (before login)
CREATE POLICY "Anyone can create quiz attempts"
  ON placement_quiz_attempts FOR INSERT
  WITH CHECK (true);

-- Users can update their own attempts (while taking quiz)
CREATE POLICY "Users can update quiz attempts"
  ON placement_quiz_attempts FOR UPDATE
  USING (true);

-- Users can read their own attempts
CREATE POLICY "Users can read quiz attempts"
  ON placement_quiz_attempts FOR SELECT
  USING (true);
```

**How to run:**
1. Copy the SQL above
2. Go to: https://supabase.com/dashboard/project/wyclbrafklhvdyjpoeno/sql/new
3. Paste and click **"Run"**

### **Step 3: Add Sample Questions**

After creating tables, add some test questions:

```sql
-- Insert sample quiz questions
INSERT INTO placement_quiz_questions (question_text, question_type, difficulty_level, options, correct_answer, explanation, min_age, max_age, sort_order, is_active) VALUES
('What number comes after 5?', 'math', 'early_explorers', '["4", "6", "7", "10"]', 1, 'The number after 5 is 6! Great counting!', 4, 7, 1, true),
('Which word rhymes with "cat"?', 'reading', 'early_explorers', '["dog", "bat", "car", "sun"]', 1, 'Bat rhymes with cat because they both end in -at!', 4, 7, 2, true),
('What is 10 + 5?', 'math', 'explorers', '["12", "15", "20", "25"]', 1, 'When you add 10 and 5, you get 15!', 7, 10, 3, true),
('Which word is spelled correctly?', 'reading', 'explorers', '["freind", "friend", "frend", "freand"]', 1, 'Friend is spelled with -ie-. A helpful trick: "I" before "E" except after "C".', 7, 10, 4, true),
('What is 12 × 8?', 'math', 'warriors', '["84", "92", "96", "104"]', 2, '12 × 8 = 96. You can think of it as (10 × 8) + (2 × 8) = 80 + 16 = 96', 10, 18, 5, true),
('Which sentence uses a semicolon correctly?', 'reading', 'warriors', '["I like pizza; but not pasta", "She ran fast; she won the race", "The dog; barked loudly", "We went; to the store"]', 1, 'A semicolon connects two complete sentences that are closely related!', 10, 18, 6, true);
```

---

## 🧪 **TEST YOUR DATABASE**

### **In Supabase Table Editor:**

1. **Go to:** https://supabase.com/dashboard/project/wyclbrafklhvdyjpoeno/editor

2. **Check tables exist:**
   - Click **"placement_quiz_questions"** - should show 6 sample questions
   - Click **"placement_quiz_attempts"** - should be empty (no attempts yet)

3. **Test RLS policies:**
   - Click **"placement_quiz_questions"**
   - Toggle **"Hide protected rows"** OFF
   - You should see all active questions

---

## 🚀 **DEPLOY TO FIX THE ERROR**

### **The Real Fix: Deploy Your Production App**

```bash
# 1. Verify Supabase tables exist (above)
# 2. Deploy your app
./deploy-netlify.sh

# 3. Once deployed, test at:
# https://www.mzmarianna.com/placement-quiz
```

**This is the correct solution!** Your Figma prototype is just a preview. Deploy your real React app to Netlify with Squarespace domain.

---

## 📊 **WHY THIS ERROR HAPPENS**

### **"Invalid schema: public" means:**

1. **Table doesn't exist** ✅ (Most common)
   - Fix: Run the SQL migration above

2. **RLS policy blocking access**
   - Fix: Update RLS policies to allow public INSERT/SELECT

3. **Wrong table name in code**
   - Our code uses: `placement_quiz_attempts` ✅ (Correct)
   - Not: `public.placement_quiz_attempts` ❌ (Wrong)

4. **Supabase client not configured**
   - Your config.ts already has credentials ✅

---

## ✅ **ACTION PLAN**

### **Step 1: Set Up Database (5 min)**
- [ ] Go to Supabase SQL Editor
- [ ] Run the CREATE TABLE SQL (above)
- [ ] Run the INSERT sample questions SQL (above)
- [ ] Verify tables exist in Table Editor

### **Step 2: Deploy Production App (20 min)**
- [ ] Run `./deploy-netlify.sh`
- [ ] Deploy to Netlify
- [ ] Get Netlify URL (e.g., mz-marianna.netlify.app)
- [ ] Test quiz on Netlify URL first

### **Step 3: Connect Domain (1 hour)**
- [ ] Configure Squarespace DNS (see SQUARESPACE-DNS-SETUP.md)
- [ ] Connect domain in Netlify
- [ ] Wait for DNS propagation
- [ ] Test at www.mzmarianna.com/placement-quiz

### **Step 4: Verify Quiz Works** ✅
- [ ] Visit `/placement-quiz`
- [ ] Fill in student info
- [ ] Click "Start Quiz"
- [ ] Should load questions (no more "Invalid schema" error!)
- [ ] Answer questions
- [ ] View results

---

## 🎯 **IMPORTANT CLARIFICATION**

### **You Have TWO Different Things:**

**Figma Make Prototype:**
- URL: gas-rally-80073543.figma.site
- Purpose: Preview/prototype in Figma
- Database: Not connected (that's why the error)
- Use: For design testing only

**Production React App:**
- URL: Will be www.mzmarianna.com
- Purpose: Your actual platform
- Database: Connected to Supabase ✅
- Use: This is what your users will use!

**Fix:** Deploy your production app, not the Figma prototype!

---

## 🆘 **STILL GETTING THE ERROR?**

### **After deploying, if you still see the error:**

**1. Check browser console (F12):**
```javascript
// Look for detailed error message
// Should show something like:
// "relation 'placement_quiz_attempts' does not exist"
// OR
// "new row violates row-level security policy"
```

**2. Verify Supabase connection:**
```javascript
// In browser console
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
// Should show: https://wyclbrafklhvdyjpoeno.supabase.co
```

**3. Check RLS policies:**
- Go to Supabase → Authentication → Policies
- Make sure policies allow public INSERT on placement_quiz_attempts

**4. Test directly in Supabase:**
```sql
-- In SQL Editor, try:
INSERT INTO placement_quiz_attempts (student_name, student_age, student_interests)
VALUES ('Test Student', 10, ARRAY['Math', 'Science']);

-- Should succeed without errors
```

---

## 📞 **NEED HELP?**

**If you're stuck:**

1. **Check database:** https://supabase.com/dashboard/project/wyclbrafklhvdyjpoeno/editor
2. **View logs:** https://supabase.com/dashboard/project/wyclbrafklhvdyjpoeno/logs
3. **Test locally:** `npm run dev` → http://localhost:5173/placement-quiz
4. **Check console:** F12 → Console tab for detailed errors

---

## 🎉 **SUCCESS LOOKS LIKE:**

Once fixed, your quiz will:
- ✅ Load intro page
- ✅ Collect student info
- ✅ Start quiz (no error!)
- ✅ Show adaptive questions
- ✅ Save answers to database
- ✅ Display results
- ✅ Save attempt to Supabase

---

**TL;DR:**
1. ✅ Run SQL migration in Supabase to create tables
2. ✅ Deploy your production app to Netlify
3. ✅ Connect your Squarespace domain
4. ✅ Test at www.mzmarianna.com/placement-quiz

**Your Figma prototype is just a preview - deploy your real app!** 🚀

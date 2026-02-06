# 🎯 Supabase Setup Complete - Next Steps

## ✅ **What's Ready:**

1. **Supabase Connected:**
   - URL: `https://wyclbrafklhvdyjpoeno.supabase.co`
   - Anon Key: Already configured in `/config.ts`
   - Database password: `fVjgI7aIiKErQnsD`

2. **Email Lead Capture System:**
   - ✅ Database migration ready (`/supabase/migrations/008_email_leads.sql`)
   - ✅ Lead capture functions (`/lib/supabase/leads.ts`)
   - ✅ Homepage email popup saves to database
   - ✅ Free guide page saves to database
   - ✅ All leads tracked with source, age, and struggle

3. **HD Images Added:**
   - ✅ Crown logo in navigation
   - ✅ Game screenshot showing "32 Correct!"
   - ✅ WOWL AI system diagram

---

## 🚀 **RUN THIS NOW - Database Setup:**

### **Step 1: Run the Migration**

You need to run the SQL migration to create the `email_leads` table in your Supabase database.

**Option A: Supabase Dashboard (Easiest)**

1. Go to: https://supabase.com/dashboard/project/wyclbrafklhvdyjpoeno
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy/paste this SQL:

```sql
-- ============================================================================
-- EMAIL LEADS TABLE
-- Capture marketing funnel leads before they sign up
-- ============================================================================

-- Create email_leads table
CREATE TABLE IF NOT EXISTS email_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  child_age INTEGER,
  biggest_struggle TEXT,
  source TEXT NOT NULL CHECK (source IN ('homepage', 'free-guide-page', 'popup', 'other')),
  utm_source TEXT,
  utm_campaign TEXT,
  utm_medium TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Prevent duplicate emails
  CONSTRAINT unique_email UNIQUE (email)
);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_email_leads_email ON email_leads(email);

-- Create index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_email_leads_created_at ON email_leads(created_at DESC);

-- Enable Row Level Security
ALTER TABLE email_leads ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous inserts (for lead capture forms)
CREATE POLICY "Allow anonymous lead capture"
  ON email_leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Only admins can view leads
CREATE POLICY "Admins can view all leads"
  ON email_leads
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Comments for documentation
COMMENT ON TABLE email_leads IS 'Marketing funnel email captures before account creation';
COMMENT ON COLUMN email_leads.email IS 'Lead email address (unique)';
COMMENT ON COLUMN email_leads.child_age IS 'Optional: Age of their child';
COMMENT ON COLUMN email_leads.biggest_struggle IS 'Optional: Their biggest parenting/education challenge';
COMMENT ON COLUMN email_leads.source IS 'Where the lead came from (homepage, free-guide-page, etc.)';
```

5. Click "Run" (bottom right)
6. You should see: "Success. No rows returned"

**Option B: Using psql command line**

```bash
# Connect to your database
psql "postgresql://postgres:fVjgI7aIiKErQnsD@db.wyclbrafklhvdyjpoeno.supabase.co:5432/postgres"

# Then paste the SQL from above
```

---

## ✅ **Step 2: Test Lead Capture**

After running the migration:

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Visit the homepage:**
   ```
   http://localhost:5173/
   ```

3. **Click "Get FREE Guide" button**

4. **Fill out the form:**
   - Email: `test@example.com`
   - Child age: `9`
   - Biggest struggle: "My child refuses to do any work"

5. **Submit the form**

6. **Check Supabase:**
   - Go to: https://supabase.com/dashboard/project/wyclbrafklhvdyjpoeno/editor
   - Click "email_leads" table
   - You should see your test lead! 🎉

---

## 📊 **View Your Leads (Admin Dashboard)**

After migration, you can view all leads:

**In Supabase Dashboard:**
- Go to "Table Editor"
- Select "email_leads"
- See all captured emails with:
  - Email address
  - Child age
  - Biggest struggle
  - Source (homepage vs. free-guide-page)
  - Timestamp

**Export to CSV:**
- In Table Editor, click "Download CSV" to export your leads

---

## 🎨 **What You'll See Now:**

### **Homepage (/):**
- ✅ "Your Child IS a Genius" messaging
- ✅ Crown logo navigation
- ✅ HD game screenshot ("32 Correct!")
- ✅ WOWL AI diagram
- ✅ Email capture popup (saves to database)

### **Free Guide Page (/free-guide):**
- ✅ Lead magnet landing page
- ✅ "Unlock Your Child's Genius in 5 Simple Steps"
- ✅ Email form (saves to database)
- ✅ Bonus content listed

### **Thank You Page (/thank-you):**
- ✅ Email confirmation
- ✅ 7-day email sequence preview
- ✅ Quiz CTA

---

## 📧 **Next Steps: Email Automation**

Your leads are now being captured! To actually *send* the guide:

### **Option 1: Resend (Recommended)**
```bash
# Install Resend
npm install resend

# Add to /config.ts
resend: {
  apiKey: 'YOUR_RESEND_API_KEY'
}
```

### **Option 2: View in Supabase for now**
For now, you can:
1. View leads in Supabase dashboard
2. Manually send emails
3. Export to CSV and upload to your email service

---

## 🎯 **Test Your Full Funnel:**

```bash
# Start dev server
npm run dev

# Test this flow:
1. Visit: http://localhost:5173/
2. Click: "Get FREE Guide"
3. Fill out form → Submit
4. Should see: "Check your email!"
5. Redirect to: /thank-you
6. Check Supabase: See your lead saved!
```

---

## 🔥 **Your Marketing Funnel is READY!**

✅ Stunning HD visuals
✅ "Genius child" messaging
✅ Email capture saving to database
✅ Step-by-step getting started guide
✅ Thank you page with quiz CTA

**You're now capturing emails BEFORE they sign up!**

Every visitor who downloads the guide is in your database, even if they don't sign up immediately. You can follow up with them later!

---

## 📝 **Marketing Assets Created:**

1. `/components/marketing/GeniusParentLanding.tsx` - Main landing page
2. `/pages/FreeGuidePage.tsx` - E-book landing page
3. `/pages/ThankYouPage.tsx` - Post-submission page
4. `/components/marketing/SimpleStepsGuide.tsx` - Getting started component
5. `/lib/supabase/leads.ts` - Lead capture functions
6. `/supabase/migrations/008_email_leads.sql` - Database table
7. `/GENIUS-PARENT-FUNNEL.md` - Complete strategy guide
8. `/MARKETING-FUNNEL-AUDIT.md` - Original gap analysis

---

**Run that SQL migration and you're LIVE! 🚀**

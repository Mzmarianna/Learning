# 🚀 Deployment Checklist

Complete guide to deploying Mz. Marianna's Academy to production.

---

## Phase 1: Export & Setup (Start Here!)

### ✅ Step 1: Download Your Code
- [ ] Export code from Figma Make as a ZIP file
- [ ] Extract to a folder on your computer
- [ ] Open terminal/command prompt in that folder

### ✅ Step 2: Install Dependencies
```bash
npm install
```

### ✅ Step 3: Test Locally (Demo Mode)
```bash
npm run dev
```
- Visit: http://localhost:5173
- Login with: `demo@test.com` / `test123`
- Verify dashboard loads correctly

---

## Phase 2: GitHub Setup

### ✅ Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Name: `mz-mariannas-academy`
3. Set to **Private**
4. Don't initialize with README (you already have one)

### ✅ Step 2: Push Code to GitHub
```bash
git init
git add .
git commit -m "Initial commit - Mz. Marianna's Academy LMS"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mz-mariannas-academy.git
git push -u origin main
```

**Alternative:** Use the included scripts:
- **Mac/Linux:** `./setup-github.sh`
- **Windows:** `setup-github.bat`

---

## Phase 3: Supabase Database Setup

### ✅ Step 1: Create Supabase Project
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Name: `Mz Marianna Academy`
4. Choose region closest to your users
5. Generate a strong database password
6. Wait ~2 minutes for project to initialize

### ✅ Step 2: Get Your API Keys
1. Go to: Settings → API
2. Copy these values:
   - **Project URL** → Save as `VITE_SUPABASE_URL`
   - **anon public** key → Save as `VITE_SUPABASE_ANON_KEY`
   - **service_role** key → Save as `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

### ✅ Step 3: Deploy Database Schema

**Option A: Supabase CLI (Recommended)**
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_ID

# Push schema
supabase db push
```

**Option B: Manual Upload**
```bash
# Run consolidation script first
# Mac/Linux:
./scripts/consolidate-sql.sh

# Windows:
scripts\consolidate-sql.bat

# Then upload COMPLETE-MASTER-SETUP.sql to:
# Supabase Dashboard → SQL Editor → New Query → Paste & Run
```

### ✅ Step 4: Configure Google OAuth (Optional)
1. Supabase Dashboard → Authentication → Providers
2. Enable Google
3. Follow setup instructions in `/DATABASE-SETUP.md`

### ✅ Step 5: Set Up Storage Buckets
```sql
-- Run in Supabase SQL Editor:

-- Avatar images
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT DO NOTHING;

-- Portfolio submissions
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', false)
ON CONFLICT DO NOTHING;

-- Enable RLS
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Students can view own portfolio"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Students can upload to portfolio"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### ✅ Step 6: Verify Database
```bash
# Run smoke test in Supabase SQL Editor
# Copy contents of SMOKE-TEST.sql
```

---

## Phase 4: Vercel Deployment

### ✅ Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### ✅ Step 2: Login to Vercel
```bash
vercel login
```

### ✅ Step 3: Deploy
```bash
# First deployment
vercel

# Follow prompts:
# - Link to existing project? No
# - What's your project's name? mz-mariannas-academy
# - In which directory is your code located? ./
# - Want to modify settings? No

# Deploy to production
vercel --prod
```

### ✅ Step 4: Add Environment Variables
In Vercel Dashboard → Settings → Environment Variables:

```bash
# Supabase (Required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Shopify (Optional - add later when setting up payments)
SHOPIFY_STORE_URL=your-store.myshopify.com
SHOPIFY_ADMIN_API_TOKEN=shpat_xxxxxxxxxxxxx
SHOPIFY_WEBHOOK_SECRET=xxxxxxxxxxxxx

# OpenAI (Optional - for Wowl AI)
OPENAI_API_KEY=sk-xxxxxxxxxxxxx

# Cron API Key (generate random string)
CRON_API_KEY=your-random-secret-key
```

### ✅ Step 5: Redeploy with Environment Variables
```bash
vercel --prod
```

### ✅ Step 6: Set Up Custom Domain (Optional)
1. Vercel Dashboard → Settings → Domains
2. Add domain: `academy.yourdomain.com`
3. Follow DNS configuration instructions
4. Wait for SSL certificate (~5 minutes)

---

## Phase 5: Shopify Setup (For Payments)

**See detailed guide:** `/SHOPIFY-VERCEL-SETUP.md`

### Quick Overview:
- [ ] Create Shopify store
- [ ] Add subscription products
- [ ] Install Recharge or Shopify Subscriptions
- [ ] Configure webhooks to Vercel
- [ ] Test purchase flow

---

## Phase 6: Testing

### ✅ Test Authentication
- [ ] Visit your Vercel URL
- [ ] Click "Sign Up"
- [ ] Create test account
- [ ] Verify email received (if configured)
- [ ] Login successfully

### ✅ Test Student Dashboard
- [ ] XP displays correctly
- [ ] Quests load
- [ ] Can view challenges
- [ ] Can upload portfolio submission
- [ ] Avatar customization works

### ✅ Test Parent Dashboard
- [ ] Can create student account
- [ ] Can view student progress
- [ ] Weekly reports accessible

### ✅ Test Placement Quiz
- [ ] Visit `/placement-quiz`
- [ ] Complete quiz (no login required)
- [ ] See results page
- [ ] Verify data saved in Supabase

---

## Phase 7: Go Live Checklist

### Security
- [ ] All environment variables set correctly
- [ ] No sensitive keys in `config.ts`
- [ ] `.env.local` added to `.gitignore`
- [ ] RLS policies enabled on all tables
- [ ] Storage bucket policies configured

### Performance
- [ ] Database indexes created
- [ ] Images optimized
- [ ] Build size under 500KB (check Vercel dashboard)

### Content
- [ ] Update logo/favicon
- [ ] Customize welcome emails
- [ ] Add real avatar options
- [ ] Update privacy policy with your info

### Monitoring
- [ ] Set up Vercel analytics
- [ ] Configure Supabase alerts
- [ ] Test error logging

---

## Phase 8: Share & Launch

### Option 1: Soft Launch (Friends & Family)
```bash
# Share your Vercel URL:
https://your-app.vercel.app

# Or custom domain:
https://academy.yourdomain.com
```

### Option 2: Public Launch
1. Set up Shopify store
2. Enable payment processing
3. Create marketing materials
4. Share placement quiz link:
   `https://academy.yourdomain.com/placement-quiz`

---

## Maintenance

### Update Code
```bash
# Make changes locally
npm run dev  # test

# Push to GitHub
git add .
git commit -m "Your changes"
git push

# Vercel auto-deploys from main branch
```

### Update Database
```bash
# Create new migration
supabase migration new your_change_name

# Edit migration file in /supabase/migrations/

# Push to Supabase
supabase db push
```

---

## Troubleshooting

### Build Fails on Vercel
- Check build logs in Vercel dashboard
- Verify all imports use correct paths
- Ensure TypeScript compiles locally: `npm run build`

### Database Connection Issues
- Verify environment variables in Vercel
- Check Supabase project is not paused
- Test connection in `/config.ts`

### Authentication Not Working
- Check Supabase Auth settings
- Verify site URL in Supabase → Authentication → URL Configuration
- Add Vercel domain to allowed redirect URLs

---

## 🎉 Success Indicators

You're ready to launch when:
- ✅ Local development works (`npm run dev`)
- ✅ Code pushed to GitHub
- ✅ Database deployed to Supabase
- ✅ App deployed to Vercel
- ✅ Can create account and login
- ✅ Student dashboard loads with demo data
- ✅ Placement quiz works without login
- ✅ Environment variables configured
- ✅ Custom domain pointing (if applicable)

---

## Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Vite Docs:** https://vitejs.dev
- **React Router:** https://reactrouter.com

---

**Your neurodivergent-first LMS is ready to change lives!** 🦉✨

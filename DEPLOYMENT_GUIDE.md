# 🚀 Complete Deployment Guide - Learning Kingdom

This guide will walk you through deploying your Learning Kingdom platform from development to production.

---

## 📋 Pre-Deployment Checklist

Before you start, make sure you have:

- [ ] GitHub account (with access to repository)
- [ ] Email: mariannav920@gmail.com
- [ ] 30-45 minutes of uninterrupted time
- [ ] Credit card (for paid services, most have free tiers)
- [ ] Access to your domain registrar (if using custom domain)

---

## 🎯 Deployment Options

### Option A: Netlify (Recommended - Easiest)
- **Best for**: Quick deployment, automatic builds
- **Free tier**: 100 GB bandwidth, 300 build minutes/month
- **Pros**: Easy GitHub integration, automatic deploys, edge functions
- **Cost**: Free for testing, $19/month for production

### Option B: Vercel  
- **Best for**: Next-level performance, global CDN
- **Free tier**: Unlimited bandwidth for personal use
- **Pros**: Lightning fast, great DX, automatic HTTPS
- **Cost**: Free for hobby, $20/month for pro

---

## 🚀 Quick Deployment (Netlify - 15 minutes)

### Step 1: Create Accounts (5 minutes)

#### 1.1 Supabase
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign in with GitHub or email: **mariannav920@gmail.com**
4. Create new organization: "Mz Marianna Academy"
5. Create new project:
   - Name: "learning-kingdom-prod"
   - Database Password: (create strong password and save it!)
   - Region: Choose closest to your users (e.g., "US East")
6. Wait 2-3 minutes for project to initialize

#### 1.2 Resend
1. Go to https://resend.com
2. Click "Get Started"
3. Sign up with: **mariannav920@gmail.com**
4. Verify your email (check inbox)
5. Skip domain setup for now (use default)

#### 1.3 Netlify
1. Go to https://netlify.com
2. Click "Sign Up"
3. Choose "GitHub" authentication
4. Authorize Netlify to access your GitHub repos

---

### Step 2: Configure Services (10 minutes)

#### 2.1 Get Supabase Credentials
1. In Supabase dashboard, go to Project Settings
2. Click "API" in sidebar
3. **COPY THESE VALUES** (you'll need them soon):
   ```
   Project URL: https://xxxxx.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
   service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx (keep secret!)
   ```

#### 2.2 Run Database Migration
1. In Supabase dashboard, go to SQL Editor
2. Click "New Query"
3. Paste this SQL:

```sql
-- Create email_leads table
CREATE TABLE IF NOT EXISTS public.email_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  child_age INTEGER,
  biggest_struggle TEXT,
  source TEXT NOT NULL,
  utm_source TEXT,
  utm_campaign TEXT,
  utm_medium TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_email_leads_created ON public.email_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_leads_source ON public.email_leads(source);

-- Enable RLS (Row Level Security)
ALTER TABLE public.email_leads ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (for lead capture)
CREATE POLICY "Allow public lead capture" ON public.email_leads
  FOR INSERT TO anon
  WITH CHECK (true);

-- Policy: Allow authenticated users to view their own leads
CREATE POLICY "Users can view leads" ON public.email_leads
  FOR SELECT TO authenticated
  USING (true);
```

4. Click "Run" (bottom right)
5. Should see: "Success. No rows returned"

#### 2.3 Get Resend API Key
1. In Resend dashboard, go to "API Keys"
2. Click "Create API Key"
3. Name it: "Learning Kingdom Production"
4. Click "Add"
5. **COPY THE KEY** (starts with `re_`) - you won't see it again!

---

### Step 3: Deploy to Netlify (10 minutes)

#### 3.1 Connect Repository
1. In Netlify dashboard, click "Add new site"
2. Choose "Import an existing project"
3. Click "Deploy with GitHub"
4. Authorize Netlify (if not already)
5. Search for your repository: "Mzmarianna/Learning"
6. Click on it

#### 3.2 Configure Build Settings
Netlify should auto-detect Vite settings, but verify:

- **Base directory**: (leave empty)
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18 or higher (should auto-detect)

Click "Show advanced" and add environment variables:

```
VITE_SUPABASE_URL = [paste your Supabase URL]
VITE_SUPABASE_ANON_KEY = [paste your anon key]
VITE_RESEND_API_KEY = [paste your Resend key]
```

#### 3.3 Deploy!
1. Click "Deploy [site name]"
2. Wait 2-3 minutes for build
3. Watch the build logs (click "Deploying...")
4. Should see: "Site is live ✓"

#### 3.4 Test Your Site
1. Click on the site URL (e.g., `random-name-12345.netlify.app`)
2. Should see your homepage!
3. Test the e-book funnel:
   - Click "Get FREE Guide"
   - Enter email: your-test@email.com
   - Submit form
   - Should redirect to Thank You page
   - **Check your email!** (might be in spam first time)
   - Click download link in email

---

### Step 4: Deploy Supabase Edge Function (5 minutes)

This enables email sending from your backend.

#### 4.1 Install Supabase CLI (if not already installed)

**Mac/Linux:**
```bash
brew install supabase/tap/supabase
```

**Windows:**
```bash
scoop install supabase
```

**Or use npx** (no install needed):
```bash
npx supabase --version
```

#### 4.2 Login to Supabase
```bash
npx supabase login
```
Follow the browser prompt to authorize.

#### 4.3 Link Your Project
```bash
cd /path/to/Learning
npx supabase link --project-ref [your-project-ref]
```
Find project ref in Supabase URL: `https://[THIS-PART].supabase.co`

#### 4.4 Add Resend Secret
```bash
npx supabase secrets set RESEND_API_KEY=[your-resend-key]
```

#### 4.5 Deploy Function
```bash
npx supabase functions deploy send-email --no-verify-jwt
```

Should see: "Function deployed successfully!"

---

## ✅ Verification Checklist

Test each of these on your live site:

### Homepage
- [ ] Site loads without errors
- [ ] Images display correctly
- [ ] Animations work smoothly
- [ ] "Get FREE Guide" button works
- [ ] "Start Quest" button links correctly
- [ ] Mobile responsive (test on phone)

### E-Book Funnel
- [ ] Free Guide page loads
- [ ] Form accepts email
- [ ] Redirects to Thank You page
- [ ] Email arrives within 1 minute
- [ ] Email looks good (no broken images)
- [ ] Download link works
- [ ] E-book opens in new tab

### Database
- [ ] Open Supabase → Table Editor → email_leads
- [ ] Should see test email you submitted
- [ ] All fields populated correctly

### Edge Function
- [ ] Open Supabase → Edge Functions → send-email
- [ ] Click "Logs"
- [ ] Should see successful email send logs

---

## 🌐 Custom Domain Setup (Optional - 15 minutes)

### Option 1: Use Existing Domain

If you own `mzmarianna.com`:

#### In Netlify:
1. Site Settings → Domain Management
2. Click "Add custom domain"
3. Enter: `mzmarianna.com`
4. Netlify will provide DNS records

#### In Your Domain Registrar (GoDaddy, Namecheap, etc.):
1. Go to DNS settings
2. Add these records:

```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: [your-site].netlify.app
```

3. Wait 24-48 hours for DNS propagation
4. Netlify will automatically provision SSL certificate

### Option 2: Get New Domain

1. **Buy domain**: Google Domains, Namecheap, GoDaddy
   - Search: `mzmarianna.com` or variations
   - Cost: $10-15/year
2. Follow "Option 1" steps above

---

## 📧 Professional Email Setup (Optional - 20 minutes)

Make emails come from `marianna@mzmarianna.com` instead of `noreply@resend.dev`

### In Resend:
1. Go to Domains
2. Click "Add Domain"
3. Enter: `mzmarianna.com`
4. Resend will show DNS records to add

### Add These DNS Records to Your Domain:

```
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all

Type: CNAME
Name: resend._domainkey
Value: resend._domainkey.resend.com

Type: MX
Name: @
Value: feedback-smtp.us-east-1.amazonses.com
Priority: 10
```

### Wait & Verify:
1. Wait 24-48 hours
2. In Resend → Domains → Click "Verify"
3. Should show green checkmark

### Update Email Templates:
In your code, change:
```typescript
from: "Mz. Marianna's Academy <noreply@resend.dev>"
```
To:
```typescript
from: "Marianna Vitale <marianna@mzmarianna.com>"
```

Redeploy to Netlify.

---

## 🔧 Troubleshooting

### Build Failed?

**Check these:**
1. Environment variables set correctly?
2. No typos in variable names?
3. Variables don't have trailing spaces?
4. Build command is `npm run build`?
5. Node version is 18+?

**Fix:**
- Site Settings → Environment Variables → Edit
- Site Settings → Build & Deploy → Edit build command

### Email Not Arriving?

**Check these:**
1. Spam folder (very common for new domains)
2. Resend dashboard → Logs → Check delivery status
3. Edge function logs in Supabase
4. Browser console for errors

**Fix:**
- Mark first email as "Not Spam"
- Verify RESEND_API_KEY is set in Supabase secrets
- Redeploy edge function

### E-Book Link Not Working?

**Check:**
- Link in email template is correct
- Figma link hasn't expired
- Network connection

**Fix:**
- Generate new Figma share link if needed
- Update email template with new link

### Database Connection Error?

**Check:**
1. VITE_SUPABASE_URL set correctly?
2. VITE_SUPABASE_ANON_KEY set correctly?
3. Supabase project active (not paused)?

**Fix:**
- Check Project Settings → API in Supabase
- Copy fresh credentials
- Update environment variables
- Redeploy

---

## 📊 Monitoring & Analytics

### Netlify Analytics (Included)
- Site Settings → Analytics & Logs
- See: traffic, bandwidth, build minutes

### Supabase Logs
- Logs tab → See all database queries
- Edge Functions → Logs → See email sends

### Resend Dashboard
- Emails → See all sent emails
- Analytics → Open rates, click rates
- Webhooks → Get notified of bounces

### Google Analytics (Optional)
1. Create GA4 property
2. Get tracking ID
3. Add to your site:
```html
<!-- In index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

---

## 💰 Cost Breakdown

### Free Tier (Great for Testing)
- **Netlify**: 100 GB bandwidth, 300 build minutes/month
- **Supabase**: 500 MB database, 50 MB file storage
- **Resend**: 100 emails/day (3,000/month)
- **Total**: $0/month

### Production (Recommended)
- **Netlify Pro**: $19/month (1 TB bandwidth, 1,000 build minutes)
- **Supabase Pro**: $25/month (8 GB database, 100 GB storage)
- **Resend**: $20/month (50,000 emails)
- **Domain**: $12/year
- **Total**: ~$65/month

### Scale (100+ active users)
- **Netlify**: $19/month
- **Supabase**: $25-100/month (based on usage)
- **Resend**: $20-80/month (based on emails)
- **Total**: $64-200/month

---

## 🎉 You're Live!

Congratulations! Your Learning Kingdom is now live on the internet!

### Share Your Site:
- Homepage: `https://your-site.netlify.app`
- E-Book Page: `https://your-site.netlify.app/free-guide`
- Placement Quiz: `https://your-site.netlify.app/placement-quiz`

### Next Steps:
1. Test everything thoroughly
2. Get feedback from friends/family
3. Make a test purchase (if payments enabled)
4. Share on social media
5. Start your marketing campaigns!

---

## 📞 Support Resources

### Documentation:
- **Supabase**: https://supabase.com/docs
- **Resend**: https://resend.com/docs
- **Netlify**: https://docs.netlify.com

### Community:
- **Supabase Discord**: https://discord.supabase.com
- **Netlify Forum**: https://answers.netlify.com

### Direct Support:
- **Supabase**: support@supabase.com
- **Resend**: support@resend.com  
- **Netlify**: support@netlify.com

---

## 🔄 Continuous Deployment

**Great news!** Every time you push to GitHub, Netlify automatically:
1. Detects the change
2. Runs `npm run build`
3. Deploys new version
4. Updates your live site

**No manual deployment needed!**

Just code, commit, push, and it's live in 2-3 minutes.

---

**Need help?** Check your email (mariannav920@gmail.com) for service notifications and support responses.

**Ready to launch?** Follow the steps above and you'll be live in under an hour! 🚀

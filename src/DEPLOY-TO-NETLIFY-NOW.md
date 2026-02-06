# 🚀 Deploy www.mzmarianna.com to Netlify - Step by Step

**Domain:** www.mzmarianna.com  
**Email:** mariannav920@gmail.com  
**Deployment Platform:** Netlify + Supabase  
**Estimated Time:** 30 minutes

---

## ✅ **PREREQUISITES CHECK**

Before starting, make sure you have:
- [ ] Supabase project URL: `wyclbrafklhvdyjpoeno.supabase.co`
- [ ] Supabase anon key (from Supabase dashboard)
- [ ] Domain registrar access (where you bought mzmarianna.com)
- [ ] GitHub account (for connecting to Netlify)

---

## 📋 **STEP 1: PREPARE ENVIRONMENT VARIABLES**

### **Create `.env.production` File**

Create this file in your project root with these values:

```bash
# ============================================================================
# SUPABASE (Required)
# ============================================================================
VITE_SUPABASE_URL=https://wyclbrafklhvdyjpoeno.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY_HERE

# ============================================================================
# STRIPE (Required for payments)
# ============================================================================
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_STRIPE_KEY_HERE
# OR use production key when ready:
# VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_STRIPE_KEY_HERE

# ============================================================================
# EMAIL (Optional - for automated emails)
# ============================================================================
VITE_RESEND_API_KEY=re_YOUR_RESEND_KEY_HERE

# ============================================================================
# AI (Optional - for WOWL AI)
# ============================================================================
VITE_GEMINI_API_KEY=YOUR_GEMINI_KEY_HERE
```

### **Where to Get These Keys:**

**1. Supabase Anon Key:**
```
1. Go to: https://supabase.com/dashboard/project/wyclbrafklhvdyjpoeno
2. Click "Settings" → "API"
3. Copy "anon public" key
```

**2. Stripe Key:**
```
1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy "Publishable key" (starts with pk_test_)
3. For production: Use pk_live_ key
```

**3. Resend API Key (Optional):**
```
1. Sign up at: https://resend.com
2. Create API key
3. Add domain: mzmarianna.com
```

**4. Gemini API Key (Optional):**
```
1. Go to: https://aistudio.google.com/apikey
2. Create new API key
3. Copy key
```

---

## 🚀 **STEP 2: DEPLOY TO NETLIFY**

### **Option A: Deploy via Netlify CLI (Fastest)**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build your app
npm run build

# Deploy to Netlify
netlify deploy --prod

# Follow prompts:
# - Create new site? Yes
# - Team: Choose your team
# - Site name: mz-marianna-academy (or any name)
# - Publish directory: dist

# Copy the URL Netlify gives you (e.g., https://mz-marianna-academy.netlify.app)
```

### **Option B: Deploy via Netlify Dashboard (Easier)**

**If you haven't pushed to GitHub yet:**
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - Mz. Marianna's Academy"

# Create GitHub repo and push
gh repo create mz-marianna-academy --private --source=. --remote=origin --push
# OR manually create repo on GitHub and:
git remote add origin https://github.com/YOUR_USERNAME/mz-marianna-academy.git
git branch -M main
git push -u origin main
```

**Then deploy on Netlify:**

1. **Go to:** https://app.netlify.com
2. **Click:** "Add new site" → "Import an existing project"
3. **Choose:** GitHub
4. **Select:** Your repository (mz-marianna-academy)
5. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
6. **Click:** "Deploy site"

**⏰ Wait 2-3 minutes for build to complete**

---

## 🔐 **STEP 3: ADD ENVIRONMENT VARIABLES TO NETLIFY**

### **Via Netlify Dashboard:**

1. Go to your site in Netlify
2. Click "Site configuration" → "Environment variables"
3. Click "Add a variable"
4. Add each variable one by one:

```
VITE_SUPABASE_URL = https://wyclbrafklhvdyjpoeno.supabase.co
VITE_SUPABASE_ANON_KEY = [your anon key]
VITE_STRIPE_PUBLISHABLE_KEY = [your stripe key]
VITE_RESEND_API_KEY = [your resend key] (optional)
VITE_GEMINI_API_KEY = [your gemini key] (optional)
```

5. **Click "Save"**
6. **Click "Trigger deploy"** (to rebuild with new variables)

### **Via Netlify CLI:**

```bash
# Set environment variables
netlify env:set VITE_SUPABASE_URL "https://wyclbrafklhvdyjpoeno.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "your-anon-key"
netlify env:set VITE_STRIPE_PUBLISHABLE_KEY "your-stripe-key"

# Trigger new deployment
netlify deploy --prod
```

---

## 🌐 **STEP 4: CONNECT YOUR DOMAIN**

### **Part A: Add Domain to Netlify**

1. **In Netlify Dashboard:**
   - Go to your site
   - Click "Domain management"
   - Click "Add domain"
   - Enter: `www.mzmarianna.com`
   - Click "Verify"

2. **Netlify will show you DNS records to add**

### **Part B: Configure DNS (Where You Registered Domain)**

**Common Registrars:**

#### **If using Squarespace Domains:**
```
1. Go to: https://account.squarespace.com/domains
2. Click on "mzmarianna.com"
3. Click "DNS Settings"
4. Add these records:

A Record:
  Host: @
  Value: 75.2.60.5
  TTL: Automatic (or 3600)

CNAME Record:
  Host: www
  Value: [your-site].netlify.app
  TTL: Automatic (or 3600)
```

#### **If using GoDaddy:**
```
1. Go to: https://dcc.godaddy.com/manage/dns
2. Select "mzmarianna.com"
3. Click "Add" to add new record

A Record:
  Name: @
  Value: 75.2.60.5
  TTL: 1 Hour

CNAME Record:
  Name: www
  Value: [your-site].netlify.app
  TTL: 1 Hour
```

#### **If using Namecheap:**
```
1. Go to: https://ap.www.namecheap.com/domains/list/
2. Click "Manage" next to mzmarianna.com
3. Go to "Advanced DNS"
4. Add:

A Record:
  Host: @
  Value: 75.2.60.5
  TTL: Automatic

CNAME Record:
  Host: www
  Value: [your-site].netlify.app
  TTL: Automatic
```

#### **If using Cloudflare:**
```
1. Go to: https://dash.cloudflare.com
2. Select "mzmarianna.com"
3. Go to "DNS" → "Records"
4. Add:

A Record:
  Name: @
  IPv4 address: 75.2.60.5
  Proxy status: Proxied (orange cloud)

CNAME Record:
  Name: www
  Target: [your-site].netlify.app
  Proxy status: Proxied (orange cloud)
```

### **Part C: Verify Domain in Netlify**

1. After adding DNS records, go back to Netlify
2. Click "Verify DNS configuration"
3. **Wait 20 minutes to 48 hours** for DNS propagation (usually 30 min)
4. Netlify will automatically provision SSL certificate

---

## 🔒 **STEP 5: ENABLE HTTPS/SSL (Automatic)**

Netlify automatically enables HTTPS once DNS is configured.

**Check SSL Status:**
1. Go to Netlify Dashboard
2. Click "Domain management"
3. Look for "HTTPS" section
4. Should say: "Certificate active" ✅

**If SSL is pending:**
- Wait 15-30 minutes after DNS propagation
- Netlify auto-provisions Let's Encrypt SSL certificate
- No action needed from you!

**Force HTTPS Redirect:**
1. In Netlify: "Domain management"
2. Enable "Force HTTPS"
3. All http:// requests will redirect to https://

---

## 📧 **STEP 6: EMAIL SETUP (Optional)**

You have **3 options** for email:

### **Option A: Use Gmail (Easiest - Current Setup)**
- Keep using: mariannav920@gmail.com
- No additional setup needed
- FREE ✅
- **Recommended for now**

### **Option B: Email Forwarding (Simple)**
Forward emails from custom domain to Gmail:

**Using Netlify Email:**
```
1. Netlify Dashboard → Domain → Email
2. Add forwarding rule:
   support@mzmarianna.com → mariannav920@gmail.com
   hello@mzmarianna.com → mariannav920@gmail.com
3. Update MX records (Netlify provides instructions)
```

**Using ImprovMX (Free):**
```
1. Go to: https://improvmx.com
2. Add domain: mzmarianna.com
3. Add alias: 
   support@mzmarianna.com → mariannav920@gmail.com
4. Add MX records to your DNS:
   MX 10 mx1.improvmx.com
   MX 20 mx2.improvmx.com
```

### **Option C: Professional Email (Google Workspace)**
Get support@mzmarianna.com with full Gmail features:

```
1. Go to: https://workspace.google.com
2. Start free trial (14 days)
3. Add domain: mzmarianna.com
4. Verify domain ownership
5. Create email: support@mzmarianna.com
6. Cost: $6/month per user
```

**Recommendation:** Start with **Option A** (Gmail), add forwarding later if needed.

---

## ✅ **STEP 7: VERIFY DEPLOYMENT**

### **Test Checklist:**

```bash
# Wait for DNS propagation (15-60 minutes)
# Then test:

# 1. Main domain works
curl -I https://www.mzmarianna.com
# Should return: 200 OK

# 2. Non-www redirects to www
curl -I https://mzmarianna.com
# Should redirect to: https://www.mzmarianna.com

# 3. HTTP redirects to HTTPS
curl -I http://www.mzmarianna.com
# Should redirect to: https://www.mzmarianna.com
```

### **Manual Testing:**

**Visit these pages and verify they work:**
- [ ] `https://www.mzmarianna.com` - Homepage loads
- [ ] `https://www.mzmarianna.com/free-guide` - Free guide page works
- [ ] `https://www.mzmarianna.com/placement-quiz` - Quiz loads
- [ ] `https://www.mzmarianna.com/pricing` - Pricing page works
- [ ] `https://www.mzmarianna.com/login` - Login page works

**Test Core Features:**
- [ ] Free guide email capture works (check Supabase)
- [ ] Placement quiz saves results (check Supabase)
- [ ] Images load correctly
- [ ] No console errors (press F12)

---

## 🐛 **TROUBLESHOOTING**

### **Problem: Domain not connecting**
```bash
# Check DNS propagation
dig www.mzmarianna.com

# Should show:
# www.mzmarianna.com. 300 IN CNAME [your-site].netlify.app

# If not showing yet, wait longer (up to 48 hours, usually 30 min)
```

### **Problem: SSL certificate not activating**
- Wait 30 minutes after DNS is fully propagated
- Netlify auto-provisions SSL (Let's Encrypt)
- Check: Netlify Dashboard → Domain → HTTPS

### **Problem: Site shows "Page Not Found"**
```bash
# Check build succeeded:
# Netlify Dashboard → Deploys → Latest deploy

# If build failed:
1. Check build logs
2. Fix any errors in code
3. Redeploy: netlify deploy --prod
```

### **Problem: Environment variables not working**
```bash
# Verify variables are set:
# Netlify Dashboard → Site configuration → Environment variables

# Common issues:
1. Missing VITE_ prefix (required for Vite!)
2. Forgot to trigger new deploy after adding variables
3. Using wrong Supabase URL/key

# Fix:
1. Add VITE_ prefix to all variables
2. Click "Trigger deploy" in Netlify
```

### **Problem: Emails not being captured**
```bash
# Check Supabase connection:
1. Go to Supabase dashboard
2. Check "email_leads" table
3. Verify VITE_SUPABASE_URL is correct
4. Verify VITE_SUPABASE_ANON_KEY is correct
```

---

## 📊 **MONITORING YOUR SITE**

### **Netlify Analytics:**
```
1. Netlify Dashboard → Analytics
2. View: Page views, bandwidth, build minutes
3. Free tier: 100GB bandwidth/month
```

### **Supabase Usage:**
```
1. Supabase Dashboard → Project → Usage
2. Monitor: Database size, API requests, storage
3. Free tier: 500MB database, 2GB bandwidth
```

### **Uptime Monitoring (Optional):**
```
Use UptimeRobot (free):
1. Go to: https://uptimerobot.com
2. Add monitor: https://www.mzmarianna.com
3. Get alerts if site goes down
```

---

## 💰 **COST BREAKDOWN**

### **Current Setup (Free/Low Cost):**
```
Netlify (Starter Plan):
  - 100GB bandwidth: FREE
  - 300 build minutes: FREE
  - Custom domain: FREE
  - SSL certificate: FREE
  
Supabase (Free Tier):
  - 500MB database: FREE
  - 2GB bandwidth: FREE
  - Unlimited API requests: FREE
  
Domain Registration:
  - mzmarianna.com: ~$12-15/year
  
TOTAL: ~$1-2/month (just domain cost)
```

### **When You Scale:**
```
Netlify Pro ($19/month):
  - 400GB bandwidth
  - 1000 build minutes
  - Background functions
  
Supabase Pro ($25/month):
  - 8GB database
  - 100GB bandwidth
  - Daily backups
  
TOTAL: ~$45/month at scale
```

---

## 🎯 **QUICK COMMAND REFERENCE**

```bash
# ============================================================================
# BUILD & DEPLOY
# ============================================================================

# Build locally
npm run build

# Preview build
npm run preview

# Deploy to Netlify
netlify deploy --prod

# ============================================================================
# DOMAIN MANAGEMENT
# ============================================================================

# Check DNS propagation
dig www.mzmarianna.com
nslookup www.mzmarianna.com

# Test site is live
curl -I https://www.mzmarianna.com

# ============================================================================
# DEBUGGING
# ============================================================================

# View Netlify logs
netlify logs

# Check environment variables
netlify env:list

# Open Netlify dashboard
netlify open

# ============================================================================
# DATABASE
# ============================================================================

# Check email leads
# Go to: https://supabase.com/dashboard/project/wyclbrafklhvdyjpoeno
# → Table Editor → email_leads

# Run SQL query
# → SQL Editor → New query
```

---

## 📞 **SUPPORT CONTACTS**

**Netlify Support:**
- Dashboard: https://app.netlify.com
- Docs: https://docs.netlify.com
- Support: https://answers.netlify.com

**Supabase Support:**
- Dashboard: https://supabase.com/dashboard
- Docs: https://supabase.com/docs
- Discord: https://discord.supabase.com

**Domain Registrar:**
- Check your registrar's support page
- Usually has live chat or email support

---

## ✅ **POST-DEPLOYMENT CHECKLIST**

Once deployed:
- [ ] www.mzmarianna.com loads ✅
- [ ] HTTPS is active (green padlock) ✅
- [ ] All pages load correctly ✅
- [ ] Free guide email capture works ✅
- [ ] Placement quiz works ✅
- [ ] Admin login works (mariannav920@gmail.com) ✅
- [ ] Stripe test mode banner shows ✅
- [ ] No console errors ✅

**Advanced (Optional):**
- [ ] Google Analytics added
- [ ] Facebook Pixel added
- [ ] Email forwarding set up
- [ ] Resend API key added
- [ ] Gemini API key added (for WOWL AI)

---

## 🎉 **NEXT STEPS AFTER DEPLOYMENT**

1. **Test everything thoroughly**
2. **Announce launch** on social media
3. **Share free guide link**: https://www.mzmarianna.com/free-guide
4. **Monitor Supabase** for email leads
5. **Add Stripe production keys** when ready to accept payments
6. **Set up email automation** (Resend)
7. **Apply for grants** (with live site URL!)

---

## 🚨 **IMPORTANT NOTES**

### **Don't Forget:**
1. **Add `.env` to `.gitignore`** (already done)
2. **Never commit API keys** to GitHub
3. **Use test Stripe keys** until ready for production
4. **Backup Supabase database** regularly
5. **Monitor usage** to avoid surprise bills

### **Security:**
1. ✅ All traffic uses HTTPS (encrypted)
2. ✅ Supabase Row Level Security enabled
3. ✅ API keys never exposed to frontend
4. ✅ Environment variables kept secure in Netlify

---

## 📧 **YOUR DEPLOYMENT INFO**

```
Domain: www.mzmarianna.com
Email: mariannav920@gmail.com
Platform: Netlify + Supabase
Supabase URL: wyclbrafklhvdyjpoeno.supabase.co
Admin Login: mariannav920@gmail.com / marianna2026
```

**Save this file!** You'll need these details.

---

## 🎯 **YOU'RE READY TO LAUNCH! 🚀**

Follow the steps above in order, and you'll have your site live at **www.mzmarianna.com** within 30-60 minutes!

**Need help?** Refer to:
- `/DEPLOY-SIMPLE.md` - General Netlify guide
- `/QUICK-START-PAYMENTS.md` - Stripe setup
- `/EMAIL-SETUP-GUIDE.md` - Resend setup

**Let's go live! 🏰👑**

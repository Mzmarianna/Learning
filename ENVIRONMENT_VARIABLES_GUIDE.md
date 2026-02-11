# 🔐 Environment Variables Setup Guide

Complete guide to configuring all environment variables for your Learning Kingdom deployment on Vercel.

---

## 📋 Quick Reference

### Required Variables (Minimum to Deploy)
```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
```

### Optional Variables (Enable Additional Features)
```bash
VITE_RESEND_API_KEY=re_xxxxx
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxx
VITE_CLASSWALLET_CLIENT_ID=xxxxx
VITE_CLASSWALLET_CLIENT_SECRET=xxxxx
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

---

## 🚀 Setting Up in Vercel

### During Initial Deployment

1. **Import your project** from GitHub
2. Before clicking "Deploy", scroll to **Environment Variables**
3. Click **"Add"** for each variable
4. Paste the name and value
5. Click **"Deploy"**

### After Deployment

1. Go to your project in Vercel dashboard
2. Click **Settings** → **Environment Variables**
3. Add new variables or edit existing ones
4. **Important**: Redeploy for changes to take effect
5. Go to **Deployments** → Latest → **...** → **Redeploy**

---

## 🔑 How to Get Each Variable

### 1. VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY

**Required for**: Database, authentication, data storage

**Get from Supabase:**
1. Go to https://supabase.com
2. Sign in with GitHub (use mariannav920@gmail.com)
3. Select your project (or create new one)
4. Go to **Settings** → **API**
5. Copy:
   - **Project URL** → Use as `VITE_SUPABASE_URL`
   - **anon public** key → Use as `VITE_SUPABASE_ANON_KEY`

**Example:**
```bash
VITE_SUPABASE_URL=https://abcdefghijk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc5ODQzOTAsImV4cCI6MjAwMzU2MDM5MH0.xxxxx
```

**What it does**: Connects your app to Supabase database and handles authentication

---

### 2. VITE_RESEND_API_KEY

**Required for**: Email sending (lead capture, notifications)

**Get from Resend:**
1. Go to https://resend.com
2. Sign up with mariannav920@gmail.com
3. Verify your email
4. Go to **API Keys** in dashboard
5. Click **"Create API Key"**
6. Name it: "Learning Kingdom Production"
7. Click **"Add"**
8. **Copy the key immediately** (starts with `re_`) - you won't see it again!

**Example:**
```bash
VITE_RESEND_API_KEY=re_AbCdEfGh_123456789abcdefghijk
```

**What it does**: Enables email sending for lead capture forms and notifications

**Free tier**: 100 emails/day (3,000/month)

---

### 3. VITE_STRIPE_PUBLIC_KEY

**Required for**: Credit card payment processing

**Get from Stripe:**
1. Go to https://stripe.com
2. Sign up with mariannav920@gmail.com
3. Go to **Developers** → **API Keys**
4. Copy **Publishable key** (starts with `pk_test_` for testing or `pk_live_` for production)

**Example (Test mode):**
```bash
VITE_STRIPE_PUBLIC_KEY=pk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz
```

**Example (Live mode):**
```bash
VITE_STRIPE_PUBLIC_KEY=pk_live_51AbCdEfGhIjKlMnOpQrStUvWxYz
```

**What it does**: Processes credit card payments via Stripe

**Cost**: 2.9% + 30¢ per transaction

---

### 4. VITE_CLASSWALLET_CLIENT_ID & VITE_CLASSWALLET_CLIENT_SECRET

**Required for**: ESA/529 education fund payments via ClassWallet

**Get from ClassWallet:**
1. Go to https://classwallet.com
2. Sign up for a merchant account
3. Complete merchant verification
4. Go to **Developer** → **API Credentials**
5. Copy:
   - **Client ID** → Use as `VITE_CLASSWALLET_CLIENT_ID`
   - **Client Secret** → Use as `VITE_CLASSWALLET_CLIENT_SECRET`

**Example:**
```bash
VITE_CLASSWALLET_CLIENT_ID=cw_client_abc123
VITE_CLASSWALLET_CLIENT_SECRET=cw_secret_xyz789
```

**What it does**: Allows parents to pay using ESA/529 education funds

**Setup time**: 1-3 business days for merchant approval

---

### 5. VITE_GOOGLE_ANALYTICS_ID

**Required for**: Website analytics and tracking

**Get from Google Analytics:**
1. Go to https://analytics.google.com
2. Sign in with mariannav920@gmail.com
3. Click **Admin** (gear icon)
4. Create **Account**: "Mz Marianna Academy"
5. Create **Property**: "Learning Kingdom"
6. Copy **Measurement ID** (starts with `G-`)

**Example:**
```bash
VITE_GOOGLE_ANALYTICS_ID=G-ABCD123456
```

**What it does**: Tracks visitor behavior, page views, conversions

**Free tier**: Unlimited (Google Analytics is free)

---

## 📝 Environment Variable Template

Copy this to create your `.env` file locally:

```bash
# ===================================
# LEARNING KINGDOM - ENVIRONMENT VARIABLES
# ===================================

# --------------------------
# REQUIRED - Core Features
# --------------------------

# Supabase (Database & Auth)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# --------------------------
# OPTIONAL - Additional Features
# --------------------------

# Resend (Email Service)
VITE_RESEND_API_KEY=

# Stripe (Credit Card Payments)
VITE_STRIPE_PUBLIC_KEY=

# ClassWallet (ESA/529 Payments)
VITE_CLASSWALLET_CLIENT_ID=
VITE_CLASSWALLET_CLIENT_SECRET=

# Google Analytics (Website Tracking)
VITE_GOOGLE_ANALYTICS_ID=

# --------------------------
# DEVELOPMENT ONLY
# --------------------------

# Port for dev server (optional)
PORT=3000
```

---

## 🔒 Security Best Practices

### ✅ DO:
- Keep `.env` file in `.gitignore` (already done)
- Use different keys for development vs production
- Rotate keys if compromised
- Use Supabase RLS (Row Level Security) policies
- Store secrets in Vercel dashboard, not in code

### ❌ DON'T:
- Commit `.env` to GitHub
- Share keys publicly
- Use production keys in development
- Hard-code API keys in source files
- Share secret keys in screenshots

---

## 🧪 Testing Your Setup

### Local Testing (Before Deployment)

1. **Create `.env` file** in project root:
   ```bash
   cp .env.example .env
   ```

2. **Add your variables** to `.env`

3. **Test the app**:
   ```bash
   npm run dev
   ```

4. **Check browser console** for errors:
   - Press `F12`
   - Look for Supabase connection errors
   - Test form submissions
   - Verify email sending

### Production Testing (After Deployment)

1. **Visit your Vercel site**
2. **Test core features**:
   - Homepage loads
   - Forms submit
   - Emails arrive
   - Payments process (test mode)
   - No console errors

3. **Check Vercel logs**:
   - Go to Vercel dashboard
   - Click your project
   - **Deployments** → Latest → **View Logs**
   - Look for environment variable errors

---

## 🐛 Troubleshooting

### "Cannot read properties of undefined"

**Cause**: Missing environment variable

**Fix**:
1. Check variable name spelling in Vercel
2. Must start with `VITE_` for Vite to expose it
3. Redeploy after adding variables

### "Supabase client not initialized"

**Cause**: Invalid or missing Supabase credentials

**Fix**:
1. Verify URL and key in Supabase dashboard
2. Ensure no trailing spaces in variables
3. Check project is not paused in Supabase

### "Email sending failed"

**Cause**: Invalid Resend API key

**Fix**:
1. Generate new API key in Resend dashboard
2. Update in Vercel environment variables
3. Redeploy

### "Stripe not defined"

**Cause**: Missing or invalid Stripe key

**Fix**:
1. Get fresh key from Stripe dashboard
2. Use `pk_test_` for testing, `pk_live_` for production
3. Update and redeploy

### Variables Work Locally but Not in Vercel

**Cause**: Forgot to redeploy after adding variables

**Fix**:
1. **Deployments** → Latest deployment
2. Click **"..."** menu
3. Select **"Redeploy"**
4. Wait for build to complete

---

## 📊 Environment Checklist

Use this checklist before deploying:

### Required Setup
- [ ] Supabase project created
- [ ] `VITE_SUPABASE_URL` added to Vercel
- [ ] `VITE_SUPABASE_ANON_KEY` added to Vercel
- [ ] Database tables created (run migrations)

### Email Setup
- [ ] Resend account created
- [ ] Email verified in Resend
- [ ] `VITE_RESEND_API_KEY` added to Vercel
- [ ] Test email sent successfully

### Payments Setup (Optional)
- [ ] Stripe account created (for credit cards)
- [ ] `VITE_STRIPE_PUBLIC_KEY` added
- [ ] ClassWallet merchant account approved
- [ ] ClassWallet credentials added
- [ ] Test payments working

### Analytics Setup (Optional)
- [ ] Google Analytics property created
- [ ] `VITE_GOOGLE_ANALYTICS_ID` added
- [ ] Tracking verified

### Final Checks
- [ ] All variables added to Vercel
- [ ] No typos in variable names
- [ ] Redeployed after adding variables
- [ ] Tested on production site
- [ ] No errors in browser console

---

## 🎯 Quick Setup Summary

**Minimum to deploy (5 minutes):**
1. Create Supabase project → Get URL and anon key
2. Add to Vercel environment variables
3. Deploy!

**Full featured setup (30 minutes):**
1. Supabase (database) - 5 min
2. Resend (email) - 5 min
3. Stripe (payments) - 10 min
4. Google Analytics (tracking) - 5 min
5. ClassWallet (ESA payments) - 5 min
6. Test everything - 5 min

---

## 📞 Support

### Issues with Specific Services

**Supabase**: support@supabase.com
**Resend**: support@resend.com
**Stripe**: support@stripe.com
**ClassWallet**: support@classwallet.com
**Vercel**: support@vercel.com

### Documentation

- Supabase: https://supabase.com/docs
- Resend: https://resend.com/docs
- Stripe: https://stripe.com/docs
- Vercel: https://vercel.com/docs

---

## ✅ You're Ready!

Once you've:
1. Set up required Supabase variables
2. Added them to Vercel
3. Deployed successfully

**Your Learning Kingdom is live!** 🚀

For step-by-step deployment: [VERCEL_QUICK_START.md](./VERCEL_QUICK_START.md)

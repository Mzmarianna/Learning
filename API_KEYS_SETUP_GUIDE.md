# 🔑 API Keys Setup Guide

This guide will help you set up all the necessary API keys and credentials for your Learning Kingdom platform.

## ⚠️ Important: DO NOT Commit API Keys to Git

All sensitive credentials should be stored in:
- `.env` file (local development) - **NEVER commit this file**
- Netlify/Vercel environment variables (production)
- Supabase dashboard (database secrets)

---

## 📋 Required API Keys Checklist

### 1. Supabase (Database & Authentication) ✅ REQUIRED

**What it's for:** Database, user authentication, storage

**How to get it:**
1. Go to https://supabase.com
2. Sign in or create account with: **mariannav920@gmail.com**
3. Create new project or select existing "Learning Kingdom" project
4. Go to Project Settings → API
5. Copy:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (for server-side only!)

**Add to .env:**
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... # Server-side only
```

---

### 2. Resend (Email Automation) ✅ HIGHLY RECOMMENDED

**What it's for:** Automated e-book delivery, welcome emails, weekly reports

**How to get it:**
1. Go to https://resend.com
2. Sign up with: **mariannav920@gmail.com**
3. Verify your email
4. Go to API Keys section
5. Click "Create API Key"
6. Name it: "Learning Kingdom Production"
7. Copy the key (starts with `re_...`)

**Add to .env (server-only):**
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
```

**Important:** This should NOT have the `VITE_` prefix as it's a server-side secret. It should only be used in Vercel/Netlify serverless functions or Supabase Edge Functions, never in the browser bundle.

**Pricing:**
- FREE: 100 emails/day (3,000/month)
- $20/month: 50,000 emails/month
- For your use case: Start with free tier!

**Setup Email Domain (Optional but Professional):**
1. In Resend dashboard → Domains
2. Add your domain: `mzmarianna.com`
3. Add DNS records they provide to your domain registrar
4. Verify domain
5. Now emails will come from `marianna@mzmarianna.com` instead of `noreply@resend.dev`

---

### 3. Netlify (Deployment & Hosting) ✅ REQUIRED FOR DEPLOYMENT

**What it's for:** Website hosting, CI/CD, serverless functions

**How to get it:**
1. Go to https://netlify.com
2. Sign up/login with: **mariannav920@gmail.com**
3. Connect your GitHub repository
4. Go to Site Settings → Build & Deploy → Environment Variables
5. Add all your environment variables there (VITE_SUPABASE_URL, VITE_RESEND_API_KEY, etc.)

**Add to .env (for CLI deployment):**
```bash
NETLIFY_AUTH_TOKEN=nfp_xxxxxxxxxxxxx
NETLIFY_SITE_ID=xxxxx-xxxxx-xxxxx
```

**To get tokens:**
- Auth Token: User Settings → Applications → Personal Access Tokens
- Site ID: Site Settings → General → Site Information

---

### 4. Stripe (Payment Processing) ⏳ OPTIONAL (FOR LATER)

**What it's for:** Processing subscription payments

**How to get it:**
1. Go to https://stripe.com
2. Sign up with: **mariannav920@gmail.com**
3. Complete business verification
4. Get API keys from Dashboard → Developers → API Keys
5. Use **test mode** keys first!

**Add to .env:**
```bash
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx  # Server-side only!
```

**Note:** You already have Stripe integrated in the code. Enable when ready to accept payments.

---

### 5. OpenAI / Google Gemini (AI Features) ⏳ OPTIONAL

**What it's for:** Wowl AI tutor, adaptive learning responses

**Option A: OpenAI (GPT)**
1. Go to https://platform.openai.com
2. Sign up/login
3. API Keys → Create new secret key
4. Add to .env: `OPENAI_API_KEY=sk-xxxxx`

**Option B: Google Gemini (Recommended - Free tier)**
1. Go to https://makersuite.google.com/app/apikey
2. Create API key
3. Add to .env: `GEMINI_API_KEY=xxxxx`

**Pricing:**
- Gemini: FREE tier available (better for your use case)
- OpenAI: Pay per token ($0.002/1K tokens for GPT-3.5)

---

### 6. Shopify (E-commerce Integration) ⏳ OPTIONAL

**What it's for:** Subscription management, payment processing

**How to get it:**
1. If you have existing Shopify store: Great!
2. If not: https://shopify.com (14-day free trial)
3. Create private app or install custom app
4. Get Admin API token

**Add to .env:**
```bash
SHOPIFY_STORE_URL=your-store.myshopify.com
SHOPIFY_ADMIN_API_TOKEN=shpat_xxxxxxxxxxxxx
SHOPIFY_WEBHOOK_SECRET=xxxxxxxxxxxxx
```

---

## 🚀 Quick Setup (30 Minutes)

### Step 1: Create .env file
```bash
cp .env.example .env
```

### Step 2: Fill in REQUIRED keys
Minimum to get started:
- `VITE_SUPABASE_URL` (from Supabase)
- `VITE_SUPABASE_ANON_KEY` (from Supabase)

### Step 3: Add RECOMMENDED keys
For e-book automation:
- `VITE_RESEND_API_KEY` (from Resend)

### Step 4: Test locally
```bash
npm run dev
```

Visit http://localhost:5173 and test:
1. Sign up for free guide
2. Check if email arrives (if Resend is configured)
3. Check Supabase dashboard for captured lead

---

## 🔒 Security Best Practices

### ✅ DO:
- Store keys in `.env` (local) and Netlify/Vercel (production)
- Use different keys for development and production
- Rotate keys if they're exposed
- Use environment variables in code: `import.meta.env.VITE_SUPABASE_URL`

### ❌ DON'T:
- Commit `.env` file to Git (already in .gitignore)
- Share API keys in screenshots, videos, or demos
- Use production keys in development
- Hardcode API keys in source code

---

## 📧 Email Configuration Details

### Domain Setup (Professional Emails)

**Current:** Emails sent from `noreply@resend.dev` (free tier)
**Goal:** Emails sent from `marianna@mzmarianna.com` (professional)

**Steps:**
1. Purchase domain: `mzmarianna.com` (if not already owned)
2. Add domain to Resend
3. Add these DNS records to your domain:

```
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all

Type: CNAME  
Name: resend._domainkey
Value: resend._domainkey.resend.com

Type: MX
Name: @
Value: feedback-smtp.us-east-1.amazonses.com (Priority: 10)
```

4. Wait for DNS propagation (24-48 hours)
5. Verify in Resend dashboard
6. Update email templates to use your domain

---

## 🧪 Testing Email Delivery

### Test with Real Email:
```bash
# In browser console or Node.js:
import { sendEbookDeliveryEmail } from './src/lib/email/ebook-delivery';

await sendEbookDeliveryEmail({
  email: 'mariannav920@gmail.com',
  firstName: 'Marianna'
});
```

### Check Resend Dashboard:
- Logs → See all sent emails
- Analytics → Open rates, click rates
- Webhooks → Get notified of bounces

---

## ❓ Troubleshooting

### Email not sending?
1. Check `VITE_RESEND_API_KEY` is set correctly
2. Check Resend dashboard for errors
3. Check browser console for error messages
4. Verify email hasn't hit spam folder

### Supabase connection error?
1. Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
2. Verify project is not paused (free tier auto-pauses after inactivity)
3. Check Supabase dashboard → Logs for errors

### Build failing?
1. Ensure all `VITE_*` variables are set in Netlify
2. Check Netlify deploy logs
3. Verify environment variables don't have trailing spaces

---

## 📞 Need Help?

1. **Check your Gmail** (mariannav920@gmail.com) for:
   - Supabase welcome email
   - Resend verification email
   - Netlify notifications

2. **Check documentation:**
   - Supabase: https://supabase.com/docs
   - Resend: https://resend.com/docs
   - Netlify: https://docs.netlify.com

3. **Support contacts:**
   - Supabase: https://supabase.com/support
   - Resend: support@resend.com

---

## ✅ Setup Verification Checklist

Before going live, verify:

- [ ] Supabase project created and connected
- [ ] Resend account created and API key added
- [ ] Test email sent successfully
- [ ] E-book link works in email
- [ ] Lead captured in Supabase `email_leads` table
- [ ] Netlify deployment connected to GitHub
- [ ] All environment variables added to Netlify
- [ ] Domain configured (if using custom domain)
- [ ] SSL certificate active
- [ ] Emails not going to spam

---

**Ready to deploy?** See `DEPLOYMENT.md` for step-by-step deployment guide!

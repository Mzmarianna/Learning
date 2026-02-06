# 🚀 Deploy www.mzmarianna.com - QUICK START (30 Minutes)

**Your Info:**
- Domain: www.mzmarianna.com
- Email: mariannav920@gmail.com
- Supabase: wyclbrafklhvdyjpoeno.supabase.co

---

## ⚡ **3-STEP DEPLOYMENT**

### **STEP 1: Get Your API Keys (10 min)**

#### **Supabase Keys:**
```
1. Go to: https://supabase.com/dashboard/project/wyclbrafklhvdyjpoeno/settings/api
2. Copy:
   - Project URL: https://wyclbrafklhvdyjpoeno.supabase.co
   - anon public key: eyJ... (long string)
```

#### **Stripe Key (Test Mode):**
```
1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy: Publishable key (pk_test_...)
```

---

### **STEP 2: Deploy to Netlify (15 min)**

#### **Option A: Via CLI (Faster)**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build & Deploy
npm run build
netlify deploy --prod

# Follow prompts
```

#### **Option B: Via GitHub (Easier)**
```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
gh repo create mz-marianna-academy --private --source=. --push

# Then:
1. Go to: https://app.netlify.com
2. Click "Add new site" → "Import from Git"
3. Select your GitHub repo
4. Build command: npm run build
5. Publish directory: dist
6. Click "Deploy"
```

#### **Add Environment Variables:**
```
In Netlify Dashboard:
→ Site configuration
→ Environment variables
→ Add:

VITE_SUPABASE_URL = https://wyclbrafklhvdyjpoeno.supabase.co
VITE_SUPABASE_ANON_KEY = [your anon key]
VITE_STRIPE_PUBLISHABLE_KEY = [your stripe key]

→ Save
→ Trigger deploy (to rebuild with new vars)
```

---

### **STEP 3: Connect Domain (5 min)**

#### **A. Add Domain in Netlify:**
```
1. Netlify Dashboard → Domain management
2. Click "Add domain"
3. Enter: www.mzmarianna.com
4. Click "Verify"
```

#### **B. Update DNS (Your Domain Registrar):**

**Add these 2 records:**
```
A Record:
  Host: @
  Value: 75.2.60.5

CNAME Record:
  Host: www
  Value: [your-site].netlify.app
```

**Where?**
- Squarespace: https://account.squarespace.com/domains
- GoDaddy: https://dcc.godaddy.com
- Namecheap: https://ap.www.namecheap.com
- Cloudflare: https://dash.cloudflare.com

---

## ⏰ **WAIT FOR DNS (30-60 min)**

While DNS propagates:

```bash
# Check if DNS is ready
dig www.mzmarianna.com

# Or visit:
https://dnschecker.org
(Enter: www.mzmarianna.com)
```

**When ready:**
- ✅ Netlify auto-provisions SSL certificate
- ✅ Your site goes live at: https://www.mzmarianna.com

---

## ✅ **VERIFY IT WORKS**

```bash
# Test these URLs:
https://www.mzmarianna.com - Homepage
https://www.mzmarianna.com/free-guide - Lead magnet
https://www.mzmarianna.com/placement-quiz - Quiz
https://www.mzmarianna.com/pricing - Pricing
https://www.mzmarianna.com/login - Login (mariannav920@gmail.com)
```

---

## 🎯 **DONE!**

Your site is now live at: **https://www.mzmarianna.com**

**Next Steps:**
1. Test all features (see `/LAUNCH-CHECKLIST.md`)
2. Announce launch on social media
3. Share free guide link
4. Monitor Supabase for signups

---

## 📚 **DETAILED GUIDES**

Need more help?

- **Full Deployment:** `/DEPLOY-TO-NETLIFY-NOW.md`
- **DNS Setup:** `/DNS-SETUP-GUIDE.md`
- **Email Setup:** `/EMAIL-DOMAIN-SETUP.md`
- **Launch Checklist:** `/LAUNCH-CHECKLIST.md`
- **Payment Setup:** `/QUICK-START-PAYMENTS.md`

---

## 🆘 **TROUBLESHOOTING**

**Problem: Build failed**
```bash
# Check build logs in Netlify
# Common fix: Install dependencies
npm install
npm run build
```

**Problem: Environment variables not working**
```
1. Verify all vars have VITE_ prefix
2. Trigger new deploy in Netlify
3. Wait 2-3 minutes for build
```

**Problem: Domain not connecting**
```
1. Verify DNS records are correct
2. Wait 30-60 minutes for propagation
3. Check: https://dnschecker.org
```

---

## 🚀 **QUICK COMMANDS**

```bash
# Local development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Netlify
netlify deploy --prod

# Check Netlify status
netlify status

# View environment variables
netlify env:list

# Open Netlify dashboard
netlify open
```

---

**🎉 READY TO LAUNCH! GO LIVE AT WWW.MZMARIANNA.COM! 🚀**

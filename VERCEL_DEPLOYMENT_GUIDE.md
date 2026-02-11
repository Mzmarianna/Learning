# 🚀 Vercel Deployment Guide - Learning Kingdom

Complete guide to deploy your Learning Kingdom application to Vercel for production use.

---

## 📋 What You Have

Your repository is **ready for Vercel deployment** with:

✅ **Vercel Configuration** (`vercel.json`) - Pre-configured for Vite build
✅ **Build Process** - Tested and working (`npm run build`)
✅ **All Learning Files** - Including ClassWallet integration
✅ **Environment Setup** - `.env.example` with all required variables
✅ **Dependencies** - All packages installed and verified

---

## 🎯 Why Vercel?

- **Lightning Fast**: Global CDN for instant page loads worldwide
- **Free Tier**: Unlimited bandwidth for personal/hobby projects
- **Auto HTTPS**: Automatic SSL certificates
- **GitHub Integration**: Auto-deploy on every push
- **Zero Config**: Works out of the box with Vite
- **Best for**: www.mzmarianna.com production deployment

---

## ⚡ Quick Start (15 Minutes)

### Step 1: Create Vercel Account (3 minutes)

1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account
5. You're in! 🎉

### Step 2: Import Your Repository (5 minutes)

1. In Vercel dashboard, click **"Add New..."** → **"Project"**
2. Look for **"Mzmarianna/Learning"** in the list
3. Click **"Import"**
4. Vercel will auto-detect settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 3: Configure Environment Variables (5 minutes)

Click **"Environment Variables"** and add these:

```
VITE_SUPABASE_URL = your_supabase_project_url
VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
```

> 💡 Get these from your Supabase project: Settings → API

**Optional but recommended:**
```
VITE_RESEND_API_KEY = your_resend_api_key
VITE_STRIPE_PUBLIC_KEY = your_stripe_public_key
VITE_GOOGLE_ANALYTICS_ID = your_ga_tracking_id
```

### Step 4: Deploy! (2 minutes)

1. Click **"Deploy"**
2. Watch the build logs (should take ~30 seconds)
3. Wait for **"Your project is live!"** ✨
4. Click **"Visit"** to see your site

**Your site is now live at**: `https://your-project-name.vercel.app`

---

## 🌐 Custom Domain Setup (Optional)

### Add www.mzmarianna.com

1. In Vercel project, go to **Settings** → **Domains**
2. Enter: `mzmarianna.com`
3. Click **"Add"**
4. Vercel will show you DNS records to add

### In Your Domain Registrar (GoDaddy, Namecheap, etc.)

Add these DNS records:

**For root domain (mzmarianna.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Wait 24-48 hours** for DNS propagation, then:
- Vercel automatically provisions SSL certificate
- Your site is live at https://www.mzmarianna.com

---

## 🔄 Continuous Deployment

**Great news!** Every time you push to GitHub:

1. Vercel automatically detects the change
2. Runs `npm run build`
3. Deploys to production
4. **Your site updates in ~30 seconds!**

No manual deployment needed! Just:
```bash
git add .
git commit -m "Your changes"
git push
```

And Vercel handles the rest! 🚀

---

## ✅ Verification Checklist

After deployment, test these:

### Homepage
- [ ] Site loads at your Vercel URL
- [ ] Images display correctly
- [ ] Navigation works
- [ ] All buttons are clickable
- [ ] Mobile responsive (test on phone)

### ClassWallet Integration
- [ ] ClassWallet callback page accessible: `/classwallet/callback`
- [ ] Payment flow works (if configured)

### Forms & Email
- [ ] Contact forms submit successfully
- [ ] Email notifications arrive (check spam)
- [ ] Form validation works

### Performance
- [ ] Page loads in < 3 seconds
- [ ] No console errors (press F12)
- [ ] Images are optimized

---

## 🛠️ Vercel CLI (Optional but Powerful)

Install Vercel CLI for advanced features:

```bash
npm install -g vercel
```

### Useful Commands

**Deploy from command line:**
```bash
vercel
```

**Deploy to production:**
```bash
vercel --prod
```

**View deployment logs:**
```bash
vercel logs
```

**Link local project:**
```bash
vercel link
```

**Run locally with Vercel environment:**
```bash
vercel dev
```

---

## 🔧 Troubleshooting

### Build Failed?

**Check these:**
1. ✅ All environment variables set correctly?
2. ✅ No typos in variable names?
3. ✅ Build works locally? (`npm run build`)
4. ✅ All dependencies in `package.json`?

**Fix:**
- Check build logs in Vercel dashboard
- Verify environment variables: Settings → Environment Variables
- Redeploy: Deployments → Click "..." → Redeploy

### Site Not Loading?

**Check:**
1. Deployment status is "Ready"
2. Domain DNS is configured correctly
3. No browser cache issues (try incognito mode)

**Fix:**
- Clear browser cache (Ctrl+Shift+Delete)
- Wait for DNS propagation (up to 48 hours)
- Check Vercel status: https://vercel-status.com

### Environment Variables Not Working?

**Common issue:** Variables added after initial deployment

**Fix:**
1. Settings → Environment Variables → Add/Update
2. **Important:** Redeploy for changes to take effect
3. Deployments → Latest → "..." → Redeploy

### ClassWallet Integration Issues?

**Check:**
1. Callback URL configured in ClassWallet dashboard
2. Should be: `https://your-domain.com/classwallet/callback`
3. Environment variables for ClassWallet API keys set

---

## 📊 Monitoring & Analytics

### Vercel Analytics (Built-in)

1. Go to your project in Vercel
2. Click **"Analytics"** tab
3. See:
   - Real-time visitors
   - Page views
   - Performance scores
   - Top pages

### Performance Insights

1. Click **"Speed Insights"** tab
2. See:
   - Core Web Vitals
   - Lighthouse scores
   - Performance over time

---

## 💰 Pricing

### Hobby (Free Forever)
- ✅ Unlimited bandwidth
- ✅ 100 deployments/day
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Perfect for: www.mzmarianna.com

### Pro ($20/month)
- Everything in Hobby, plus:
- ✅ Advanced analytics
- ✅ Priority support
- ✅ Team collaboration
- ✅ Password protection
- ✅ 1,000 deployments/day

**Recommendation**: Start with Hobby, upgrade when you need team features.

---

## 🚀 Advanced Features

### Preview Deployments

Every pull request gets its own preview URL:
- Test changes before merging
- Share with team/clients
- Automatic cleanup after merge

### Environment-Specific Variables

Set different values for:
- **Production**: Live site variables
- **Preview**: Staging/test variables
- **Development**: Local development

### Custom Build Settings

Edit `vercel.json` to customize:
- Build command
- Output directory
- Redirects and rewrites
- Headers and CORS

---

## 📞 Support

### Documentation
- **Vercel Docs**: https://vercel.com/docs
- **Vite Docs**: https://vitejs.dev
- **Deployment Guides**: https://vercel.com/guides

### Community
- **Vercel Discord**: https://vercel.com/discord
- **GitHub Discussions**: https://github.com/vercel/vercel/discussions

### Direct Support
- **Vercel Support**: support@vercel.com
- **Status Page**: https://vercel-status.com

---

## 🎉 You're Live on Vercel!

**Your Learning Kingdom is now deployed!**

### Share Your Site:
- Homepage: `https://your-project.vercel.app` or `https://www.mzmarianna.com`
- Direct links work: `/classwallet/callback`, `/free-guide`, etc.

### Next Steps:
1. ✅ Test all features thoroughly
2. ✅ Set up custom domain (if not done)
3. ✅ Configure analytics
4. ✅ Share with your audience!
5. ✅ Start accepting students!

---

## 🔄 Switching from Netlify to Vercel

Already deployed to Netlify? Here's how to switch:

1. **Keep Netlify running** (no downtime)
2. Deploy to Vercel following steps above
3. Test Vercel deployment thoroughly
4. Update DNS to point to Vercel
5. **Wait for DNS propagation**
6. Verify everything works on Vercel
7. Archive or delete Netlify site

**Both can run simultaneously** - no need to rush the switch!

---

## 📝 Deployment Checklist

Before going live, ensure:

- [ ] All environment variables configured
- [ ] Build succeeds without errors
- [ ] All pages load correctly
- [ ] Forms submit successfully
- [ ] Payment integration works (if applicable)
- [ ] Mobile responsive on all devices
- [ ] SSL certificate active (automatic)
- [ ] Custom domain configured
- [ ] Analytics tracking enabled
- [ ] Error monitoring set up
- [ ] Backup/rollback plan ready

---

**Ready to launch?** Follow the Quick Start above and you'll be live in 15 minutes! 🚀

**Questions?** Check the Troubleshooting section or reach out to Vercel support.

**Your app is production-ready and waiting to serve students at www.mzmarianna.com!** ✨

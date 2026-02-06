# 🏢 Squarespace Domains → Netlify Setup for mzmarianna.com

**Your Domain:** mzmarianna.com (www.mzmarianna.com)  
**Your Email:** mariannav920@gmail.com  
**Squarespace Key:** be962d42-ca74-4f3c-9016-9e23f878a98c  
**Platform:** Squarespace Domains → Netlify

---

## 🎯 **WHAT YOU NEED TO DO**

Connect your Squarespace-registered domain (mzmarianna.com) to your Netlify site so visitors can access your site at **www.mzmarianna.com**.

**Time Required:** 5 minutes to configure + 30-60 minutes for DNS propagation

---

## 📋 **BEFORE YOU START**

### **1. Get Your Netlify Site URL**

First, you need to know your Netlify site name.

**Option A: If you've already deployed to Netlify:**
```
1. Go to: https://app.netlify.com
2. Login with your account
3. Click on your site
4. Look at the URL - it will be something like:
   → mz-marianna-academy.netlify.app
   → mzmarianna.netlify.app
   → random-name-12345.netlify.app

COPY THIS URL - you'll need it!
```

**Option B: If you haven't deployed yet:**
```bash
# Deploy first
npm run build
netlify deploy --prod

# Or via dashboard:
1. Push code to GitHub
2. Connect GitHub to Netlify
3. Deploy and get your site URL
```

---

## 🔐 **STEP 1: LOGIN TO SQUARESPACE DOMAINS**

### **Access Your Domain Settings:**

1. **Go to:** https://account.squarespace.com/domains

2. **Login with:**
   - Email: mariannav920@gmail.com
   - Password: (your Squarespace password)

3. **Find your domain:**
   - Look for **"mzmarianna.com"** in your domains list
   - Click on it to open domain settings

---

## 🌐 **STEP 2: CONFIGURE DNS RECORDS**

### **Navigate to DNS Settings:**

```
In Squarespace:
1. Click on "mzmarianna.com"
2. Click "DNS Settings" (or "Advanced DNS" or "DNS")
3. You'll see a list of DNS records
```

---

### **Option A: Squarespace Custom Records (Recommended)**

If Squarespace allows custom DNS records:

#### **Step 2A: Delete Conflicting Records**

Look for and **DELETE** these records if they exist:
- Any A record pointing to `@` or root domain
- Any CNAME record for `www`
- Any A record for `www`

**Why?** These conflict with Netlify's configuration.

#### **Step 2B: Add Netlify A Record**

Click **"Add Record"** or **"Add"**

```
Record Type: A
Host: @ (or leave blank for root)
Points to: 75.2.60.5
TTL: Automatic (or 3600)
```

Click **"Save"** or **"Add Record"**

#### **Step 2C: Add Netlify CNAME Record**

Click **"Add Record"** or **"Add"** again

```
Record Type: CNAME
Host: www
Points to: [your-netlify-site].netlify.app
TTL: Automatic (or 3600)

EXAMPLE:
If your Netlify site is "mz-marianna-academy.netlify.app"
Then Points to: mz-marianna-academy.netlify.app
```

Click **"Save"** or **"Add Record"**

---

### **Option B: Use Squarespace Built-In Integration**

Some Squarespace accounts have a "Connect to External Site" option:

```
1. In domain settings
2. Look for "Use domain with external site" or "Connect domain"
3. Select "Netlify" if available
4. Enter your Netlify site URL
5. Squarespace auto-configures DNS
```

**If you see this option, use it! It's easier.**

---

## 📸 **VISUAL GUIDE: SQUARESPACE INTERFACE**

### **What You'll See:**

**Squarespace Domain Dashboard:**
```
My Domains
├── mzmarianna.com
    ├── Overview
    ├── DNS Settings  ← CLICK HERE
    ├── Email
    └── Transfer
```

**DNS Settings Page:**
```
DNS Settings for mzmarianna.com

[Add Record]

Current Records:
┌─────────────────────────────────────────────┐
│ Type  │ Host │ Value              │ TTL     │
├───────┼──────┼────────────────────┼─────────┤
│ A     │ @    │ 75.2.60.5          │ 3600    │ ← ADD THIS
│ CNAME │ www  │ [your-site].netlify│ 3600    │ ← ADD THIS
└─────────────────────────────────────────────┘
```

---

## ✅ **STEP 3: ADD DOMAIN IN NETLIFY**

After configuring DNS in Squarespace, add the domain in Netlify:

### **Via Netlify Dashboard:**

1. **Go to:** https://app.netlify.com
2. **Select your site**
3. **Go to:** "Domain management" (in the left menu)
4. **Click:** "Add domain" or "Add custom domain"
5. **Enter:** `www.mzmarianna.com`
6. **Click:** "Verify"

Netlify will check if DNS is configured correctly.

### **Via Netlify CLI:**

```bash
netlify domains:add www.mzmarianna.com
```

---

## ⏰ **STEP 4: WAIT FOR DNS PROPAGATION**

After saving DNS records in Squarespace:

### **How Long?**
- **Minimum:** 15 minutes
- **Average:** 30-60 minutes  
- **Maximum:** 48 hours (rare with Squarespace)

### **Check Propagation Status:**

**Method 1: Command Line**
```bash
# Check if A record is live
dig mzmarianna.com

# Should eventually show:
# mzmarianna.com.  300  IN  A  75.2.60.5

# Check if CNAME is live
dig www.mzmarianna.com

# Should eventually show:
# www.mzmarianna.com.  300  IN  CNAME  [your-site].netlify.app
```

**Method 2: Online Checker**
```
1. Go to: https://dnschecker.org
2. Enter: www.mzmarianna.com
3. Select: A or CNAME
4. Click "Search"
5. Wait for green checkmarks globally
```

**Method 3: Try Visiting**
```
https://www.mzmarianna.com
(Might not work immediately - be patient!)
```

---

## 🔒 **STEP 5: SSL CERTIFICATE (AUTOMATIC)**

Once DNS propagates, Netlify **automatically** provisions an SSL certificate.

### **Timeline:**
```
DNS propagates → Wait 15-30 minutes → SSL provisions automatically
```

### **Check SSL Status:**

**In Netlify Dashboard:**
```
1. Go to your site
2. Click "Domain management"
3. Scroll to "HTTPS" section
4. Should say: "Certificate active" ✅
```

**If SSL is pending:**
- DNS must be fully propagated first
- Wait 30 minutes after DNS is live
- Netlify uses Let's Encrypt (free)
- No action needed - it's automatic!

### **Enable HTTPS Redirect:**

Once SSL is active:
```
1. In "HTTPS" section
2. Toggle "Force HTTPS" → ON
3. All http:// traffic redirects to https://
```

---

## 🎯 **VERIFY EVERYTHING WORKS**

### **Test Checklist:**

```bash
# 1. Root domain redirects to www
curl -I https://mzmarianna.com
# Should redirect to: https://www.mzmarianna.com

# 2. WWW version loads
curl -I https://www.mzmarianna.com
# Should return: 200 OK

# 3. HTTPS is enforced
curl -I http://www.mzmarianna.com
# Should redirect to: https://www.mzmarianna.com
```

### **Browser Tests:**

Visit these URLs - all should work:
- [ ] `https://www.mzmarianna.com` ✅ (loads site)
- [ ] `https://mzmarianna.com` ✅ (redirects to www)
- [ ] `http://www.mzmarianna.com` ✅ (redirects to https)
- [ ] `http://mzmarianna.com` ✅ (redirects to https://www)

### **Check for:**
- ✅ Green padlock (🔒) in browser address bar
- ✅ No "Not Secure" warnings
- ✅ All pages load correctly
- ✅ Images display
- ✅ No mixed content warnings (check F12 console)

---

## 🐛 **TROUBLESHOOTING**

### **Problem: "Domain not found" in Squarespace**

**Solution:**
```
1. Verify you own mzmarianna.com in Squarespace
2. Check domain hasn't expired
3. Confirm domain is in "Active" status
4. Make sure you're logged into correct Squarespace account
```

---

### **Problem: Can't find DNS settings in Squarespace**

**Solution:**
```
Squarespace interface varies by plan:

Try these locations:
→ Settings → Domains → [Your domain] → DNS Settings
→ Domains → Advanced → DNS
→ Domain Settings → Advanced DNS

If you can't find it:
→ Contact Squarespace support
→ Or use Squarespace's "Connect to External Site" feature
```

---

### **Problem: DNS not propagating after 2 hours**

**Solution:**
```
1. Verify records are saved in Squarespace
2. Check for typos:
   ✅ 75.2.60.5 (correct)
   ❌ 75.2.60.50 (wrong)
   ✅ www (correct)
   ❌ www. (wrong - no trailing dot)

3. Clear DNS cache:
   # Mac/Linux
   sudo dscacheutil -flushcache

   # Windows
   ipconfig /flushdns

4. Try different DNS checker:
   → Google DNS: 8.8.8.8
   → Cloudflare DNS: 1.1.1.1
```

---

### **Problem: "This site can't provide a secure connection"**

**Solution:**
```
Cause: SSL not provisioned yet

Fix:
1. Confirm DNS is fully propagated (all green on dnschecker.org)
2. Wait 30 minutes after DNS propagates
3. Check Netlify dashboard → HTTPS section
4. If still pending after 1 hour, click "Renew certificate"
```

---

### **Problem: Squarespace says "Domain is in use"**

**Solution:**
```
This means the domain is currently connected to a Squarespace site.

Fix:
1. In Squarespace → Settings → Domains
2. Find mzmarianna.com
3. Click "Disconnect" or "Remove from site"
4. Confirm disconnection
5. Then add DNS records for Netlify
```

---

## 📧 **BONUS: EMAIL WITH SQUARESPACE DOMAIN**

Since your domain is registered with Squarespace, you have email options:

### **Option 1: Keep Gmail (Current)**
- Continue using: mariannav920@gmail.com
- FREE, no changes needed ✅

### **Option 2: Google Workspace (Professional)**
- Get: marianna@mzmarianna.com
- Cost: $6/month
- Set up through Google Workspace
- Add MX records in Squarespace DNS

### **Option 3: Email Forwarding (Free)**
- Forward: support@mzmarianna.com → mariannav920@gmail.com
- Use ImprovMX or similar service
- Add MX records in Squarespace DNS

**See:** `/EMAIL-DOMAIN-SETUP.md` for detailed instructions

---

## 📋 **QUICK REFERENCE: DNS RECORDS**

### **What to Add in Squarespace:**

```
Record 1 (A Record):
──────────────────────
Type:      A
Host:      @ (or leave blank)
Points to: 75.2.60.5
TTL:       Automatic (or 3600)

Record 2 (CNAME Record):
──────────────────────
Type:      CNAME
Host:      www
Points to: [your-netlify-site].netlify.app
TTL:       Automatic (or 3600)
```

### **Example with Your Site:**

```
If your Netlify site is: mz-marianna-academy.netlify.app

Then CNAME should be:
──────────────────────
Type:      CNAME
Host:      www
Points to: mz-marianna-academy.netlify.app
TTL:       Automatic
```

---

## ✅ **FINAL CHECKLIST**

Before you start:
- [ ] Have Squarespace login credentials
- [ ] Know your Netlify site URL (xxxxx.netlify.app)
- [ ] Site is deployed on Netlify

Configuration:
- [ ] Logged into Squarespace Domains
- [ ] Found mzmarianna.com in domain list
- [ ] Accessed DNS Settings
- [ ] Deleted conflicting records
- [ ] Added A record (@ → 75.2.60.5)
- [ ] Added CNAME record (www → [site].netlify.app)
- [ ] Saved all changes

In Netlify:
- [ ] Added custom domain (www.mzmarianna.com)
- [ ] Netlify verified DNS configuration
- [ ] Waiting for DNS propagation

After DNS propagates:
- [ ] SSL certificate is active
- [ ] HTTPS redirect enabled
- [ ] All URLs work (www, non-www, http, https)
- [ ] Site loads correctly
- [ ] Green padlock shows in browser

---

## 🎉 **SUCCESS!**

Once DNS propagates and SSL is active:

**Your site will be live at:**
- ✅ https://www.mzmarianna.com (primary)
- ✅ https://mzmarianna.com (redirects to www)

**Share these links:**
- Homepage: https://www.mzmarianna.com
- Free Guide: https://www.mzmarianna.com/free-guide
- Placement Quiz: https://www.mzmarianna.com/placement-quiz
- Pricing: https://www.mzmarianna.com/pricing

---

## 📞 **NEED HELP?**

**Squarespace Support:**
- Live Chat: https://support.squarespace.com
- Phone: 1-646-580-3456
- Help Center: https://support.squarespace.com/hc/en-us/articles/205812378-Connecting-a-domain-to-your-site

**Netlify Support:**
- Docs: https://docs.netlify.com/domains-https/custom-domains/
- Community: https://answers.netlify.com
- Support: https://www.netlify.com/support/

**DNS Verification:**
- Check propagation: https://dnschecker.org
- DNS lookup: https://mxtoolbox.com/SuperTool.aspx

---

## 🚀 **NEXT STEPS**

1. **Configure DNS** (follow steps above) - 5 min
2. **Wait for propagation** - 30-60 min
3. **Verify SSL activates** - automatic
4. **Test your site** - 5 min
5. **Announce launch!** 🎉

---

**🎯 Ready to connect your Squarespace domain? Follow the steps above!**

**Your Squarespace Key:** `be962d42-ca74-4f3c-9016-9e23f878a98c`
(Note: This key might be for Squarespace site verification - you typically don't need this for DNS configuration. The DNS records above are what you need!)

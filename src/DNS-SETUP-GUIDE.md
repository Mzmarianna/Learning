# 🌐 DNS Setup Guide for www.mzmarianna.com

**Goal:** Connect your domain (mzmarianna.com) to your Netlify site  
**Time:** 5 minutes to configure, 15-60 minutes for DNS to propagate  
**Email:** mariannav920@gmail.com

---

## 📋 **BEFORE YOU START**

You need:
1. **Domain registrar login** (where you bought mzmarianna.com)
   - Common registrars: GoDaddy, Namecheap, Google Domains, Squarespace, Cloudflare
2. **Netlify site deployed** (complete previous step first)
3. **Netlify site name** (e.g., `mz-marianna-academy.netlify.app`)

---

## 🎯 **STEP 1: GET YOUR NETLIFY DETAILS**

### **Find Your Netlify Site Name:**

**Option A: Via Dashboard**
1. Go to: https://app.netlify.com
2. Click on your site
3. You'll see the site name at the top (e.g., `mz-marianna-academy.netlify.app`)
4. **Copy this URL** - you'll need it!

**Option B: Via CLI**
```bash
netlify sites:list
# Look for your site in the list
```

### **Netlify's IP Address:**
For A records, use: **`75.2.60.5`**

---

## 🌐 **STEP 2: CONFIGURE DNS (Choose Your Registrar)**

### **🔍 Don't Know Your Registrar?**

Check who owns your domain:
```bash
# In terminal:
whois mzmarianna.com | grep -i registrar

# Or visit:
# https://who.is/whois/mzmarianna.com
```

---

## 🏢 **REGISTRAR-SPECIFIC INSTRUCTIONS**

### **Option A: Squarespace Domains**

1. **Login:**
   - Go to: https://account.squarespace.com/domains
   - Login with: mariannav920@gmail.com

2. **Access DNS:**
   - Click on **"mzmarianna.com"**
   - Click **"DNS Settings"** or **"Advanced DNS"**

3. **Delete Existing Records:**
   - Look for existing A and CNAME records
   - Delete any A record pointing to `@`
   - Delete any CNAME record for `www`

4. **Add New Records:**

   **A Record (for root domain):**
   ```
   Type: A
   Host: @
   Value: 75.2.60.5
   TTL: Automatic (or 3600)
   ```

   **CNAME Record (for www):**
   ```
   Type: CNAME
   Host: www
   Value: [your-site].netlify.app
   TTL: Automatic (or 3600)
   
   Example Value: mz-marianna-academy.netlify.app
   ```

5. **Save Changes**

---

### **Option B: GoDaddy**

1. **Login:**
   - Go to: https://dcc.godaddy.com
   - Login with: mariannav920@gmail.com

2. **Access DNS:**
   - Find "mzmarianna.com" in your domains list
   - Click **"DNS"** or **"Manage DNS"**

3. **Delete Existing Records:**
   - Find A record with host `@` - click **Delete**
   - Find CNAME record with host `www` - click **Delete**

4. **Add New Records:**
   
   Click **"Add"** → Select **"A"**:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   TTL: 1 Hour (default)
   ```

   Click **"Add"** → Select **"CNAME"**:
   ```
   Type: CNAME
   Name: www
   Value: [your-site].netlify.app
   TTL: 1 Hour (default)
   ```

5. **Save All Records**

---

### **Option C: Namecheap**

1. **Login:**
   - Go to: https://ap.www.namecheap.com
   - Login with: mariannav920@gmail.com

2. **Access DNS:**
   - Click **"Domain List"**
   - Find "mzmarianna.com"
   - Click **"Manage"**
   - Go to **"Advanced DNS"** tab

3. **Delete Existing Records:**
   - Remove any A records pointing to `@`
   - Remove any CNAME records for `www`

4. **Add New Records:**

   Click **"Add New Record"** → Type: **A Record**:
   ```
   Type: A Record
   Host: @
   Value: 75.2.60.5
   TTL: Automatic
   ```

   Click **"Add New Record"** → Type: **CNAME Record**:
   ```
   Type: CNAME Record
   Host: www
   Value: [your-site].netlify.app
   TTL: Automatic
   ```

5. **Save All Changes** (green checkmark)

---

### **Option D: Google Domains**

1. **Login:**
   - Go to: https://domains.google.com
   - Login with: mariannav920@gmail.com

2. **Access DNS:**
   - Find "mzmarianna.com"
   - Click **"Manage"**
   - Go to **"DNS"** tab
   - Scroll to **"Custom records"**

3. **Add Records:**

   **A Record:**
   ```
   Host name: @
   Type: A
   TTL: 3600
   Data: 75.2.60.5
   ```

   **CNAME Record:**
   ```
   Host name: www
   Type: CNAME
   TTL: 3600
   Data: [your-site].netlify.app
   ```

4. **Save**

---

### **Option E: Cloudflare**

1. **Login:**
   - Go to: https://dash.cloudflare.com
   - Login with: mariannav920@gmail.com

2. **Access DNS:**
   - Click on **"mzmarianna.com"**
   - Go to **"DNS"** → **"Records"**

3. **Delete Old Records:**
   - Delete existing A record for `@`
   - Delete existing CNAME record for `www`

4. **Add New Records:**

   Click **"Add record"**:
   ```
   Type: A
   Name: @
   IPv4 address: 75.2.60.5
   Proxy status: Proxied (orange cloud) ✅
   TTL: Auto
   ```

   Click **"Add record"**:
   ```
   Type: CNAME
   Name: www
   Target: [your-site].netlify.app
   Proxy status: Proxied (orange cloud) ✅
   TTL: Auto
   ```

5. **Save**

**⚠️ Cloudflare Note:** 
- Keep "Proxied" (orange cloud) ON for DDoS protection
- SSL/TLS mode: Set to "Full" in SSL/TLS settings

---

### **Option F: Other Registrar (Generic Steps)**

Most registrars have similar interfaces:

1. **Login** to your domain registrar
2. **Find DNS settings** (usually called "DNS Management", "Name Servers", or "Advanced DNS")
3. **Add these two records:**

   ```
   A Record:
   - Host/Name: @ (or leave blank)
   - Value/Points to: 75.2.60.5
   - TTL: 3600 (or Automatic)
   
   CNAME Record:
   - Host/Name: www
   - Value/Points to: [your-site].netlify.app
   - TTL: 3600 (or Automatic)
   ```

4. **Save changes**

---

## 🎯 **STEP 3: ADD DOMAIN IN NETLIFY**

### **Via Netlify Dashboard:**

1. Go to: https://app.netlify.com
2. Click on your site
3. Go to **"Domain management"**
4. Click **"Add domain"** or **"Add custom domain"**
5. Enter: `www.mzmarianna.com`
6. Click **"Verify"**
7. Netlify will check your DNS records

### **Via Netlify CLI:**

```bash
netlify domains:add www.mzmarianna.com
```

---

## ⏰ **STEP 4: WAIT FOR DNS PROPAGATION**

### **How Long Does It Take?**
- **Minimum:** 15 minutes
- **Average:** 30-60 minutes
- **Maximum:** 48 hours (rare)

### **Check DNS Propagation:**

**Method 1: Command Line**
```bash
# Check A record
dig @8.8.8.8 mzmarianna.com

# Check CNAME record
dig @8.8.8.8 www.mzmarianna.com

# Simple check
nslookup www.mzmarianna.com
```

**Method 2: Online Tool**
- Visit: https://dnschecker.org
- Enter: `www.mzmarianna.com`
- Click "Search"
- Look for green checkmarks globally

**Method 3: Browser**
```bash
# Try visiting (might not work immediately)
https://www.mzmarianna.com
```

### **What to Look For:**

**A Record should show:**
```
mzmarianna.com.  300  IN  A  75.2.60.5
```

**CNAME Record should show:**
```
www.mzmarianna.com.  300  IN  CNAME  [your-site].netlify.app.
```

---

## 🔒 **STEP 5: SSL CERTIFICATE (Automatic)**

Netlify automatically provisions SSL certificate via Let's Encrypt.

### **Check SSL Status:**

1. Go to Netlify Dashboard → Your site
2. Click **"Domain management"**
3. Scroll to **"HTTPS"** section
4. Should say: **"Certificate active"** ✅

### **Timeline:**
- DNS must propagate first (Step 4)
- Then Netlify provisions SSL: **15-30 minutes**
- Total time: **30-90 minutes** from DNS setup

### **Force HTTPS Redirect:**

Once SSL is active:
1. In Netlify → **"Domain management"**
2. Find **"HTTPS"** section
3. Toggle **"Force HTTPS"** → ON ✅
4. All `http://` traffic redirects to `https://`

---

## ✅ **STEP 6: VERIFY EVERYTHING WORKS**

### **Test Checklist:**

```bash
# 1. Root domain redirects to www
curl -I https://mzmarianna.com
# Should show: Location: https://www.mzmarianna.com

# 2. WWW domain loads
curl -I https://www.mzmarianna.com
# Should show: 200 OK

# 3. HTTPS is enforced
curl -I http://www.mzmarianna.com
# Should redirect to: https://www.mzmarianna.com

# 4. Check SSL certificate
openssl s_client -connect www.mzmarianna.com:443 -servername www.mzmarianna.com
# Should show: Let's Encrypt certificate
```

### **Manual Browser Tests:**

Visit these URLs and verify they all work:
- [ ] `https://www.mzmarianna.com` ✅ (loads homepage)
- [ ] `https://mzmarianna.com` ✅ (redirects to www)
- [ ] `http://www.mzmarianna.com` ✅ (redirects to https)
- [ ] `https://www.mzmarianna.com/free-guide` ✅ (free guide page)
- [ ] `https://www.mzmarianna.com/placement-quiz` ✅ (quiz page)
- [ ] `https://www.mzmarianna.com/pricing` ✅ (pricing page)

**Check for:**
- ✅ Green padlock (🔒) in browser
- ✅ No mixed content warnings
- ✅ Fast page load times
- ✅ No 404 errors

---

## 🐛 **TROUBLESHOOTING**

### **Problem: "Domain not found" or "Site not found"**

**Cause:** DNS not propagated yet  
**Fix:** Wait 15-60 minutes, then check again

```bash
# Check if DNS is propagated
dig www.mzmarianna.com

# Should show your Netlify IP or CNAME
# If not showing yet, wait longer
```

---

### **Problem: "SSL certificate pending" in Netlify**

**Cause:** DNS must fully propagate before SSL provisions  
**Fix:** 
1. Verify DNS is fully propagated (all green on dnschecker.org)
2. Wait 15-30 more minutes
3. Netlify will auto-provision SSL (Let's Encrypt)

---

### **Problem: "Too many redirects" error**

**Cause:** Cloudflare SSL mode misconfigured  
**Fix:**
1. Cloudflare Dashboard → SSL/TLS
2. Change SSL mode to **"Full"**
3. Wait 5 minutes, try again

---

### **Problem: "ERR_NAME_NOT_RESOLVED"**

**Cause:** DNS records not set correctly  
**Fix:**
1. Check DNS records in your registrar
2. Verify:
   - A record: `@` → `75.2.60.5`
   - CNAME: `www` → `[your-site].netlify.app`
3. Save and wait 15 minutes

---

### **Problem: Works on www but not root domain**

**Cause:** A record not set correctly  
**Fix:**
1. Add A record: `@` → `75.2.60.5`
2. Wait 15 minutes for propagation

---

### **Problem: "This site can't provide a secure connection"**

**Cause:** SSL not provisioned yet  
**Fix:**
1. Wait for DNS propagation (check dnschecker.org)
2. Wait 30 minutes after DNS is fully propagated
3. Netlify will auto-provision SSL

---

## 📊 **DNS RECORD SUMMARY**

Here's what your DNS should look like when configured correctly:

```
mzmarianna.com
├── A Record (@)
│   └── Points to: 75.2.60.5
│
└── CNAME Record (www)
    └── Points to: [your-site].netlify.app

Optional (for email):
├── MX Records (if using custom email)
│   ├── 10 mx1.improvmx.com
│   └── 20 mx2.improvmx.com
│
└── TXT Record (SPF - for email)
    └── v=spf1 include:_spf.mx.cloudflare.net ~all
```

---

## 🔍 **CHECK YOUR CURRENT DNS**

Run this to see your current DNS configuration:

```bash
# Check all DNS records
dig ANY mzmarianna.com

# Check just A record (root domain)
dig mzmarianna.com

# Check CNAME record (www subdomain)
dig www.mzmarianna.com

# Check using Google's DNS
dig @8.8.8.8 www.mzmarianna.com

# Check using Cloudflare's DNS
dig @1.1.1.1 www.mzmarianna.com
```

---

## ✅ **FINAL CHECKLIST**

Once everything is working:

- [ ] DNS records added (A + CNAME) ✅
- [ ] DNS propagated globally ✅
- [ ] Domain added in Netlify ✅
- [ ] SSL certificate active ✅
- [ ] HTTPS redirect enabled ✅
- [ ] www.mzmarianna.com loads ✅
- [ ] mzmarianna.com redirects to www ✅
- [ ] All pages load correctly ✅
- [ ] No mixed content warnings ✅
- [ ] Green padlock in browser ✅

---

## 🎉 **SUCCESS!**

Your domain is now live at:
**https://www.mzmarianna.com**

### **Share These Links:**
- Homepage: https://www.mzmarianna.com
- Free Guide: https://www.mzmarianna.com/free-guide
- Placement Quiz: https://www.mzmarianna.com/placement-quiz
- Pricing: https://www.mzmarianna.com/pricing
- Admin Login: https://www.mzmarianna.com/login

---

## 📧 **NEXT: EMAIL SETUP (Optional)**

Now that your domain is connected, you can:
1. Keep using mariannav920@gmail.com (easiest)
2. Set up email forwarding (support@mzmarianna.com → Gmail)
3. Get Google Workspace (professional email)

See: **EMAIL-SETUP-GUIDE.md** for instructions.

---

## 📞 **SUPPORT**

**Netlify Support:**
- Docs: https://docs.netlify.com/domains-https/custom-domains/
- Community: https://answers.netlify.com

**DNS Help:**
- Check propagation: https://dnschecker.org
- DNS guide: https://www.cloudflare.com/learning/dns/what-is-dns/

**Still Stuck?**
- Check: `/DEPLOY-TO-NETLIFY-NOW.md` - Full deployment guide
- Netlify Status: https://www.netlifystatus.com

---

**🎯 Your domain is ready! Time to launch! 🚀**

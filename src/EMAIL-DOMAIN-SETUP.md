# 📧 Custom Email Setup for mzmarianna.com

**Current Email:** mariannav920@gmail.com  
**Domain:** www.mzmarianna.com  
**Goal:** Set up professional email addresses like support@mzmarianna.com

---

## 🎯 **CHOOSE YOUR EMAIL SOLUTION**

You have **3 options** with different complexity levels:

| Option | Email Address | Cost | Complexity | Recommended |
|--------|---------------|------|------------|-------------|
| **A** | mariannav920@gmail.com | FREE | None | ✅ **Start here** |
| **B** | support@mzmarianna.com → Gmail | FREE | Low | **Good for growth** |
| **C** | support@mzmarianna.com (full inbox) | $6/mo | Medium | **Professional** |

---

## ✅ **OPTION A: KEEP USING GMAIL (RECOMMENDED TO START)**

### **Why This Works:**
- ✅ FREE
- ✅ No setup needed
- ✅ Already working
- ✅ Gmail's powerful features
- ✅ Can upgrade later

### **What You Get:**
- Reliable email service
- Gmail spam protection
- Mobile app support
- All features you're used to

### **When to Upgrade:**
- When you want: support@mzmarianna.com
- When you need multiple team members
- When you want to look more professional

**👉 Skip to Option B or C when you're ready to scale.**

---

## 📬 **OPTION B: EMAIL FORWARDING (FREE - SIMPLE)**

**What it is:** support@mzmarianna.com → automatically forwards to → mariannav920@gmail.com

### **Pros:**
- ✅ Professional email address
- ✅ Keep using Gmail interface
- ✅ Multiple aliases (support@, hello@, info@)
- ✅ 100% FREE

### **Cons:**
- ❌ Can't send FROM custom domain (sends from Gmail)
- ❌ Recipients see "sent via gmail.com"

---

## 📬 **METHOD 1: ImprovMX (Easiest, FREE)**

### **Step 1: Sign Up**
1. Go to: https://improvmx.com
2. Click **"Sign up for free"**
3. Enter email: mariannav920@gmail.com
4. Verify email

### **Step 2: Add Your Domain**
1. Click **"Add domain"**
2. Enter: `mzmarianna.com`
3. Click **"Add domain"**

### **Step 3: Create Email Aliases**
1. Click **"Add alias"**
2. Create these forwards:

```
Alias: support@mzmarianna.com
Forward to: mariannav920@gmail.com

Alias: hello@mzmarianna.com
Forward to: mariannav920@gmail.com

Alias: info@mzmarianna.com
Forward to: mariannav920@gmail.com

Alias: marianna@mzmarianna.com
Forward to: mariannav920@gmail.com
```

### **Step 4: Add DNS Records**

Go to your domain registrar's DNS settings and add these **MX records**:

```
Priority 10: mx1.improvmx.com
Priority 20: mx2.improvmx.com
```

**Registrar-Specific Instructions:**

#### **Squarespace:**
```
1. Go to: https://account.squarespace.com/domains
2. Click on "mzmarianna.com"
3. Go to "DNS Settings"
4. Click "Add Record" → Type: MX

MX Record 1:
  Priority: 10
  Host: @
  Value: mx1.improvmx.com

MX Record 2:
  Priority: 20
  Host: @
  Value: mx2.improvmx.com

5. Save
```

#### **GoDaddy:**
```
1. Go to: https://dcc.godaddy.com
2. Click "DNS" for mzmarianna.com
3. Click "Add" → Type: MX

MX Record 1:
  Priority: 10
  Host: @
  Points to: mx1.improvmx.com
  TTL: 1 Hour

MX Record 2:
  Priority: 20
  Host: @
  Points to: mx2.improvmx.com
  TTL: 1 Hour
```

#### **Namecheap:**
```
1. Go to: Advanced DNS
2. Click "Add New Record" → Type: MX Record

MX Record 1:
  Priority: 10
  Host: @
  Value: mx1.improvmx.com

MX Record 2:
  Priority: 20
  Host: @
  Value: mx2.improvmx.com
```

#### **Cloudflare:**
```
1. Go to DNS → Records
2. Click "Add record" → Type: MX

MX Record 1:
  Name: @
  Mail server: mx1.improvmx.com
  Priority: 10

MX Record 2:
  Name: @
  Mail server: mx2.improvmx.com
  Priority: 20
```

### **Step 5: Add SPF Record (Improves Deliverability)**

Add this **TXT record** to prevent your emails from being marked as spam:

```
Type: TXT
Host: @
Value: v=spf1 include:spf.improvmx.com ~all
```

### **Step 6: Wait & Test**

**Wait:** 15-60 minutes for DNS propagation

**Test:**
1. Send email TO: support@mzmarianna.com
2. Check: mariannav920@gmail.com inbox
3. Should receive email ✅

---

## 📬 **METHOD 2: Cloudflare Email Routing (FREE)**

If you use Cloudflare for DNS:

### **Step 1: Enable Email Routing**
1. Go to: https://dash.cloudflare.com
2. Select: mzmarianna.com
3. Go to: **Email** → **Email Routing**
4. Click **"Enable Email Routing"**

### **Step 2: Configure Records**
Cloudflare automatically adds MX records - accept the defaults

### **Step 3: Add Destination**
1. Enter: mariannav920@gmail.com
2. Click **"Send verification email"**
3. Check Gmail and verify

### **Step 4: Create Aliases**
```
support@mzmarianna.com → mariannav920@gmail.com
hello@mzmarianna.com → mariannav920@gmail.com
info@mzmarianna.com → mariannav920@gmail.com
```

### **Step 5: Test**
Send email to support@mzmarianna.com, should arrive in Gmail!

---

## 💼 **OPTION C: GOOGLE WORKSPACE (PROFESSIONAL)**

**What it is:** Full Gmail experience with your custom domain

### **Pros:**
- ✅ Send AND receive from support@mzmarianna.com
- ✅ Full Gmail interface & features
- ✅ Professional appearance
- ✅ Google Drive, Calendar, Meet included
- ✅ Can add team members

### **Cons:**
- ❌ $6/month per user
- ❌ Requires payment setup

### **Best For:**
- When you're making revenue
- When you have a team
- When professional image is critical

---

## 💼 **GOOGLE WORKSPACE SETUP**

### **Step 1: Sign Up**
1. Go to: https://workspace.google.com
2. Click **"Get Started"**
3. Enter business name: **Mz. Marianna's Academy**
4. Select: **Just you** (or add team size)
5. Enter: mzmarianna.com (your existing domain)

### **Step 2: Create Email**
1. Choose email address: support@mzmarianna.com
2. Or: marianna@mzmarianna.com
3. Create password

### **Step 3: Verify Domain**
Google will ask you to verify ownership via:
- **Option A:** TXT record (recommended)
- **Option B:** HTML file upload
- **Option C:** Meta tag

**Add TXT Record:**
```
Type: TXT
Host: @
Value: google-site-verification=XXXXXXXXXXXXX
(Google provides the exact value)
```

### **Step 4: Update MX Records**

Replace any existing MX records with Google's:

```
Priority 1:  ASPMX.L.GOOGLE.COM
Priority 5:  ALT1.ASPMX.L.GOOGLE.COM
Priority 5:  ALT2.ASPMX.L.GOOGLE.COM
Priority 10: ALT3.ASPMX.L.GOOGLE.COM
Priority 10: ALT4.ASPMX.L.GOOGLE.COM
```

**Example (GoDaddy):**
```
MX Record 1:
  Priority: 1
  Host: @
  Points to: ASPMX.L.GOOGLE.COM

MX Record 2:
  Priority: 5
  Host: @
  Points to: ALT1.ASPMX.L.GOOGLE.COM

(Continue for all 5 records)
```

### **Step 5: Wait & Test**
- Wait 15-60 minutes for DNS propagation
- Login to: https://mail.google.com
- Send test email to: mariannav920@gmail.com

### **Step 6: Setup Gmail Sending**

**Forward mariannav920@gmail.com to your new address:**
1. Gmail Settings → Forwarding
2. Add: support@mzmarianna.com
3. Now all personal emails forward to work email

**OR keep both inboxes:**
- Personal: mariannav920@gmail.com
- Business: support@mzmarianna.com
- Check both separately

---

## 📋 **RECOMMENDED SETUP FOR YOUR BUSINESS**

### **Phase 1: Now (FREE)**
- Keep using: mariannav920@gmail.com
- Add to website footer: "Contact: mariannav920@gmail.com"
- **Cost:** $0/month

### **Phase 2: When You Get Traction (FREE)**
- Set up ImprovMX email forwarding
- Add: support@mzmarianna.com → mariannav920@gmail.com
- Update website footer: "Contact: support@mzmarianna.com"
- **Cost:** $0/month

### **Phase 3: When You're Making Money**
- Upgrade to Google Workspace
- Get: support@mzmarianna.com (full inbox)
- Can add team: tutor1@mzmarianna.com, tutor2@, etc.
- **Cost:** $6/month per user

---

## 🎯 **RECOMMENDED EMAIL ADDRESSES**

When you set up forwarding or Google Workspace:

```
Primary:
✅ support@mzmarianna.com (customer support)
✅ hello@mzmarianna.com (general inquiries)
✅ marianna@mzmarianna.com (personal/CEO)

Optional:
📧 info@mzmarianna.com (general info)
📧 billing@mzmarianna.com (payment questions)
📧 partnerships@mzmarianna.com (for schools/orgs)
📧 press@mzmarianna.com (media inquiries)
```

**All can forward to:** mariannav920@gmail.com

---

## ✅ **TESTING YOUR EMAIL SETUP**

### **Test Receiving:**
```
1. Send email TO: support@mzmarianna.com
2. Check: mariannav920@gmail.com inbox
3. Should arrive within seconds
```

### **Test Sending:**

**With Forwarding (ImprovMX/Cloudflare):**
- You send FROM: mariannav920@gmail.com
- Recipient sees "sent via gmail.com"
- Still professional ✅

**With Google Workspace:**
- You send FROM: support@mzmarianna.com
- Recipient sees your custom domain
- Fully professional ✅

### **Check Spam Score:**
https://www.mail-tester.com
1. Send email to address shown
2. Check spam score (should be 8+/10)

---

## 🔧 **TROUBLESHOOTING**

### **Problem: Email not arriving**
```
Wait time: 15-60 minutes after adding MX records
Check DNS: dig mx mzmarianna.com
Should show your MX records
```

### **Problem: Email in spam folder**
```
Add SPF record:
v=spf1 include:spf.improvmx.com ~all

Add DMARC record:
v=DMARC1; p=none; rua=mailto:mariannav920@gmail.com
```

### **Problem: Can't send from custom domain**
```
This is expected with forwarding (free options)
Upgrade to Google Workspace for full sending
OR use Gmail "Send As" feature (limited)
```

---

## 📊 **EMAIL SETUP SUMMARY**

### **Current Status:**
```
✅ You have: mariannav920@gmail.com
✅ Domain: www.mzmarianna.com (live)
🔲 Custom email: support@mzmarianna.com (not set up yet)
```

### **Next Steps:**
```
Option A (Recommended Now):
- Keep using mariannav920@gmail.com
- No changes needed
- Cost: $0

Option B (Recommended Later):
- Set up ImprovMX forwarding
- Get professional address
- Cost: $0

Option C (Recommended When Profitable):
- Google Workspace
- Full professional email
- Cost: $6/month
```

---

## 🎉 **RECOMMENDATION**

For your stage (just launching):

**Start with Option A** (mariannav920@gmail.com)
- ✅ Already works
- ✅ Free
- ✅ Focus on getting users first

**Upgrade to Option B** (ImprovMX forwarding) when:
- You have 50+ users
- You're getting daily support emails
- Professional appearance matters

**Upgrade to Option C** (Google Workspace) when:
- You're making $500+/month in revenue
- You have team members
- You need separate inboxes

---

## 📧 **YOUR EMAIL TIMELINE**

```
Month 0-3 (Launch):
mariannav920@gmail.com
→ Cost: $0

Month 3-6 (Growth):
support@mzmarianna.com → Gmail forwarding
→ Cost: $0

Month 6+ (Scale):
support@mzmarianna.com (Google Workspace)
→ Cost: $6/month
```

---

**🎯 You're ready! Start with Gmail, upgrade when you need it! 📧**

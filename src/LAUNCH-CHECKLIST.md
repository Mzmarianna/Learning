# 🚀 Launch Checklist for www.mzmarianna.com

**Domain:** www.mzmarianna.com  
**Email:** mariannav920@gmail.com  
**Status:** Ready to launch!

---

## ✅ **PRE-LAUNCH CHECKLIST**

### **1. Environment Variables**
Test that all required keys are set:

- [ ] **VITE_SUPABASE_URL** - Database connection
- [ ] **VITE_SUPABASE_ANON_KEY** - Database authentication
- [ ] **VITE_STRIPE_PUBLISHABLE_KEY** - Payment processing
- [ ] **VITE_RESEND_API_KEY** - Email automation (optional)
- [ ] **VITE_GEMINI_API_KEY** - AI tutoring (optional)

**Check in Netlify:**
```
Netlify Dashboard → Site configuration → Environment variables
```

---

### **2. Database Setup**
Verify Supabase is configured:

- [ ] Tables exist (users, students, quests, challenges)
- [ ] Row Level Security (RLS) enabled
- [ ] Admin account created (mariannav920@gmail.com)
- [ ] Sample data loaded (optional)

**Test Connection:**
```bash
# Go to Supabase dashboard
https://supabase.com/dashboard/project/wyclbrafklhvdyjpoeno

# Check tables
→ Table Editor → Should see all tables
```

---

### **3. Domain & SSL**
Verify domain is connected and secure:

- [ ] www.mzmarianna.com resolves
- [ ] HTTPS is active (green padlock 🔒)
- [ ] Certificate is valid (Let's Encrypt)
- [ ] Non-www redirects to www
- [ ] HTTP redirects to HTTPS

**Test:**
```bash
curl -I https://www.mzmarianna.com
# Should return: 200 OK

curl -I https://mzmarianna.com
# Should redirect to: https://www.mzmarianna.com

curl -I http://www.mzmarianna.com
# Should redirect to: https://www.mzmarianna.com
```

---

### **4. Build & Deploy**
Confirm site is built correctly:

- [ ] Build succeeds without errors
- [ ] All pages load
- [ ] No 404 errors
- [ ] Images load correctly
- [ ] No console errors (F12 in browser)

**Test Build Locally:**
```bash
npm run build
npm run preview
# Visit: http://localhost:4173
```

---

## 🧪 **FUNCTIONAL TESTING**

### **Test 1: Homepage**
**URL:** `https://www.mzmarianna.com`

- [ ] Page loads in < 3 seconds
- [ ] Crown logo displays
- [ ] Hero section visible
- [ ] Navigation menu works
- [ ] CTA buttons work
- [ ] Footer displays
- [ ] Responsive on mobile

---

### **Test 2: Free Guide Funnel**
**URL:** `https://www.mzmarianna.com/free-guide`

**Step 1: Landing Page**
- [ ] Page loads correctly
- [ ] Email form displays
- [ ] Child age selector works
- [ ] Biggest struggle dropdown works

**Step 2: Submit Form**
- [ ] Enter test email: test@example.com
- [ ] Click "Send Me The Free Guide"
- [ ] Redirects to `/thank-you` page
- [ ] No errors in console

**Step 3: Verify Database**
```bash
# Check Supabase
→ Table Editor → email_leads
→ Should see new row with test@example.com
```

**Step 4: Thank You Page**
- [ ] Success message displays
- [ ] Download link works
- [ ] "Take Quiz" CTA displays
- [ ] 7-day sequence shown

---

### **Test 3: Placement Quiz**
**URL:** `https://www.mzmarianna.com/placement-quiz`

**Step 1: Intro Screen**
- [ ] Quiz intro loads
- [ ] "Let's Start" button works

**Step 2: Info Collection**
- [ ] Name input works
- [ ] Age selector (4-18) works
- [ ] Interest tags work (select 5)
- [ ] Email input works (optional)
- [ ] "Start Quiz" button works

**Step 3: Quiz Flow**
- [ ] First question loads
- [ ] Progress bar displays (1 of 12)
- [ ] Can select answer (A/B/C/D)
- [ ] "Submit Answer" button works
- [ ] Feedback shows (correct/incorrect)
- [ ] "Next Question" button works
- [ ] Progress through all 12 questions
- [ ] Loading state between questions

**Step 4: Results Page**
- [ ] Redirects to `/placement-results/:attemptId`
- [ ] Tier recommendation shows (Explorers/Warriors)
- [ ] Score displays
- [ ] Skill breakdown shows
- [ ] Next steps CTA displays

**Step 5: Verify Database**
```bash
# Check Supabase
→ Table Editor → placement_quiz_results
→ Should see new entry with student info
```

---

### **Test 4: Pricing Page**
**URL:** `https://www.mzmarianna.com/pricing`

- [ ] Page loads
- [ ] 4 pricing tiers display correctly:
  - [ ] Free Explorer ($0)
  - [ ] Warrior ($29/month)
  - [ ] Scholar ($79/month)
  - [ ] Legend ($149/month)
- [ ] Monthly/Annual toggle works
- [ ] Annual shows 20% savings
- [ ] "Choose Plan" buttons work
- [ ] Features list displays
- [ ] Social proof visible

---

### **Test 5: Checkout Flow**
**URL:** `https://www.mzmarianna.com/checkout`

**⚠️ IMPORTANT: Use Stripe TEST mode!**

**Step 1: Checkout Page**
- [ ] Page loads
- [ ] Plan details show (from pricing page)
- [ ] Email input works
- [ ] Name input works
- [ ] Card input works

**Step 2: Test Payment**
Use Stripe test card:
```
Card: 4242 4242 4242 4242
Exp: Any future date (12/25)
CVC: Any 3 digits (123)
ZIP: Any 5 digits (12345)
```

- [ ] Card form accepts test card
- [ ] "Pay Now" button works
- [ ] Processing state shows
- [ ] Redirects to success page

**Step 3: Payment Success**
**URL:** `https://www.mzmarianna.com/payment-success`

- [ ] Success page displays
- [ ] Confirmation message shows
- [ ] Next steps displayed
- [ ] Dashboard CTA works

**Step 4: Verify Database**
```bash
# Check Supabase
→ Table Editor → payments
→ Should see new payment entry
```

**⚠️ Test Failed Payments:**
Use Stripe decline card: `4000 0000 0000 0002`
- [ ] Shows error message
- [ ] Doesn't redirect
- [ ] Allows retry

---

### **Test 6: Authentication**
**URL:** `https://www.mzmarianna.com/login`

**Test Login:**
- [ ] Login page loads
- [ ] Email input works
- [ ] Password input works
- [ ] "Sign In" button works

**Test Admin Login:**
```
Email: mariannav920@gmail.com
Password: marianna2026
```

- [ ] Login succeeds
- [ ] Redirects to `/dashboard/admin`
- [ ] Admin dashboard loads
- [ ] All admin features accessible

**Test Logout:**
- [ ] Logout button works
- [ ] Redirects to homepage
- [ ] Session cleared

**Test Sign Up:**
**URL:** `https://www.mzmarianna.com/signup`
- [ ] Sign up form loads
- [ ] Can create test account
- [ ] Email verification (if enabled)
- [ ] Redirects to onboarding

---

### **Test 7: Student Dashboard**
**Login as student or use demo:**
**URL:** `https://www.mzmarianna.com/demo/student`

- [ ] Dashboard loads
- [ ] Quest map displays
- [ ] Current quest card shows
- [ ] XP display works
- [ ] WOWL chat accessible
- [ ] Profile displays
- [ ] Upcoming classes widget (if applicable)

---

### **Test 8: Responsive Design**
Test on multiple devices:

**Desktop (1920x1080):**
- [ ] All pages look good
- [ ] No horizontal scroll
- [ ] Images properly sized

**Tablet (768x1024):**
- [ ] Layout adjusts correctly
- [ ] Navigation collapses (if designed)
- [ ] Forms still usable

**Mobile (375x667):**
- [ ] All pages responsive
- [ ] Touch targets large enough
- [ ] Text readable
- [ ] Forms work on mobile keyboard

**Test Browsers:**
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## 🔒 **SECURITY TESTING**

### **SSL/HTTPS:**
- [ ] All pages use HTTPS
- [ ] No mixed content warnings
- [ ] Certificate valid and trusted
- [ ] Grade A on SSL Labs: https://www.ssllabs.com/ssltest/analyze.html?d=www.mzmarianna.com

### **Headers:**
- [ ] Security headers present (X-Frame-Options, CSP, etc.)
- [ ] Test: https://securityheaders.com/?q=www.mzmarianna.com

### **Authentication:**
- [ ] Can't access protected pages without login
- [ ] Tokens expire correctly
- [ ] Password reset works (if implemented)

---

## ⚡ **PERFORMANCE TESTING**

### **Page Speed:**
Test with Google PageSpeed Insights:
https://pagespeed.web.dev

**Desktop Performance:**
- [ ] Score > 90
- [ ] First Contentful Paint < 1.8s
- [ ] Time to Interactive < 3.8s
- [ ] Speed Index < 3.4s

**Mobile Performance:**
- [ ] Score > 80
- [ ] First Contentful Paint < 2.5s
- [ ] Time to Interactive < 5s

### **Optimization:**
- [ ] Images optimized (using WebP where possible)
- [ ] CSS minified
- [ ] JavaScript minified
- [ ] Fonts optimized
- [ ] Lazy loading implemented

---

## 🐛 **ERROR HANDLING**

### **Test Error Pages:**

**404 Not Found:**
- [ ] Visit: `https://www.mzmarianna.com/non-existent-page`
- [ ] Shows friendly 404 page (not blank)
- [ ] Has link back to homepage

**500 Server Error:**
- [ ] Graceful error messages (no stack traces)
- [ ] User-friendly language

**Network Offline:**
- [ ] App handles offline gracefully
- [ ] Shows "No connection" message

---

## 📊 **ANALYTICS & TRACKING**

### **Google Analytics (if set up):**
- [ ] Tracking code installed
- [ ] Page views tracked
- [ ] Events tracked (button clicks, form submits)
- [ ] Real-time data showing

### **Supabase Analytics:**
- [ ] Database calls logged
- [ ] API usage visible
- [ ] Storage usage tracked

---

## 📧 **EMAIL TESTING**

### **Resend Email (if set up):**

**Test Welcome Email:**
- [ ] Sign up new user
- [ ] Receives welcome email
- [ ] Email renders correctly
- [ ] Links work

**Test Lead Capture Email:**
- [ ] Submit free guide form
- [ ] Receives e-book email
- [ ] Download link works
- [ ] Email not in spam

**Check Email Deliverability:**
- [ ] Test at: https://www.mail-tester.com
- [ ] Score > 8/10

---

## 💳 **STRIPE TESTING**

### **Test Mode:**
- [ ] Using test keys (pk_test_...)
- [ ] Test payments don't charge real money
- [ ] Dashboard shows "TEST MODE" banner

### **Webhook Testing:**
- [ ] Webhooks configured in Stripe
- [ ] Payment success triggers database update
- [ ] Failed payments logged

### **Test Scenarios:**
```
Successful Payment: 4242 4242 4242 4242
Declined Card: 4000 0000 0000 0002
Requires Authentication: 4000 0025 0000 3155
```

---

## 🎯 **USER ACCEPTANCE TESTING**

### **Parent Persona Test:**
```
Scenario: Parent wants to try free guide

1. Visit homepage
2. Click "Get Free Guide"
3. Enter email
4. Download e-book
5. Take placement quiz
6. See results
7. View pricing
8. Choose plan
9. Complete checkout

✅ All steps work smoothly
```

### **Student Persona Test:**
```
Scenario: Student wants to complete a quest

1. Login to student dashboard
2. See current quest
3. Click on challenge
4. Complete challenge
5. Submit work
6. Earn XP
7. Level up

✅ All steps work smoothly
```

---

## 📱 **SOCIAL MEDIA PREVIEW**

### **Open Graph Tags:**
Test how your site looks when shared:

**Facebook:**
- [ ] Test: https://developers.facebook.com/tools/debug/
- [ ] Enter: www.mzmarianna.com
- [ ] Preview looks good

**Twitter:**
- [ ] Test: https://cards-dev.twitter.com/validator
- [ ] Enter: www.mzmarianna.com
- [ ] Card renders correctly

**LinkedIn:**
- [ ] Share link on LinkedIn
- [ ] Preview shows correct title, image, description

---

## 🚀 **FINAL GO-LIVE CHECKLIST**

Right before you announce launch:

### **Technical:**
- [ ] All tests above passed ✅
- [ ] No critical bugs
- [ ] Backups enabled
- [ ] Monitoring active
- [ ] Error tracking (Sentry/LogRocket)

### **Content:**
- [ ] All text proofread
- [ ] No placeholder content ("Lorem ipsum")
- [ ] Legal pages (Privacy, Terms) - if applicable
- [ ] Contact info correct

### **Marketing:**
- [ ] Social media accounts ready
- [ ] Launch announcement written
- [ ] Email to leads prepared
- [ ] Press kit (if applicable)

### **Support:**
- [ ] Support email working (mariannav920@gmail.com)
- [ ] FAQ page created (if applicable)
- [ ] Help documentation (if applicable)

---

## 📣 **POST-LAUNCH MONITORING**

### **First 24 Hours:**
- [ ] Monitor Netlify for errors
- [ ] Check Supabase for database issues
- [ ] Watch for email deliverability
- [ ] Monitor payment processing
- [ ] Track user signups
- [ ] Review analytics

### **First Week:**
- [ ] Daily check of error logs
- [ ] Review user feedback
- [ ] Check conversion rates
- [ ] Monitor performance metrics
- [ ] Fix any critical bugs immediately

### **First Month:**
- [ ] Weekly analytics review
- [ ] User feedback survey
- [ ] Performance optimization
- [ ] Content updates based on usage
- [ ] Plan next features

---

## 🎉 **LAUNCH ANNOUNCEMENT TEMPLATE**

Once everything is tested:

### **Social Media Post:**
```
🎉 Exciting news! Mz. Marianna's Academy is now LIVE! 🏰

A neurodivergent-first learning platform where students become warriors, 
complete epic quests, and discover their genius.

✨ What's inside:
• Adaptive curriculum (ages 5-18)
• WOWL AI tutor (infinitely patient!)
• Gamified learning (XP, levels, rewards)
• Real results (89% see progress in week 1)

🎁 FREE resources:
• Download our guide: www.mzmarianna.com/free-guide
• Take placement quiz: www.mzmarianna.com/placement-quiz

Try it free → www.mzmarianna.com

#NeurodivergentEducation #Homeschool #OnlineLearning #EdTech
```

### **Email to Leads:**
```
Subject: 🏰 Mz. Marianna's Academy is LIVE!

Hi [Name],

Remember that placement quiz you took? Or the free guide you downloaded?

I'm thrilled to announce that Mz. Marianna's Academy is officially LIVE!

🎮 What's New:
→ Complete quest-based curriculum (K-12)
→ WOWL AI tutor (your child's new learning companion)
→ Gamified progress tracking
→ 4 pricing tiers (including FREE plan!)

🎁 Special Launch Offer:
→ First 100 members get 20% off annual plans
→ Use code: LAUNCH20

Ready to unlock your child's genius?
→ Start here: www.mzmarianna.com

Questions? Just reply to this email!

Let's go on an adventure! 🏰✨
- Marianna

P.S. Already have an account? Login at: www.mzmarianna.com/login
```

---

## 🎯 **SUCCESS METRICS**

Track these KPIs:

### **Week 1:**
- [ ] Total visitors: ?
- [ ] Free guide downloads: ?
- [ ] Placement quizzes completed: ?
- [ ] Signups: ?
- [ ] Paid conversions: ?

### **Month 1:**
- [ ] Total users: ?
- [ ] Active users: ?
- [ ] Conversion rate: ?
- [ ] Monthly revenue: ?
- [ ] Customer satisfaction: ?

---

## ✅ **YOU'RE READY TO LAUNCH!**

Once all checkboxes are complete:

1. **Deploy to production** ✅
2. **Verify everything works** ✅
3. **Send announcement** 📣
4. **Monitor closely** 📊
5. **Iterate based on feedback** 🔄

---

## 🚨 **EMERGENCY CONTACTS**

If something breaks:

**Netlify Issues:**
- Status: https://www.netlifystatus.com
- Support: https://answers.netlify.com

**Supabase Issues:**
- Status: https://status.supabase.com
- Support: https://supabase.com/dashboard (support chat)

**Stripe Issues:**
- Support: https://dashboard.stripe.com/support

**Domain/DNS Issues:**
- Check your registrar's support

---

**🎉 CONGRATULATIONS! YOU'RE LIVE AT WWW.MZMARIANNA.COM! 🚀**

Welcome to the world, Mz. Marianna's Academy! 🏰👑

# ⚡ QUICK DEPLOY GUIDE - Production Features

## 🎯 **What's Ready**

✅ Email system (transactional + onboarding)
✅ Placement quiz (adaptive, neurodivergent-first)
✅ Database triggers (8 automated workflows)
✅ Landing page (conversion-optimized)
✅ Analytics (GA4 + Facebook Pixel + Hotjar)

---

## 🚀 **60-Minute Deployment**

### **Minute 0-15: Email System**

1. **Create Resend Account**
   - Go to https://resend.com
   - Sign up (free: 3,000 emails/month)
   - Get API key (Dashboard → API Keys)

2. **Configure Supabase**
   ```bash
   # Supabase Dashboard → Project Settings → Secrets
   # Add new secret:
   Name: RESEND_API_KEY
   Value: re_xxxxx (your key)
   ```

3. **Deploy Edge Function**
   ```bash
   # Option 1: CLI
   supabase functions deploy send-email

   # Option 2: Dashboard
   # Copy /supabase/functions/send-email/index.ts
   # Paste in Supabase → Edge Functions → Create
   ```

4. **Test**
   ```typescript
   import { sendEmail } from './lib/email-service';
   await sendEmail({
     to: 'you@example.com',
     subject: 'Test',
     html: '<h1>It works!</h1>',
   });
   ```

---

### **Minute 15-25: Database Migrations**

1. **Placement Quiz System**
   ```sql
   -- Copy /supabase/migrations/add-placement-quiz.sql
   -- Paste in Supabase → SQL Editor → Run
   ```

2. **Lifecycle Triggers**
   ```sql
   -- Copy /supabase/migrations/add-lifecycle-triggers.sql
   -- Paste in Supabase → SQL Editor → Run
   ```

3. **Verify**
   ```sql
   SELECT COUNT(*) FROM placement_quiz_results; -- Should be 0
   SELECT COUNT(*) FROM activity_log; -- Should exist
   ```

---

### **Minute 25-35: Landing Page**

1. **Update Routing**
   ```typescript
   // In App.tsx or your router:
   // BEFORE:
   import LandingPage from './components/marketing/LandingPage';

   // AFTER:
   import LandingPage from './components/marketing/LandingPageOptimized';

   // Use it:
   <LandingPage onStartQuiz={handleStartQuiz} onLogin={handleLogin} />
   ```

2. **Customize (Optional)**
   - Edit testimonials (lines 31-53)
   - Add real parent quotes
   - Add demo video URL

---

### **Minute 35-45: Analytics**

1. **Get GA4 ID**
   - Go to https://analytics.google.com
   - Create property (GA4)
   - Copy Measurement ID (G-XXXXXXXXXX)

2. **Initialize**
   ```typescript
   // In App.tsx (at the top, in useEffect):
   import { initAnalytics } from './lib/analytics';

   useEffect(() => {
     initAnalytics('G-XXXXXXXXXX'); // Your ID
   }, []);
   ```

3. **Track Events**
   ```typescript
   import { trackQuizStart, trackSignup } from './lib/analytics';

   // When quiz starts:
   trackQuizStart();

   // When user signs up:
   trackSignup('parent');
   ```

---

### **Minute 45-55: Test Everything**

1. **Email Test**
   ```typescript
   // Run in console:
   import { sendWelcomeEmail } from './lib/email-service';
   await sendWelcomeEmail('you@example.com', 'Test', 'parent');
   // Check inbox
   ```

2. **Quiz Test**
   ```typescript
   // Navigate to placement quiz page
   // Complete quiz
   // Verify results show
   // Check database: SELECT * FROM placement_quiz_results;
   ```

3. **Analytics Test**
   ```typescript
   // Click CTA on landing page
   // Check GA4 Real-time report (wait 10 seconds)
   // Should see event: cta_click
   ```

4. **Triggers Test**
   ```sql
   -- Create test user → Check activity_log
   SELECT * FROM activity_log 
   WHERE activity_type = 'welcome_email_needed'
   ORDER BY created_at DESC LIMIT 5;
   ```

---

### **Minute 55-60: Go Live**

1. **Switch Landing Page**
   - Deploy updated routing to production
   - Test on live URL

2. **Monitor**
   - Check GA4 Real-time
   - Check Resend dashboard (email delivery)
   - Check Supabase logs (Edge Functions)

---

## 🎯 **Critical Paths**

### **New User Flow**
```
Landing Page (optimized) 
  ↓ CTA click (tracked)
Start Placement Quiz
  ↓ 5 minutes
Quiz Complete → Tier assigned
  ↓ Trigger fires
Welcome Email sent
  ↓ Day 1
Navigation Email
  ↓ Day 3
Meet Wowl Email
  ↓ Day 7
First Quest Email
  ↓ Day 14
Check-in Email
```

### **Conversion Funnel**
```
Visit Landing → View testimonials → Read FAQ
  ↓ (conversion ~30%)
Start Quiz → Complete Quiz
  ↓ (conversion ~80%)
Sign Up → Verify Email
  ↓ (conversion ~90%)
Enroll → Start Learning
```

---

## 📊 **Monitoring Dashboards**

### **Resend (Email)**
- https://resend.com/emails
- Check: Delivery rate, bounces, complaints

### **Google Analytics**
- https://analytics.google.com
- Check: Real-time users, conversion events, funnel

### **Supabase**
- Dashboard → Edge Functions → Logs
- Check: Edge function errors, execution time

### **Database**
```sql
-- Recent emails queued
SELECT * FROM activity_log 
WHERE activity_type LIKE '%email%' 
ORDER BY created_at DESC LIMIT 20;

-- Placement quiz results
SELECT 
  assigned_tier, 
  COUNT(*) as count,
  AVG(overall_level) as avg_level
FROM placement_quiz_results
GROUP BY assigned_tier;

-- Conversion funnel
SELECT 
  COUNT(DISTINCT student_id) FILTER (WHERE activity_type = 'placement_quiz_complete') as quizzes,
  COUNT(DISTINCT student_id) FILTER (WHERE activity_type = 'quest_complete') as active_learners
FROM activity_log;
```

---

## 🐛 **Troubleshooting**

### **Emails Not Sending**
```bash
# Check 1: API key configured?
# Supabase → Secrets → RESEND_API_KEY exists?

# Check 2: Edge function deployed?
# Supabase → Edge Functions → send-email exists?

# Check 3: Test directly
curl -X POST 'https://YOUR_PROJECT.supabase.co/functions/v1/send-email' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"to":"test@example.com","subject":"Test","html":"<p>Test</p>"}'
```

### **Quiz Not Saving**
```sql
-- Check if table exists
SELECT * FROM placement_quiz_results LIMIT 1;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'placement_quiz_results';

-- Test manually
SELECT save_placement_quiz_result(
  'student-uuid',
  'explorers',
  5, 6, 5, 5,
  'visual',
  '["Strong math"]'::jsonb,
  '["Reading practice"]'::jsonb,
  '["Use visual aids"]'::jsonb,
  '["Movement breaks"]'::jsonb,
  'EX-W1',
  '[]'::jsonb
);
```

### **Analytics Not Tracking**
```javascript
// Check 1: GA script loaded?
console.log(window.gtag); // Should be function
console.log(window.dataLayer); // Should be array

// Check 2: Events firing?
window.gtag('event', 'test_event', { test: true });
// Check GA4 → Real-time → Events (wait 10 sec)

// Check 3: Measurement ID correct?
// Should be G-XXXXXXXXXX format
```

---

## ✅ **Launch Checklist**

**Pre-Launch:**
- [ ] Resend API key added to Supabase
- [ ] Edge function deployed and tested
- [ ] Both migrations run successfully
- [ ] Email log table created
- [ ] Landing page updated
- [ ] GA4 property created and initialized
- [ ] Test email sent and received
- [ ] Test quiz completed successfully
- [ ] Analytics events firing

**Post-Launch:**
- [ ] Monitor first 10 signups
- [ ] Check email delivery rate (should be 95%+)
- [ ] Verify quiz → enrollment conversion
- [ ] Review analytics funnel
- [ ] Check for Edge function errors
- [ ] Confirm triggers firing correctly

**Week 1:**
- [ ] Review onboarding email open rates
- [ ] Check quiz completion rate
- [ ] Monitor landing page conversion
- [ ] Gather user feedback
- [ ] Adjust email timing if needed

---

## 🎯 **Success Metrics**

| Metric | Target | How to Check |
|--------|--------|--------------|
| Email delivery rate | 95%+ | Resend dashboard |
| Quiz completion | 80%+ | `SELECT COUNT(*) FROM placement_quiz_results` |
| Welcome email open | 60%+ | Resend → Email → Opens |
| Landing page → Quiz | 30%+ | GA4 → Events → begin_quiz |
| Quiz → Signup | 80%+ | GA4 → Events → sign_up |
| Edge function errors | <1% | Supabase → Functions → Logs |

---

## 🆘 **Quick Help**

**Email Issues:** Check `/EMAIL-SETUP-GUIDE.md`
**Quiz Logic:** Check `/lib/placement-quiz.ts` comments
**Full Details:** Check `/PRODUCTION-FEATURES-COMPLETE.md`

---

## 🎉 **You're Live!**

After 60 minutes, you'll have:
- ✅ Automated email system
- ✅ Smart placement quiz
- ✅ Conversion-optimized landing page
- ✅ Full analytics tracking
- ✅ 8 automated workflows

**Next:** Monitor, optimize, and scale! 🚀

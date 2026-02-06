# 📧 Email System Setup Guide

## ✅ **What's Been Created**

1. ✅ Supabase Edge Function: `/supabase/functions/send-email/index.ts`
2. ✅ Email Service Library: `/lib/email-service.ts`
3. ✅ 5 Email Templates (HTML):
   - Student welcome email
   - Parent welcome email
   - Tutor welcome email
   - Enrollment confirmation
   - Placement results
   - Weekly progress report

---

## 🚀 **Setup Instructions** (15 minutes)

### **Step 1: Create Resend Account** (5 minutes)

1. Go to https://resend.com
2. Sign up (free tier: 3,000 emails/month)
3. Verify your email
4. Go to "API Keys" in dashboard
5. Click "Create API Key"
6. Copy the key (starts with `re_`)

**Cost:** FREE (3,000 emails/month)

---

### **Step 2: Configure Supabase** (5 minutes)

**A. Add Resend API Key to Supabase:**

1. Open Supabase Dashboard
2. Go to Project Settings → Edge Functions
3. Click "Manage secrets"
4. Add new secret:
   - **Name:** `RESEND_API_KEY`
   - **Value:** Your Resend API key (re_xxxxx)

**B. Deploy Edge Function:**

```bash
# Install Supabase CLI if you haven't:
npm install -g supabase

# Login to Supabase:
supabase login

# Link your project:
supabase link --project-ref YOUR_PROJECT_REF

# Deploy the email function:
supabase functions deploy send-email
```

**Alternative (No CLI):**
- Copy contents of `/supabase/functions/send-email/index.ts`
- Go to Supabase Dashboard → Edge Functions
- Click "Create new function"
- Name it `send-email`
- Paste the code
- Deploy

---

### **Step 3: Create Email Log Table** (2 minutes)

Run this SQL in Supabase SQL Editor:

```sql
-- Email log for tracking (optional but recommended)
CREATE TABLE IF NOT EXISTS email_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email_id TEXT NOT NULL, -- Resend email ID
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'bounced')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_email_log_recipient ON email_log(recipient, sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_log_status ON email_log(status);

-- RLS Policy
ALTER TABLE email_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view email log" ON email_log
  FOR SELECT USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
```

---

### **Step 4: Verify Domain (Optional - For Production)** (10 minutes)

**Why?** Emails sent from your own domain (`@mzmarianna.com`) instead of generic Resend domain.

**Steps:**
1. In Resend dashboard → Domains → Add Domain
2. Enter your domain: `mzmarianna.com`
3. Add DNS records to your domain registrar:
   - SPF record
   - DKIM records
   - DMARC record
4. Verify in Resend (takes 5-10 mins)

**For Testing:** Skip this! Resend gives you `onboarding@resend.dev` for testing.

---

## 🧪 **Test Your Email System** (5 minutes)

### **Test 1: Send Test Email via Console**

```typescript
// In browser console or test file:
import { sendEmail } from './lib/email-service';

await sendEmail({
  to: 'your-email@example.com',
  subject: '🧪 Test Email from Mz. Marianna\'s Academy',
  html: '<h1>It works!</h1><p>Your email system is configured correctly.</p>',
});
```

Check your inbox! Should arrive in < 5 seconds.

### **Test 2: Send Welcome Email**

```typescript
import { sendWelcomeEmail } from './lib/email-service';

await sendWelcomeEmail(
  'parent@example.com',
  'Sarah',
  'parent'
);
```

### **Test 3: Check Email Log**

```sql
-- In Supabase SQL Editor:
SELECT * FROM email_log ORDER BY sent_at DESC LIMIT 10;
```

---

## 🔗 **Integration with Your App**

### **Usage Examples**

**1. Send Welcome Email on Signup:**

```typescript
// In your signup flow:
const { data: user } = await supabase.auth.signUp({
  email: 'parent@example.com',
  password: 'password',
});

// Send welcome email
await sendWelcomeEmail(user.email, user.display_name, 'parent');
```

**2. Send Enrollment Confirmation:**

```typescript
import { sendEnrollmentConfirmation } from './lib/email-service';

await sendEnrollmentConfirmation(
  parentEmail,
  studentName,
  'explorers',
  '2026-02-10'
);
```

**3. Send Weekly Progress Report:**

```typescript
import { sendWeeklyProgressReport } from './lib/email-service';

await sendWeeklyProgressReport(
  parentEmail,
  studentName,
  {
    xpEarned: 450,
    challengesCompleted: 12,
    badgesEarned: 3,
    timeSpent: 8,
    highlights: [
      'Mastered double-digit addition!',
      'Read 5 books this week',
      'Created amazing STEAM project',
    ],
  }
);
```

---

## 🤖 **Automated Emails with Database Triggers**

### **Create Trigger for Welcome Emails:**

```sql
-- Function to send welcome email when user created
CREATE OR REPLACE FUNCTION send_welcome_email_trigger()
RETURNS TRIGGER AS $$
DECLARE
  v_email TEXT;
  v_display_name TEXT;
  v_role user_role;
BEGIN
  -- Get user details
  SELECT email, display_name, role INTO v_email, v_display_name, v_role
  FROM profiles
  WHERE id = NEW.id;
  
  -- Call Edge Function to send email (async via pg_net extension)
  -- Note: This requires pg_net extension enabled
  PERFORM
    net.http_post(
      url := current_setting('app.supabase_url') || '/functions/v1/send-welcome-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key')
      ),
      body := jsonb_build_object(
        'email', v_email,
        'name', v_display_name,
        'role', v_role
      )
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_send_welcome_email ON profiles;
CREATE TRIGGER trigger_send_welcome_email
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION send_welcome_email_trigger();
```

**Note:** This requires `pg_net` extension. Simpler approach: call from your signup code!

---

## 📧 **Email Templates Included**

All templates are responsive, mobile-friendly HTML:

| Template | Function | Use Case |
|----------|----------|----------|
| Student Welcome | `sendWelcomeEmail(..., 'student')` | New student signup |
| Parent Welcome | `sendWelcomeEmail(..., 'parent')` | New parent signup |
| Tutor Welcome | `sendWelcomeEmail(..., 'tutor')` | New tutor signup |
| Enrollment | `sendEnrollmentConfirmation()` | After placement quiz |
| Placement Results | `sendPlacementResults()` | Quiz completion |
| Weekly Progress | `sendWeeklyProgressReport()` | Weekly (automated) |

---

## 🎨 **Customizing Email Templates**

Edit templates in `/lib/email-service.ts`:

```typescript
// Find the template function:
function getStudentWelcomeTemplate(userName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    ...
    </html>
  `;
}

// Customize HTML, styles, content
// All templates use inline CSS for email client compatibility
```

---

## 📊 **Monitoring & Debugging**

### **Check Email Delivery:**

**In Resend Dashboard:**
- View all sent emails
- See delivery status
- Track opens/clicks (if enabled)
- View bounce/spam reports

**In Your Database:**
```sql
-- Recent emails
SELECT * FROM email_log ORDER BY sent_at DESC LIMIT 20;

-- Failed emails
SELECT * FROM email_log WHERE status = 'failed';

-- Emails to specific user
SELECT * FROM email_log WHERE recipient = 'user@example.com';
```

---

## ⚠️ **Troubleshooting**

### **Email Not Sending:**

1. **Check Resend API Key:**
   ```sql
   -- In Supabase SQL Editor:
   SELECT current_setting('app.secrets.RESEND_API_KEY', true);
   -- Should show your key (not empty)
   ```

2. **Check Edge Function Logs:**
   - Supabase Dashboard → Edge Functions → send-email → Logs
   - Look for errors

3. **Test Resend API Directly:**
   ```bash
   curl -X POST 'https://api.resend.com/emails' \
     -H 'Authorization: Bearer re_YOUR_KEY' \
     -H 'Content-Type: application/json' \
     -d '{
       "from": "onboarding@resend.dev",
       "to": "your-email@example.com",
       "subject": "Test",
       "html": "<p>Test</p>"
     }'
   ```

### **Email Going to Spam:**

1. ✅ Verify your domain (see Step 4)
2. ✅ Add SPF, DKIM, DMARC records
3. ✅ Avoid spam trigger words
4. ✅ Include unsubscribe link (for marketing emails)
5. ✅ Warm up your domain (send gradually)

---

## 💰 **Pricing (Resend)**

| Tier | Emails/Month | Cost |
|------|--------------|------|
| **Free** | 3,000 | $0 |
| Pro | 50,000 | $20 |
| Scale | 100,000+ | Custom |

**For Your Academy:**
- ~50 students = ~200 emails/month (transactional)
- + Weekly reports = ~400 emails/month
- + Onboarding sequences = ~600 emails/month
- **Total:** ~1,200/month = FREE TIER ✅

---

## ✅ **Checklist**

- [ ] Resend account created
- [ ] API key added to Supabase secrets
- [ ] Edge function deployed
- [ ] Email log table created
- [ ] Test email sent successfully
- [ ] Welcome email tested
- [ ] Templates customized (optional)
- [ ] Domain verified (optional, for production)

---

## 🚀 **You're Ready!**

**Email system is fully functional!**

**Next:** Connect to your signup flow and database triggers.

**See:** `/PRODUCTION-FEATURES-AUDIT.md` for next steps.

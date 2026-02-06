# 🤖 Automation Guide - Mz. Marianna's Academy

Complete guide to automated systems, cron jobs, and monitoring for your LMS.

---

## 📋 Table of Contents

1. [Automated Systems Overview](#automated-systems-overview)
2. [Cron Jobs Configuration](#cron-jobs-configuration)
3. [Database Automation](#database-automation)
4. [Monitoring & Alerts](#monitoring--alerts)
5. [Automated User Management](#automated-user-management)
6. [Email Automation](#email-automation)
7. [Maintenance Tasks](#maintenance-tasks)

---

## 🎯 Automated Systems Overview

Your LMS includes the following automated systems:

### ✅ Currently Active (Once Deployed)

| System | Frequency | Purpose |
|--------|-----------|---------|
| Health Checks | Every 15 min | Monitor system health |
| Subscription Checks | Daily 2 AM | Verify active subscriptions |
| Session Cleanup | Daily 3 AM | Remove expired data |
| Weekly Reports | Monday 9 AM | Send parent reports |
| XP Calculation | On event | Auto-calculate student XP |
| Quest Progression | On completion | Auto-unlock next quests |

### ⏳ Ready to Enable

| System | Purpose | Requires |
|--------|---------|----------|
| Email Notifications | Welcome emails, reports | Resend API key |
| Wowl AI Responses | AI tutor interactions | OpenAI API key |
| Shopify Integration | Payment processing | Shopify credentials |

---

## ⏰ Cron Jobs Configuration

All cron jobs are configured in `/vercel.json`:

### 1. Health Check (Every 15 minutes)
```json
{
  "path": "/api/health-check",
  "schedule": "*/15 * * * *"
}
```

**What it does:**
- ✅ Checks API responsiveness
- ✅ Verifies database connection
- ✅ Confirms admin user exists
- ✅ Validates critical tables
- ✅ Monitors environment variables

**Endpoints:**
- `GET /api/health-check` - Run manual health check
- Returns: `{ status, timestamp, checks, responseTime }`

**Monitoring:**
- Status codes: `200` (healthy), `200` (degraded), `503` (unhealthy)
- Integrate with UptimeRobot, Pingdom, or similar services

---

### 2. Subscription Check (Daily at 2 AM)
```json
{
  "path": "/api/shopify-subscription-check",
  "schedule": "0 2 * * *"
}
```

**What it does:**
- ✅ Queries Shopify for active subscriptions
- ✅ Updates user subscription status in database
- ✅ Sends expiration warnings
- ✅ Disables access for expired accounts

**Configuration:**
```bash
# Required environment variables:
SHOPIFY_STORE_URL=your-store.myshopify.com
SHOPIFY_ADMIN_API_TOKEN=shpat_xxxxxxxxxxxxx
```

---

### 3. Cleanup Expired Sessions (Daily at 3 AM)
```json
{
  "path": "/api/cleanup-expired-sessions",
  "schedule": "0 3 * * *"
}
```

**What it does:**
- ✅ Removes old placement quiz attempts (>90 days, incomplete)
- ✅ Cleans up temporary data
- ✅ Archives old submissions
- ✅ Frees up database space

**Benefits:**
- Keeps database lean and performant
- Improves query speeds
- Reduces storage costs

---

### 4. Weekly Reports (Monday at 9 AM)
```json
{
  "path": "/api/send-weekly-reports",
  "schedule": "0 9 * * 1"
}
```

**What it does:**
- ✅ Calculates weekly student progress
- ✅ Generates XP, challenges, badge stats
- ✅ Stores historical data
- ✅ Sends parent emails (if configured)

**Metrics Tracked:**
- XP earned this week
- Challenges completed
- Badges earned
- Current level
- Total XP

---

## 🗄️ Database Automation

### Automated Database Functions

Your database includes several automated functions:

#### 1. XP Auto-Calculation
**Trigger:** After insert on `xp_events`
**Function:** `auto_update_student_xp()`

```sql
-- Automatically updates student_profiles.xp_total
-- when new XP events are created
```

**Benefits:**
- No manual XP calculation needed
- Real-time XP updates
- Guaranteed consistency

---

#### 2. Quest Auto-Progression
**Trigger:** After update on `quest_instances`
**Function:** `auto_unlock_next_quest()`

```sql
-- Unlocks the next quest when current quest is completed
-- Based on tier and difficulty progression
```

**Benefits:**
- Students always have new content
- No manual quest assignment needed
- Smooth learning progression

---

#### 3. Badge Auto-Award
**Trigger:** After insert/update on various tables
**Function:** `check_badge_criteria()`

```sql
-- Awards badges when criteria are met
-- Examples: "First Quest", "10 Challenges", "Level 5"
```

**Benefits:**
- Instant gratification
- Automated rewards
- Engagement boost

---

#### 4. Weekly Report Generator
**Function:** `generate_weekly_report(student_id UUID)`

```sql
-- Call manually or from cron job
SELECT * FROM generate_weekly_report('student-uuid-here');
```

**Returns:**
- Weekly XP earned
- Challenges completed
- Time spent learning
- Badges earned

---

## 📊 Monitoring & Alerts

### Health Check Monitoring

**Setup with UptimeRobot (Free):**

1. Create account at https://uptimerobot.com
2. Add new monitor:
   - **Monitor Type:** HTTP(s)
   - **URL:** `https://your-app.vercel.app/api/health-check`
   - **Monitoring Interval:** 5 minutes
   - **Alert Contacts:** Your email/SMS

3. Configure alerts:
   - Down alerts: Email + SMS
   - Up alerts: Email only
   - Threshold: Alert after 2 failed checks

**What you'll monitor:**
- ✅ API uptime
- ✅ Database connectivity
- ✅ Response times
- ✅ System health

---

### Database Performance Monitoring

**Supabase Dashboard:**
1. Go to: https://supabase.com/dashboard
2. Click: Database → Performance
3. Monitor:
   - Query performance
   - Connection pool usage
   - Table sizes
   - Slow queries

**Set up alerts:**
- Database size > 80% of plan limit
- Connection pool > 80% utilization
- Slow queries > 1 second

---

### Vercel Deployment Monitoring

**Vercel Analytics (Built-in):**
1. Go to: Vercel Dashboard → Your Project → Analytics
2. Monitor:
   - Page load times
   - Core Web Vitals
   - Traffic patterns
   - Error rates

**Set up alerts:**
- Error rate > 1%
- Build failures
- Deployment issues

---

## 👥 Automated User Management

### Admin User Creation (One-Time Setup)

**Automated Script:**
```bash
# Set environment variables
export SUPABASE_URL=https://your-project.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
export ADMIN_EMAIL=mariannav920@gmail.com
export ADMIN_PASSWORD=marianna2026

# Run script
node scripts/create-admin-user.js
```

**SQL Script (Alternative):**
```sql
-- Run in Supabase SQL Editor
-- See: /supabase/setup-admin-user.sql
```

---

### Auto Student Account Creation (Shopify Purchase)

**Webhook Flow:**
1. Customer purchases subscription on Shopify
2. Shopify sends webhook to `/api/shopify-webhook`
3. Script automatically creates:
   - Auth user
   - Profile record
   - Student profile
   - Welcome email queued

**Configuration:**
```bash
# In Shopify Admin → Settings → Notifications → Webhooks
Webhook URL: https://your-app.vercel.app/api/shopify-webhook
Event: orders/create
Format: JSON
```

---

## 📧 Email Automation

### Email Service Setup (Optional)

**Using Resend (Recommended):**

1. Create account at https://resend.com
2. Get API key
3. Add to Vercel environment variables:
   ```bash
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```

---

### Automated Emails

Once configured, these emails send automatically:

#### 1. Welcome Email
**Trigger:** New user signs up
**Template:** `/lib/email/templates/welcome.ts`
**Contains:**
- Welcome message
- Login instructions
- Placement quiz link
- Getting started guide

---

#### 2. Weekly Progress Report
**Trigger:** Every Monday (cron job)
**Template:** `/lib/email/templates/weekly-report.ts`
**Contains:**
- XP earned this week
- Challenges completed
- Badges earned
- Upcoming lessons
- Parent insights

---

#### 3. Quest Completion
**Trigger:** Student completes a quest
**Template:** `/lib/email/templates/quest-complete.ts`
**Contains:**
- Celebration message
- XP earned
- Badges unlocked
- Next quest preview

---

#### 4. Subscription Expiration Warning
**Trigger:** 7 days before expiration
**Template:** `/lib/email/templates/expiration-warning.ts`
**Contains:**
- Expiration date
- Renewal link
- Payment instructions

---

## 🔧 Maintenance Tasks

### Daily Automated Tasks

| Time | Task | Purpose |
|------|------|---------|
| 2:00 AM | Subscription check | Update access rights |
| 3:00 AM | Database cleanup | Remove old data |
| 3:30 AM | Database backup | Supabase handles this |

---

### Weekly Automated Tasks

| Day | Time | Task | Purpose |
|-----|------|------|---------|
| Monday | 9:00 AM | Generate reports | Parent insights |
| Sunday | 11:59 PM | Archive week data | Historical records |

---

### Monthly Automated Tasks (Future)

| Task | Purpose | Status |
|------|---------|--------|
| Performance audit | Identify slow queries | ⏸️ Not implemented |
| Storage cleanup | Remove unused files | ⏸️ Not implemented |
| Security scan | Check vulnerabilities | ⏸️ Not implemented |
| Cost optimization | Review usage patterns | ⏸️ Not implemented |

---

## 🚀 Enabling Automation in Production

### Step 1: Deploy to Vercel

```bash
vercel --prod
```

Cron jobs are automatically enabled on production deployments.

---

### Step 2: Set Environment Variables

**Required for automation:**
```bash
# Database (Required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Cron job protection (Recommended)
CRON_API_KEY=your-random-secret-key

# Email (Optional)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Shopify (Optional)
SHOPIFY_STORE_URL=your-store.myshopify.com
SHOPIFY_ADMIN_API_TOKEN=shpat_xxxxxxxxxxxxx
SHOPIFY_WEBHOOK_SECRET=xxxxxxxxxxxxx

# OpenAI (Optional)
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
```

---

### Step 3: Test Cron Jobs

**Manual trigger (for testing):**
```bash
# Health check
curl https://your-app.vercel.app/api/health-check

# Subscription check (requires CRON_API_KEY)
curl -H "Authorization: Bearer YOUR_CRON_API_KEY" \
  https://your-app.vercel.app/api/shopify-subscription-check

# Cleanup (requires CRON_API_KEY)
curl -H "Authorization: Bearer YOUR_CRON_API_KEY" \
  https://your-app.vercel.app/api/cleanup-expired-sessions

# Weekly reports (requires CRON_API_KEY)
curl -H "Authorization: Bearer YOUR_CRON_API_KEY" \
  https://your-app.vercel.app/api/send-weekly-reports
```

---

### Step 4: Monitor Logs

**Vercel Dashboard:**
1. Go to: Your Project → Deployments → View Function Logs
2. Filter by: `/api/health-check`, `/api/shopify-subscription-check`, etc.
3. Check for errors

**Supabase Logs:**
1. Go to: Supabase Dashboard → Logs
2. Check: Database logs, Auth logs
3. Look for errors or slow queries

---

## 📈 Optimization Tips

### Database Optimization

**Indexes (Already created in schema):**
```sql
-- Student lookups
CREATE INDEX idx_students_user_id ON student_profiles(user_id);
CREATE INDEX idx_students_tier ON student_profiles(tier);

-- XP events
CREATE INDEX idx_xp_events_student ON xp_events(student_id, created_at);

-- Quest instances
CREATE INDEX idx_quest_instances_student ON quest_instances(student_id, status);
```

---

### Caching Strategy

**Browser caching:**
- Static assets: 1 year
- API responses: No cache (real-time data)
- Images: CDN cached automatically

**Database caching:**
- Supabase handles query caching automatically
- Enable PostgREST caching for read-heavy tables

---

### Performance Monitoring

**Track these metrics:**
- Average response time per endpoint
- Database query execution time
- Storage usage growth rate
- Active user count

**Set alerts for:**
- Response time > 2 seconds
- Database size > 80% of limit
- Error rate > 1%
- Failed cron jobs

---

## 🎉 Benefits of Automation

✅ **Reduces Manual Work:** No need to manually check subscriptions, send reports, or clean data

✅ **Improves Reliability:** Automated tasks run consistently at scheduled times

✅ **Scales Effortlessly:** Handles 10 students or 10,000 students the same way

✅ **Better UX:** Students get instant rewards, parents get timely updates

✅ **Cost Efficient:** Free tiers on Vercel and Supabase cover small deployments

✅ **Peace of Mind:** Health checks alert you before problems become critical

---

## 🆘 Troubleshooting

### Cron Job Not Running

**Check Vercel logs:**
```bash
vercel logs --follow
```

**Verify cron schedule syntax:**
- Use https://crontab.guru to validate schedules
- Remember: Vercel uses UTC timezone

---

### Health Check Failing

**Common causes:**
1. Supabase credentials not set
2. Database paused (free tier inactivity)
3. RLS policies blocking queries

**Fix:**
1. Check environment variables
2. Wake up database in Supabase dashboard
3. Verify service role key has correct permissions

---

### Emails Not Sending

**Check:**
1. RESEND_API_KEY is set
2. Email service is configured in code
3. Logs for error messages

---

## 📚 Additional Resources

- **Vercel Cron Jobs:** https://vercel.com/docs/cron-jobs
- **Supabase Functions:** https://supabase.com/docs/guides/database/functions
- **Resend Emails:** https://resend.com/docs
- **UptimeRobot:** https://uptimerobot.com/docs

---

## ✅ Automation Checklist

Before going live, ensure:

- [x] Admin user creation script ready
- [x] Health check endpoint working
- [x] Cron jobs configured in vercel.json
- [x] Environment variables set in Vercel
- [x] Database triggers installed
- [x] Monitoring service configured
- [ ] Test cron jobs manually
- [ ] Set up email alerts
- [ ] Monitor logs for first week
- [ ] Document any custom automations

---

**Your LMS is now fully automated and ready to scale!** 🚀✨

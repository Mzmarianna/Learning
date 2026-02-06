# 🛍️ Shopify + Vercel Integration Setup Guide

## Architecture Overview

```
┌─────────────────────────────────────────┐
│          SHOPIFY STORE                  │
│   (yourstore.myshopify.com)            │
│                                         │
│   • Product catalog                     │
│   • Payment processing                  │
│   • Customer management                 │
│   • Subscription billing                │
│                                         │
│   When customer purchases:              │
│   └─> Webhook to Vercel ───────┐       │
└─────────────────────────────────│───────┘
                                  │
                                  ▼
┌─────────────────────────────────────────┐
│         VERCEL SERVERLESS API           │
│   (academy.yourdomain.com/api)         │
│                                         │
│   /api/shopify-webhook                  │
│   • Receives purchase notification      │
│   • Creates user account in Supabase    │
│   • Sends welcome email                 │
│   • Assigns first quest                 │
│                                         │
│   /api/shopify-subscription-check       │
│   • Checks subscription status          │
│   • Locks access if expired             │
│   • Runs daily via cron                 │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│      YOUR LMS (REACT APP)               │
│   (academy.yourdomain.com)             │
│                                         │
│   • Student dashboard                   │
│   • Quest system                        │
│   • Parent portal                       │
│   • Roblox challenges                   │
│   • Protected by SubscriptionGuard      │
└─────────────────────────────────────────┘
```

---

## Part 1: Shopify Store Setup

### **Step 1: Create Shopify Store**

1. Go to [shopify.com](https://shopify.com)
2. Start free trial
3. Choose a store name (e.g., `mz-marianna-academy`)
4. Your store URL: `mz-marianna-academy.myshopify.com`

### **Step 2: Create Subscription Products**

Create 3 products in Shopify:

#### **Product 1: Explorer Plan**
- **Title:** "Explorer Plan - Monthly Subscription"
- **Price:** $29.00/month
- **SKU:** `explorer-monthly`
- **Description:**
  ```
  Perfect for one student!
  • Full access to all quests
  • Roblox educational challenges
  • Parent dashboard
  • Weekly progress reports
  • Unlimited learning time
  ```

#### **Product 2: Family Plan**
- **Title:** "Family Plan - Monthly Subscription"  
- **Price:** $49.00/month
- **SKU:** `family-monthly`
- **Tag:** `most-popular`
- **Description:**
  ```
  Best for families with 2-3 students!
  • Up to 3 student accounts
  • Everything in Explorer Plan
  • Multi-student dashboard
  • Sibling progress comparison
  • Priority support
  ```

#### **Product 3: Annual Plan**
- **Title:** "Annual Plan - Yearly Subscription"
- **Price:** $199.00/year
- **Compare at price:** $348 (show savings)
- **SKU:** `explorer-annual`
- **Description:**
  ```
  Save $149 per year! 
  • 1 student account
  • All Explorer Plan features
  • Lock in current price
  • VIP support
  • Best value (43% off)
  ```

### **Step 3: Install Subscription App**

Shopify doesn't handle recurring billing natively. Install an app:

**Option A: Recharge (Recommended)**
1. Go to Shopify App Store
2. Search "Recharge Subscriptions"
3. Install & configure
4. Set up recurring billing for all 3 products

**Option B: Shopify Subscriptions (Free, but limited)**
1. Built into Shopify
2. Go to Apps > Subscriptions
3. Create subscription plans

### **Step 4: Set Up Webhooks**

1. Go to **Settings** → **Notifications** → **Webhooks**
2. Click **Create webhook**
3. Configure:
   - **Event:** Order creation
   - **Format:** JSON
   - **URL:** `https://academy.yourdomain.com/api/shopify-webhook`
   - **Webhook API version:** 2024-01

4. Save the **webhook secret** (you'll need this)

### **Step 5: Get API Credentials**

1. Go to **Settings** → **Apps and sales channels**
2. Click **Develop apps**
3. Click **Create an app**
4. Name it "LMS Integration"
5. Go to **API credentials**
6. Click **Configure Admin API scopes**
7. Select these scopes:
   - `read_customers`
   - `read_orders`
   - `read_products`
8. Click **Save**
9. Install app
10. Copy **Admin API access token**

---

## Part 2: Vercel Deployment

### **Step 1: Prepare Your Project**

Add `vercel.json` to your project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Credentials", "value": "true" },
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,POST,OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "X-Requested-With, Content-Type, Authorization" }
      ]
    }
  ]
}
```

### **Step 2: Install Vercel CLI**

```bash
npm install -g vercel
```

### **Step 3: Login & Deploy**

```bash
# Login to Vercel
vercel login

# Link project
vercel link

# Deploy
vercel --prod
```

### **Step 4: Add Environment Variables**

In Vercel Dashboard → Settings → Environment Variables:

```bash
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Shopify
SHOPIFY_STORE_URL=mz-marianna-academy.myshopify.com
SHOPIFY_ADMIN_API_TOKEN=shpat_xxxxxxxxxxxxx
SHOPIFY_WEBHOOK_SECRET=xxxxxxxxxxxxx

# Vercel (auto-generated)
VERCEL_URL=academy.yourdomain.com

# Cron API Key (generate random string)
CRON_API_KEY=your-random-secret-key-here
```

### **Step 5: Set Up Custom Domain**

1. In Vercel Dashboard → Settings → Domains
2. Add domain: `academy.yourdomain.com`
3. Follow DNS instructions to point domain to Vercel
4. Wait for SSL certificate to provision (~5 min)

---

## Part 3: Database Setup

### **Step 1: Update Profiles Table**

Add subscription columns to `profiles` table:

```sql
-- Add subscription columns
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS subscription_tier TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS subscription_started_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS subscription_renewed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS shopify_customer_id TEXT,
ADD COLUMN IF NOT EXISTS shopify_order_number TEXT,
ADD COLUMN IF NOT EXISTS max_students INTEGER DEFAULT 1;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_shopify_customer 
ON profiles(shopify_customer_id);

CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status 
ON profiles(subscription_status);
```

### **Step 2: Create Welcome Email Template**

```sql
-- Add welcome email template
INSERT INTO email_templates (
  template_name,
  subject_template,
  html_template,
  required_variables,
  description
) VALUES (
  'welcome',
  'Welcome to Mz. Marianna''s Academy! 🎉',
  '<!-- Welcome email HTML -->',
  ARRAY['firstName', 'email', 'tempPassword', 'loginUrl'],
  'Sent when new customer signs up via Shopify'
) ON CONFLICT (template_name) DO NOTHING;
```

---

## Part 4: Protect Your LMS

### **Step 1: Update App.tsx**

Wrap your app with SubscriptionGuard:

```typescript
import SubscriptionGuard from './components/subscription/SubscriptionGuard';

export default function App() {
  // ... existing code ...

  return (
    <BrowserRouter>
      <SubscriptionGuard>
        <DemoModeBanner />
        <Routes>
          {/* ... all your routes ... */}
        </Routes>
        <Toaster />
      </SubscriptionGuard>
    </BrowserRouter>
  );
}
```

### **Step 2: Update Database Migration**

The subscription columns were added in Part 3, Step 1. Make sure to run that SQL!

---

## Part 5: Set Up Cron Job

Vercel doesn't have built-in cron, so use an external service:

### **Option A: Vercel Cron (Beta)**

Create `/vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/shopify-subscription-check",
      "schedule": "0 2 * * *"
    }
  ]
}
```

### **Option B: Cron-job.org (Free)**

1. Go to [cron-job.org](https://cron-job.org)
2. Create account
3. Create cron job:
   - **URL:** `https://academy.yourdomain.com/api/shopify-subscription-check`
   - **Schedule:** Daily at 2am
   - **Request method:** POST
   - **Headers:** `x-api-key: your-cron-api-key`

---

## Part 6: Testing

### **Test Purchase Flow**

1. **Place test order in Shopify:**
   ```bash
   # Use Shopify's test mode
   # Or use Bogus Gateway for testing
   # Card: 1 (16 times)
   # Expiry: Any future date
   # CVV: Any 3 digits
   ```

2. **Check webhook received:**
   - Go to Vercel → Functions → Logs
   - Should see: `📦 Processing order #1001 for test@example.com`

3. **Verify account created:**
   ```sql
   SELECT * FROM profiles WHERE email = 'test@example.com';
   ```

4. **Check welcome email queued:**
   ```sql
   SELECT * FROM email_queue WHERE recipient_email = 'test@example.com';
   ```

5. **Try logging in:**
   - Go to `https://academy.yourdomain.com/login`
   - Use email from test order
   - Use temp password from welcome email

### **Test Subscription Check**

```bash
# Manually trigger cron job
curl -X POST https://academy.yourdomain.com/api/shopify-subscription-check \
  -H "x-api-key: your-cron-api-key"
```

### **Test Subscription Lock**

1. Set subscription status to `expired`:
   ```sql
   UPDATE profiles 
   SET subscription_status = 'expired' 
   WHERE email = 'test@example.com';
   ```

2. Try to access dashboard
3. Should see beautiful subscription renewal screen

---

## Part 7: Shopify Store Customization

### **Customize Thank You Page**

After purchase, redirect to LMS:

```liquid
{% if order %}
<div class="thank-you-message">
  <h2>🎉 Welcome to Mz. Marianna's Academy!</h2>
  <p>Your account is being created...</p>
  <p>You'll receive a welcome email in the next few minutes with your login credentials.</p>
  
  <script>
    // Redirect after 5 seconds
    setTimeout(() => {
      window.location.href = 'https://academy.yourdomain.com/login?email={{ customer.email }}';
    }, 5000);
  </script>
</div>
{% endif %}
```

### **Add Product Images**

Create nice graphics for each plan showing:
- Features list
- Student avatars
- Screenshots of LMS
- Testimonials

---

## Part 8: Going Live Checklist

- [ ] Shopify store created & configured
- [ ] 3 subscription products created
- [ ] Recharge/subscription app installed
- [ ] Webhooks configured & tested
- [ ] API credentials obtained
- [ ] Vercel app deployed
- [ ] Environment variables set
- [ ] Custom domain connected
- [ ] Database columns added
- [ ] SubscriptionGuard implemented
- [ ] Cron job scheduled
- [ ] Test purchase completed successfully
- [ ] Welcome email received
- [ ] Login works with temp password
- [ ] Subscription check runs daily
- [ ] Expired subscription blocks access
- [ ] Renewal screen shows correct pricing

---

## Pricing Summary

### **Monthly Costs**

| Service | Cost | Notes |
|---------|------|-------|
| **Shopify** | $39/mo | Basic plan (or $5/mo Starter) |
| **Recharge** | $99/mo | Subscription app (or use free Shopify Subscriptions) |
| **Vercel** | Free - $20/mo | Free for hobby, $20 for pro |
| **Supabase** | Free - $25/mo | Free up to 500MB DB |
| **Domain** | $12/year | Any registrar |
| **Email (Resend)** | Free - $20/mo | Free up to 3,000/mo |

**Total:** $138/mo - $183/mo (or as low as $44/mo with free tiers)

---

## 🎉 You're Done!

Your system now:
- ✅ **Sells subscriptions** via Shopify
- ✅ **Processes payments** securely
- ✅ **Auto-creates accounts** on purchase
- ✅ **Hosts LMS** on Vercel
- ✅ **Protects content** behind subscription
- ✅ **Checks status daily** and locks if expired
- ✅ **Shows beautiful upgrade screens**

**Shopify handles:** Money stuff  
**Vercel handles:** LMS hosting  
**Supabase handles:** Database & auth  

**Perfect separation of concerns!** 🚀

---

## Support

Need help?
- **Shopify:** support@shopify.com
- **Vercel:** vercel.com/support
- **Recharge:** help.rechargepayments.com

---

**Your neurodivergent-first LMS is now ready to make money!** 💰

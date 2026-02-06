# 💳 **QUICK START: Accept Payments in 5 Minutes**

## ⚡ **Super Fast Setup:**

### **1. Install Stripe** (30 seconds)
```bash
npm install @stripe/stripe-js stripe
```

### **2. Get Stripe Keys** (2 minutes)
1. Go to: https://dashboard.stripe.com/register
2. Sign up (use mariannav920@gmail.com)
3. Go to: https://dashboard.stripe.com/test/apikeys
4. Copy your keys

### **3. Add Keys to .env** (30 seconds)
```bash
# Add these to your .env file:
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51...YourKeyHere
STRIPE_SECRET_KEY=sk_test_51...YourKeyHere
```

### **4. Create Test Products in Stripe** (2 minutes)
```
1. Go to: https://dashboard.stripe.com/test/products
2. Click "Add Product"
3. Create:
   - Name: "Warrior Monthly"
   - Price: $29 USD
   - Recurring: Monthly
   - Click "Save Product"
4. Copy the Price ID (starts with "price_")
5. Repeat for other tiers
```

### **5. Update Price IDs** (1 minute)
Open `/lib/stripe/config.ts` and paste your Price IDs:
```typescript
{
  id: 'warrior',
  name: 'Warrior',
  stripePriceId: 'price_YOUR_PRICE_ID_HERE', // ← PASTE HERE
}
```

---

## 🎉 **DONE! Test It:**

```bash
npm run dev

# Visit:
http://localhost:5173/pricing

# Click any "Upgrade Now" button
# You'll see the checkout page!
```

---

## 🧪 **Test Payment:**

Use these Stripe test cards:

**Success:**
- Card: `4242 4242 4242 4242`
- Exp: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

**Failure:**
- Card: `4000 0000 0000 0002`

**3D Secure:**
- Card: `4000 0027 6000 3184`

---

## 📋 **What You Can Do Now:**

### **Visit These Pages:**
- ✅ `/pricing` - See all tiers
- ✅ `/checkout?plan=warrior` - Test checkout
- ✅ `/payment-success` - See success page

### **Test These Features:**
- ✅ Toggle Monthly/Annual billing
- ✅ Click "Upgrade Now" → See checkout
- ✅ Select payment method
- ✅ (When Stripe is connected) Complete payment
- ✅ Download invoice

---

## 🚀 **Go Live (When Ready):**

### **Switch to Live Mode:**
1. Stripe Dashboard → Toggle "Test Mode" → OFF
2. Get your LIVE keys from: https://dashboard.stripe.com/apikeys
3. Update `.env` with live keys
4. Create products in LIVE mode
5. Update Price IDs
6. Deploy to Netlify!

---

## 💰 **Pricing Summary:**

| Tier | Monthly | Annual (Save 20%) |
|------|---------|-------------------|
| **Free** | $0 | — |
| **Warrior** 🔥 | $29 | $279/year |
| **Scholar** | $79 | $779/year |
| **Legend** | $149 | $1,449/year |

---

## 📊 **Track Your Revenue:**

### **Supabase Dashboard:**
```sql
-- See all payments
SELECT * FROM payments ORDER BY payment_date DESC;

-- Calculate MRR
SELECT plan_id, SUM(amount) as monthly_revenue
FROM subscriptions
WHERE status = 'active' AND billing_interval = 'month'
GROUP BY plan_id;

-- Total customers by tier
SELECT plan_id, COUNT(*) as customers
FROM subscriptions
WHERE status = 'active'
GROUP BY plan_id;
```

### **Stripe Dashboard:**
- Go to: https://dashboard.stripe.com/dashboard
- See: Revenue, Customers, Subscriptions
- View: Payment history, Failed payments

---

## ❓ **Common Questions:**

### **Q: Do I need to write backend code?**
A: Yes, for production you need Netlify Functions (see `/PAYMENT-SETUP-GUIDE.md`)

### **Q: How do I test without a backend?**
A: The UI works! Backend is needed for actual Stripe checkout.

### **Q: Can I use PayPal instead?**
A: PayPal support is built-in, just need to integrate the SDK.

### **Q: How do I handle refunds?**
A: In Stripe Dashboard → Payments → Click payment → Refund

### **Q: What about taxes?**
A: Stripe Tax can auto-calculate. Enable in Dashboard.

### **Q: Can I offer discounts?**
A: Yes! Create Stripe Coupons, apply at checkout.

---

## 🎯 **Your Complete Payment Stack:**

```
Frontend Pages:
├── /pricing (PricingPage.tsx) - Choose a plan
├── /checkout (CheckoutPage.tsx) - Enter payment
└── /payment-success (PaymentSuccessPage.tsx) - Receipt

Components:
├── PricingTable.tsx - Pricing cards
└── InvoiceTemplate.tsx - Professional receipts

Backend:
├── Stripe API - Payment processing
├── Supabase - Data storage
└── Netlify Functions - Server logic

Database:
├── payments - Transaction history
├── subscriptions - Active plans
├── invoices - Receipt storage
└── payment_methods - Saved cards
```

---

## 🎨 **Customization:**

Want to change prices? Edit `/lib/stripe/config.ts`:
```typescript
export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'warrior',
    price: 29, // ← Change this
    features: [
      'Your custom feature', // ← Add features
    ]
  }
];
```

---

## ✅ **Checklist:**

Before going live:
- [ ] Stripe account created
- [ ] Test mode keys added to .env
- [ ] Products created in Stripe
- [ ] Price IDs updated in config.ts
- [ ] Tested checkout flow
- [ ] Database migration run
- [ ] Backend functions deployed
- [ ] Webhooks configured
- [ ] Live keys added (production)
- [ ] Tested live payment
- [ ] Invoice email working

---

## 🎉 **You're All Set!**

Your payment system is ready to accept money! 💰

**Need help?** Read: `/PAYMENT-SETUP-GUIDE.md`

**Questions?** Email: mariannav920@gmail.com

---

**Now go make that money!** 🚀💸

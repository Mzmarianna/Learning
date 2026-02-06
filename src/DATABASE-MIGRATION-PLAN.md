# 🗄️ DATABASE MIGRATION PLAN
## Post-Rebrand Schema Updates

---

## 📋 **MIGRATION OVERVIEW**

**Why We Need This:**
- Rebrand requires new features (freemium, referrals, analytics)
- Physical product sales (workbooks, merch)
- School licensing
- Partnership tracking
- Enhanced Wowl AI data collection

**Migration Strategy:**
- Incremental migrations (not one big bang)
- Zero downtime (use Supabase migrations)
- Backwards compatible (don't break existing app)
- Data preservation (no user data loss)

---

## 🚀 **MIGRATION SEQUENCE**

### **Phase 1: Freemium & Analytics (Week 1) - CRITICAL**

**File:** `/supabase/migrations/20260203_freemium_analytics.sql`

```sql
-- ============================================================================
-- MIGRATION 1: FREEMIUM & ANALYTICS SUPPORT
-- ============================================================================

-- 1. Add subscription tier to users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free'
CHECK (subscription_tier IN ('free', 'premium', 'vip'));

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_started_at TIMESTAMP;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMP;

-- 2. Usage tracking (for freemium limits)
CREATE TABLE IF NOT EXISTS user_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  period_start TIMESTAMP NOT NULL,
  period_end TIMESTAMP NOT NULL,
  quests_used INTEGER DEFAULT 0,
  wowl_messages_used INTEGER DEFAULT 0,
  live_classes_attended INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_user_period UNIQUE(user_id, period_start)
);

CREATE INDEX idx_usage_user ON user_usage(user_id);
CREATE INDEX idx_usage_period ON user_usage(period_start, period_end);

-- 3. Paywall events (track conversion attempts)
CREATE TABLE IF NOT EXISTS paywall_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  trigger_type TEXT NOT NULL, -- 'quest_limit', 'clan_invitation', 'wowl_limit'
  trigger_context JSONB, -- Additional data about what triggered paywall
  shown_at TIMESTAMP DEFAULT NOW(),
  action_taken TEXT, -- 'upgraded', 'dismissed', 'clicked_learn_more', 'closed'
  action_at TIMESTAMP
);

CREATE INDEX idx_paywall_user ON paywall_events(user_id);
CREATE INDEX idx_paywall_trigger ON paywall_events(trigger_type);
CREATE INDEX idx_paywall_time ON paywall_events(shown_at);

-- 4. Analytics events (for Mixpanel + internal)
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  event_properties JSONB,
  session_id UUID,
  timestamp TIMESTAMP DEFAULT NOW(),
  
  -- For filtering/analysis
  event_date DATE GENERATED ALWAYS AS (DATE(timestamp)) STORED
);

CREATE INDEX idx_events_user_time ON analytics_events(user_id, timestamp DESC);
CREATE INDEX idx_events_name_time ON analytics_events(event_name, timestamp DESC);
CREATE INDEX idx_events_date ON analytics_events(event_date);
CREATE INDEX idx_events_session ON analytics_events(session_id);

-- 5. Function to reset usage limits weekly
CREATE OR REPLACE FUNCTION reset_weekly_usage()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Archive old usage
  INSERT INTO user_usage_history (SELECT * FROM user_usage WHERE period_end < NOW());
  
  -- Delete old records
  DELETE FROM user_usage WHERE period_end < NOW();
  
  -- Create new period for all users
  INSERT INTO user_usage (user_id, period_start, period_end)
  SELECT 
    id,
    DATE_TRUNC('week', NOW()),
    DATE_TRUNC('week', NOW()) + INTERVAL '7 days'
  FROM users
  WHERE role = 'student'
  ON CONFLICT (user_id, period_start) DO NOTHING;
END;
$$;

-- 6. Enable Row Level Security (RLS)
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE paywall_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own usage"
  ON user_usage FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('tutor', 'admin')
  ));

CREATE POLICY "Users can view own paywall events"
  ON paywall_events FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('tutor', 'admin')
  ));

CREATE POLICY "System can insert analytics"
  ON analytics_events FOR INSERT
  WITH CHECK (true); -- Allow all inserts (we'll validate in app)

-- 7. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_users_subscription_dates ON users(subscription_started_at, subscription_ends_at);

-- ============================================================================
-- ROLLBACK INSTRUCTIONS (if needed)
-- ============================================================================
-- DROP TABLE IF EXISTS analytics_events CASCADE;
-- DROP TABLE IF EXISTS paywall_events CASCADE;
-- DROP TABLE IF EXISTS user_usage CASCADE;
-- ALTER TABLE users DROP COLUMN IF EXISTS subscription_tier;
-- ALTER TABLE users DROP COLUMN IF EXISTS subscription_started_at;
-- ALTER TABLE users DROP COLUMN IF EXISTS subscription_ends_at;
```

---

### **Phase 2: Referral System (Week 2)**

**File:** `/supabase/migrations/20260210_referral_system.sql`

```sql
-- ============================================================================
-- MIGRATION 2: REFERRAL & VIRAL MECHANICS
-- ============================================================================

-- 1. Referral codes (each user gets one)
CREATE TABLE IF NOT EXISTS referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_referral_codes_user ON referral_codes(user_id);
CREATE INDEX idx_referral_codes_code ON referral_codes(code);

-- 2. Track referrals
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES users(id) ON DELETE CASCADE,
  code_used TEXT REFERENCES referral_codes(code),
  signed_up_at TIMESTAMP DEFAULT NOW(),
  converted_to_paid BOOLEAN DEFAULT FALSE,
  converted_at TIMESTAMP,
  
  CONSTRAINT unique_referral UNIQUE(referred_id)
);

CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred ON referrals(referred_id);
CREATE INDEX idx_referrals_converted ON referrals(converted_to_paid);

-- 3. Referral rewards
CREATE TABLE IF NOT EXISTS referral_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reward_type TEXT NOT NULL, -- 'free_week', 'discount_20', 'bonus_xp_500'
  reward_value JSONB, -- Flexible storage for reward details
  earned_at TIMESTAMP DEFAULT NOW(),
  redeemed BOOLEAN DEFAULT FALSE,
  redeemed_at TIMESTAMP,
  expires_at TIMESTAMP
);

CREATE INDEX idx_rewards_user ON referral_rewards(user_id);
CREATE INDEX idx_rewards_redeemed ON referral_rewards(redeemed, expires_at);

-- 4. Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character code (uppercase + numbers)
    new_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM referral_codes WHERE code = new_code) INTO code_exists;
    
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  RETURN new_code;
END;
$$;

-- 5. Trigger to create referral code for new users
CREATE OR REPLACE FUNCTION create_referral_code_for_user()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.role = 'student' OR NEW.role = 'parent' THEN
    INSERT INTO referral_codes (user_id, code)
    VALUES (NEW.id, generate_referral_code());
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_create_referral_code
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_referral_code_for_user();

-- 6. Function to award referral rewards
CREATE OR REPLACE FUNCTION award_referral_reward(
  p_referrer_id UUID,
  p_referred_id UUID
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  referral_count INTEGER;
BEGIN
  -- Count how many successful referrals this user has
  SELECT COUNT(*) INTO referral_count
  FROM referrals
  WHERE referrer_id = p_referrer_id AND converted_to_paid = TRUE;
  
  -- Award based on milestones
  IF referral_count = 1 THEN
    -- First referral: 1 free week
    INSERT INTO referral_rewards (user_id, reward_type, reward_value, expires_at)
    VALUES (p_referrer_id, 'free_week', '{"weeks": 1}'::JSONB, NOW() + INTERVAL '30 days');
    
  ELSIF referral_count = 3 THEN
    -- Third referral: 1 month free
    INSERT INTO referral_rewards (user_id, reward_type, reward_value, expires_at)
    VALUES (p_referrer_id, 'free_month', '{"months": 1}'::JSONB, NOW() + INTERVAL '60 days');
    
  ELSIF referral_count = 5 THEN
    -- Fifth referral: VIP upgrade for 3 months
    INSERT INTO referral_rewards (user_id, reward_type, reward_value, expires_at)
    VALUES (p_referrer_id, 'vip_upgrade', '{"months": 3}'::JSONB, NOW() + INTERVAL '90 days');
    
  ELSIF referral_count % 10 = 0 THEN
    -- Every 10th referral: $100 credit
    INSERT INTO referral_rewards (user_id, reward_type, reward_value, expires_at)
    VALUES (p_referrer_id, 'account_credit', '{"amount": 100}'::JSONB, NOW() + INTERVAL '365 days');
  END IF;
END;
$$;

-- 7. Enable RLS
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referral code"
  ON referral_codes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own referrals"
  ON referrals FOR SELECT
  USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Users can view own rewards"
  ON referral_rewards FOR SELECT
  USING (auth.uid() = user_id);
```

---

### **Phase 3: Partnership Tracking (Week 3)**

**File:** `/supabase/migrations/20260217_partnerships.sql`

```sql
-- ============================================================================
-- MIGRATION 3: PARTNERSHIP & AFFILIATE TRACKING
-- ============================================================================

-- 1. Partners (organizations we work with)
CREATE TABLE IF NOT EXISTS partnerships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'homeschool_org', 'school', 'microschool', 'nonprofit', 'affiliate'
  contact_name TEXT,
  contact_email TEXT,
  discount_code TEXT UNIQUE,
  discount_percentage DECIMAL(5,2), -- e.g., 20.00 for 20% off
  commission_rate DECIMAL(5,2), -- e.g., 10.00 for 10% revenue share
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'inactive')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_partnerships_type ON partnerships(type);
CREATE INDEX idx_partnerships_status ON partnerships(status);
CREATE INDEX idx_partnerships_discount_code ON partnerships(discount_code);

-- 2. Track signups from partners
CREATE TABLE IF NOT EXISTS partnership_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partnership_id UUID REFERENCES partnerships(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  discount_code_used TEXT,
  discount_amount DECIMAL(10,2),
  signed_up_at TIMESTAMP DEFAULT NOW(),
  converted_to_paid BOOLEAN DEFAULT FALSE,
  converted_at TIMESTAMP,
  lifetime_value DECIMAL(10,2) DEFAULT 0,
  
  CONSTRAINT unique_partnership_user UNIQUE(user_id)
);

CREATE INDEX idx_partnership_signups_partnership ON partnership_signups(partnership_id);
CREATE INDEX idx_partnership_signups_user ON partnership_signups(user_id);
CREATE INDEX idx_partnership_signups_converted ON partnership_signups(converted_to_paid);

-- 3. Commission payments
CREATE TABLE IF NOT EXISTS partnership_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partnership_id UUID REFERENCES partnerships(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_signups INTEGER DEFAULT 0,
  total_conversions INTEGER DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  commission_owed DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_commissions_partnership ON partnership_commissions(partnership_id);
CREATE INDEX idx_commissions_period ON partnership_commissions(period_start, period_end);
CREATE INDEX idx_commissions_status ON partnership_commissions(status);

-- 4. Function to calculate monthly commissions
CREATE OR REPLACE FUNCTION calculate_partnership_commissions(
  p_month DATE
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  partner RECORD;
  period_start DATE;
  period_end DATE;
  total_signups INTEGER;
  total_conversions INTEGER;
  total_revenue DECIMAL(10,2);
  commission_owed DECIMAL(10,2);
BEGIN
  period_start := DATE_TRUNC('month', p_month);
  period_end := period_start + INTERVAL '1 month' - INTERVAL '1 day';
  
  FOR partner IN SELECT * FROM partnerships WHERE status = 'active' AND commission_rate > 0 LOOP
    -- Count signups and conversions
    SELECT 
      COUNT(*),
      COUNT(*) FILTER (WHERE converted_to_paid = TRUE),
      COALESCE(SUM(lifetime_value) FILTER (WHERE converted_to_paid = TRUE), 0)
    INTO total_signups, total_conversions, total_revenue
    FROM partnership_signups
    WHERE partnership_id = partner.id
      AND signed_up_at >= period_start
      AND signed_up_at <= period_end;
    
    -- Calculate commission
    commission_owed := total_revenue * (partner.commission_rate / 100);
    
    -- Insert commission record
    IF total_conversions > 0 THEN
      INSERT INTO partnership_commissions (
        partnership_id,
        period_start,
        period_end,
        total_signups,
        total_conversions,
        total_revenue,
        commission_owed
      ) VALUES (
        partner.id,
        period_start,
        period_end,
        total_signups,
        total_conversions,
        total_revenue,
        commission_owed
      );
    END IF;
  END LOOP;
END;
$$;

-- 5. Enable RLS
ALTER TABLE partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE partnership_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE partnership_commissions ENABLE ROW LEVEL SECURITY;

-- Admins only can view partnerships
CREATE POLICY "Admins can manage partnerships"
  ON partnerships FOR ALL
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Users can view their own partnership signup
CREATE POLICY "Users can view own partnership signup"
  ON partnership_signups FOR SELECT
  USING (auth.uid() = user_id);
```

---

### **Phase 4: Physical Products (Week 4)**

**File:** `/supabase/migrations/20260224_products_orders.sql`

```sql
-- (Physical product tables - workbooks, merch, etc.)
-- I can provide this next if you want, or we can focus on Phases 1-3 first
```

---

## 🔧 **GEMINI AI / WOWL INTEGRATION**

### **What I'm Expecting:**

When you share the Gemini code, I'll need to:

1. **Review current Wowl implementation**
   - Where is the AI logic? (probably `/lib/wowl-ai.ts` or similar)
   - What API are we using? (OpenAI GPT vs Gemini)
   - How is context passed to the AI?

2. **Enhance for adaptive learning**
   ```typescript
   // Current (probably):
   const wowlResponse = await callAI(userMessage, basicContext);
   
   // Enhanced (what we need):
   const wowlResponse = await callAI(userMessage, {
     studentProfile: {
       tier: 'explorers',
       skillGaps: ['fractions', 'reading_inference'],
       strengths: ['pattern_recognition', 'visual_learning'],
       emotionalState: 'slightly_frustrated', // detected from behavior
       recentProgress: { xpThisWeek: 450, questsCompleted: 3 }
     },
     conversationHistory: last5Messages,
     currentQuest: { id, subject, difficulty },
     adaptivePrompts: {
       encouragement: "You're doing great! Want a hint?",
       intervention: "Let's take a brain break!",
       recommendation: "Try this Minecraft quest next - it's perfect for you"
     }
   });
   ```

3. **Database schema for AI interactions**
   ```sql
   -- Track every Wowl conversation for ML training
   CREATE TABLE wowl_conversations (
     id UUID PRIMARY KEY,
     student_id UUID REFERENCES users(id),
     quest_id UUID REFERENCES quests(id),
     messages JSONB, -- Full conversation history
     emotional_state TEXT,
     intervention_type TEXT, -- 'hint', 'brain_break', 'recommendation'
     outcome TEXT, -- 'completed_quest', 'quit_early', 'requested_help'
     created_at TIMESTAMP
   );
   ```

---

## ✅ **MIGRATION EXECUTION PLAN**

### **This Week:**
1. Review existing schema (what tables do we have?)
2. Test Phase 1 migration on development database
3. Deploy Phase 1 to production (freemium + analytics)
4. Update app code to use new tables

### **Next 2 Weeks:**
1. Deploy Phase 2 (referrals)
2. Deploy Phase 3 (partnerships)
3. Review Gemini AI code (when you provide it)
4. Plan Wowl upgrade migration

---

**Ready when you are! Share the Gemini/Wowl code and I'll integrate it.** 🦉🧠

In the meantime, should I start implementing Phase 1 of the database migration?

# 🏗️ Architecture Overview - Mz. Marianna's Academy

**Visual guide to how everything connects**

---

## 🎯 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER DEVICES                             │
│   📱 Mobile Browsers  💻 Desktop Browsers  🖥️ Tablets           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VERCEL EDGE NETWORK                           │
│                  (Global CDN + Hosting)                          │
│                                                                   │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────┐ │
│  │  Static Assets  │  │  React App (SPA) │  │ API Functions  │ │
│  │  • CSS          │  │  • App.tsx       │  │  • Webhooks    │ │
│  │  • Images       │  │  • Components    │  │  • Cron jobs   │ │
│  │  • Fonts        │  │  • Pages         │  │                │ │
│  └─────────────────┘  └──────────────────┘  └────────────────┘ │
└───────────────────┬────────────────────────────┬────────────────┘
                    │                            │
                    │                            │
                    ▼                            ▼
       ┌────────────────────────┐    ┌─────────────────────────┐
       │   SUPABASE BACKEND     │    │   SHOPIFY STORE         │
       │  (Database + Auth)     │    │  (Payment Processing)   │
       │                        │    │                         │
       │  • PostgreSQL DB       │    │  • Subscription Plans   │
       │  • Authentication      │    │  • Payment Gateway      │
       │  • Storage Buckets     │    │  • Customer Management  │
       │  • Real-time Updates   │    │  • Webhooks             │
       │  • Edge Functions      │    │                         │
       └────────────────────────┘    └─────────────────────────┘
                    │
                    │
                    ▼
       ┌────────────────────────┐
       │   EMAIL SERVICE        │
       │   (Resend/SendGrid)    │
       │                        │
       │  • Welcome emails      │
       │  • Weekly reports      │
       │  • Notifications       │
       └────────────────────────┘
```

---

## 🔄 User Flow Diagrams

### New User Journey

```
START
  │
  ├─→ 1. Visit Placement Quiz (no login required)
  │      ↓
  ├─→ 2. Complete Quiz → Get Tier Recommendation
  │      ↓
  ├─→ 3. Click "Create Account" → Redirects to Shopify
  │      ↓
  ├─→ 4. Purchase Subscription on Shopify
  │      ↓
  ├─→ 5. Shopify sends webhook to Vercel API
  │      ↓
  ├─→ 6. API creates account in Supabase
  │      ↓
  ├─→ 7. Email sent with login credentials
  │      ↓
  ├─→ 8. User logs in → Dashboard
  │      ↓
END → Start learning!
```

### Existing User Journey

```
START
  │
  ├─→ 1. Visit LMS URL
  │      ↓
  ├─→ 2. Login Page (Supabase Auth)
  │      ↓
  ├─→ 3. SubscriptionGuard checks status
  │      ↓
  ├─→ 4. If active → Dashboard
  │      │
  │      └─→ If inactive → Upgrade Screen
  │             ↓
  │          Renew via Shopify
END
```

### Student Learning Journey

```
Student Dashboard
  │
  ├─→ View Current Quest
  │      ↓
  ├─→ See Challenge List
  │      ↓
  ├─→ Click Challenge
  │      ↓
  ├─→ Read Instructions
  │      ↓
  ├─→ Complete Challenge (Roblox, project, etc.)
  │      ↓
  ├─→ Submit Evidence (photo, video, text)
  │      ↓
  ├─→ Tutor Reviews
  │      ↓
  ├─→ Award XP + Badges
  │      ↓
  ├─→ Auto-unlock next challenge
  │      ↓
  └─→ Progress to next quest (when complete)
```

---

## 🗄️ Database Architecture

### Core Tables & Relationships

```
profiles (users)
  ├─→ id (PK)
  ├─→ email
  ├─→ role (student|parent|tutor|admin)
  ├─→ subscription_tier
  └─→ subscription_status
      │
      ├─────────────────┬──────────────────┬────────────────┐
      │                 │                  │                │
      ▼                 ▼                  ▼                ▼
student_profiles   parent_profiles   tutor_profiles   admin_profiles
  ├─→ user_id (FK)   ├─→ user_id      ├─→ user_id     └─→ user_id
  ├─→ tier           ├─→ children[]    └─→ students[]
  ├─→ xp_total       └─→ payment_info
  ├─→ current_level
  └─→ avatar_url
      │
      ├───────────────┬─────────────────┬──────────────┬─────────────┐
      │               │                 │              │             │
      ▼               ▼                 ▼              ▼             ▼
quest_instances  challenge_        submissions    xp_events    badges_earned
                 instances
  ├─→ student_id   ├─→ student_id   ├─→ student_id  ├─→ student_id  ├─→ student_id
  ├─→ quest_id     ├─→ challenge_id ├─→ content     ├─→ xp_amount   ├─→ badge_id
  ├─→ status       ├─→ status       ├─→ status      ├─→ reason      └─→ awarded_at
  └─→ progress     ├─→ started_at   ├─→ reviewed_by └─→ created_at
                   └─→ completed_at └─→ feedback
```

### Security (Row Level Security)

```
RLS POLICIES:

Students:
  ✅ Can SELECT own data
  ✅ Can UPDATE own submissions
  ✅ Can INSERT own portfolio
  ❌ Cannot see other students

Parents:
  ✅ Can SELECT children's data (where parent_id = user.id)
  ✅ Can INSERT new students (up to subscription limit)
  ❌ Cannot modify XP/progress directly

Tutors:
  ✅ Can SELECT assigned students
  ✅ Can UPDATE submissions (review/feedback)
  ✅ Can INSERT xp_events
  ❌ Cannot modify student profiles

Admins:
  ✅ Full access to all tables
  ✅ Can CRUD everything
  ✅ Bypass RLS with service_role key
```

---

## 🔌 API Architecture

### Frontend → Supabase (Direct)

```typescript
// Frontend makes direct calls to Supabase
// Uses anon key (public, but RLS protects data)

User Login
  ↓
supabase.auth.signInWithPassword()
  ↓
Session stored in browser
  ↓
All queries include session token
  ↓
RLS policies enforce access control
```

### Shopify → Vercel API → Supabase

```typescript
// Shopify webhooks go through Vercel API
// Uses service_role key (bypasses RLS)

Customer purchases on Shopify
  ↓
POST /api/shopify-webhook
  ├─→ Verify signature
  ├─→ Extract customer data
  ├─→ Create account in Supabase (service_role)
  ├─→ Queue welcome email
  └─→ Return 200 OK
```

### Cron Job (Daily Subscription Check)

```typescript
// External cron hits Vercel API daily

Cron service (cron-job.org)
  ↓
POST /api/shopify-subscription-check
  ├─→ Verify API key
  ├─→ Fetch all active subscriptions from Shopify
  ├─→ Update Supabase profiles
  ├─→ Lock expired accounts
  └─→ Return summary
```

---

## 🎨 Frontend Architecture

### Component Hierarchy

```
App.tsx (Router)
  │
  ├─→ Public Routes
  │     ├─→ LoginPage
  │     ├─→ SignUpPage
  │     └─→ PlacementQuizPage
  │
  ├─→ Protected Routes (SubscriptionGuard)
  │     │
  │     ├─→ Student Routes
  │     │     ├─→ StudentDashboardPage
  │     │     │     ├─→ StudentDashboard
  │     │     │     │     ├─→ CurrentQuestCard
  │     │     │     │     ├─→ XPDisplay
  │     │     │     │     ├─→ UpcomingClasses
  │     │     │     │     └─→ WowlChat
  │     │     │     
  │     │     ├─→ QuestsPage
  │     │     │     └─→ QuestMap
  │     │     │
  │     │     ├─→ QuestDetailsPage
  │     │     │     ├─→ QuestDetails
  │     │     │     └─→ ChallengeCard[]
  │     │     │
  │     │     └─→ ChallengeDetailsPage
  │     │           ├─→ ChallengeDetails
  │     │           └─→ SubmissionFlow
  │     │
  │     ├─→ Parent Routes
  │     │     └─→ ParentDashboardPage
  │     │           ├─→ ParentDashboard
  │     │           ├─→ StudentAssessmentView
  │     │           └─→ ParentPortfolioView
  │     │
  │     ├─→ Tutor Routes
  │     │     └─→ TutorDashboardPage
  │     │           ├─→ TutorDashboard
  │     │           ├─→ TutorReviewQueue
  │     │           └─→ StudentAssessmentPanel
  │     │
  │     └─→ Admin Routes
  │           └─→ AdminDashboardPage
  │                 ├─→ AdminDashboard
  │                 ├─→ CreateStudentModal
  │                 └─→ AssignChallengesModal
  │
  └─→ Common Components
        ├─→ LoadingScreen
        ├─→ DemoModeBanner
        └─→ Toaster (notifications)
```

### State Management

```
React Context (via Supabase)
  │
  ├─→ Auth State
  │     ├─→ User session
  │     ├─→ User profile
  │     └─→ Role
  │
  ├─→ Student State
  │     ├─→ XP total
  │     ├─→ Current level
  │     ├─→ Active quests
  │     └─→ Badges
  │
  └─→ Real-time Subscriptions
        ├─→ Quest progress updates
        ├─→ New submissions
        └─→ Tutor feedback
```

---

## 🔐 Security Layers

### Layer 1: Network (Vercel)
```
✅ HTTPS enforced
✅ DDoS protection
✅ CDN with edge caching
✅ CORS configured
```

### Layer 2: Authentication (Supabase)
```
✅ JWT tokens
✅ Session management
✅ Email verification
✅ OAuth (Google) ready
```

### Layer 3: Authorization (RLS)
```
✅ Row-level security policies
✅ Role-based access
✅ Parent-child relationships
✅ Service role vs anon key
```

### Layer 4: Application
```
✅ Input validation
✅ XSS prevention (React escaping)
✅ SQL injection prevention (parameterized)
✅ Webhook signature verification
```

### Layer 5: Data Privacy
```
✅ COPPA compliance
✅ Parental consent
✅ Data encryption at rest
✅ GDPR-ready (data export/delete)
```

---

## 📦 Build & Deployment Flow

### Development

```
Local Machine
  │
  ├─→ npm run dev
  │     ├─→ Vite dev server (HMR)
  │     ├─→ Tailwind JIT compiler
  │     └─→ TypeScript type checking
  │
  └─→ Changes saved
        └─→ Browser auto-refreshes
```

### Production Build

```
npm run build
  │
  ├─→ TypeScript compilation
  │     └─→ Type checking + emit .js files
  │
  ├─→ Vite bundling
  │     ├─→ Code splitting
  │     ├─→ Tree shaking
  │     ├─→ Minification
  │     └─→ Asset optimization
  │
  └─→ Output to /dist
        ├─→ index.html
        ├─→ assets/
        │     ├─→ main-[hash].js
        │     ├─→ vendor-[hash].js
        │     └─→ styles-[hash].css
        └─→ api/ (serverless functions)
```

### Deployment to Vercel

```
git push origin main
  │
  ├─→ Vercel detects push
  │     │
  │     ├─→ Clone repository
  │     ├─→ npm install
  │     ├─→ npm run build
  │     ├─→ Deploy to edge network
  │     └─→ Assign URL
  │
  └─→ Live at: https://your-app.vercel.app
```

---

## 🔄 Data Flow Examples

### Example 1: Student Completes Challenge

```
1. Student clicks "Submit" on challenge
     ↓
2. Frontend validates input
     ↓
3. Upload file to Supabase Storage (if applicable)
     ↓
4. Insert submission to database
     ↓
5. Database trigger fires → update challenge_instances
     ↓
6. Check if quest complete → auto-unlock next
     ↓
7. Real-time subscription notifies parent
     ↓
8. Frontend shows success toast + reward overlay
```

### Example 2: Tutor Reviews Submission

```
1. Tutor opens review queue
     ↓
2. Frontend queries: submissions WHERE status = 'pending'
     ↓
3. RLS checks: tutor is assigned to this student
     ↓
4. Tutor provides feedback + XP award
     ↓
5. Update submission (status = 'approved')
     ↓
6. Call award_xp_to_student(student_id, xp_amount)
     ↓
7. Function updates: student XP, checks for level up, awards badges
     ↓
8. Real-time notifies student → shows reward overlay
```

### Example 3: Parent Views Progress

```
1. Parent logs in
     ↓
2. Frontend queries: students WHERE parent_id = current_user
     ↓
3. For each student:
     - Get current quest progress
     - Get recent submissions
     - Get XP history
     - Get badges earned
     ↓
4. RLS ensures parent can only see their children
     ↓
5. Dashboard renders with charts + portfolio
```

---

## 🎯 Performance Optimizations

### Frontend
```
✅ Code splitting (React.lazy)
✅ Image lazy loading
✅ Route-based chunking
✅ Tree shaking
✅ Minification
✅ Gzip compression
```

### Database
```
✅ Indexes on foreign keys
✅ Composite indexes on common queries
✅ Connection pooling (Supabase)
✅ Prepared statements
✅ Efficient RLS policies
```

### API
```
✅ Edge functions (low latency)
✅ Serverless (auto-scaling)
✅ CDN caching for static assets
✅ Real-time subscriptions (WebSocket)
```

---

## 📊 Monitoring & Observability

### Vercel Dashboard
- ✅ Build logs
- ✅ Function invocations
- ✅ Error tracking
- ✅ Analytics (page views, performance)

### Supabase Dashboard
- ✅ Database queries
- ✅ Real-time connections
- ✅ Storage usage
- ✅ Auth events

### Shopify Dashboard
- ✅ Order history
- ✅ Subscription status
- ✅ Webhook deliveries
- ✅ Customer data

---

## 🎉 Summary

Your architecture is:

✅ **Scalable** - Serverless + edge deployment  
✅ **Secure** - Multi-layer security  
✅ **Fast** - CDN + optimized builds  
✅ **Reliable** - Managed services (99.9% uptime)  
✅ **Cost-effective** - Free tiers available  
✅ **Production-ready** - No placeholders or TODOs

**Everything is connected and working together!** 🦉✨

---

**Need more detail on any component?**  
Check the specific docs:
- Database: `DATABASE-SETUP.md`
- Payment: `SHOPIFY-VERCEL-SETUP.md`
- Deployment: `DEPLOYMENT-CHECKLIST.md`

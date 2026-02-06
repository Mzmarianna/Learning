# Demo Access Guide 🎮

Welcome to Mz. Marianna's Academy! You can now explore the platform **without needing Supabase**.

## Quick Access

### 🚀 Demo Mode (No Login Required)

**Direct Link:** Navigate to `/demo/student`

This gives you instant access to:
- Student Dashboard with XP/Level stats
- Weekly Lesson Schedule (Explorers tier)
- Current Quest information
- Recent submissions
- Badge collection

**Sample Data Included:**
- Student: "Alex Explorer" (10 years old)
- Tier: Explorers of Knowledge
- Level 5 with 2,500 XP
- Week 1: "Fractions and Decimals in the Real World"
- 3 earned badges
- Recent challenge submissions

### 🏠 Homepage

Navigate to `/` (root) to see:
- Full marketing landing page
- **"Try Demo Mode" button** prominently displayed at the top
- Placement quiz option
- Package pricing
- Testimonials

## Routes Available

| Route | Description | Requires Login? |
|-------|-------------|-----------------|
| `/` | Homepage/Landing page | No |
| `/demo/student` | Demo Student Dashboard | No |
| `/placement-quiz` | Free placement quiz | No |
| `/login` | Login page (requires Supabase) | No |
| `/signup` | Sign up page (requires Supabase) | No |
| `/dashboard/student` | Real student dashboard | Yes |

## What You'll See in Demo Mode

### Weekly Lesson Schedule ✨

The **Explorers tier** student (Alex Explorer) will see:

**Week 1: Fractions and Decimals in the Real World**
- **Monday:** Math Fundamentals - "Understanding Fractions Through Real-Life Examples"
- **Tuesday:** Writing & Expression - "Writing About Your Favorite Foods"
- **Wednesday:** STEAM & Discovery - "Engineering Challenge: Build a Model"
- **Thursday:** Reading & Comprehension - "Reading Stories About Sharing"

Each lesson card shows:
- Time (e.g., "10:00 AM - 11:00 AM")
- Subject icon and color
- Learning objectives
- Materials needed
- "Join Class" button
- Completion status

### Dashboard Stats

You'll see:
- **Total XP:** 2,500
- **Current Level:** 5
- **Progress to Level 6:** Visual progress bar
- **Earned Badges:** 3 badges displayed
- **Recent Submissions:** 3 completed challenges

## Notes

- Demo mode uses **mock data** - nothing is saved
- Buttons like "Join Class" are interactive but won't connect to real classes
- You can navigate back to the homepage anytime
- The yellow banner at the top indicates you're in demo mode

## To Enable Full Features (with Supabase)

If you want to use authentication and real data:

1. Set up Supabase project
2. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Create demo user in Supabase with `tier: 'explorers'`
4. Navigate to `/login` and sign in

---

**Quick Start:** Just open the app and click **"Try Demo Mode →"** on the homepage! 🎉

# 🏰 LIVE SITE INTEGRATION PLAN - mzmarianna.com

**Date:** February 3, 2026
**Site:** https://mzmarianna.com
**Status:** Production site running, WOWL AI needs enhancement

---

## 🔍 **WHAT I DISCOVERED**

### **✅ What You ALREADY Have (Impressive!)**

1. **Complete Production Platform**
   - 165+ files, ~15,500+ lines of code
   - Supabase backend connected
   - Authentication system working
   - Dashboard for Students/Parents/Tutors/Admin
   - Warriors curriculum integrated
   - Dark theme with crown logo and circuit-board patterns

2. **WOWL AI Chat Component** 
   - File: `/components/student/WowlAIChat.tsx`
   - Beautiful UI with floating chat button
   - Welcome messages
   - Suggestion chips
   - Keyword-based intelligent responses
   - ⚠️ **Uses placeholder AI** - waiting for Gemini integration

3. **WOWL AI Agent System**
   - File: `/lib/wowl-ai-agent.ts`
   - Task generation (daily, adaptive)
   - Report generation (daily, weekly, alerts)
   - Learning pattern analysis
   - Break detection
   - ⚠️ **Not connected to chat UI**

4. **Multiple WOWL Components**
   - `WowlAIChat.tsx` - Chat interface
   - `WowlChat.tsx` - Alternative chat?
   - `WowlDashboard.tsx` - Dashboard widget
   - `WowlInstructor.tsx` - Instruction interface
   - `wowl-ai-agent.ts` - Task/report engine
   - `wowl-personality.ts` - Personality traits
   - `wowl-voice.ts` - Voice characteristics
   - `wowl-mastery-engine.ts` - Mastery tracking

5. **Database Structure**
   - Users, students, parents, tutors
   - Quests, challenges, submissions
   - XP, badges, streaks
   - Student competencies
   - Quest enrollments
   - Analytics events

### **❌ What's Missing**

1. **Adaptive Engine File**
   - You shared the code in chat
   - But `/lib/curriculum/adaptive-engine.ts` doesn't exist yet
   - Need to create it

2. **Gemini API Integration**
   - `WowlAIChat.tsx` has placeholder: `// TODO: Replace this with actual Gemini/Firebase AI call`
   - `/lib/ai/gemini-service.ts` exists but not used by WowlAIChat
   - Need to connect them

3. **Competency Tracking Integration**
   - Database tables exist (student_competencies, quest_competencies)
   - But likely empty (no mappings)
   - Not being used by WOWL yet

4. **WOWL Components Not Connected**
   - Multiple WOWL files but they're separate
   - Need unified system

---

## 🎯 **INTEGRATION STRATEGY**

### **Phase 1: Create Missing Files (30 min)**

**Step 1.1: Create Adaptive Engine** (10 min)
- Create `/lib/curriculum/adaptive-engine.ts`
- Paste the code you provided (generateRecommendations, etc.)
- Export all functions

**Step 1.2: Create Competency Framework** (10 min)
- Create `/lib/curriculum/competency-framework.ts`
- Define 100+ competencies across 12 domains
- Or use simplified version for now

**Step 1.3: Connect Gemini to WowlAIChat** (10 min)
- Update `WowlAIChat.tsx` to import `/lib/ai/gemini-service.ts`
- Replace placeholder `generateAIResponse()` with Gemini call
- Test responses

---

### **Phase 2: Integrate Adaptive Engine (45 min)**

**Step 2.1: Update WowlAIChat** (15 min)
- Import adaptive engine functions
- Fetch student mastery data
- Use `generateRecommendations()` for suggestions
- Use `getNextCompetencyToWork()` for challenges

**Step 2.2: Create Next-Challenge Endpoint** (15 min)
- Create `/api/students/[id]/next-challenge.ts`
- Use adaptive engine for smart recommendations
- Return WOWL messages with recommendations

**Step 2.3: Connect WOWL Agent to Adaptive Engine** (15 min)
- Update `wowl-ai-agent.ts`
- Import adaptive engine
- Use it in `generateDailyTasks()`
- Use it in `generateAdaptiveTasks()`

---

### **Phase 3: Add Quest Auto-Progression (30 min)**

**Step 3.1: Create Quest Completion Handler** (15 min)
- Update quest completion API
- Use `/lib/services/quest-progression-service.ts`
- Auto-assign next quest

**Step 3.2: Update Challenge Completion** (15 min)
- Update challenge completion API
- Update mastery tracking
- Award XP and competency boosts

---

### **Phase 4: Database Population (2-4 hours - OPTIONAL for now)**

**Step 4.1: Populate quest_competencies**
- Map each quest to 2-5 competencies
- Create SQL migration
- Run on production

**Step 4.2: Populate challenge_competencies**
- Map each challenge to 1-2 competencies
- Add mastery_boost values
- Run on production

---

## 📋 **IMMEDIATE ACTIONS (Next 30 Minutes)**

### **Action 1: Create Adaptive Engine File**

Create `/lib/curriculum/adaptive-engine.ts`:

```typescript
// Paste the code you provided earlier:
// - generateRecommendations()
// - getNextCompetencyToWork()
// - calculateDomainReadiness()
// - isQuestUnlocked()
// - All interfaces and constants
```

---

### **Action 2: Connect Gemini to WowlAIChat**

Update `/components/student/WowlAIChat.tsx`:

**Find line 69:**
```typescript
// AI Response Generator (placeholder - replace with Gemini/Firebase AI)
const generateAIResponse = async (userMessage: string): Promise<string> => {
```

**Replace with:**
```typescript
import { generateWowlResponse, detectEmotionalState } from '@/lib/ai/gemini-service';
import type { StudentContext, BehaviorSignals } from '@/lib/ai/gemini-service';

const generateAIResponse = async (userMessage: string): Promise<string> => {
  // Build student context
  const studentContext: StudentContext = {
    id: '...', // from props
    name: studentName,
    age: 10, // from student data
    tier: 'explorers', // from student data
    skillLevels: {
      math: 5,
      reading: 7,
      writing: 5,
      steam: 6,
    },
    knowledgeGaps: [], // from adaptive engine
    strengths: [], // from adaptive engine
    learningStyle: learningStyle as any,
    currentQuest: undefined,
    recentProgress: {
      xpThisWeek: 0,
      questsCompleted: 0,
      streakDays: 0,
      lastSessionMinutes: 0,
    },
  };

  // Build behavior signals (would track in real-time)
  const behaviorSignals: BehaviorSignals = {
    clickSpeed: 'normal',
    timeOnCurrentProblem: 0,
    helpRequestsLast10Min: 0,
    successRateLast5Attempts: 0.5,
    messagesSent: messages.length,
    messagesReceived: messages.filter(m => m.role === 'assistant').length,
    quitAttemptsRecent: 0,
    inferredEmotion: 'neutral',
  };

  // Call Gemini service
  const response = await generateWowlResponse(
    userMessage,
    studentContext,
    behaviorSignals,
    []
  );

  return response.message;
};
```

---

### **Action 3: Add Gemini API Key**

**Option A: If you have Gemini API key**

Add to environment variables:
```bash
# .env.local
VITE_GEMINI_API_KEY=your-api-key-here
```

Then in your app initialization (e.g., `src/main.tsx`):
```typescript
import { initializeGemini } from './lib/ai/gemini-service';

// Initialize Gemini on app startup
if (import.meta.env.VITE_GEMINI_API_KEY) {
  initializeGemini(import.meta.env.VITE_GEMINI_API_KEY);
}
```

**Option B: If you DON'T have Gemini API key yet**

The fallback responses in `/lib/ai/gemini-service.ts` will work fine!
They already use your brand voice.

---

## 🧪 **TESTING PLAN**

### **Test 1: Adaptive Engine**

Create test file `/lib/curriculum/adaptive-engine.test.ts`:

```typescript
import { generateRecommendations } from './adaptive-engine';

// Test with sample data
const masteryData = [
  { competencyId: 1, domain: 'Math', skillName: 'Addition', masteryPercentage: 35, attempts: 5, lastAssessedAt: '2026-02-01' },
  { competencyId: 2, domain: 'Reading', skillName: 'Phonics', masteryPercentage: 70, attempts: 10, lastAssessedAt: '2026-02-02' },
];

const recommendations = generateRecommendations(
  'explorers',
  masteryData,
  [], // availableQuests
  [], // completedQuestIds
  []  // inProgressQuestIds
);

console.log('Recommendations:', recommendations);
```

Run:
```bash
npm run dev
# Open browser console to see results
```

---

### **Test 2: WOWL Chat with Gemini**

1. Start dev server: `npm run dev`
2. Log in as a student
3. Open WOWL chat (floating button)
4. Send message: "This is too hard"
5. **Expected:** Short, direct response offering break
6. **Check:** Response uses brand voice (1-2 sentences)

---

### **Test 3: Adaptive Recommendations**

1. Complete a challenge
2. Check console logs for mastery updates
3. Open WOWL chat
4. Ask: "What should I work on next?"
5. **Expected:** Recommendation based on weakest domain

---

## 🚨 **CURRENT ISSUES TO FIX**

### **Issue 1: Multiple WOWL Files**

**Problem:** You have 8 different WOWL-related files that aren't unified

**Files:**
- `/components/student/WowlAIChat.tsx` - Main chat UI
- `/components/student/WowlChat.tsx` - Alternative?
- `/components/student/WowlDashboard.tsx` - Dashboard widget
- `/components/student/WowlInstructor.tsx` - Instruction UI
- `/lib/wowl-ai-agent.ts` - Task/report generation
- `/lib/wowl-personality.ts` - Personality traits
- `/lib/wowl-voice.ts` - Voice characteristics
- `/lib/wowl-mastery-engine.ts` - Mastery tracking

**Solution:**
1. Make `WowlAIChat.tsx` the primary chat interface
2. Import `wowl-ai-agent.ts` for task generation
3. Import `wowl-personality.ts` and `wowl-voice.ts` for consistent voice
4. Import `wowl-mastery-engine.ts` for progress tracking
5. Use `WowlDashboard.tsx` and `WowlInstructor.tsx` as separate widgets
6. Consider deprecating `WowlChat.tsx` if it's redundant

---

### **Issue 2: Gemini Service Not Used**

**Problem:** `/lib/ai/gemini-service.ts` exists but `WowlAIChat.tsx` doesn't use it

**Solution:** See Action 2 above

---

### **Issue 3: Adaptive Engine Missing**

**Problem:** Files import from `@/lib/curriculum/adaptive-engine` but it doesn't exist

**Solution:** See Action 1 above

---

### **Issue 4: Database Tables Empty**

**Problem:** `quest_competencies` and `challenge_competencies` likely have 0 rows

**Impact:** Adaptive recommendations can't work optimally

**Solution:** Phase 4 (2-4 hours) - can wait until after core integration

---

## 📊 **ARCHITECTURE OVERVIEW**

### **Current Architecture**

```
Frontend (React + Vite)
├── Pages/
│   ├── StudentDashboardPage.tsx
│   ├── ParentDashboardPage.tsx
│   └── ...
├── Components/
│   ├── student/
│   │   ├── WowlAIChat.tsx (needs enhancement)
│   │   ├── WowlDashboard.tsx
│   │   └── ...
│   └── ...
├── Lib/
│   ├── ai/
│   │   └── gemini-service.ts (created, not used)
│   ├── curriculum/
│   │   ├── (missing adaptive-engine.ts)
│   │   ├── (missing competency-framework.ts)
│   │   └── warriors-curriculum.ts
│   ├── wowl-ai-agent.ts (exists, not connected)
│   └── ...
└── API/ (Supabase edge functions?)

Backend (Supabase)
├── Database
│   ├── users, students, parents, tutors
│   ├── quests, challenges, submissions
│   ├── student_competencies (empty?)
│   ├── quest_competencies (empty?)
│   └── challenge_competencies (empty?)
└── Functions
    └── (edge functions for email, etc.)
```

### **Target Architecture (After Integration)**

```
Frontend
├── WowlAIChat.tsx
│   ├── imports: gemini-service.ts
│   ├── imports: adaptive-engine.ts
│   ├── imports: wowl-ai-agent.ts
│   └── generates: smart responses + recommendations
├── StudentDashboard
│   ├── shows: next recommended challenge
│   ├── shows: WOWL tasks from ai-agent
│   └── shows: progress from mastery-engine
└── ...

Backend
├── Database (populated)
│   ├── quest_competencies (200+ rows)
│   ├── challenge_competencies (500+ rows)
│   └── student_competencies (tracked in real-time)
├── API Routes (new)
│   ├── /api/students/[id]/next-challenge
│   ├── /api/quests/[id]/complete (enhanced)
│   └── /api/challenges/[id]/complete (enhanced)
└── ...
```

---

## ⚡ **QUICK START CHECKLIST**

### **Right Now (10 minutes)**

- [ ] Create `/lib/curriculum/adaptive-engine.ts` with your code
- [ ] Create `/lib/curriculum/competency-framework.ts` (simplified for now)
- [ ] Test that files import correctly: `npm run dev`

### **Next (20 minutes)**

- [ ] Update `WowlAIChat.tsx` to use gemini-service
- [ ] Add GEMINI_API_KEY to environment (or use fallback)
- [ ] Test chat with sample messages
- [ ] Verify responses use brand voice

### **Then (30 minutes)**

- [ ] Connect `wowl-ai-agent.ts` to adaptive engine
- [ ] Update `generateDailyTasks()` to use recommendations
- [ ] Test task generation on student dashboard

### **Finally (45 minutes)**

- [ ] Create next-challenge API endpoint
- [ ] Update quest completion handler
- [ ] Update challenge completion handler
- [ ] Test full flow: complete challenge → mastery updates → next recommendation

---

## 🎯 **SUCCESS CRITERIA**

**After Phase 1 (30 min):**
- ✅ Adaptive engine file exists and imports
- ✅ Gemini service connected to WowlAIChat
- ✅ Chat responses use brand voice

**After Phase 2 (1 hour 15 min):**
- ✅ WOWL recommends challenges based on mastery
- ✅ Adaptive engine generates smart suggestions
- ✅ Student dashboard shows personalized tasks

**After Phase 3 (1 hour 45 min):**
- ✅ Quest completion auto-assigns next quest
- ✅ Challenge completion updates mastery
- ✅ WOWL celebrates achievements automatically

**After Phase 4 (3-5 hours total):**
- ✅ Database fully populated with mappings
- ✅ System optimally recommends based on weak skills
- ✅ Ready for production scale

---

## 🦉 **NEXT IMMEDIATE ACTION**

**I'll create the missing files for you now:**

1. ✅ `/lib/curriculum/adaptive-engine.ts` - Your code
2. ✅ `/lib/curriculum/competency-framework.ts` - Simplified version
3. ✅ Update imports in existing files

**Then you:**

1. Add your Gemini API key (or keep using fallback)
2. Test on localhost
3. Deploy when ready

**Ready? Let me create those files!** 🚀


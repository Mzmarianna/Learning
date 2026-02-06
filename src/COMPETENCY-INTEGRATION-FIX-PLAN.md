# 🎯 COMPETENCY FRAMEWORK INTEGRATION - FIX PLAN

## 📊 **CURRENT STATE SUMMARY**

### ✅ **What EXISTS (But Not Fully Connected):**

1. **IB-Aligned Competency Framework** (`/lib/curriculum/competency-framework.ts`)
   - 100+ competencies across 12 domains
   - 4 mastery levels (attempted → familiar → proficient → mastery)
   - Organized by tier (Early Explorers, Explorers, Warriors)

2. **Adaptive Recommendation Engine** (`/lib/curriculum/adaptive-engine.ts`)
   - `generateRecommendations()` - Smart quest suggestions
   - `getNextCompetencyToWork()` - Identifies sweet spot skills
   - Analyzes mastery data to prioritize learning

3. **Database Tables (Schema Ready):**
   - `student_competencies` - Tracks mastery per student
   - `quest_competencies` - Maps quests to skills they teach
   - `challenge_competencies` - Maps challenges to skills
   - `learning_goals` - Student objectives

4. **Quiz-Based Initial Assignment**
   - Quiz calculates scores
   - Calls `getQuestRecommendations()`
   - Creates quest_enrollments

### ❌ **What's BROKEN/MISSING:**

1. **Quest-Competency Mappings EMPTY**
   - `quest_competencies` table likely has 0 rows
   - Can't recommend quests based on weak skills without this

2. **Challenge-Competency Mappings EMPTY**
   - `challenge_competencies` table likely has 0 rows
   - Completing challenges doesn't update mastery

3. **WOWL Doesn't Use Adaptive Engine**
   - `/api/students/:id/next-challenge` doesn't call `generateRecommendations()`
   - Misses opportunity for smart targeting

4. **Quest Assignment Creates ALL Quests at Once**
   - Enrollment creates 4 quest_enrollments (math, reading, writing, STEAM)
   - Should only create 1 (weakest area) + store others as recommendations

5. **No Auto-Progression After Quest Completion**
   - Student completes quest → No automatic "next quest" assignment
   - Must browse quest board manually

---

## 🚀 **PRIORITY FIX ORDER**

### **P0: Database Population (CRITICAL - NOTHING WORKS WITHOUT THIS)**

**Problem:** Empty `quest_competencies` and `challenge_competencies` tables
**Impact:** Entire competency system is dormant
**Effort:** 2-4 hours (tedious but straightforward)

**Files to Create:**
- `/supabase/migrations/20260203_populate_quest_competencies.sql`
- `/supabase/migrations/20260203_populate_challenge_competencies.sql`

**Example Mapping:**
```sql
-- Quest 001: Great Number Quest → Math competencies
INSERT INTO quest_competencies (quest_id, competency_id, is_primary, weight) VALUES
  ('quest-001', 'MATH-EE-003', true, 100),   -- Addition (primary)
  ('quest-001', 'MATH-EE-004', true, 100),   -- Subtraction (primary)
  ('quest-001', 'MATH-EE-001', false, 50);   -- Counting (secondary)

-- Challenge 001-A: Simple Addition → Specific competency
INSERT INTO challenge_competencies (challenge_id, competency_id, mastery_boost) VALUES
  ('challenge-001-a', 'MATH-EE-003', 5);     -- +5% mastery when completed
```

**Action Items:**
- [ ] Audit all quests (how many exist?)
- [ ] Map each quest to 2-5 competencies
- [ ] Audit all challenges (how many exist?)
- [ ] Map each challenge to 1-2 competencies
- [ ] Create SQL migration files
- [ ] Run migrations
- [ ] Verify with `SELECT COUNT(*) FROM quest_competencies;`

---

### **P1: Fix Quest Assignment Logic**

**Problem:** Enrollment creates 4 quests at once instead of 1
**Impact:** Overwhelming for students, no clear "next step"
**Effort:** 30 minutes

**File to Modify:** `/api/students/enroll` (or wherever quiz → quest assignment happens)

**BEFORE:**
```typescript
const questRecommendations = getQuestRecommendations(mathScore, readingScore, efScore);
for (const quest of questRecommendations) {
  await db.prepare(
    `INSERT INTO quest_enrollments (student_id, subject, level, status) 
     VALUES (?, ?, ?, 'active')`
  ).bind(studentId, quest.subject, quest.level).run();
}
```

**AFTER:**
```typescript
const questRecommendations = getQuestRecommendations(mathScore, readingScore, efScore);

// Assign ONLY the first quest (weakest area)
const primaryQuest = questRecommendations[0];
await db.prepare(
  `INSERT INTO quest_enrollments (student_id, subject, level, status) 
   VALUES (?, ?, ?, 'active')`
).bind(studentId, primaryQuest.subject, primaryQuest.level).run();

// Store the OTHER recommendations for later
for (let i = 1; i < questRecommendations.length; i++) {
  await db.prepare(
    `INSERT INTO student_recommendations (student_id, quest_id, reason, priority) 
     VALUES (?, ?, ?, ?)`
  ).bind(
    studentId, 
    questRecommendations[i].questId, 
    `Recommended based on assessment`, 
    i
  ).run();
}

// Create learning goals for the other areas
for (const rec of questRecommendations.slice(1)) {
  await db.prepare(
    `INSERT INTO learning_goals (student_id, goal_type, target_competency, status) 
     VALUES (?, 'competency', ?, 'active')`
  ).bind(studentId, rec.targetCompetency).run();
}
```

**Action Items:**
- [ ] Create `student_recommendations` table (if doesn't exist)
- [ ] Modify enrollment endpoint
- [ ] Test with new student signup
- [ ] Verify only 1 quest_enrollment created

---

### **P2: Connect WOWL to Adaptive Engine**

**Problem:** WOWL's next-challenge API doesn't use smart recommendations
**Impact:** Students don't get optimal challenge selection
**Effort:** 1 hour

**File to Modify:** `/api/students/:id/next-challenge`

**BEFORE:**
```typescript
// Just checks for any available challenge in active quests
const nextChallenge = await db.prepare(
  `SELECT * FROM student_challenges 
   WHERE student_id = ? AND status = 'available' 
   LIMIT 1`
).bind(studentId).first();
```

**AFTER:**
```typescript
import { generateRecommendations, getNextCompetencyToWork } from '@/lib/curriculum/adaptive-engine';
import { getStudentCompetencies } from '@/lib/curriculum/competency-service';

// Get student's current mastery data
const masteryData = await getStudentCompetencies(studentId);

// Get student's tier
const student = await getStudent(studentId);

// Generate smart recommendations
const recommendations = generateRecommendations(
  student.tier,
  masteryData,
  [], // availableQuests - fetch from quest_enrollments
  []  // completedQuests - fetch from history
);

// Get the next competency they should work on
const nextCompetency = getNextCompetencyToWork(masteryData);

// Find challenge that teaches this competency
const nextChallenge = await db.prepare(
  `SELECT sc.* FROM student_challenges sc
   JOIN challenge_competencies cc ON sc.challenge_id = cc.challenge_id
   WHERE sc.student_id = ? 
     AND sc.status = 'available'
     AND cc.competency_id = ?
   ORDER BY sc.difficulty ASC
   LIMIT 1`
).bind(studentId, nextCompetency.id).first();

// If no challenge found for that competency, fall back to any available
if (!nextChallenge) {
  nextChallenge = await db.prepare(
    `SELECT * FROM student_challenges 
     WHERE student_id = ? AND status = 'available' 
     LIMIT 1`
  ).bind(studentId).first();
}
```

**Action Items:**
- [ ] Create `getStudentCompetencies()` helper function
- [ ] Modify `/api/students/:id/next-challenge` endpoint
- [ ] Test recommendations with sample student
- [ ] Verify it prioritizes weak competencies

---

### **P3: Auto-Progression After Quest Completion**

**Problem:** No automatic "next quest" assignment when current quest completes
**Impact:** Students lose momentum, parents must intervene
**Effort:** 45 minutes

**File to Create:** `/lib/services/quest-progression-service.ts`

```typescript
import { generateRecommendations } from '@/lib/curriculum/adaptive-engine';
import { getStudentCompetencies } from '@/lib/curriculum/competency-service';

export async function handleQuestCompletion(studentId: string, completedQuestId: string) {
  // 1. Mark quest as completed
  await db.prepare(
    `UPDATE quest_enrollments 
     SET status = 'completed', completed_at = ? 
     WHERE student_id = ? AND quest_id = ?`
  ).bind(new Date(), studentId, completedQuestId).run();
  
  // 2. Update learning goals
  await updateLearningGoals(studentId, completedQuestId);
  
  // 3. Get updated mastery data
  const masteryData = await getStudentCompetencies(studentId);
  
  // 4. Get student tier
  const student = await getStudent(studentId);
  
  // 5. Generate new recommendations
  const recommendations = generateRecommendations(
    student.tier,
    masteryData,
    [], // available quests
    []  // completed quests
  );
  
  // 6. Assign next quest automatically
  if (recommendations.length > 0) {
    const nextQuest = recommendations[0];
    
    await db.prepare(
      `INSERT INTO quest_enrollments (student_id, quest_id, status, auto_assigned) 
       VALUES (?, ?, 'active', true)`
    ).bind(studentId, nextQuest.questId).run();
    
    // 7. Send WOWL notification
    await sendWowlMessage(studentId, {
      message: `Great job completing that quest! I found your next adventure. Want to try it?`,
      questId: nextQuest.questId,
      reason: nextQuest.reason
    });
  }
  
  // 8. Celebrate completion
  await awardCompletionXP(studentId, completedQuestId);
}
```

**Action Items:**
- [ ] Create quest-progression-service.ts
- [ ] Hook into quest completion event
- [ ] Test auto-assignment flow
- [ ] Verify WOWL sends notification

---

### **P4: Competency Mastery Updates**

**Problem:** Completing challenges doesn't update `student_competencies` 
**Impact:** Mastery tracking doesn't work
**Effort:** 30 minutes

**File to Modify:** `/api/challenges/:id/complete` (or wherever challenge completion is handled)

**Add This Logic:**
```typescript
// After marking challenge as complete
const challengeCompetencies = await db.prepare(
  `SELECT competency_id, mastery_boost 
   FROM challenge_competencies 
   WHERE challenge_id = ?`
).bind(challengeId).all();

for (const cc of challengeCompetencies.results) {
  // Update or insert student_competency record
  await db.prepare(
    `INSERT INTO student_competencies (student_id, competency_id, mastery_percentage, attempts, last_attempted_at)
     VALUES (?, ?, ?, 1, ?)
     ON CONFLICT (student_id, competency_id) DO UPDATE SET
       mastery_percentage = MIN(100, mastery_percentage + ?),
       attempts = attempts + 1,
       last_attempted_at = ?`
  ).bind(
    studentId, 
    cc.competency_id, 
    cc.mastery_boost, 
    new Date(),
    cc.mastery_boost,
    new Date()
  ).run();
}
```

**Action Items:**
- [ ] Find challenge completion handler
- [ ] Add competency update logic
- [ ] Test with sample challenge
- [ ] Verify mastery_percentage increments

---

## 📋 **IMPLEMENTATION CHECKLIST**

### **Phase 1: Database Population (Week 1)**
- [ ] **Day 1:** Audit quests (count, list IDs)
- [ ] **Day 1:** Map top 10 quests to competencies
- [ ] **Day 2:** Map remaining quests to competencies
- [ ] **Day 2:** Create quest_competencies migration SQL
- [ ] **Day 3:** Audit challenges (count, list IDs)
- [ ] **Day 3:** Map challenges to competencies
- [ ] **Day 3:** Create challenge_competencies migration SQL
- [ ] **Day 4:** Run migrations on dev database
- [ ] **Day 4:** Verify mappings (`SELECT COUNT(*)` queries)
- [ ] **Day 5:** Deploy to production

### **Phase 2: Fix Quest Assignment (Week 1)**
- [ ] **Day 5:** Create student_recommendations table migration
- [ ] **Day 5:** Modify enrollment endpoint (1 quest only)
- [ ] **Day 5:** Test with new student signup
- [ ] **Day 5:** Verify behavior

### **Phase 3: Connect WOWL to Adaptive Engine (Week 2)**
- [ ] **Day 8:** Create getStudentCompetencies() helper
- [ ] **Day 8:** Modify /api/students/:id/next-challenge
- [ ] **Day 9:** Test recommendations
- [ ] **Day 9:** Verify weak competencies prioritized

### **Phase 4: Auto-Progression (Week 2)**
- [ ] **Day 10:** Create quest-progression-service.ts
- [ ] **Day 10:** Hook into quest completion event
- [ ] **Day 11:** Test auto-assignment
- [ ] **Day 11:** Verify WOWL notifications

### **Phase 5: Mastery Updates (Week 2)**
- [ ] **Day 12:** Add competency update logic to challenge completion
- [ ] **Day 12:** Test mastery_percentage increments
- [ ] **Day 12:** Final integration testing

---

## 🧪 **TESTING PLAN**

### **Test Case 1: New Student Enrollment**
1. Student completes quiz (scores: Math=3, Reading=7, EF=5)
2. **Expected:** Only 1 quest assigned (Math - weakest area)
3. **Expected:** 3 recommendations stored in student_recommendations
4. **Expected:** 3 learning_goals created

### **Test Case 2: WOWL Next Challenge**
1. Student has low mastery in "Addition" (30%)
2. Student has high mastery in "Reading Comprehension" (85%)
3. **Expected:** WOWL recommends Addition challenge, not Reading
4. **Expected:** Challenge difficulty matches student level

### **Test Case 3: Quest Completion**
1. Student completes "Great Number Quest"
2. **Expected:** Quest marked complete
3. **Expected:** New quest auto-assigned (next weakest area)
4. **Expected:** WOWL sends congratulations + next quest notification

### **Test Case 4: Mastery Tracking**
1. Student completes challenge (teaches "Subtraction", mastery_boost=5)
2. **Expected:** student_competencies.mastery_percentage increases by 5
3. **Expected:** attempts count increments
4. **Expected:** last_attempted_at updates

---

## 📊 **VERIFICATION QUERIES**

Run these after each phase:

```sql
-- Phase 1: Verify quest-competency mappings
SELECT 
  q.title,
  COUNT(qc.competency_id) as competency_count
FROM quests q
LEFT JOIN quest_competencies qc ON q.id = qc.quest_id
GROUP BY q.id, q.title
ORDER BY competency_count DESC;

-- Expected: Every quest has 2-5 competencies mapped

-- Phase 2: Verify single quest assignment
SELECT 
  s.name,
  COUNT(qe.id) as active_quest_count
FROM students s
LEFT JOIN quest_enrollments qe ON s.id = qe.student_id AND qe.status = 'active'
GROUP BY s.id, s.name;

-- Expected: Each student has 1 active quest (not 4)

-- Phase 3: Verify adaptive recommendations
SELECT 
  sc.competency_id,
  c.name as competency_name,
  sc.mastery_percentage,
  COUNT(challenge_id) as available_challenges
FROM student_competencies sc
JOIN competencies c ON sc.competency_id = c.id
LEFT JOIN challenge_competencies cc ON sc.competency_id = cc.competency_id
WHERE sc.student_id = ?
  AND sc.mastery_percentage < 70
GROUP BY sc.competency_id, c.name, sc.mastery_percentage
ORDER BY sc.mastery_percentage ASC;

-- Expected: Lowest mastery competency has challenges available

-- Phase 4: Verify auto-progression
SELECT 
  qe.quest_id,
  qe.status,
  qe.auto_assigned,
  qe.created_at
FROM quest_enrollments qe
WHERE qe.student_id = ?
ORDER BY qe.created_at DESC
LIMIT 5;

-- Expected: Recent quests have auto_assigned = true

-- Phase 5: Verify mastery updates
SELECT 
  c.name,
  sc.mastery_percentage,
  sc.attempts,
  sc.last_attempted_at
FROM student_competencies sc
JOIN competencies c ON sc.competency_id = c.id
WHERE sc.student_id = ?
ORDER BY sc.last_attempted_at DESC;

-- Expected: Mastery increases after challenge completions
```

---

## 🚨 **RISKS & MITIGATIONS**

### **Risk 1: Quest-Competency Mapping is HUGE Effort**
**Impact:** Could take days to map 50+ quests × 5 competencies each
**Mitigation:** 
- Start with top 10 most-used quests
- Use AI to suggest mappings (review manually)
- Prioritize Tier 1 (Explorers) first

### **Risk 2: Breaking Existing Quest Assignments**
**Impact:** Current students might have 4 active quests that suddenly break
**Mitigation:**
- Migration script: Mark existing multi-quest enrollments as legacy
- Only apply new logic to NEW enrollments
- Grandfather existing students

### **Risk 3: Adaptive Engine Recommends Wrong Quests**
**Impact:** Student gets quests that are too hard/easy
**Mitigation:**
- Add difficulty bounds to recommendations
- Allow manual override by tutors
- A/B test new logic vs old logic

---

## 🎯 **SUCCESS METRICS**

**After Phase 1:**
- ✅ 100% of quests have ≥2 competency mappings
- ✅ 100% of challenges have ≥1 competency mapping

**After Phase 2:**
- ✅ New students get 1 active quest (not 4)
- ✅ Recommendations stored in student_recommendations

**After Phase 3:**
- ✅ WOWL next-challenge prioritizes low-mastery competencies
- ✅ 80%+ of challenges match student's weak areas

**After Phase 4:**
- ✅ Quest completion → auto-assigns next quest (100%)
- ✅ Students don't need parent intervention to progress

**After Phase 5:**
- ✅ Challenge completion → mastery_percentage increases
- ✅ Mastery tracking works for 100% of students

---

## ⏱️ **TIMELINE ESTIMATE**

| Phase | Effort | Timeline |
|-------|--------|----------|
| P0: Database Population | 2-4 hours | Day 1-5 |
| P1: Fix Quest Assignment | 30 min | Day 5 |
| P2: Connect WOWL to Adaptive Engine | 1 hour | Day 8-9 |
| P3: Auto-Progression | 45 min | Day 10-11 |
| P4: Mastery Updates | 30 min | Day 12 |
| **Total:** | **5-7 hours** | **Week 1-2** |

---

## 📝 **NEXT IMMEDIATE ACTION**

**Option A: I Start Building (RECOMMENDED)**
- I create the quest-competency mapping migration
- I modify quest assignment logic
- I connect WOWL to adaptive engine
- You review and test

**Option B: You Audit First**
- You count how many quests exist
- You count how many challenges exist
- You decide which to map first
- Then I build the migrations

**Option C: Parallel Work**
- I start on P1-P2 (code changes)
- You work on P0 (mapping quests to competencies)
- We merge when both done

---

**Which option do you prefer?**

1. I start building now (fastest)
2. You audit first (more strategic)
3. Parallel work (efficient)

🦉 **Let me know and I'll execute immediately!** 👑

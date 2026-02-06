# 🎮 GAME PROGRESS SYSTEM - SETUP GUIDE

**Status:** ✅ **READY FOR DEPLOYMENT**

---

## 📋 **OVERVIEW**

Your Mz. Marianna's Academy platform now has a complete **gamification system** with:

- ✅ **XP & Leveling** - Students earn XP and level up
- ✅ **Gems** - In-game currency for rewards
- ✅ **Character Unlocks** - Unlock companions at different levels
- ✅ **Auto-progression** - XP automatically calculates levels
- ✅ **Database triggers** - Auto-initialize on signup
- ✅ **Client API** - Easy-to-use functions for progress tracking

---

## 🗄️ **DATABASE SCHEMA**

### **Student Profiles Table**

```sql
CREATE TABLE student_profiles (
  id UUID PRIMARY KEY,
  age INTEGER,
  tier tier_level,
  current_level INTEGER DEFAULT 1,
  total_xp INTEGER DEFAULT 0,
  gems INTEGER DEFAULT 0,
  unlocked_characters JSONB DEFAULT '["wise_owl", "sparkle_unicorn"]'::jsonb,
  current_quest_id TEXT,
  preferences JSONB,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### **Key Fields:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `current_level` | INTEGER | 1 | Student's current level |
| `total_xp` | INTEGER | 0 | Total XP earned all-time |
| `gems` | INTEGER | 0 | In-game currency balance |
| `unlocked_characters` | JSONB | `["wise_owl", "sparkle_unicorn"]` | Array of unlocked companion IDs |

---

## 🚀 **DEPLOYMENT STEPS**

### **1. Update Your Supabase Database**

#### **Option A: New Database (Fresh Install)**

Run the complete schema:

```bash
# In Supabase SQL Editor
psql -f supabase/schema.sql
psql -f supabase/functions.sql
```

#### **Option B: Existing Database (Migration)**

Run the migration to add new fields:

```bash
# In Supabase SQL Editor
psql -f supabase/migrations/add-game-progress-fields.sql
```

Or manually in SQL Editor:

```sql
-- Add gems column
ALTER TABLE student_profiles 
ADD COLUMN IF NOT EXISTS gems INTEGER DEFAULT 0;

-- Add unlocked_characters column
ALTER TABLE student_profiles 
ADD COLUMN IF NOT EXISTS unlocked_characters JSONB 
DEFAULT '["wise_owl", "sparkle_unicorn"]'::jsonb;

-- Update existing students
UPDATE student_profiles 
SET unlocked_characters = '["wise_owl", "sparkle_unicorn"]'::jsonb
WHERE unlocked_characters IS NULL;

UPDATE student_profiles 
SET gems = 0
WHERE gems IS NULL;
```

### **2. Deploy Database Functions**

Make sure the `handle_new_user()` trigger is installed:

```bash
# In Supabase SQL Editor
psql -f supabase/functions.sql
```

This creates:
- ✅ Auto-initialization on signup
- ✅ XP tracking functions
- ✅ Character unlock logic
- ✅ Level calculation helpers

### **3. Verify Installation**

Run this verification query:

```sql
SELECT 
  COUNT(*) as total_students,
  COUNT(*) FILTER (WHERE gems IS NOT NULL) as students_with_gems,
  COUNT(*) FILTER (WHERE unlocked_characters IS NOT NULL) as students_with_characters
FROM student_profiles;
```

Expected result: All students should have `gems` and `unlocked_characters`

---

## 💻 **CLIENT-SIDE INTEGRATION**

### **Import the Game Progress API**

```typescript
import gameProgress from './lib/api/game-progress';
```

### **Available Functions:**

#### **1. Get Student's Game State**

```typescript
const state = await gameProgress.getUserGameState(userId);
// Returns: { user_id, current_level, total_xp, gems, unlocked_characters }
```

#### **2. Award XP and Gems**

```typescript
const result = await gameProgress.updateProgress(userId, xpGained, gemsGained);
// Returns: { success, newLevel, leveledUp, newCharacters }
```

#### **3. Award XP Only**

```typescript
await gameProgress.awardXp(userId, 100);
```

#### **4. Award Gems Only**

```typescript
await gameProgress.awardGems(userId, 50);
```

#### **5. Spend Gems**

```typescript
const result = await gameProgress.spendGems(userId, 200);
// Returns: { success, error? }
```

#### **6. Unlock Character**

```typescript
const result = await gameProgress.unlockCharacter(userId, 'swift_horse');
```

#### **7. Get Character Unlock Status**

```typescript
const characters = await gameProgress.getCharacterStatus(userId);
// Returns: [{ character, unlocked, canUnlock }]
```

#### **8. Get Leaderboard**

```typescript
const topPlayers = await gameProgress.getLeaderboard(10);
```

---

## 🎯 **LEVELING SYSTEM**

### **XP Formula:**

```typescript
Level = floor(total_xp / 1000) + 1
```

- **Level 1:** 0 - 999 XP
- **Level 2:** 1000 - 1999 XP
- **Level 3:** 2000 - 2999 XP
- etc.

### **Character Unlocks:**

| Character | Level Required | Description |
|-----------|----------------|-------------|
| 🦉 Wise Owl | 1 (starter) | Starter companion - wise and encouraging |
| 🦄 Sparkle Unicorn | 1 (starter) | Starter companion - magical and fun |
| 🐴 Swift Horse | 5 | Gallop through challenges |
| 🐐 Grammar Goat | 10 | Master of words |
| 🐉 Math Dragon | 15 | Breathes fire with numbers |
| 🦊 Science Fox | 20 | Clever and curious |

---

## 🔧 **EXAMPLE USAGE**

### **When a Student Completes a Challenge:**

```typescript
import gameProgress from './lib/api/game-progress';

async function handleChallengeComplete(studentId: string, masteryLevel: string) {
  // Calculate XP based on mastery
  const xpMap = {
    emerging: 50,
    developing: 75,
    proficient: 100,
    advanced: 150,
    mastered: 200,
  };
  
  const xpGained = xpMap[masteryLevel] || 100;
  const gemsGained = masteryLevel === 'mastered' ? 20 : 10;
  
  // Update progress
  const result = await gameProgress.updateProgress(studentId, xpGained, gemsGained);
  
  // Show notifications
  if (result.leveledUp) {
    console.log(`🎉 Level up! Now level ${result.newLevel}`);
  }
  
  if (result.newCharacters && result.newCharacters.length > 0) {
    console.log(`🎁 Unlocked: ${result.newCharacters.join(', ')}`);
  }
}
```

### **Display Student Progress:**

```typescript
import gameProgress from './lib/api/game-progress';

async function showStudentStats(studentId: string) {
  const state = await gameProgress.getUserGameState(studentId);
  
  if (state) {
    const progress = gameProgress.getLevelProgress(state.total_xp);
    
    console.log(`Level ${progress.currentLevel}`);
    console.log(`XP: ${progress.xpInCurrentLevel} / 1000`);
    console.log(`Progress: ${progress.progressPercentage.toFixed(1)}%`);
    console.log(`Gems: ${state.gems}`);
    console.log(`Characters: ${state.unlocked_characters.length}`);
  }
}
```

### **Shop Purchase (Spend Gems):**

```typescript
async function purchaseItem(studentId: string, itemCost: number) {
  const result = await gameProgress.spendGems(studentId, itemCost);
  
  if (result.success) {
    console.log('Purchase successful!');
  } else {
    console.error('Not enough gems!', result.error);
  }
}
```

---

## 🎨 **UI INTEGRATION IDEAS**

### **Student Dashboard:**

```tsx
import { useEffect, useState } from 'react';
import gameProgress from './lib/api/game-progress';

function StudentDashboard({ studentId }: { studentId: string }) {
  const [state, setState] = useState(null);
  
  useEffect(() => {
    gameProgress.getUserGameState(studentId).then(setState);
  }, [studentId]);
  
  if (!state) return <div>Loading...</div>;
  
  const progress = gameProgress.getLevelProgress(state.total_xp);
  
  return (
    <div>
      <h1>Level {progress.currentLevel}</h1>
      <ProgressBar 
        value={progress.progressPercentage} 
        label={`${progress.xpInCurrentLevel} / 1000 XP`}
      />
      <div>💎 {state.gems} Gems</div>
      <div>
        <h2>Your Companions</h2>
        {state.unlocked_characters.map(char => (
          <CharacterCard key={char} characterId={char} />
        ))}
      </div>
    </div>
  );
}
```

---

## 📊 **TESTING**

### **Test Scenario 1: New Student Signup**

```sql
-- Verify default values
SELECT id, current_level, total_xp, gems, unlocked_characters
FROM student_profiles
WHERE email = 'test@example.com';

-- Expected:
-- current_level: 1
-- total_xp: 0
-- gems: 0
-- unlocked_characters: ["wise_owl", "sparkle_unicorn"]
```

### **Test Scenario 2: Award XP**

```typescript
// Award 1500 XP (should reach level 2)
await gameProgress.updateProgress('student-uuid', 1500, 0);

// Check result
const state = await gameProgress.getUserGameState('student-uuid');
console.log(state.current_level); // Should be 2
console.log(state.total_xp); // Should be 1500
```

### **Test Scenario 3: Character Unlock**

```typescript
// Award 5000 XP (should reach level 6 and unlock Swift Horse)
const result = await gameProgress.updateProgress('student-uuid', 5000, 0);

console.log(result.leveledUp); // true
console.log(result.newLevel); // 6
console.log(result.newCharacters); // ['swift_horse']
```

---

## 🔒 **ROW LEVEL SECURITY**

The game progress data is protected by RLS policies:

- ✅ **Students** can view/update their own progress
- ✅ **Parents** can view their children's progress
- ✅ **Tutors** can view assigned students' progress
- ✅ **Admins** can view all progress

RLS is **already configured** in `/supabase/schema.sql`

---

## 📈 **ANALYTICS QUERIES**

### **Top Students Leaderboard:**

```sql
SELECT 
  p.display_name,
  sp.current_level,
  sp.total_xp,
  sp.gems,
  array_length(sp.unlocked_characters, 1) as character_count
FROM student_profiles sp
JOIN profiles p ON p.id = sp.id
ORDER BY sp.total_xp DESC
LIMIT 10;
```

### **Average XP by Tier:**

```sql
SELECT 
  tier,
  AVG(total_xp) as avg_xp,
  AVG(current_level) as avg_level,
  AVG(gems) as avg_gems
FROM student_profiles
GROUP BY tier;
```

### **Character Unlock Stats:**

```sql
SELECT 
  jsonb_array_elements_text(unlocked_characters) as character,
  COUNT(*) as student_count
FROM student_profiles
GROUP BY character
ORDER BY student_count DESC;
```

---

## 🐛 **TROUBLESHOOTING**

### **Issue: Characters not unlocking**

**Check:**
```sql
SELECT current_level, unlocked_characters 
FROM student_profiles 
WHERE id = 'student-uuid';
```

**Fix:**
```typescript
// Manually trigger unlock check
const state = await gameProgress.getUserGameState(userId);
await gameProgress.updateProgress(userId, 0, 0); // Forces character check
```

### **Issue: XP not updating**

**Check RLS policies:**
```sql
SELECT * FROM student_profiles WHERE id = auth.uid();
```

**Verify trigger:**
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

### **Issue: Gems going negative**

**Prevention:** The `spendGems()` function checks balance first

```typescript
const result = await gameProgress.spendGems(userId, amount);
if (!result.success) {
  console.error('Not enough gems');
}
```

---

## ✅ **DEPLOYMENT CHECKLIST**

- [ ] Run database migration (add gems & unlocked_characters)
- [ ] Deploy database functions (handle_new_user trigger)
- [ ] Test with a new student signup
- [ ] Test awarding XP (should auto-level up)
- [ ] Test character unlocks at level 5 & 10
- [ ] Test gem awarding and spending
- [ ] Verify RLS policies are active
- [ ] Update UI to show XP/gems/characters
- [ ] Add character unlock notifications
- [ ] Add level-up celebration animations

---

## 🎯 **NEXT STEPS**

### **Phase 1: Core Integration** (This is DONE ✅)
- [x] Database schema updated
- [x] Triggers created
- [x] Client API built
- [x] TypeScript types updated

### **Phase 2: UI Enhancement** (Recommended)
- [ ] Add XP progress bar to student dashboard
- [ ] Create character gallery component
- [ ] Add "Level Up!" celebration modal
- [ ] Show gem balance in header
- [ ] Create shop for gem purchases

### **Phase 3: Advanced Features** (Future)
- [ ] Daily login streaks
- [ ] Weekly challenges for bonus XP
- [ ] Leaderboard page
- [ ] Character customization
- [ ] Gem shop with power-ups

---

## 📞 **SUPPORT**

If you encounter issues:

1. Check the `/supabase/schema.sql` file for latest schema
2. Verify `/lib/api/game-progress.ts` is imported correctly
3. Check Supabase logs for database errors
4. Review RLS policies if data isn't showing

---

## 🎉 **YOU'RE READY!**

Your game progress system is **production-ready** and integrated with:

✅ Supabase backend  
✅ Auto-progression triggers  
✅ Client-side API  
✅ TypeScript types  
✅ RLS security  
✅ Character unlocks  
✅ XP & Gems tracking  

**Start using it by running:** `npm run dev`

**Test the admin panel at:** http://localhost:5173 → Login as Admin → Create Students

---

**Happy coding! 🚀✨**

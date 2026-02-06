# 🔗 GAME PROGRESS INTEGRATION EXAMPLES

Complete examples showing how to integrate the game progress system into your existing Mz. Marianna's Academy codebase.

---

## 📍 **WHERE TO INTEGRATE**

### **1. Student Dashboard** (`/pages/StudentDashboardPage.tsx`)

Add XP/Gems display to the student dashboard:

```tsx
import { useEffect, useState } from 'react';
import gameProgress from '../lib/api/game-progress';
import { Trophy, Gem, Star } from 'lucide-react';

function StudentDashboardPage() {
  const [gameState, setGameState] = useState(null);
  const [progress, setProgress] = useState(null);
  
  useEffect(() => {
    const loadGameState = async () => {
      const userId = 'current-student-id'; // Get from auth context
      const state = await gameProgress.getUserGameState(userId);
      if (state) {
        setGameState(state);
        setProgress(gameProgress.getLevelProgress(state.total_xp));
      }
    };
    loadGameState();
  }, []);
  
  if (!gameState || !progress) return <div>Loading...</div>;
  
  return (
    <div className="p-6">
      {/* XP Progress Card */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Level {progress.currentLevel}</h2>
              <p className="text-sm opacity-90">Keep learning to level up!</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6" />
              <span className="text-xl font-bold">{gameState.total_xp}</span>
              <span className="text-sm opacity-75">XP</span>
            </div>
            <div className="flex items-center gap-2">
              <Gem className="w-6 h-6" />
              <span className="text-xl font-bold">{gameState.gems}</span>
              <span className="text-sm opacity-75">Gems</span>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
          <div 
            className="bg-white h-full rounded-full transition-all duration-500"
            style={{ width: `${progress.progressPercentage}%` }}
          />
        </div>
        <p className="text-sm mt-2 text-center">
          {progress.xpInCurrentLevel} / 1000 XP to Level {progress.currentLevel + 1}
        </p>
      </div>
      
      {/* Unlocked Characters */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4">Your Companions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {gameState.unlocked_characters.map(charId => (
            <div key={charId} className="border-2 border-green-500 rounded-lg p-4 text-center">
              <div className="text-4xl mb-2">
                {getCharacterEmoji(charId)}
              </div>
              <p className="font-semibold">{getCharacterName(charId)}</p>
              <span className="text-xs text-green-600">✓ Unlocked</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getCharacterEmoji(charId: string) {
  const emojiMap = {
    wise_owl: '🦉',
    sparkle_unicorn: '🦄',
    swift_horse: '🐴',
    grammar_goat: '🐐',
    math_dragon: '🐉',
    science_fox: '🦊',
  };
  return emojiMap[charId] || '✨';
}

function getCharacterName(charId: string) {
  const nameMap = {
    wise_owl: 'Wise Owl',
    sparkle_unicorn: 'Sparkle Unicorn',
    swift_horse: 'Swift Horse',
    grammar_goat: 'Grammar Goat',
    math_dragon: 'Math Dragon',
    science_fox: 'Science Fox',
  };
  return nameMap[charId] || charId;
}
```

---

### **2. Challenge Completion** (`/components/curriculum/ChallengeCard.tsx`)

Award XP when a challenge is completed:

```tsx
import gameProgress from '../lib/api/game-progress';
import { toast } from 'sonner@2.0.3';

async function handleChallengeComplete(
  studentId: string, 
  masteryLevel: string,
  challengeTitle: string
) {
  // Calculate XP based on mastery level
  const xpMap = {
    emerging: 50,
    developing: 75,
    proficient: 100,
    advanced: 150,
    mastered: 200,
  };
  
  const xpGained = xpMap[masteryLevel] || 100;
  
  // Bonus gems for high mastery
  const gemsGained = masteryLevel === 'mastered' ? 25 : 
                     masteryLevel === 'advanced' ? 15 : 10;
  
  // Update game progress
  const result = await gameProgress.updateProgress(studentId, xpGained, gemsGained);
  
  if (result.success) {
    // Show XP/Gems earned toast
    toast.success(`Challenge Complete! +${xpGained} XP, +${gemsGained} Gems`);
    
    // Show level up notification
    if (result.leveledUp) {
      toast.success(`🎉 Level Up! You're now Level ${result.newLevel}!`, {
        duration: 5000,
      });
    }
    
    // Show character unlock notification
    if (result.newCharacters && result.newCharacters.length > 0) {
      const characterNames = result.newCharacters.map(getCharacterName).join(', ');
      toast.success(`🎁 New Companion Unlocked: ${characterNames}!`, {
        duration: 5000,
      });
    }
  }
}

// Usage in ChallengeCard:
function ChallengeCard({ challenge, studentId }) {
  const handleComplete = async (mastery: string) => {
    // ... existing submission logic ...
    
    // Award game progress
    await handleChallengeComplete(studentId, mastery, challenge.title);
  };
  
  return (
    <div className="challenge-card">
      {/* ... your existing UI ... */}
      <button onClick={() => handleComplete('proficient')}>
        Submit
      </button>
    </div>
  );
}
```

---

### **3. WOWL AI Assessment** (`/lib/ai/gemini-service.ts`)

Award XP automatically when WOWL assesses a submission:

```tsx
import gameProgress from '../api/game-progress';

// Inside your assessment function:
async function assessSubmission(studentId: string, submission: any) {
  // ... existing WOWL assessment logic ...
  
  const masteryLevel = determineMasteryLevel(submission);
  
  // Calculate XP
  const xpMap = {
    emerging: 50,
    developing: 75,
    proficient: 100,
    advanced: 150,
    mastered: 200,
  };
  
  const xpGained = xpMap[masteryLevel];
  const gemsGained = masteryLevel === 'mastered' ? 25 : 10;
  
  // Award progress
  const result = await gameProgress.updateProgress(studentId, xpGained, gemsGained);
  
  // Add to feedback
  const feedback = {
    ...existingFeedback,
    rewards: {
      xp: xpGained,
      gems: gemsGained,
      leveledUp: result.leveledUp,
      newLevel: result.newLevel,
      newCharacters: result.newCharacters,
    },
  };
  
  return feedback;
}
```

---

### **4. Parent Dashboard** (`/pages/ParentDashboardPage.tsx`)

Show children's progress to parents:

```tsx
import gameProgress from '../lib/api/game-progress';

function ParentDashboardPage() {
  const [children, setChildren] = useState([]);
  
  useEffect(() => {
    const loadChildren = async () => {
      const childrenData = await getMyChildren(); // Your existing function
      
      // Load game state for each child
      const childrenWithProgress = await Promise.all(
        childrenData.map(async (child) => {
          const state = await gameProgress.getUserGameState(child.id);
          const progress = state ? gameProgress.getLevelProgress(state.total_xp) : null;
          return { ...child, gameState: state, progress };
        })
      );
      
      setChildren(childrenWithProgress);
    };
    loadChildren();
  }, []);
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Children</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        {children.map(child => (
          <div key={child.id} className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <img 
                src={child.avatar_url} 
                alt={child.display_name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h2 className="text-xl font-bold">{child.display_name}</h2>
                <p className="text-gray-600">Age {child.age}</p>
              </div>
            </div>
            
            {child.gameState && child.progress && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Level</span>
                  <span className="font-bold text-lg">{child.progress.currentLevel}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total XP</span>
                  <span className="font-semibold">{child.gameState.total_xp}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Gems</span>
                  <span className="font-semibold">💎 {child.gameState.gems}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Companions</span>
                  <span className="font-semibold">
                    {child.gameState.unlocked_characters.length} / 6
                  </span>
                </div>
                
                {/* Progress to next level */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600">Progress to Level {child.progress.currentLevel + 1}</span>
                    <span className="font-semibold">{child.progress.progressPercentage.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-full rounded-full transition-all"
                      style={{ width: `${child.progress.progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### **5. Quest Completion Rewards**

When a student completes a full quest, award bonus XP and gems:

```tsx
import gameProgress from '../lib/api/game-progress';

async function handleQuestCompletion(studentId: string, questId: string) {
  // Base quest completion rewards
  const questXP = 500;
  const questGems = 100;
  
  // Award progress
  const result = await gameProgress.updateProgress(studentId, questXP, questGems);
  
  // Show celebration
  if (result.success) {
    showQuestCompleteCelebration({
      xp: questXP,
      gems: questGems,
      leveledUp: result.leveledUp,
      newLevel: result.newLevel,
      newCharacters: result.newCharacters,
    });
  }
}

function showQuestCompleteCelebration(rewards: any) {
  // Show modal/animation with confetti
  toast.success(
    `🎊 Quest Complete! +${rewards.xp} XP, +${rewards.gems} Gems`,
    { duration: 6000 }
  );
  
  if (rewards.leveledUp) {
    setTimeout(() => {
      toast.success(`🎉 Level ${rewards.newLevel} Achieved!`, { duration: 5000 });
    }, 1000);
  }
}
```

---

### **6. Leaderboard Page** (New Component)

Create a leaderboard to show top students:

```tsx
import { useEffect, useState } from 'react';
import gameProgress from '../lib/api/game-progress';
import { Trophy, Medal } from 'lucide-react';

function LeaderboardPage() {
  const [topStudents, setTopStudents] = useState([]);
  
  useEffect(() => {
    gameProgress.getLeaderboard(20).then(setTopStudents);
  }, []);
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-8 h-8 text-yellow-500" />
        <h1 className="text-3xl font-bold">Leaderboard</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left">Rank</th>
              <th className="px-6 py-4 text-left">Student</th>
              <th className="px-6 py-4 text-right">Level</th>
              <th className="px-6 py-4 text-right">Total XP</th>
            </tr>
          </thead>
          <tbody>
            {topStudents.map((student, index) => (
              <tr 
                key={student.student_id}
                className={`border-b ${index < 3 ? 'bg-yellow-50' : ''}`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {index === 0 && <span className="text-2xl">🥇</span>}
                    {index === 1 && <span className="text-2xl">🥈</span>}
                    {index === 2 && <span className="text-2xl">🥉</span>}
                    {index > 2 && <span className="font-bold text-gray-600">#{index + 1}</span>}
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold">{student.display_name}</td>
                <td className="px-6 py-4 text-right">
                  <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold">
                    <Trophy className="w-4 h-4" />
                    {student.current_level}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-indigo-600">
                  {student.total_xp.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

### **7. Character Gallery Component**

Show all characters (locked and unlocked):

```tsx
import { useEffect, useState } from 'react';
import gameProgress from '../lib/api/game-progress';
import { Lock, Check } from 'lucide-react';

function CharacterGallery({ studentId }: { studentId: string }) {
  const [characters, setCharacters] = useState([]);
  
  useEffect(() => {
    gameProgress.getCharacterStatus(studentId).then(setCharacters);
  }, [studentId]);
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {characters.map(({ character, unlocked, canUnlock }) => (
        <div 
          key={character.character_id}
          className={`
            rounded-xl p-6 text-center transition-all
            ${unlocked 
              ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg' 
              : canUnlock
              ? 'bg-yellow-100 border-2 border-yellow-400'
              : 'bg-gray-100 opacity-60'
            }
          `}
        >
          <div className="text-6xl mb-3">
            {getCharacterEmoji(character.character_id)}
          </div>
          
          <h3 className="font-bold text-lg mb-2">{character.name}</h3>
          <p className={`text-sm mb-3 ${unlocked ? 'text-white' : 'text-gray-600'}`}>
            {character.description}
          </p>
          
          {unlocked ? (
            <div className="flex items-center justify-center gap-2 text-white font-semibold">
              <Check className="w-5 h-5" />
              <span>Unlocked!</span>
            </div>
          ) : canUnlock ? (
            <div className="flex items-center justify-center gap-2 text-yellow-700 font-semibold">
              <span>✨ Ready to unlock!</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <Lock className="w-4 h-4" />
              <span className="text-sm">Level {character.level_required}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

---

## 🎯 **QUICK START CHECKLIST**

1. **Deploy Database Changes:**
   ```bash
   # Run in Supabase SQL Editor
   psql -f supabase/migrations/add-game-progress-fields.sql
   ```

2. **Import Game Progress API:**
   ```tsx
   import gameProgress from './lib/api/game-progress';
   ```

3. **Award XP on Challenge Complete:**
   ```tsx
   await gameProgress.awardXp(studentId, 100);
   ```

4. **Display Progress in Dashboard:**
   ```tsx
   const state = await gameProgress.getUserGameState(studentId);
   const progress = gameProgress.getLevelProgress(state.total_xp);
   ```

5. **Show Notifications:**
   ```tsx
   if (result.leveledUp) {
     toast.success(`Level Up! Now Level ${result.newLevel}!`);
   }
   ```

---

## ✅ **DONE!**

You now have complete integration examples for the game progress system throughout your entire application!

**Test it by:**
1. Creating a new student
2. Completing a challenge
3. Watching XP/Gems increase
4. Seeing level-up notifications
5. Unlocking new characters at levels 5, 10, 15, 20

🚀 **Happy coding!**

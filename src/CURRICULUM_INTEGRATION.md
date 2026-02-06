# 📚 Level 1 Math Curriculum - Integration Guide

## Overview

The Level 1 Math curriculum (L1UM) is now fully integrated into your LMS as structured data and React components. It includes 16 lessons covering foundational math skills with a Robux reward system.

---

## 🎯 What's Built

### Data Structure (`/lib/curriculum-data.ts`)
- **Complete L1UM curriculum data** with all 16 lessons
- **Type-safe TypeScript interfaces** for lessons, badges, skills
- **Helper functions** for progress tracking
- **Redemption options** (avatar items, game passes, special rewards)

### React Components

1. **`LevelOverview.tsx`** - Shows learning objectives, assessment methods, rewards
2. **`LessonCard.tsx`** - Individual lesson display with status (locked/available/in-progress/completed)
3. **`CurriculumViewer.tsx`** - Main component with tabs (Overview/Lessons/Rewards)
4. **`RedemptionOptions.tsx`** - Robux redemption center

---

## 🚀 Quick Start Usage

### In Student Dashboard

```typescript
import CurriculumViewer from '@/components/curriculum/CurriculumViewer';
import L1UM from '@/lib/curriculum-data';

// In your StudentDashboard component
<CurriculumViewer
  level={L1UM}
  completedLessonIds={['L1UM-01', 'L1UM-02']} // From Firestore
  currentLessonId="L1UM-03" // Current lesson in progress
  onStartLesson={(lesson) => {
    console.log('Starting lesson:', lesson.title);
    // Navigate to lesson activity or update Firestore
  }}
  onContinueLesson={(lesson) => {
    console.log('Continuing lesson:', lesson.title);
  }}
  onReviewLesson={(lesson) => {
    console.log('Reviewing lesson:', lesson.title);
  }}
/>
```

### In Tutor Dashboard

```typescript
import { L1UM, getLessonById } from '@/lib/curriculum-data';

// Show specific lesson details
const lesson = getLessonById('L1UM-05');

// Display feedback prompts for tutors
{lesson?.feedbackPrompts.map(prompt => (
  <div key={prompt.message}>
    <span className={prompt.type === 'success' ? 'text-green-600' : 'text-blue-600'}>
      {prompt.message}
    </span>
  </div>
))}
```

### In Admin Dashboard

```typescript
import { calculateRobuxEarned, canRedeem } from '@/lib/curriculum-data';

// Calculate student progress
const completedLessons = ['L1UM-01', 'L1UM-02', 'L1UM-03'];
const robuxEarned = calculateRobuxEarned(completedLessons); // 300
const isReadyToRedeem = canRedeem(robuxEarned); // false (needs 800)
```

---

## 📊 Firestore Integration

### Tracking Student Progress

Update your Firestore schema to track lesson completion:

```typescript
// Collection: studentProgress/{studentId}
interface StudentProgress {
  studentId: string;
  levelId: string; // 'L1UM'
  completedLessons: string[]; // ['L1UM-01', 'L1UM-02', ...]
  currentLessonId: string | null;
  totalRobuxEarned: number;
  redeemedItems: string[]; // redemption option IDs
  lastActivityAt: Timestamp;
}
```

### Firestore Operations

```typescript
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Mark lesson as complete
async function completeLesson(studentId: string, lessonId: string) {
  const progressRef = doc(db, 'studentProgress', studentId);
  
  await updateDoc(progressRef, {
    completedLessons: arrayUnion(lessonId),
    totalRobuxEarned: increment(100), // Each badge = 100 Robux
    lastActivityAt: serverTimestamp(),
  });
}

// Start a new lesson
async function startLesson(studentId: string, lessonId: string) {
  const progressRef = doc(db, 'studentProgress', studentId);
  
  await updateDoc(progressRef, {
    currentLessonId: lessonId,
    lastActivityAt: serverTimestamp(),
  });
}

// Redeem a reward
async function redeemReward(studentId: string, rewardId: string, robuxCost: number) {
  const progressRef = doc(db, 'studentProgress', studentId);
  
  await updateDoc(progressRef, {
    redeemedItems: arrayUnion(rewardId),
    totalRobuxEarned: increment(-robuxCost), // Deduct Robux
    lastActivityAt: serverTimestamp(),
  });
}
```

---

## 🎮 Lesson Activity Integration

### Create Interactive Lesson Activities

Each lesson needs interactive activities. Here's an example for L1UM-01 (Count to 10):

```typescript
// /components/lessons/L1UM01CountTo10.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function L1UM01CountTo10({ onComplete }: { onComplete: () => void }) {
  const [currentNumber, setCurrentNumber] = useState(1);
  const [score, setScore] = useState(0);

  const checkAnswer = (answer: number) => {
    if (answer === currentNumber) {
      setScore(score + 1);
      if (currentNumber === 10) {
        onComplete(); // Lesson complete!
      } else {
        setCurrentNumber(currentNumber + 1);
      }
    }
  };

  return (
    <div className="bg-calm-surface rounded-2xl border-2 border-calm-border p-8">
      <h2 className="text-2xl mb-6">Count the Objects!</h2>
      
      {/* Display objects to count */}
      <div className="flex gap-4 justify-center mb-8">
        {Array.from({ length: currentNumber }).map((_, i) => (
          <div key={i} className="w-12 h-12 bg-purple-200 rounded-full" />
        ))}
      </div>

      {/* Answer buttons */}
      <div className="grid grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
          <Button
            key={num}
            onClick={() => checkAnswer(num)}
            className="text-xl h-16"
          >
            {num}
          </Button>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-muted-foreground">
          Progress: {score} / 10
        </p>
      </div>
    </div>
  );
}
```

### Lesson Router

Create a router to load the correct lesson activity:

```typescript
// /components/lessons/LessonRouter.tsx
import { Lesson } from '@/lib/curriculum-data';
import L1UM01CountTo10 from './L1UM01CountTo10';
import L1UM02CountTo20 from './L1UM02CountTo20';
// ... import all lesson activities

const lessonActivities: Record<string, React.ComponentType<any>> = {
  'L1UM-01': L1UM01CountTo10,
  'L1UM-02': L1UM02CountTo20,
  // ... map all lessons
};

export default function LessonRouter({ 
  lesson, 
  onComplete 
}: { 
  lesson: Lesson; 
  onComplete: () => void;
}) {
  const ActivityComponent = lessonActivities[lesson.id];

  if (!ActivityComponent) {
    return <div>Lesson activity coming soon!</div>;
  }

  return <ActivityComponent onComplete={onComplete} />;
}
```

---

## 🏆 Badge Awarding System

### Award Badge on Lesson Completion

```typescript
import { doc, setDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Lesson } from '@/lib/curriculum-data';

async function awardBadge(studentId: string, lesson: Lesson) {
  // Save to badges collection
  const badgeRef = doc(collection(db, 'badges'));
  
  await setDoc(badgeRef, {
    studentId,
    badgeId: lesson.badge.id,
    badgeName: lesson.badge.name,
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    robuxValue: lesson.badge.robuxValue,
    awardedAt: serverTimestamp(),
  });

  // Update student progress
  await completeLesson(studentId, lesson.id);

  // Show celebration animation/toast
  toast.success(`🎉 Badge Earned: ${lesson.badge.name}!`, {
    description: `You earned ${lesson.badge.robuxValue} Robux!`,
  });
}
```

---

## 🎨 UI Customization

### Lesson Status Colors

The system automatically applies colors based on lesson status:

- **Locked** (gray): Prerequisites not met
- **Available** (blue): Ready to start
- **In Progress** (yellow): Currently working on
- **Completed** (green): Finished and badge earned

### Custom Styling

Override default styles in your theme:

```css
/* In your globals.css */
.lesson-card-locked {
  @apply opacity-60 cursor-not-allowed;
}

.lesson-card-available {
  @apply hover:shadow-lg transition-shadow cursor-pointer;
}

.lesson-card-completed {
  @apply border-green-300 bg-green-50;
}
```

---

## 📈 Progress Tracking Dashboard

### Create a Progress Summary Component

```typescript
import { L1UM, calculateRobuxEarned } from '@/lib/curriculum-data';
import { CheckCircle2, Circle, Lock } from 'lucide-react';

export default function ProgressSummary({ completedLessonIds }: { completedLessonIds: string[] }) {
  const totalLessons = L1UM.lessons.length;
  const completedCount = completedLessonIds.length;
  const progressPercent = (completedCount / totalLessons) * 100;
  const robuxEarned = calculateRobuxEarned(completedLessonIds);

  return (
    <div className="bg-calm-surface rounded-2xl border-2 border-calm-border p-6">
      <h3 className="text-xl font-semibold mb-4">Level 1 Math Progress</h3>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-semibold">Lessons Completed</span>
          <span className="text-sm font-semibold">{completedCount} / {totalLessons}</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full reward-bg transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-green-50 rounded-xl border border-green-200">
          <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-1" />
          <div className="text-2xl font-bold text-green-600">{completedCount}</div>
          <div className="text-xs text-muted-foreground">Completed</div>
        </div>
        
        <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-200">
          <Circle className="w-6 h-6 text-blue-500 mx-auto mb-1" />
          <div className="text-2xl font-bold text-blue-600">
            {totalLessons - completedCount}
          </div>
          <div className="text-xs text-muted-foreground">Remaining</div>
        </div>
        
        <div className="text-center p-3 bg-purple-50 rounded-xl border border-purple-200">
          <Award className="w-6 h-6 text-purple-500 mx-auto mb-1" />
          <div className="text-2xl font-bold text-purple-600">{robuxEarned}</div>
          <div className="text-xs text-muted-foreground">Robux</div>
        </div>
      </div>
    </div>
  );
}
```

---

## 🔔 Notifications & Celebrations

### Lesson Completion Celebration

```typescript
import confetti from 'canvas-confetti';

function celebrateLessonComplete(lesson: Lesson) {
  // Confetti animation
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });

  // Toast notification
  toast.success(`🎉 Lesson Complete!`, {
    description: `You earned the ${lesson.badge.name} badge and ${lesson.badge.robuxValue} Robux!`,
    duration: 5000,
  });

  // Optional: Play success sound
  const audio = new Audio('/sounds/success.mp3');
  audio.play();
}
```

### Redemption Threshold Notification

```typescript
function checkRedemptionThreshold(robuxEarned: number) {
  if (robuxEarned === 800) {
    toast.success('🎊 Redemption Unlocked!', {
      description: 'You can now redeem your Robux for awesome rewards!',
      action: {
        label: 'View Rewards',
        onClick: () => {
          // Navigate to rewards tab
        },
      },
    });
  }
}
```

---

## 🧪 Testing the Curriculum

### Test Student Flow

```typescript
// Example: Test completing all lessons
const testCompleteLessons = async () => {
  const studentId = 'test-student-123';
  
  for (const lesson of L1UM.lessons) {
    console.log(`Starting lesson: ${lesson.title}`);
    await startLesson(studentId, lesson.id);
    
    // Simulate lesson activity
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`Completing lesson: ${lesson.title}`);
    await completeLesson(studentId, lesson.id);
    await awardBadge(studentId, lesson);
  }
  
  console.log('All lessons completed!');
};
```

### Test Redemption

```typescript
const testRedemption = async () => {
  const studentId = 'test-student-123';
  const rewardId = 'avatar-cape';
  const robuxCost = 800;
  
  await redeemReward(studentId, rewardId, robuxCost);
  console.log('Reward redeemed successfully!');
};
```

---

## 📱 Mobile Responsiveness

The curriculum components are fully responsive:

- **Desktop**: 2-column lesson grid, full-width tabs
- **Tablet**: 2-column lesson grid, compact navigation
- **Mobile**: Single-column layout, stack all elements

Test on different screen sizes to ensure smooth experience.

---

## 🎯 Next Steps

1. **Create lesson activities** for each of the 16 lessons
2. **Implement Firestore writes** for progress tracking
3. **Add celebration animations** for badge earning
4. **Build redemption flow** with parent/admin approval
5. **Create printable progress reports** for parents
6. **Add analytics** to track student engagement

---

## 📖 Complete Example: Student Dashboard Integration

```typescript
// /components/student/StudentDashboard.tsx
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import CurriculumViewer from '@/components/curriculum/CurriculumViewer';
import L1UM, { Lesson } from '@/lib/curriculum-data';

export default function StudentDashboard({ studentId }: { studentId: string }) {
  const [progress, setProgress] = useState({
    completedLessons: [],
    currentLessonId: null,
    totalRobuxEarned: 0,
    redeemedItems: [],
  });

  // Real-time progress tracking
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'studentProgress', studentId),
      (doc) => {
        if (doc.exists()) {
          setProgress(doc.data() as any);
        }
      }
    );

    return () => unsubscribe();
  }, [studentId]);

  const handleStartLesson = async (lesson: Lesson) => {
    // Navigate to lesson activity
    router.push(`/lessons/${lesson.id}`);
    
    // Update Firestore
    await startLesson(studentId, lesson.id);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Math Journey</h1>
      
      <CurriculumViewer
        level={L1UM}
        completedLessonIds={progress.completedLessons}
        currentLessonId={progress.currentLessonId}
        onStartLesson={handleStartLesson}
        onContinueLesson={handleStartLesson}
        onReviewLesson={(lesson) => {
          // Open lesson in review mode
        }}
      />
    </div>
  );
}
```

---

## ✅ Summary

**You now have:**
✅ Complete L1UM curriculum data (16 lessons)  
✅ React components for displaying curriculum  
✅ Robux reward system (100 per lesson, 800 to redeem)  
✅ Badge system with 16 unique badges  
✅ Redemption center with avatar items, game passes, special rewards  
✅ Progress tracking helpers  
✅ Mobile-responsive design  
✅ Neurodivergent-friendly status system (locked/available/in-progress/completed)  

**Next:**  
Create the 16 interactive lesson activities (counting games, addition challenges, etc.)

**Your Level 1 Math curriculum is ready to go!** 🎉📚💜

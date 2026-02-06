/**
 * Seed Curriculum Data
 * Creates initial quest and challenge templates in Firestore
 * 
 * Usage:
 *   node scripts/seed-curriculum.js
 * 
 * This will create:
 * - 1 sample quest template (L1UM-CORE)
 * - 16 challenge templates for that quest
 * - 1 badge template
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin
try {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: 'mz-marianna-kingdom-learning',
  });
  console.log('✓ Firebase Admin initialized');
} catch (error) {
  console.error('❌ Error initializing Firebase Admin:', error.message);
  console.error('\n💡 Tip: Run "firebase login" first');
  process.exit(1);
}

const db = admin.firestore();

// Quest Template Data
const questTemplate = {
  questId: 'L1UM-CORE',
  level: 'L1',
  unit: 'UM',
  overlay: 'CORE',
  title: 'Number Sense Adventure',
  description: 'Master the fundamentals of counting, number recognition, and basic operations through engaging activities and games.',
  badgeName: 'Number Ninja',
  usesRoblox: true,
  requiredCheckpoints: [1, 8, 16],
  totalChallenges: 16,
  masteryRule: {
    minCompleted: 16,
    requiresTutorConfirm: true,
    requiresAssessmentAt: [1, 8, 16],
  },
};

// Challenge Templates
const challengeTitles = [
  'Assessment: What Do You Know?',
  'Counting to 10',
  'Recognizing Numbers',
  'More and Less',
  'Number Order',
  'Practice: Number Games',
  'Skip Counting',
  'Midpoint Check: Show What You Know',
  'Adding with Objects',
  'Subtraction Basics',
  'Number Stories',
  'Math in the Wild',
  'Number Patterns',
  'Practice: Roblox Math Quest',
  'Problem Solving',
  'Celebration: Master Assessment',
];

const challengeInstructions = [
  'Let\'s see what you already know! This helps us personalize your journey.',
  'Learn to count from 1 to 10 using fun objects and activities.',
  'Practice recognizing written numbers and matching them to quantities.',
  'Compare groups of objects to understand which has more or less.',
  'Put numbers in the correct order and understand what comes next.',
  'Play interactive number games to practice what you\'ve learned.',
  'Learn to count by 2s, 5s, and 10s using patterns.',
  'Great progress! Let\'s review what you\'ve learned so far.',
  'Use physical objects to understand addition concepts.',
  'Learn subtraction by taking away objects from a group.',
  'Create and solve simple word problems about everyday situations.',
  'Find numbers and math all around you in the real world.',
  'Discover and create patterns using numbers and shapes.',
  'Complete math challenges in Roblox to practice your skills.',
  'Use all your number skills to solve multi-step problems.',
  'Amazing work! Time to celebrate and show off your mastery!',
];

function generateChallengeTemplates() {
  const challenges = [];
  
  for (let i = 1; i <= 16; i++) {
    const isCheckpoint = i === 1 || i === 8 || i === 16;
    const challengeId = `L1UM-CORE-${String(i).padStart(2, '0')}`;
    
    challenges.push({
      challengeId,
      questId: 'L1UM-CORE',
      number: i,
      title: challengeTitles[i - 1],
      type: isCheckpoint ? 'CHECKPOINT' : (i % 2 === 0 ? 'PRACTICE' : 'LEARN'),
      instructions: challengeInstructions[i - 1],
      resourceLink: i === 14 ? 'https://www.roblox.com/games/example' : undefined,
      robloxGameLink: i === 14 ? 'https://www.roblox.com/games/example' : undefined,
      evidenceType: isCheckpoint ? 'QUIZ' : (i % 3 === 0 ? 'PHOTO' : 'CHECKBOX'),
      xp: {
        baseComplete: isCheckpoint ? 100 : 50,
        correctnessBonus: isCheckpoint ? 50 : undefined,
        effortBonus: 25,
      },
      isCheckpoint,
    });
  }
  
  return challenges;
}

// Badge Template
const badgeTemplate = {
  badgeId: 'badge-number-ninja',
  name: 'Number Ninja',
  description: 'Mastered Level 1 Math: Number Sense Adventure',
  color: '#14B8A6',
  questId: 'L1UM-CORE',
  criteria: 'Complete all 16 challenges in the Number Sense Adventure quest with tutor confirmation',
};

async function seedData() {
  try {
    console.log('\n🌱 Seeding curriculum data...\n');
    
    // Create quest template
    console.log('📚 Creating quest template: L1UM-CORE...');
    await db.collection('questTemplates').doc('L1UM-CORE').set(questTemplate);
    console.log('   ✓ Quest template created');
    
    // Create challenge templates
    console.log('\n🎯 Creating 16 challenge templates...');
    const challenges = generateChallengeTemplates();
    
    const batch = db.batch();
    challenges.forEach((challenge) => {
      const ref = db.collection('challengeTemplates').doc(challenge.challengeId);
      batch.set(ref, challenge);
    });
    await batch.commit();
    console.log('   ✓ All 16 challenge templates created');
    
    // Create badge template
    console.log('\n🏆 Creating badge template...');
    await db.collection('badgeTemplates').doc('badge-number-ninja').set(badgeTemplate);
    console.log('   ✓ Badge template created');
    
    console.log('\n✅ Curriculum data seeded successfully!\n');
    console.log('📊 Created:');
    console.log('   • 1 Quest Template (L1UM-CORE)');
    console.log('   • 16 Challenge Templates');
    console.log('   • 1 Badge Template (Number Ninja)');
    
    console.log('\n💡 Next steps:');
    console.log('   1. Create a student user in Firebase Authentication');
    console.log('   2. Set their role: node scripts/set-user-role.js EMAIL student');
    console.log('   3. Assign them the quest using Firestore or Cloud Functions');
    console.log('   4. Student can start their learning journey!');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedData();

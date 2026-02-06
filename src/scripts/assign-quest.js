/**
 * Assign Quest to Student
 * Creates a quest instance and 16 challenge instances for a student
 * 
 * Usage:
 *   node scripts/assign-quest.js STUDENT_EMAIL QUEST_ID
 * 
 * Example:
 *   node scripts/assign-quest.js student@example.com L1UM-CORE
 */

const admin = require('firebase-admin');

// Check command line arguments
if (process.argv.length < 4) {
  console.error('❌ Usage: node assign-quest.js STUDENT_EMAIL QUEST_ID');
  console.error('   Example: node assign-quest.js student@example.com L1UM-CORE');
  process.exit(1);
}

const studentEmail = process.argv[2];
const questId = process.argv[3];

// Initialize Firebase Admin
try {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: 'mz-marianna-kingdom-learning',
  });
  console.log('✓ Firebase Admin initialized');
} catch (error) {
  console.error('❌ Error initializing Firebase Admin:', error.message);
  process.exit(1);
}

const db = admin.firestore();

async function assignQuest() {
  try {
    // Get student user
    console.log(`🔍 Finding student: ${studentEmail}...`);
    const student = await admin.auth().getUserByEmail(studentEmail);
    const studentUid = student.uid;
    
    // Verify student role
    const userDoc = await db.collection('users').doc(studentUid).get();
    if (!userDoc.exists) {
      throw new Error('User document not found in Firestore. Run set-user-role.js first.');
    }
    
    const userData = userDoc.data();
    if (userData.role !== 'student') {
      throw new Error(`User is not a student (role: ${userData.role})`);
    }
    
    // Get quest template
    console.log(`📚 Loading quest template: ${questId}...`);
    const questTemplateDoc = await db.collection('questTemplates').doc(questId).get();
    if (!questTemplateDoc.exists) {
      throw new Error(`Quest template ${questId} not found. Run seed-curriculum.js first.`);
    }
    
    const questTemplate = questTemplateDoc.data();
    
    // Check if quest already assigned
    const questInstanceId = `${questId}-${studentUid}`;
    const existingQuest = await db.collection('questInstances').doc(questInstanceId).get();
    if (existingQuest.exists) {
      console.log(`⚠️  Quest already assigned to this student`);
      console.log(`   Quest Instance ID: ${questInstanceId}`);
      process.exit(0);
    }
    
    // Create quest instance
    console.log(`🎯 Creating quest instance...`);
    const now = Date.now();
    
    const questInstance = {
      questInstanceId,
      questId,
      studentUid,
      assignedAt: now,
      status: 'ACTIVE',
      progress: {
        completedCount: 0,
        requiredCompleted: false,
        mastered: false,
        tutorConfirmed: false,
      },
    };
    
    await db.collection('questInstances').doc(questInstanceId).set(questInstance);
    console.log('   ✓ Quest instance created');
    
    // Create challenge instances
    console.log(`\n📝 Creating ${questTemplate.totalChallenges} challenge instances...`);
    
    const batch = db.batch();
    for (let i = 1; i <= questTemplate.totalChallenges; i++) {
      const challengeId = `${questId}-${String(i).padStart(2, '0')}`;
      const challengeInstanceId = `${challengeId}-${studentUid}`;
      
      const challengeInstance = {
        challengeInstanceId,
        challengeId,
        questInstanceId,
        studentUid,
        status: 'TODO',
      };
      
      const ref = db.collection('challengeInstances').doc(challengeInstanceId);
      batch.set(ref, challengeInstance);
    }
    
    await batch.commit();
    console.log(`   ✓ All ${questTemplate.totalChallenges} challenge instances created`);
    
    console.log('\n✅ Quest assigned successfully!\n');
    console.log('📊 Details:');
    console.log(`   Student: ${studentEmail} (${studentUid})`);
    console.log(`   Quest: ${questTemplate.title}`);
    console.log(`   Quest ID: ${questId}`);
    console.log(`   Quest Instance ID: ${questInstanceId}`);
    console.log(`   Total Challenges: ${questTemplate.totalChallenges}`);
    
    console.log('\n💡 Next steps:');
    console.log('   1. Student logs into the app');
    console.log('   2. They will see the quest on their Quest Map');
    console.log('   3. They can start Challenge 1');
    console.log('   4. Tutor reviews and approves work to unlock next challenges');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    if (error.code === 'auth/user-not-found') {
      console.error(`\n💡 Student ${studentEmail} not found. Create the account first.`);
    }
    
    process.exit(1);
  }
}

assignQuest();

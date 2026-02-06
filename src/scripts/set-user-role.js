/**
 * Set User Role Script
 * Sets custom claims for Firebase Auth users
 * 
 * Usage:
 *   node scripts/set-user-role.js EMAIL ROLE
 * 
 * Example:
 *   node scripts/set-user-role.js mariannav920@gmail.com admin
 *   node scripts/set-user-role.js student@example.com student
 * 
 * Roles: student, parent, tutor, admin
 */

const admin = require('firebase-admin');

// Check command line arguments
if (process.argv.length < 4) {
  console.error('❌ Usage: node set-user-role.js EMAIL ROLE');
  console.error('   Roles: student, parent, tutor, admin');
  process.exit(1);
}

const email = process.argv[2];
const role = process.argv[3];

// Validate role
const validRoles = ['student', 'parent', 'tutor', 'admin'];
if (!validRoles.includes(role)) {
  console.error(`❌ Invalid role: ${role}`);
  console.error(`   Valid roles: ${validRoles.join(', ')}`);
  process.exit(1);
}

// Initialize Firebase Admin
try {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: 'mz-marianna-kingdom-learning',
  });
  console.log('✓ Firebase Admin initialized');
} catch (error) {
  console.error('❌ Error initializing Firebase Admin:', error.message);
  console.error('\n💡 Tip: Run "firebase login" first or set GOOGLE_APPLICATION_CREDENTIALS');
  process.exit(1);
}

// Set custom claims
async function setUserRole() {
  try {
    // Get user by email
    console.log(`🔍 Finding user: ${email}...`);
    const user = await admin.auth().getUserByEmail(email);
    
    // Set custom claims
    console.log(`🔧 Setting role to: ${role}...`);
    await admin.auth().setCustomUserClaims(user.uid, { role });
    
    // Also create/update user document in Firestore
    console.log(`📝 Updating Firestore document...`);
    const db = admin.firestore();
    const userRef = db.collection('users').doc(user.uid);
    
    const existingDoc = await userRef.get();
    const now = admin.firestore.FieldValue.serverTimestamp();
    
    if (existingDoc.exists) {
      // Update existing document
      await userRef.update({
        role,
        updatedAt: now,
      });
    } else {
      // Create new document
      await userRef.set({
        uid: user.uid,
        email: user.email,
        role,
        displayName: user.displayName || email.split('@')[0],
        createdAt: now,
        updatedAt: now,
        currentLevel: role === 'student' ? 'L1' : undefined,
        totalXP: role === 'student' ? 0 : undefined,
      });
    }
    
    console.log('\n✅ Success!');
    console.log(`   User: ${email}`);
    console.log(`   UID: ${user.uid}`);
    console.log(`   Role: ${role}`);
    console.log('\n💡 User must sign out and sign back in for role to take effect');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    if (error.code === 'auth/user-not-found') {
      console.error(`\n💡 User ${email} not found. Create the account first:`);
      console.error(`   1. Go to Firebase Console → Authentication`);
      console.error(`   2. Click "Add user"`);
      console.error(`   3. Enter email and password`);
      console.error(`   4. Then run this script again`);
    }
    
    process.exit(1);
  }
}

setUserRole();

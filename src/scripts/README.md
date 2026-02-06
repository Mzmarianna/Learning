# 🛠️ Firebase Admin Scripts

Helper scripts for managing Mz. Marianna's Kingdom Learning backend.

## Prerequisites

```bash
# Install Firebase Admin SDK
npm install firebase-admin

# Login to Firebase
firebase login
```

## Scripts

### 1. Set User Role

Assigns custom claims (roles) to Firebase Auth users.

**Usage:**
```bash
node scripts/set-user-role.js EMAIL ROLE
```

**Roles:**
- `student` - Student learner
- `parent` - Parent/guardian
- `tutor` - Instructor/reviewer
- `admin` - System administrator

**Examples:**
```bash
# Make yourself an admin
node scripts/set-user-role.js mariannav920@gmail.com admin

# Create a student
node scripts/set-user-role.js student@example.com student

# Create a tutor
node scripts/set-user-role.js tutor@example.com tutor
```

**What it does:**
1. ✅ Sets Firebase Auth custom claim
2. ✅ Creates/updates user document in Firestore
3. ✅ Initializes student data (XP, level) if student role

---

### 2. Seed Curriculum

Creates initial quest and challenge templates.

**Usage:**
```bash
node scripts/seed-curriculum.js
```

**What it creates:**
- 📚 1 Quest Template: "Number Sense Adventure" (L1UM-CORE)
- 🎯 16 Challenge Templates (L1UM-CORE-01 through L1UM-CORE-16)
- 🏆 1 Badge Template: "Number Ninja"

**Safe to run multiple times** - Will update existing templates.

---

### 3. Assign Quest

Assigns a quest to a student (creates quest instance + challenge instances).

**Usage:**
```bash
node scripts/assign-quest.js STUDENT_EMAIL QUEST_ID
```

**Example:**
```bash
node scripts/assign-quest.js student@example.com L1UM-CORE
```

**Prerequisites:**
1. Student must exist in Firebase Auth
2. Student must have 'student' role set
3. Quest template must exist (run `seed-curriculum.js` first)

**What it does:**
1. ✅ Creates quest instance document
2. ✅ Creates 16 challenge instance documents
3. ✅ Sets initial status to ACTIVE
4. ✅ Student can immediately start the quest

---

## Complete Workflow Example

### Setup a new student from scratch:

```bash
# 1. Create user in Firebase Console → Authentication
#    Email: student@example.com
#    Password: (set a password)

# 2. Set their role to student
node scripts/set-user-role.js student@example.com student

# 3. Seed curriculum if not done already
node scripts/seed-curriculum.js

# 4. Assign them their first quest
node scripts/assign-quest.js student@example.com L1UM-CORE

# ✅ Done! Student can now log in and start learning
```

### Setup an admin (yourself):

```bash
# Create your account in Firebase Console → Authentication

# Set yourself as admin
node scripts/set-user-role.js mariannav920@gmail.com admin

# ✅ You can now access admin dashboard
```

### Setup a tutor:

```bash
# Create tutor account in Firebase Console

# Set role
node scripts/set-user-role.js tutor@example.com tutor

# Assign students to tutor (TODO: script for this)
```

---

## Troubleshooting

### "Error initializing Firebase Admin"

**Fix:**
```bash
# Make sure you're logged in
firebase login

# Or set credentials
export GOOGLE_APPLICATION_CREDENTIALS="path/to/service-account-key.json"
```

### "User not found"

**Fix:** Create the user in Firebase Console → Authentication first.

### "Quest template not found"

**Fix:** Run `seed-curriculum.js` first to create templates.

### "Permission denied"

**Fix:** Deploy security rules:
```bash
firebase deploy --only firestore:rules
```

---

## Advanced Usage

### Using Service Account (for CI/CD)

1. Download service account key from Firebase Console
2. Set environment variable:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/key.json"
   ```
3. Run scripts as normal

### Batch Operations

Create a script to process multiple users:

```bash
#!/bin/bash
# batch-create-students.sh

students=(
  "student1@example.com"
  "student2@example.com"
  "student3@example.com"
)

for email in "${students[@]}"; do
  node scripts/set-user-role.js "$email" student
  node scripts/assign-quest.js "$email" L1UM-CORE
done
```

---

## Future Scripts (TODO)

- [ ] `list-users.js` - List all users by role
- [ ] `assign-tutor.js` - Link tutor to students
- [ ] `link-parent.js` - Link parent to children
- [ ] `create-cohort.js` - Create learning cohorts
- [ ] `export-progress.js` - Export student progress reports
- [ ] `backup-firestore.js` - Backup Firestore data
- [ ] `reset-student.js` - Reset student progress

---

## Security Notes

⚠️ **These scripts have admin privileges** - Use carefully!

- Never commit service account keys to Git
- Only run in trusted environments
- Use separate dev/prod Firebase projects
- Audit logs regularly in Firebase Console

---

## Support

Questions? Email: mariannav920@gmail.com

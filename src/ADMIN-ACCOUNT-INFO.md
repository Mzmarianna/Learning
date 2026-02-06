# 🔐 ADMIN ACCOUNT INFORMATION

## ✅ **YES, YOU HAVE AN ADMIN ACCOUNT SET UP!**

---

## 📧 **DEFAULT ADMIN CREDENTIALS:**

```
Email:    mariannav920@gmail.com
Password: marianna2026
Name:     Mz. Marianna
```

---

## 🚀 **HOW TO ACCESS:**

### **1. Go to your app**
```bash
npm run dev
```

Open: http://localhost:5173

### **2. Click "Login"**

### **3. Select "Admin" role card**
(Purple card with Shield icon)

### **4. Enter credentials:**
- **Email:** `mariannav920@gmail.com`
- **Password:** `marianna2026`

### **5. Access Admin Dashboard**
You'll be redirected to `/dashboard/admin`

---

## 🛡️ **WHAT ADMIN CAN DO:**

### **Dashboard Features:**
- ✅ View all students
- ✅ Create new students
- ✅ Assign challenges
- ✅ Manage content library
- ✅ View system analytics
- ✅ Manage tutors & teachers
- ✅ Configure school partnerships

### **Special Admin Permissions:**
- ✅ **No subscription required** (staff don't need to pay)
- ✅ Access to all student data
- ✅ Audit logs for compliance
- ✅ Email management
- ✅ Content creation & editing
- ✅ User role assignment

---

## 🔧 **IF ADMIN DOESN'T EXIST IN DATABASE:**

Run this script to create the admin user:

```bash
node scripts/create-admin-user.js
```

**Requirements:**
- Set environment variables first:
  - `SUPABASE_URL` (or `VITE_SUPABASE_URL`)
  - `SUPABASE_SERVICE_ROLE_KEY` (not anon key!)

**Optional environment variables:**
- `ADMIN_EMAIL` (defaults to mariannav920@gmail.com)
- `ADMIN_PASSWORD` (defaults to marianna2026)

---

## 🔑 **CHANGE PASSWORD (RECOMMENDED FOR PRODUCTION):**

### **Option 1: Via Supabase Dashboard**
1. Go to Supabase Dashboard → Authentication → Users
2. Find `mariannav920@gmail.com`
3. Click "..." → "Send password reset email"

### **Option 2: Via SQL**
Run in Supabase SQL Editor:
```sql
-- Change admin password
UPDATE auth.users
SET encrypted_password = crypt('YourNewPassword123', gen_salt('bf'))
WHERE email = 'mariannav920@gmail.com';
```

### **Option 3: Via App (after login)**
1. Login as admin
2. Go to Settings → Change Password
3. Enter new password

---

## 📊 **ADMIN-ONLY FILES IN YOUR CODEBASE:**

### **Pages:**
- `/pages/AdminDashboardPage.tsx` - Main admin interface

### **Components:**
- `/components/dashboard/AdminDashboard.tsx` - Dashboard UI
- `/components/admin/CreateStudentModal.tsx` - Create students
- `/components/admin/AssignChallengesModal.tsx` - Assign work

### **API Functions:**
- `/lib/supabase/auth.ts` - `isAdmin()` function
- `/lib/privacy-compliance.ts` - Admin audit logs

### **Scripts:**
- `/scripts/create-admin-user.js` - Create admin programmatically
- `/supabase/setup-admin-user.sql` - Manual SQL setup

---

## ⚠️ **SECURITY NOTES:**

### **For Production:**
1. ✅ **Change the default password immediately**
2. ✅ Move credentials to environment variables
3. ✅ Enable 2FA (if Supabase supports it)
4. ✅ Use strong password (15+ characters)
5. ✅ Don't commit passwords to Git

### **Current Status:**
- ⚠️ Default password in code (dev only - CHANGE THIS!)
- ⚠️ Password visible in scripts (delete after setup)
- ✅ Admin route protected (requires auth)
- ✅ Role-based access control implemented

---

## 🧪 **TEST ADMIN ACCESS NOW:**

### **Quick Test:**
1. Run: `npm run dev`
2. Go to: http://localhost:5173
3. Click: "Login"
4. Select: "Admin" card (purple with shield)
5. Enter:
   - Email: `mariannav920@gmail.com`
   - Password: `marianna2026`
6. Click: "Sign In"

**Expected:** Redirects to `/dashboard/admin` with full admin interface

---

## 🎯 **ADMIN DASHBOARD FEATURES:**

When you login, you'll see:

### **Top Stats Cards:**
- Total Students
- Active This Week
- Content Items
- Average Progress

### **Quick Actions:**
- 👤 Create New Student
- 📋 Assign Challenges
- 📚 View Content Library
- 👥 Manage Users

### **Management Sections:**
- Student Management
- Content Library
- Teacher/Tutor Management
- Analytics & Reports
- System Settings

---

## ✅ **SUMMARY:**

**You have:**
- ✅ Admin account configured
- ✅ Default credentials set
- ✅ Admin dashboard built
- ✅ Role-based access working
- ✅ Admin-only routes protected
- ✅ Scripts to create admin users

**Default Login:**
- 📧 **Email:** mariannav920@gmail.com
- 🔐 **Password:** marianna2026

**Test it now with:** `npm run dev`

---

## 🚨 **IMPORTANT:**

**BEFORE DEPLOYING TO PRODUCTION:**
1. Change the admin password
2. Remove password from scripts
3. Use environment variables
4. Enable audit logging
5. Set up admin alerts

**The default password `marianna2026` is for DEVELOPMENT ONLY!**

---

**Go test your admin access now!** 🛡️✨

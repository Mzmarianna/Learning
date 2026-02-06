# 🚀 Quick Reference Card - Mz. Marianna's Academy

**One-page reference for deployment and maintenance**

---

## 🔑 Admin Credentials

```
Email:    mariannav920@gmail.com
Password: marianna2026
URL:      https://your-app.vercel.app/login
```

⚠️  Change password after first login!

---

## 📊 System Status

### Health Check
```bash
curl https://your-app.vercel.app/api/health-check
```

Expected: `{ "status": "healthy" }`

### Cron Jobs (Automated)
- **Health Check:** Every 15 minutes
- **Subscriptions:** Daily at 2 AM
- **Cleanup:** Daily at 3 AM  
- **Reports:** Monday at 9 AM

---

## 🚀 Deployment Commands

### Push to GitHub
```bash
git add .
git commit -m "Update"
git push
```

### Deploy to Vercel
```bash
vercel --prod
```

### Create Admin User
```bash
node scripts/create-admin-user.js
```

---

## 🗄️ Database Access

**Supabase Dashboard:**
- https://supabase.com/dashboard
- Project: wyclbrafklhvdyjpoeno

**Quick SQL:**
```sql
-- Check admin user
SELECT * FROM profiles WHERE role = 'admin';

-- Count students
SELECT COUNT(*) FROM student_profiles;

-- Recent activity
SELECT * FROM xp_events ORDER BY created_at DESC LIMIT 10;
```

---

## 🌐 Important URLs

| Service | URL |
|---------|-----|
| Production App | https://your-app.vercel.app |
| Admin Login | /login |
| Placement Quiz | /placement-quiz |
| Health Check | /api/health-check |
| Vercel Dashboard | https://vercel.com/dashboard |
| Supabase Dashboard | https://supabase.com/dashboard |
| UptimeRobot | https://uptimerobot.com |

---

## 🔐 Environment Variables (Vercel)

**Required:**
```bash
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
CRON_API_KEY=your-secret-key
```

**Optional:**
```bash
OPENAI_API_KEY=sk-xxx...
SHOPIFY_STORE_URL=store.myshopify.com
RESEND_API_KEY=re_xxx...
```

---

## 🛠️ Common Tasks

### Test Locally
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
```

### Test Cron Jobs
```bash
curl -H "Authorization: Bearer YOUR_CRON_API_KEY" \
  https://your-app.vercel.app/api/cleanup-expired-sessions
```

---

## 📚 Key Files

| File | Purpose |
|------|---------|
| `/PRODUCTION-READY.md` | Deployment guide |
| `/AUTOMATION-GUIDE.md` | Cron jobs & monitoring |
| `/FINAL-SUMMARY.md` | Complete overview |
| `/config.ts` | Configuration |
| `/vercel.json` | Deployment settings |
| `.env.example` | Environment template |

---

## 🆘 Emergency Contacts

**Support Email:** mariannav920@gmail.com

**Status Pages:**
- Vercel: https://www.vercel-status.com
- Supabase: https://status.supabase.com

---

## ✅ Daily Checklist

- [ ] Check UptimeRobot status
- [ ] Review Vercel logs
- [ ] Check Supabase dashboard
- [ ] Monitor user signups
- [ ] Review error emails

---

## 📊 Metrics to Track

- Active users
- Placement quiz completions
- Student signups
- Average session time
- Database size
- API response times

---

## 🔄 Update Workflow

1. Make changes locally
2. Test: `npm run dev`
3. Build: `npm run build`
4. Commit: `git commit -m "..."`
5. Push: `git push`
6. Vercel auto-deploys

---

## 🐛 Quick Fixes

**Site Down:**
- Check Vercel status page
- Check Supabase dashboard
- Review recent deployments

**Login Fails:**
- Verify Supabase credentials
- Check user exists in database
- Try password reset

**Slow Performance:**
- Check database indexes
- Review slow queries
- Check Vercel analytics

---

**Keep this card handy for quick reference!** 🎯

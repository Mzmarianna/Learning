# 🚀 DEPLOY NOW - Simple Checklist

**Follow these exact steps. Should take 30 minutes total.**

---

## ✅ **CHECKLIST**

### **BEFORE YOU START** (5 minutes)

- [ ] Google Cloud SDK installed: `gcloud --version`
- [ ] Terraform installed: `terraform --version`
- [ ] Logged into Google Cloud: `gcloud auth login`
- [ ] Have your Gemini API key ready
- [ ] Have your Resend API key ready

---

### **STEP 1: Configure API Keys** (2 minutes)

```bash
# Open the config file
vim terraform/terraform.tfvars

# Change these two lines:
gemini_api_key = "YOUR_GEMINI_API_KEY_HERE"  # ← Put your real key here
resend_api_key = "YOUR_RESEND_API_KEY_HERE"  # ← Put your real key here

# Save and exit (:wq in vim)
```

- [ ] API keys added to terraform.tfvars
- [ ] File saved

---

### **STEP 2: Run Deployment Script** (15 minutes)

```bash
chmod +x deploy.sh
./deploy.sh
```

The script will ask you to confirm. **Type: `yes`**

Then wait 10-15 minutes while it creates everything.

- [ ] Script completed successfully
- [ ] No red error messages
- [ ] `deployment-info.txt` file created

---

### **STEP 3: Update DNS** (5 minutes)

Open `deployment-info.txt` and find your LOAD BALANCER IP.

**Example:** `34.107.123.456`

Go to **Squarespace** → Settings → Domains → DNS:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | `YOUR_IP_HERE` | 3600 |
| A | www | `YOUR_IP_HERE` | 3600 |

- [ ] A record for @ created
- [ ] A record for www created
- [ ] Changes saved in Squarespace

---

### **STEP 4: Deploy Database** (5 minutes)

```bash
# Connect to database
./connect-db.sh
```

When it asks for password, look in `deployment-info.txt` for **DATABASE ADMIN PASSWORD**.

Copy and paste it.

Then in the database prompt, run:

```sql
\i gcp/schema.sql
\i gcp/functions.sql
\q
```

- [ ] Schema deployed successfully
- [ ] No errors in database
- [ ] Exited database

---

### **STEP 5: Wait for SSL** (15-30 minutes)

SSL certificate provisions automatically after DNS updates.

Check status every 10 minutes:

```bash
gcloud compute ssl-certificates list
```

Look for **STATUS: ACTIVE**

- [ ] SSL certificate status is ACTIVE

---

### **STEP 6: Deploy Application** (10 minutes)

**Backend:**
```bash
./deploy-backend.sh
```

**Frontend:**
```bash
./deploy-frontend.sh
```

- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] No errors

---

### **STEP 7: Test Your Site** (2 minutes)

```bash
# Test API
curl https://www.mzmarianna.com/health

# Open in browser
open https://www.mzmarianna.com
```

- [ ] Health check returns: `{"status":"ok"}`
- [ ] Site loads in browser
- [ ] SSL padlock shows in browser

---

## 🎉 **YOU'RE LIVE!**

Your global edtech platform is now running on Google Cloud!

**What you deployed:**
- ✅ Database with 200 connections (handles 100K+ users)
- ✅ Auto-scaling backend (2-100 instances)
- ✅ Global CDN for fast loading worldwide
- ✅ SSL/HTTPS encryption
- ✅ DDoS protection
- ✅ Automated backups
- ✅ Real-time monitoring
- ✅ Read replicas for performance

**Monthly cost:** ~$470/month for full global scale

**To reduce cost for testing:**
- Edit `terraform/terraform.tfvars`
- Uncomment the "STARTER" section
- Run: `cd terraform && terraform apply`
- Cost drops to ~$150/month

---

## 🔄 **UPDATING YOUR SITE**

**Update frontend:**
```bash
./deploy-frontend.sh
```

**Update backend:**
```bash
./deploy-backend.sh
```

---

## 📊 **VIEW LOGS & MONITORING**

**Backend logs:**
```bash
gcloud run services logs read mz-marianna-academy-backend --region us-central1
```

**Monitoring dashboard:**
Check `deployment-info.txt` for the dashboard URL

---

## 🆘 **SOMETHING WRONG?**

**SSL not working after 30 minutes?**
```bash
# Check DNS is correct
dig www.mzmarianna.com
# Should show your load balancer IP
```

**Can't connect to database?**
```bash
# Verify database is running
gcloud sql instances list
```

**Site not loading?**
```bash
# Check Cloud Run is running
gcloud run services list
```

**Still stuck?**
Check the full README.md for detailed troubleshooting.

---

## 🎯 **WHAT'S NEXT?**

1. Test student signup flow
2. Test WOWL AI assessment
3. Upload your actual content
4. Invite beta testers
5. Monitor performance dashboard
6. Scale up as you grow!

---

**Your platform is ready to serve learners worldwide! 🌍✨**

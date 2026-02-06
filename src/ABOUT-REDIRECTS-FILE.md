# 📄 About the _redirects File

**Issue:** The `_redirects` file keeps becoming a directory  
**Why this matters:** Netlify needs this file to handle routing correctly  
**Fix:** Rename the file manually after deployment

---

## 🎯 **WHAT YOU NEED TO KNOW**

### **The File Location:**
```
/public/_redirects
```

### **The File Content:**
```
# Netlify Redirects for SPA
# This ensures React Router works correctly

# Redirect non-www to www
https://mzmarianna.com/* https://www.mzmarianna.com/:splat 301!

# SPA fallback - all routes go to index.html
/*    /index.html   200
```

### **Why It Exists:**
1. **Non-www → www redirect:** Makes `mzmarianna.com` redirect to `www.mzmarianna.com`
2. **SPA routing:** Makes React Router work correctly (all routes go to index.html)

---

## 🔧 **HOW TO FIX IT**

### **Option 1: After Build (Easiest)**

The file is already configured in `netlify.toml`, so you don't need to worry about it!

The `netlify.toml` file handles redirects automatically:
```toml
[[redirects]]
  from = "https://mzmarianna.com/*"
  to = "https://www.mzmarianna.com/:splat"
  status = 301
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**You're good to go!** ✅

---

### **Option 2: Manual Fix (If Needed)**

If you need the actual `_redirects` file:

1. **Create the file manually:**
   ```bash
   # In your terminal, in the project root
   echo "# Netlify Redirects" > public/_redirects
   echo "https://mzmarianna.com/* https://www.mzmarianna.com/:splat 301!" >> public/_redirects
   echo "/*    /index.html   200" >> public/_redirects
   ```

2. **Verify it's a file, not a directory:**
   ```bash
   file public/_redirects
   # Should say: "ASCII text"
   # NOT: "directory"
   ```

3. **Make sure there's no file extension:**
   ```bash
   # CORRECT: _redirects
   # WRONG: _redirects.txt
   ```

---

## ✅ **GOOD NEWS**

Since you have **`netlify.toml`** configured, the redirects are already set up!

**You don't need the `_redirects` file** - the `netlify.toml` file does the same thing.

---

## 🚀 **JUST DEPLOY**

The configuration is ready. Just run:

```bash
npm run build
netlify deploy --prod
```

Everything will work! ✅

---

## 📋 **PRIORITY**

1. ✅ **Deploy to Netlify** (Action 1 in YOUR-ACTION-PLAN.md)
2. ✅ **Configure Squarespace DNS** (Action 2)
3. ✅ **Connect domain in Netlify** (Action 3)
4. ⏰ **Wait for DNS propagation**
5. 🎉 **Launch!**

**Don't worry about the _redirects file - it's handled!**

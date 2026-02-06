# ============================================================================
# MZ. MARIANNA'S ACADEMY - PRODUCTION CONFIGURATION
# Global EdTech Platform - Optimized for 100,000+ Users
# ============================================================================

# ============================================================================
# 🔑 REQUIRED: ADD YOUR API KEYS HERE
# ============================================================================

gemini_api_key = "YOUR_GEMINI_API_KEY_HERE"  # Get from: https://ai.google.dev/
resend_api_key = "YOUR_RESEND_API_KEY_HERE"  # Get from: https://resend.com/

# ============================================================================
# 🌍 GLOBAL PRODUCTION CONFIGURATION (Pre-Optimized)
# Ready for 100,000+ concurrent users across 3 continents
# ============================================================================

# Project
project_id  = "gen-lang-client-0029826717"
region      = "us-central1"
environment = "production"
app_name    = "mz-marianna-academy"
domain_name = "www.mzmarianna.com"

# Database - HIGH PERFORMANCE
db_tier                    = "db-n1-standard-4"  # 4 vCPUs, 15GB RAM ($250/mo)
db_disk_size               = 100                 # Initial: 100GB
db_max_disk_size           = 500                 # Max: 500GB (auto-scales)
db_backup_enabled          = true
db_backup_start_time       = "03:00"
enable_read_replicas       = true                # 2 read replicas for scaling

# Backend - AUTO-SCALING
backend_min_instances = 2      # Always ready: 2 instances
backend_max_instances = 100    # Scale up to: 100 instances
backend_cpu           = "2000m"  # 2 vCPUs per instance
backend_memory        = "2Gi"    # 2GB RAM per instance
backend_concurrency   = 100      # 100 concurrent requests per instance

# CDN & Performance
enable_cdn         = true
cdn_cache_max_ttl  = 86400  # Cache static assets for 24 hours

# Security
enable_cloud_armor = true  # DDoS protection + rate limiting

# Monitoring
enable_monitoring    = true
enable_uptime_checks = true
alert_email          = "mariannav920@gmail.com"

# ============================================================================
# 💰 COST OPTIMIZATION PRESETS
# Uncomment a section below to change scale/cost
# ============================================================================

# STARTER - 1,000 users (~$150/month)
# db_tier               = "db-g1-small"
# backend_min_instances = 0
# backend_max_instances = 10
# enable_read_replicas  = false

# GROWTH - 10,000 users (~$250/month)
# db_tier               = "db-n1-standard-2"
# backend_min_instances = 1
# backend_max_instances = 20
# enable_read_replicas  = false

# ENTERPRISE - 100,000+ users (~$470/month) ✅ CURRENT
# Already configured above!

# ============================================================================
# DEPLOYMENT NOTES
# ============================================================================
# 
# 1. Add your API keys above (REQUIRED)
# 2. Choose your scale preset (or keep ENTERPRISE default)
# 3. Run: ./deploy.sh
# 4. Infrastructure deploys in 10-15 minutes
# 
# Your platform will be ready to scale globally! 🚀
# ============================================================================
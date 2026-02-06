# ============================================================================
# TERRAFORM VARIABLES
# Mz. Marianna's Academy - Global Scale Configuration
# ============================================================================

# ============================================================================
# PROJECT CONFIGURATION
# ============================================================================

variable "project_id" {
  description = "Google Cloud Project ID"
  type        = string
  default     = "gen-lang-client-0029826717"
}

variable "region" {
  description = "Primary region for resources"
  type        = string
  default     = "us-central1"
}

variable "regions" {
  description = "Multi-region deployment for global scale"
  type        = list(string)
  default     = ["us-central1", "europe-west1", "asia-southeast1"]
}

variable "zone" {
  description = "Primary zone for resources"
  type        = string
  default     = "us-central1-a"
}

variable "environment" {
  description = "Environment (dev, staging, production)"
  type        = string
  default     = "production"
}

# ============================================================================
# APPLICATION CONFIGURATION
# ============================================================================

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "mz-marianna-academy"
}

variable "domain_name" {
  description = "Primary domain name"
  type        = string
  default     = "www.mzmarianna.com"
}

# ============================================================================
# DATABASE CONFIGURATION - OPTIMIZED FOR 100K+ USERS
# ============================================================================

variable "db_tier" {
  description = "Cloud SQL instance tier"
  type        = string
  default     = "db-n1-standard-4" # 4 vCPUs, 15GB RAM for scale
}

variable "db_name" {
  description = "PostgreSQL database name"
  type        = string
  default     = "mz_marianna_db"
}

variable "db_version" {
  description = "PostgreSQL version"
  type        = string
  default     = "POSTGRES_15"
}

variable "db_disk_size" {
  description = "Initial disk size in GB"
  type        = number
  default     = 100
}

variable "db_max_disk_size" {
  description = "Maximum disk size for auto-resize"
  type        = number
  default     = 500
}

variable "db_backup_enabled" {
  description = "Enable automated backups"
  type        = bool
  default     = true
}

variable "db_backup_start_time" {
  description = "Backup start time (HH:MM format)"
  type        = string
  default     = "03:00"
}

variable "enable_read_replicas" {
  description = "Enable read replicas for scaling reads"
  type        = bool
  default     = true
}

# ============================================================================
# CLOUD RUN CONFIGURATION - GLOBAL SCALE
# ============================================================================

variable "backend_min_instances" {
  description = "Minimum number of backend instances"
  type        = number
  default     = 2 # Always have 2 ready for high availability
}

variable "backend_max_instances" {
  description = "Maximum number of backend instances"
  type        = number
  default     = 100 # Scale to 100 for global traffic
}

variable "backend_cpu" {
  description = "CPU allocation for backend (1000m = 1 vCPU)"
  type        = string
  default     = "2000m"
}

variable "backend_memory" {
  description = "Memory allocation for backend"
  type        = string
  default     = "2Gi"
}

variable "backend_timeout" {
  description = "Request timeout in seconds"
  type        = number
  default     = 300
}

variable "backend_concurrency" {
  description = "Maximum concurrent requests per instance"
  type        = number
  default     = 100
}

# ============================================================================
# CDN & CACHING
# ============================================================================

variable "enable_cdn" {
  description = "Enable Cloud CDN for global content delivery"
  type        = bool
  default     = true
}

variable "cdn_cache_max_ttl" {
  description = "Maximum CDN cache TTL in seconds"
  type        = number
  default     = 86400 # 24 hours
}

# ============================================================================
# SECURITY & SECRETS
# ============================================================================

variable "gemini_api_key" {
  description = "Gemini API key for WOWL AI"
  type        = string
  sensitive   = true
  default     = ""
}

variable "resend_api_key" {
  description = "Resend API key for email"
  type        = string
  sensitive   = true
  default     = ""
}

variable "jwt_secret" {
  description = "JWT secret for authentication"
  type        = string
  sensitive   = true
  default     = ""
}

variable "session_secret" {
  description = "Session secret for Express"
  type        = string
  sensitive   = true
  default     = ""
}

variable "enable_cloud_armor" {
  description = "Enable Cloud Armor DDoS protection"
  type        = bool
  default     = true
}

# ============================================================================
# MONITORING & ALERTING
# ============================================================================

variable "enable_monitoring" {
  description = "Enable Cloud Monitoring"
  type        = bool
  default     = true
}

variable "alert_email" {
  description = "Email for alerts and notifications"
  type        = string
  default     = "mariannav920@gmail.com"
}

variable "enable_uptime_checks" {
  description = "Enable uptime monitoring"
  type        = bool
  default     = true
}

# ============================================================================
# TAGS & LABELS
# ============================================================================

variable "labels" {
  description = "Common labels for all resources"
  type        = map(string)
  default = {
    project     = "mz-marianna-academy"
    managed_by  = "terraform"
    environment = "production"
    owner       = "marianna"
    scale       = "global"
  }
}
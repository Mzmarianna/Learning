# ============================================================================
# CLOUD STORAGE
# Mz. Marianna's Academy - Storage Buckets
# ============================================================================

# ============================================================================
# FRONTEND STORAGE BUCKET
# ============================================================================

resource "google_storage_bucket" "frontend_storage" {
  name          = "wowl-frontend-storage"
  location      = var.region
  project       = var.project_id
  storage_class = var.storage_class
  force_destroy = false # Prevent accidental deletion

  uniform_bucket_level_access = true

  # Website configuration
  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }

  # CORS configuration for frontend assets
  cors {
    origin          = ["https://${var.domain_name}", "https://www.mzmarianna.com"]
    method          = ["GET", "HEAD", "OPTIONS"]
    response_header = ["*"]
    max_age_seconds = 3600
  }

  # Lifecycle rules
  lifecycle_rule {
    condition {
      age = var.storage_lifecycle_age
    }
    action {
      type          = "SetStorageClass"
      storage_class = "NEARLINE"
    }
  }

  # Versioning
  versioning {
    enabled = true
  }

  labels = var.labels
}

# ============================================================================
# USER UPLOADS BUCKET (student submissions, avatars, etc.)
# ============================================================================

resource "google_storage_bucket" "user_uploads" {
  name          = "${var.app_name}-user-uploads"
  location      = var.region
  project       = var.project_id
  storage_class = var.storage_class
  force_destroy = false

  uniform_bucket_level_access = true

  # CORS configuration for file uploads
  cors {
    origin          = ["https://${var.domain_name}"]
    method          = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    response_header = ["Content-Type", "Content-Disposition"]
    max_age_seconds = 3600
  }

  # Lifecycle rules - move old uploads to cheaper storage
  lifecycle_rule {
    condition {
      age = 180 # 6 months
    }
    action {
      type          = "SetStorageClass"
      storage_class = "NEARLINE"
    }
  }

  lifecycle_rule {
    condition {
      age = 365 # 1 year
    }
    action {
      type          = "SetStorageClass"
      storage_class = "COLDLINE"
    }
  }

  # Versioning for recovery
  versioning {
    enabled = true
  }

  labels = var.labels
}

# ============================================================================
# DATABASE BACKUPS BUCKET
# ============================================================================

resource "google_storage_bucket" "db_backups" {
  name          = "${var.app_name}-db-backups"
  location      = var.region
  project       = var.project_id
  storage_class = "NEARLINE" # Cheaper for backups
  force_destroy = false

  uniform_bucket_level_access = true

  # Lifecycle rules - keep backups for 90 days
  lifecycle_rule {
    condition {
      age = 90
    }
    action {
      type = "Delete"
    }
  }

  # Versioning
  versioning {
    enabled = true
  }

  labels = merge(var.labels, {
    purpose = "database-backups"
  })
}

# ============================================================================
# IAM BINDINGS
# ============================================================================

# Allow backend service to read/write user uploads
resource "google_storage_bucket_iam_member" "backend_uploads_admin" {
  bucket = google_storage_bucket.user_uploads.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.backend_sa.email}"
}

# Allow backend service to read frontend storage
resource "google_storage_bucket_iam_member" "backend_frontend_viewer" {
  bucket = google_storage_bucket.frontend_storage.name
  role   = "roles/storage.objectViewer"
  member = "serviceAccount:${google_service_account.backend_sa.email}"
}

# Make frontend storage publicly readable
resource "google_storage_bucket_iam_member" "frontend_public_access" {
  bucket = google_storage_bucket.frontend_storage.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

# ============================================================================
# BACKEND CDN BUCKET FOR STATIC ASSETS
# ============================================================================

resource "google_compute_backend_bucket" "frontend_cdn" {
  name        = "${var.app_name}-frontend-cdn"
  bucket_name = google_storage_bucket.frontend_storage.name
  enable_cdn  = true
  project     = var.project_id

  cdn_policy {
    cache_mode        = "CACHE_ALL_STATIC"
    client_ttl        = 3600
    default_ttl       = 3600
    max_ttl           = 86400
    negative_caching  = true
    serve_while_stale = 86400
  }
}

# ============================================================================
# OUTPUTS
# ============================================================================

output "frontend_storage_bucket" {
  description = "Frontend storage bucket name"
  value       = google_storage_bucket.frontend_storage.name
}

output "frontend_storage_url" {
  description = "Frontend storage bucket URL"
  value       = google_storage_bucket.frontend_storage.url
}

output "user_uploads_bucket" {
  description = "User uploads bucket name"
  value       = google_storage_bucket.user_uploads.name
}

output "db_backups_bucket" {
  description = "Database backups bucket name"
  value       = google_storage_bucket.db_backups.name
}

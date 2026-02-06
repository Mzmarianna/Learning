# ============================================================================
# CLOUD SQL FOR POSTGRESQL
# Mz. Marianna's Academy Database - Production Scale
# ============================================================================

# ============================================================================
# CLOUD SQL INSTANCE - HIGH AVAILABILITY
# ============================================================================

resource "google_sql_database_instance" "main" {
  name             = "${var.app_name}-db-instance"
  database_version = var.db_version
  region           = var.region
  project          = var.project_id

  deletion_protection = true

  settings {
    tier              = var.db_tier
    availability_type = "REGIONAL" # High availability with failover
    disk_type         = "PD_SSD"
    disk_size         = var.db_disk_size
    disk_autoresize   = true
    disk_autoresize_limit = var.db_max_disk_size

    # Backup configuration
    backup_configuration {
      enabled                        = var.db_backup_enabled
      start_time                     = var.db_backup_start_time
      point_in_time_recovery_enabled = true
      transaction_log_retention_days = 7
      backup_retention_settings {
        retained_backups = 30
        retention_unit   = "COUNT"
      }
    }

    # Maintenance window
    maintenance_window {
      day          = 7 # Sunday
      hour         = 4 # 4 AM
      update_track = "stable"
    }

    # IP configuration - private IP only
    ip_configuration {
      ipv4_enabled                                  = true
      private_network                               = google_compute_network.vpc.id
      enable_private_path_for_google_cloud_services = true
      
      authorized_networks {
        name  = "cloud-run-access"
        value = "0.0.0.0/0"
      }
    }

    # Insights configuration
    insights_config {
      query_insights_enabled  = true
      query_plans_per_minute  = 5
      query_string_length     = 1024
      record_application_tags = true
    }

    # Database flags - OPTIMIZED FOR SCALE
    database_flags {
      name  = "max_connections"
      value = "200" # Increased for 100K+ users
    }

    database_flags {
      name  = "shared_buffers"
      value = "1048576" # 1GB (for db-n1-standard-4)
    }

    database_flags {
      name  = "effective_cache_size"
      value = "3145728" # 3GB
    }

    database_flags {
      name  = "work_mem"
      value = "8192" # 8MB
    }

    database_flags {
      name  = "maintenance_work_mem"
      value = "131072" # 128MB
    }

    database_flags {
      name  = "random_page_cost"
      value = "1.1"
    }

    database_flags {
      name  = "effective_io_concurrency"
      value = "200" # SSD optimization
    }

    database_flags {
      name  = "log_min_duration_statement"
      value = "1000"
    }

    database_flags {
      name  = "cloudsql.enable_pgaudit"
      value = "on"
    }

    # Connection pooling
    database_flags {
      name  = "cloudsql.iam_authentication"
      value = "on"
    }
  }

  depends_on = [
    google_service_networking_connection.private_vpc_connection
  ]
}

# ============================================================================
# READ REPLICAS - FOR SCALING READS
# ============================================================================

resource "google_sql_database_instance" "read_replica" {
  count = var.enable_read_replicas ? 2 : 0
  
  name             = "${var.app_name}-db-read-replica-${count.index + 1}"
  database_version = var.db_version
  region           = var.region
  project          = var.project_id
  
  master_instance_name = google_sql_database_instance.main.name
  
  deletion_protection = false

  replica_configuration {
    failover_target = false
  }

  settings {
    tier              = var.db_tier
    availability_type = "ZONAL"
    disk_type         = "PD_SSD"
    disk_autoresize   = true
    
    ip_configuration {
      ipv4_enabled    = true
      private_network = google_compute_network.vpc.id
    }
  }
}

# ============================================================================
# DATABASE
# ============================================================================

resource "google_sql_database" "main" {
  name     = var.db_name
  instance = google_sql_database_instance.main.name
  project  = var.project_id

  charset   = "UTF8"
  collation = "en_US.UTF8"
}

# ============================================================================
# DATABASE USERS
# ============================================================================

# Application user (for backend service)
resource "google_sql_user" "app_user" {
  name     = "app_user"
  instance = google_sql_database_instance.main.name
  password = local.db_password
  project  = var.project_id
}

# Admin user (for migrations and management)
resource "google_sql_user" "admin_user" {
  name     = "admin_user"
  instance = google_sql_database_instance.main.name
  password = random_password.db_admin_password.result
  project  = var.project_id
}

resource "random_password" "db_admin_password" {
  length  = 32
  special = true
}

# ============================================================================
# IAM BINDINGS
# ============================================================================

# Allow Cloud Run service account to connect to Cloud SQL
resource "google_project_iam_member" "cloudsql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.backend_sa.email}"
}

# ============================================================================
# SERVICE ACCOUNT FOR BACKEND
# ============================================================================

resource "google_service_account" "backend_sa" {
  account_id   = "${var.app_name}-backend-sa"
  display_name = "Mz. Marianna Backend Service Account"
  project      = var.project_id
}

# ============================================================================
# OUTPUTS
# ============================================================================

output "db_instance_connection_name" {
  description = "Cloud SQL instance connection name"
  value       = google_sql_database_instance.main.connection_name
}

output "db_instance_ip" {
  description = "Cloud SQL instance private IP"
  value       = google_sql_database_instance.main.private_ip_address
  sensitive   = true
}

output "db_name" {
  description = "Database name"
  value       = google_sql_database.main.name
}

output "db_user" {
  description = "Application database user"
  value       = google_sql_user.app_user.name
}
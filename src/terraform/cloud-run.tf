# ============================================================================
# CLOUD RUN SERVICES
# Mz. Marianna's Academy Backend
# ============================================================================

# ============================================================================
# BACKEND SERVICE
# ============================================================================

resource "google_cloud_run_v2_service" "backend" {
  name     = "${var.app_name}-backend"
  location = var.region
  project  = var.project_id

  ingress = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.backend_sa.email

    # Scaling configuration
    scaling {
      min_instance_count = var.backend_min_instances
      max_instance_count = var.backend_max_instances
    }

    # VPC connector for Cloud SQL access
    vpc_access {
      connector = google_vpc_access_connector.connector.id
      egress    = "PRIVATE_RANGES_ONLY"
    }

    # Timeout
    timeout = "${var.backend_timeout}s"

    containers {
      name  = "backend"
      image = "us-docker.pkg.dev/cloudrun/container/hello" # Placeholder - replace with your image

      # Resource limits
      resources {
        limits = {
          cpu    = var.backend_cpu
          memory = var.backend_memory
        }
        cpu_idle = true
        startup_cpu_boost = true
      }

      # Startup probe
      startup_probe {
        http_get {
          path = "/health"
          port = 8080
        }
        initial_delay_seconds = 10
        timeout_seconds       = 3
        period_seconds        = 3
        failure_threshold     = 3
      }

      # Liveness probe
      liveness_probe {
        http_get {
          path = "/health"
          port = 8080
        }
        initial_delay_seconds = 30
        timeout_seconds       = 3
        period_seconds        = 10
        failure_threshold     = 3
      }

      # Environment variables
      env {
        name  = "NODE_ENV"
        value = var.environment
      }

      env {
        name  = "PORT"
        value = "8080"
      }

      env {
        name  = "DATABASE_HOST"
        value = "/cloudsql/${google_sql_database_instance.main.connection_name}"
      }

      env {
        name  = "DATABASE_NAME"
        value = google_sql_database.main.name
      }

      env {
        name  = "DATABASE_USER"
        value = google_sql_user.app_user.name
      }

      # Secrets from Secret Manager
      env {
        name = "DATABASE_PASSWORD"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.db_password.secret_id
            version = "latest"
          }
        }
      }

      env {
        name = "GEMINI_API_KEY"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.gemini_api_key.secret_id
            version = "latest"
          }
        }
      }

      env {
        name = "RESEND_API_KEY"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.resend_api_key.secret_id
            version = "latest"
          }
        }
      }

      env {
        name = "JWT_SECRET"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.jwt_secret.secret_id
            version = "latest"
          }
        }
      }

      env {
        name = "SESSION_SECRET"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.session_secret.secret_id
            version = "latest"
          }
        }
      }

      env {
        name  = "FRONTEND_URL"
        value = "https://${var.domain_name}"
      }

      env {
        name  = "STORAGE_BUCKET"
        value = google_storage_bucket.frontend_storage.name
      }

      # Cloud SQL connection
      env {
        name  = "INSTANCE_CONNECTION_NAME"
        value = google_sql_database_instance.main.connection_name
      }
    }

    # Container concurrency
    max_instance_request_concurrency = var.backend_concurrency

    # Execution environment (gen2 for better performance)
    execution_environment = "EXECUTION_ENVIRONMENT_GEN2"
  }

  # Traffic configuration
  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }

  depends_on = [
    google_secret_manager_secret_version.db_password,
    google_secret_manager_secret_version.gemini_api_key,
    google_secret_manager_secret_version.resend_api_key,
    google_secret_manager_secret_version.jwt_secret,
    google_secret_manager_secret_version.session_secret,
  ]

  labels = var.labels
}

# ============================================================================
# IAM POLICY - Allow public access (will be restricted by load balancer)
# ============================================================================

resource "google_cloud_run_v2_service_iam_member" "backend_invoker" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.backend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# ============================================================================
# NETWORK ENDPOINT GROUP (for load balancer)
# ============================================================================

resource "google_compute_region_network_endpoint_group" "backend_neg" {
  name                  = "${var.app_name}-backend-neg"
  network_endpoint_type = "SERVERLESS"
  region                = var.region
  project               = var.project_id

  cloud_run {
    service = google_cloud_run_v2_service.backend.name
  }
}

# ============================================================================
# OUTPUTS
# ============================================================================

output "backend_url" {
  description = "Backend Cloud Run service URL"
  value       = google_cloud_run_v2_service.backend.uri
}

output "backend_service_name" {
  description = "Backend Cloud Run service name"
  value       = google_cloud_run_v2_service.backend.name
}

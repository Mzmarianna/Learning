# ============================================================================
# SECRET MANAGER
# Mz. Marianna's Academy - Secrets Management
# ============================================================================

# ============================================================================
# DATABASE PASSWORD
# ============================================================================

resource "google_secret_manager_secret" "db_password" {
  secret_id = "${var.app_name}-db-password"
  project   = var.project_id

  replication {
    auto {}
  }

  labels = var.labels
}

resource "google_secret_manager_secret_version" "db_password" {
  secret      = google_secret_manager_secret.db_password.id
  secret_data = local.db_password
}

# ============================================================================
# GEMINI API KEY
# ============================================================================

resource "google_secret_manager_secret" "gemini_api_key" {
  secret_id = "${var.app_name}-gemini-api-key"
  project   = var.project_id

  replication {
    auto {}
  }

  labels = var.labels
}

resource "google_secret_manager_secret_version" "gemini_api_key" {
  secret      = google_secret_manager_secret.gemini_api_key.id
  secret_data = var.gemini_api_key
}

# ============================================================================
# RESEND API KEY
# ============================================================================

resource "google_secret_manager_secret" "resend_api_key" {
  secret_id = "${var.app_name}-resend-api-key"
  project   = var.project_id

  replication {
    auto {}
  }

  labels = var.labels
}

resource "google_secret_manager_secret_version" "resend_api_key" {
  secret      = google_secret_manager_secret.resend_api_key.id
  secret_data = var.resend_api_key
}

# ============================================================================
# JWT SECRET
# ============================================================================

resource "google_secret_manager_secret" "jwt_secret" {
  secret_id = "${var.app_name}-jwt-secret"
  project   = var.project_id

  replication {
    auto {}
  }

  labels = var.labels
}

resource "google_secret_manager_secret_version" "jwt_secret" {
  secret      = google_secret_manager_secret.jwt_secret.id
  secret_data = local.jwt_secret
}

# ============================================================================
# SESSION SECRET
# ============================================================================

resource "google_secret_manager_secret" "session_secret" {
  secret_id = "${var.app_name}-session-secret"
  project   = var.project_id

  replication {
    auto {}
  }

  labels = var.labels
}

resource "google_secret_manager_secret_version" "session_secret" {
  secret      = google_secret_manager_secret.session_secret.id
  secret_data = local.session_secret
}

# ============================================================================
# IAM BINDINGS - Allow Cloud Run to access secrets
# ============================================================================

resource "google_secret_manager_secret_iam_member" "backend_secrets_accessor" {
  for_each = toset([
    google_secret_manager_secret.db_password.secret_id,
    google_secret_manager_secret.gemini_api_key.secret_id,
    google_secret_manager_secret.resend_api_key.secret_id,
    google_secret_manager_secret.jwt_secret.secret_id,
    google_secret_manager_secret.session_secret.secret_id,
  ])

  secret_id = each.value
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.backend_sa.email}"
  project   = var.project_id
}

# ============================================================================
# OUTPUTS
# ============================================================================

output "secrets_created" {
  description = "List of secrets created"
  value = [
    google_secret_manager_secret.db_password.secret_id,
    google_secret_manager_secret.gemini_api_key.secret_id,
    google_secret_manager_secret.resend_api_key.secret_id,
    google_secret_manager_secret.jwt_secret.secret_id,
    google_secret_manager_secret.session_secret.secret_id,
  ]
}

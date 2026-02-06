# ============================================================================
# TERRAFORM OUTPUTS
# Mz. Marianna's Academy - Summary of deployed resources
# ============================================================================

output "project_id" {
  description = "Google Cloud Project ID"
  value       = var.project_id
}

output "region" {
  description = "Primary region"
  value       = var.region
}

# ============================================================================
# NETWORKING
# ============================================================================

output "load_balancer_ip_address" {
  description = "⭐ IMPORTANT: Point your domain DNS to this IP address"
  value       = google_compute_global_address.lb_ip.address
}

output "vpc_network_name" {
  description = "VPC network name"
  value       = google_compute_network.vpc.name
}

# ============================================================================
# DATABASE
# ============================================================================

output "database_connection_name" {
  description = "Cloud SQL connection name for application"
  value       = google_sql_database_instance.main.connection_name
}

output "database_name" {
  description = "Database name"
  value       = google_sql_database.main.name
}

output "database_user" {
  description = "Application database user"
  value       = google_sql_user.app_user.name
}

output "database_password_secret" {
  description = "Secret Manager path for database password"
  value       = google_secret_manager_secret.db_password.id
}

output "database_admin_password" {
  description = "Admin user password (save this securely!)"
  value       = random_password.db_admin_password.result
  sensitive   = true
}

# ============================================================================
# CLOUD RUN
# ============================================================================

output "backend_service_url" {
  description = "Backend Cloud Run service URL"
  value       = google_cloud_run_v2_service.backend.uri
}

output "backend_service_name" {
  description = "Backend Cloud Run service name"
  value       = google_cloud_run_v2_service.backend.name
}

# ============================================================================
# STORAGE
# ============================================================================

output "frontend_storage_bucket_name" {
  description = "Frontend storage bucket - upload your static files here"
  value       = google_storage_bucket.frontend_storage.name
}

output "frontend_storage_url" {
  description = "Frontend storage bucket URL"
  value       = "gs://${google_storage_bucket.frontend_storage.name}"
}

output "user_uploads_bucket_name" {
  description = "User uploads bucket"
  value       = google_storage_bucket.user_uploads.name
}

# ============================================================================
# SECRETS
# ============================================================================

output "secrets_summary" {
  description = "Secrets created in Secret Manager"
  value = {
    db_password    = google_secret_manager_secret.db_password.secret_id
    gemini_api_key = google_secret_manager_secret.gemini_api_key.secret_id
    resend_api_key = google_secret_manager_secret.resend_api_key.secret_id
    jwt_secret     = google_secret_manager_secret.jwt_secret.secret_id
    session_secret = google_secret_manager_secret.session_secret.secret_id
  }
}

# ============================================================================
# DEPLOYMENT SUMMARY
# ============================================================================

output "deployment_summary" {
  description = "Quick reference for your deployment"
  value = {
    domain            = var.domain_name
    load_balancer_ip  = google_compute_global_address.lb_ip.address
    backend_url       = google_cloud_run_v2_service.backend.uri
    frontend_bucket   = google_storage_bucket.frontend_storage.name
    database_instance = google_sql_database_instance.main.name
    ssl_status        = "Provisioning - may take up to 15 minutes"
  }
}

# ============================================================================
# NEXT STEPS
# ============================================================================

output "next_steps" {
  description = "What to do next after Terraform completes"
  value = <<-EOT
    
    ✅ INFRASTRUCTURE DEPLOYED SUCCESSFULLY!
    
    📋 NEXT STEPS:
    
    1. ⭐ UPDATE DNS RECORDS:
       - Go to your Squarespace DNS settings
       - Create an A record for www.mzmarianna.com
       - Point it to: ${google_compute_global_address.lb_ip.address}
       - Create an A record for mzmarianna.com (apex)
       - Point it to: ${google_compute_global_address.lb_ip.address}
    
    2. 🔐 SAVE ADMIN PASSWORD:
       Run: terraform output -raw database_admin_password
       Save it securely - you'll need it for database migrations
    
    3. 📦 UPLOAD FRONTEND:
       gsutil -m rsync -r ./dist gs://${google_storage_bucket.frontend_storage.name}
    
    4. 🐳 DEPLOY BACKEND:
       gcloud run deploy ${google_cloud_run_v2_service.backend.name} \
         --image=YOUR_CONTAINER_IMAGE \
         --region=${var.region}
    
    5. 🗄️ MIGRATE DATABASE:
       Connect using: ${google_sql_database_instance.main.connection_name}
       Run schema from: /gcp/schema.sql
    
    6. ✅ VERIFY:
       - Wait 15 mins for SSL certificate provisioning
       - Visit: https://${var.domain_name}
    
    📚 Full guide: See /GCP-DEPLOYMENT-GUIDE.md
  EOT
}

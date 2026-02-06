# ============================================================================
# MAIN TERRAFORM CONFIGURATION
# Mz. Marianna's Academy - Google Cloud Platform Infrastructure
# ============================================================================

# ============================================================================
# VPC NETWORK
# ============================================================================

resource "google_compute_network" "vpc" {
  name                    = "${var.app_name}-vpc"
  auto_create_subnetworks = false
  project                 = var.project_id

  depends_on = [google_project_service.required_apis]
}

resource "google_compute_subnetwork" "subnet" {
  name          = "${var.app_name}-subnet"
  ip_cidr_range = "10.0.0.0/24"
  region        = var.region
  network       = google_compute_network.vpc.id
  project       = var.project_id

  log_config {
    aggregation_interval = "INTERVAL_5_SEC"
    flow_sampling        = 0.5
    metadata             = "INCLUDE_ALL_METADATA"
  }
}

# ============================================================================
# VPC ACCESS CONNECTOR (for Cloud Run to access Cloud SQL)
# ============================================================================

resource "google_vpc_access_connector" "connector" {
  name          = "${var.app_name}-vpc-connector"
  region        = var.region
  network       = google_compute_network.vpc.name
  ip_cidr_range = "10.8.0.0/28"
  project       = var.project_id

  min_instances = 2
  max_instances = 3

  machine_type = "e2-micro"

  depends_on = [
    google_project_service.required_apis,
    google_compute_network.vpc
  ]
}

# ============================================================================
# PRIVATE SERVICE CONNECTION (for Cloud SQL)
# ============================================================================

resource "google_compute_global_address" "private_ip_address" {
  name          = "${var.app_name}-private-ip"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.vpc.id
  project       = var.project_id
}

resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = google_compute_network.vpc.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_address.name]

  depends_on = [google_project_service.required_apis]
}

# ============================================================================
# STATIC IP FOR LOAD BALANCER
# ============================================================================

resource "google_compute_global_address" "lb_ip" {
  name    = "${var.app_name}-lb-ip"
  project = var.project_id
}

# ============================================================================
# RANDOM PASSWORDS
# ============================================================================

resource "random_password" "db_password" {
  length  = 32
  special = true
}

resource "random_password" "jwt_secret" {
  count   = var.jwt_secret == "" ? 1 : 0
  length  = 64
  special = false
}

resource "random_password" "session_secret" {
  count   = var.session_secret == "" ? 1 : 0
  length  = 64
  special = false
}

# ============================================================================
# OUTPUTS FOR OTHER MODULES
# ============================================================================

locals {
  db_password     = random_password.db_password.result
  jwt_secret      = var.jwt_secret != "" ? var.jwt_secret : random_password.jwt_secret[0].result
  session_secret  = var.session_secret != "" ? var.session_secret : random_password.session_secret[0].result
  backend_sa_email = google_service_account.backend_sa.email
}

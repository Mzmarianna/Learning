# ============================================================================
# GLOBAL LOAD BALANCER WITH SSL
# Mz. Marianna's Academy - HTTPS Load Balancer
# ============================================================================

# ============================================================================
# SSL CERTIFICATE (Google-managed)
# ============================================================================

resource "google_compute_managed_ssl_certificate" "default" {
  name    = "${var.app_name}-ssl-cert"
  project = var.project_id

  managed {
    domains = [var.domain_name, "mzmarianna.com"]
  }
}

# ============================================================================
# BACKEND SERVICE (Cloud Run)
# ============================================================================

resource "google_compute_backend_service" "backend" {
  name                  = "${var.app_name}-backend-service"
  project               = var.project_id
  protocol              = "HTTP"
  port_name             = "http"
  timeout_sec           = var.backend_timeout
  enable_cdn            = false
  load_balancing_scheme = "EXTERNAL_MANAGED"

  backend {
    group = google_compute_region_network_endpoint_group.backend_neg.id
  }

  log_config {
    enable      = true
    sample_rate = 1.0
  }

  # Health check
  health_checks = [google_compute_health_check.backend.id]

  # Security policy (Cloud Armor)
  security_policy = google_compute_security_policy.backend_policy.id
}

# ============================================================================
# HEALTH CHECK
# ============================================================================

resource "google_compute_health_check" "backend" {
  name    = "${var.app_name}-health-check"
  project = var.project_id

  http_health_check {
    port         = 8080
    request_path = "/health"
  }

  timeout_sec         = 5
  check_interval_sec  = 10
  healthy_threshold   = 2
  unhealthy_threshold = 3
}

# ============================================================================
# CLOUD ARMOR SECURITY POLICY
# ============================================================================

resource "google_compute_security_policy" "backend_policy" {
  name    = "${var.app_name}-security-policy"
  project = var.project_id

  # Default rule - allow all traffic
  rule {
    action   = "allow"
    priority = "2147483647"
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }
    description = "Default allow rule"
  }

  # Rate limiting rule
  rule {
    action   = "rate_based_ban"
    priority = "1000"
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }
    rate_limit_options {
      conform_action = "allow"
      exceed_action  = "deny(429)"

      enforce_on_key = "IP"

      rate_limit_threshold {
        count        = 100
        interval_sec = 60
      }

      ban_duration_sec = 600
    }
    description = "Rate limit: 100 requests per minute per IP"
  }

  # Block known bad IPs (SQL injection attempts, etc.)
  rule {
    action   = "deny(403)"
    priority = "500"
    match {
      expr {
        expression = "evaluatePreconfiguredExpr('sqli-stable')"
      }
    }
    description = "Block SQL injection attempts"
  }

  rule {
    action   = "deny(403)"
    priority = "501"
    match {
      expr {
        expression = "evaluatePreconfiguredExpr('xss-stable')"
      }
    }
    description = "Block XSS attempts"
  }
}

# ============================================================================
# URL MAP
# ============================================================================

resource "google_compute_url_map" "default" {
  name            = "${var.app_name}-url-map"
  project         = var.project_id
  default_service = google_compute_backend_service.backend.id

  # Route /api/* to backend
  host_rule {
    hosts        = [var.domain_name, "mzmarianna.com"]
    path_matcher = "main"
  }

  path_matcher {
    name            = "main"
    default_service = google_compute_backend_service.backend.id

    # Static files from Cloud Storage
    path_rule {
      paths   = ["/static/*", "/assets/*", "/images/*"]
      service = google_compute_backend_bucket.frontend_cdn.id
    }

    # API routes to Cloud Run
    path_rule {
      paths   = ["/api/*", "/auth/*"]
      service = google_compute_backend_service.backend.id
    }
  }
}

# ============================================================================
# HTTPS PROXY
# ============================================================================

resource "google_compute_target_https_proxy" "default" {
  name             = "${var.app_name}-https-proxy"
  project          = var.project_id
  url_map          = google_compute_url_map.default.id
  ssl_certificates = [google_compute_managed_ssl_certificate.default.id]
}

# ============================================================================
# FORWARDING RULE (creates the load balancer IP)
# ============================================================================

resource "google_compute_global_forwarding_rule" "https" {
  name                  = "${var.app_name}-https-forwarding-rule"
  project               = var.project_id
  ip_protocol           = "TCP"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  port_range            = "443"
  target                = google_compute_target_https_proxy.default.id
  ip_address            = google_compute_global_address.lb_ip.address
}

# ============================================================================
# HTTP TO HTTPS REDIRECT
# ============================================================================

resource "google_compute_url_map" "http_redirect" {
  name    = "${var.app_name}-http-redirect"
  project = var.project_id

  default_url_redirect {
    https_redirect         = true
    redirect_response_code = "MOVED_PERMANENTLY_DEFAULT"
    strip_query            = false
  }
}

resource "google_compute_target_http_proxy" "http_redirect" {
  name    = "${var.app_name}-http-proxy"
  project = var.project_id
  url_map = google_compute_url_map.http_redirect.id
}

resource "google_compute_global_forwarding_rule" "http" {
  name                  = "${var.app_name}-http-forwarding-rule"
  project               = var.project_id
  ip_protocol           = "TCP"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  port_range            = "80"
  target                = google_compute_target_http_proxy.http_redirect.id
  ip_address            = google_compute_global_address.lb_ip.address
}

# ============================================================================
# OUTPUTS
# ============================================================================

output "load_balancer_ip" {
  description = "Load balancer IP address - Point your domain to this IP"
  value       = google_compute_global_address.lb_ip.address
}

output "ssl_certificate_status" {
  description = "SSL certificate provisioning status"
  value       = google_compute_managed_ssl_certificate.default.managed[0].status
}

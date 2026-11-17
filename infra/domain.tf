# Custom domain on Firebase Hosting: www. serves the site, the bare domain redirects to it.

resource "google_firebase_hosting_custom_domain" "www" {
  provider              = google-beta
  site_id               = google_firebase_hosting_site.site.site_id
  custom_domain         = "www.${var.domain}"
  wait_dns_verification = false
}

resource "google_firebase_hosting_custom_domain" "bare" {
  provider              = google-beta
  site_id               = google_firebase_hosting_site.site.site_id
  custom_domain         = var.domain
  redirect_target       = google_firebase_hosting_custom_domain.www.custom_domain
  wait_dns_verification = false
}

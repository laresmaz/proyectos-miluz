# Firebase (Hosting)

resource "google_project_service" "firebase" {
  for_each = toset(["firebase.googleapis.com", "firebasehosting.googleapis.com"])

  service            = each.value
  disable_on_destroy = false
}

resource "google_firebase_project" "this" {
  provider = google-beta

  depends_on = [google_project_service.firebase]
}

# The default site, served at <project-id>.web.app.
resource "google_firebase_hosting_site" "site" {
  provider = google-beta
  site_id  = var.project_id

  depends_on = [google_firebase_project.this]
}

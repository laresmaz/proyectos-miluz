# Keyless access from GitHub Actions to Google service account

resource "google_project_service" "identity" {
  # Cloud Billing is for the billing-account roles at the end of this file.
  for_each = toset(["iam.googleapis.com", "iamcredentials.googleapis.com", "sts.googleapis.com", "cloudbilling.googleapis.com"])

  service            = each.value
  disable_on_destroy = false
}

resource "google_iam_workload_identity_pool" "github" {
  workload_identity_pool_id = "github"
  display_name              = "GitHub Actions"

  depends_on = [google_project_service.identity]
}

resource "google_iam_workload_identity_pool_provider" "github" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.github.workload_identity_pool_id
  workload_identity_pool_provider_id = "github"
  display_name                       = "GitHub Actions"

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
  attribute_mapping = {
    "google.subject" = "assertion.sub"
  }
  # Only tokens from this exact repository are accepted at all.
  attribute_condition = "assertion.repository_id == \"${var.github_repo_id}\""
}

# PR runs plan, the "infrastructure" environment applies, the "production" environment deploys the site.
locals {
  github_principal = "principal://iam.googleapis.com/${google_iam_workload_identity_pool.github.name}/subject/repo:${var.github_repo}"

  deployers = {
    tf-plan = {
      subject = "pull_request"
      roles   = ["roles/viewer", "roles/storage.objectViewer"]
    }
    tf-apply = {
      subject = "environment:infrastructure"
      roles   = ["roles/owner"]
    }
    hosting-deploy = {
      subject = "environment:production"
      roles   = ["roles/firebasehosting.admin", "roles/serviceusage.serviceUsageConsumer"]
    }
  }

  deployer_roles = merge([
    for name, d in local.deployers : { for role in d.roles : "${name} ${role}" => { name = name, role = role } }
  ]...)
}

resource "google_service_account" "deployer" {
  for_each = local.deployers

  account_id   = each.key
  display_name = "GitHub ${each.key}"

  depends_on = [google_project_service.identity]
}

resource "google_project_iam_member" "deployer" {
  for_each = local.deployer_roles

  project = var.project_id
  role    = each.value.role
  member  = google_service_account.deployer[each.value.name].member
}

resource "google_service_account_iam_member" "github" {
  for_each = local.deployers

  service_account_id = google_service_account.deployer[each.key].name
  role               = "roles/iam.workloadIdentityUser"
  member             = "${local.github_principal}:${each.value.subject}"
}

# Budgets live on the billing account, not the project, so plan and apply need access there too.
resource "google_billing_account_iam_member" "deployer" {
  for_each = { tf-plan = "roles/billing.viewer", tf-apply = "roles/billing.costsManager" }

  billing_account_id = var.billing_account
  role               = each.value
  member             = google_service_account.deployer[each.key].member

  depends_on = [google_project_service.identity]
}

output "github_variables" {
  description = "Values for the GitHub variables the workflows read."
  value = {
    GCP_WORKLOAD_IDENTITY_PROVIDER = google_iam_workload_identity_pool_provider.github.name
    GCP_TF_PLAN_ACCOUNT            = google_service_account.deployer["tf-plan"].email
    GCP_TF_APPLY_ACCOUNT           = google_service_account.deployer["tf-apply"].email
    GCP_HOSTING_DEPLOY_ACCOUNT     = google_service_account.deployer["hosting-deploy"].email
  }
}

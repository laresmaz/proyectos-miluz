# Inputs for the infrastructure

variable "project_id" {
  description = "Google Cloud project ID."
  type        = string
}

variable "project_number" {
  description = "Google Cloud project number; the budget filter needs it."
  type        = string
}

variable "region" {
  description = "Region for regional resources; us-east1 is closest to Venezuela and has the Cloud Storage free tier."
  type        = string
  default     = "us-east1"
}

variable "billing_account" {
  description = "Billing account ID (01ABCD-23EFGH-45IJKL); set as TF_VAR_billing_account, never committed."
  type        = string
  sensitive   = true

  # Safegard and empty value delete the billing account
  validation {
    condition     = can(regex("^[0-9A-F]{6}-[0-9A-F]{6}-[0-9A-F]{6}$", var.billing_account))
    error_message = "Set TF_VAR_billing_account to the billing account ID, like 01ABCD-23EFGH-45IJKL (see gcloud billing accounts list)."
  }
}

variable "domain" {
  description = "Domain bought at Porkbun; the site lives at www. and the bare domain redirects there."
  type        = string
}

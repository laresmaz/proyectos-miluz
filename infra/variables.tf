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
}

# Inputs for the infrastructure

variable "project_id" {
  description = "Google Cloud project ID."
  type        = string
}

variable "region" {
  description = "Region for regional resources; us-east1 is closest to Venezuela and has the Cloud Storage free tier."
  type        = string
  default     = "us-east1"
}

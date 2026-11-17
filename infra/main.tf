# Google Cloud infrastructure for the site

terraform {
  required_version = ">= 1.15.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "8.10.0"
    }
  }

  # Created by hand since Terraform can't store its state in a bucket it hasn't made yet.
  backend "gcs" {
    bucket = "proyectos-miluz-tfstate"
    prefix = "terraform/state"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
  user_project_override = true
  billing_project       = var.project_id
}

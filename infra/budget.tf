# Budget alert

resource "google_project_service" "billing_budgets" {
  service            = "billingbudgets.googleapis.com"
  disable_on_destroy = false
}

resource "google_billing_budget" "monthly" {
  billing_account = var.billing_account
  display_name    = "${var.project_id} monthly"

  budget_filter {
    projects               = ["projects/${var.project_number}"]
    credit_types_treatment = "EXCLUDE_ALL_CREDITS"
  }

  # Must match the billing account's currency, or the apply fails.
  amount {
    specified_amount {
      currency_code = "EUR"
      units         = "1"
    }
  }

  threshold_rules {
    threshold_percent = 0.4
  }
  threshold_rules {
    threshold_percent = 0.8
  }
  threshold_rules {
    threshold_percent = 1.0
  }

  depends_on = [google_project_service.billing_budgets]
}

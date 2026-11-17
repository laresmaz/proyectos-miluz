# Infrastructure

Terraform for the site's Google Cloud project. After the bootstrap below, changes go through a PR: CI checks them, and CD applies them after the merge to main.

## One-time bootstrap

Terraform can't create the things it needs to run, so these steps are done by hand once.

1. **Billing account:** in [console.cloud.google.com](https://console.cloud.google.com), open Billing, create a billing account and add a card. If the free trial is offered, accept it, then activate the full account so Cloud Run keeps working after the trial.
2. **Tools (NixOS):** Terraform's license is marked unfree in nixpkgs, so it needs the flag:

   ```sh
   NIXPKGS_ALLOW_UNFREE=1 nix shell --impure nixpkgs#terraform nixpkgs#google-cloud-sdk
   ```

3. **Log in:** the first command is for gcloud, the second gives Terraform your credentials.

   ```sh
   gcloud auth login
   gcloud auth application-default login
   ```

4. **Project and billing:**

   ```sh
   gcloud projects create <project-id>
   gcloud billing accounts list    # ACCOUNT_ID looks like 01ABCD-23EFGH-45IJKL
   gcloud billing projects link <project-id> --billing-account=<ACCOUNT_ID>
   ```

   Terraform needs Cloud Resource Manager to look up the project before it can enable any other API, so this one is turned on by hand:

   ```sh
   gcloud services enable cloudresourcemanager.googleapis.com --project=<project-id>
   ```

5. **State bucket:** private, and versioned so an old state can be restored after a bad apply.

   ```sh
   gcloud storage buckets create gs://proyectos-miluz-tfstate \
     --project=<project-id> --location=us-east1 \
     --uniform-bucket-level-access --public-access-prevention
   gcloud storage buckets update gs://proyectos-miluz-tfstate --versioning
   ```

6. **Firebase:** Google refuses to add Firebase through the API until the Firebase terms are accepted in the console. In [console.firebase.google.com](https://console.firebase.google.com), create a project, pick the existing `<project-id>` from the list, accept the terms and turn Google Analytics off.
7. **First run:** from this folder. The import hands the Firebase from step 6 to Terraform.

   ```sh
   terraform init
   terraform import google_firebase_project.this projects/<project-id>
   terraform apply
   ```

## Day to day

Edit the `.tf` files on a branch and open a PR. Run `terraform fmt` before committing; CI fails on unformatted files.

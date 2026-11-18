# proyectos-miluz

## TODO

- Look into a hard billing cap: Google budgets only send emails, so spending past the 1 € budget isn't stopped. A Pub/Sub topic on the budget plus a function that disables billing would cap it.
- Automatic rollback: a failed after-deploy check marks CD red but leaves the bad release live. Roll back by hand in Firebase console → Hosting → Release history, or have CD run `firebase hosting:rollback` when the checks fail.

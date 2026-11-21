# proyectos-miluz

## TODO

- Look into a hard billing cap: Google budgets only send emails, so spending past the 1 € budget isn't stopped. A Pub/Sub topic on the budget plus a function that disables billing would cap it.
- Google Business Profile: the engineer creates and verifies it (it weighs most in local search), with the same name, phone (https://wa.me/584242558776), city and area served as `frontend/src/data/config.ts`, so Google matches it to the site's LocalBusiness data. Link the website, add opening hours and real project photos, and ask past clients for reviews, which also become the site's testimonials.
- Automatic rollback: a failed after-deploy check marks CD red but leaves the bad release live. Roll back by hand in Firebase console → Hosting → Release history, or have CD run `firebase hosting:rollback` when the checks fail.

---
description: Read this before making any authentication changes in the project.
---

# Authentication guidelines

- This application uses Clerk for all authentication. Do not introduce other auth providers, custom session logic, or alternate sign-in flows.
- The /dashboard route is protected and must only be accessible to signed-in users.
- If an authenticated user visits the homepage, redirect them to /dashboard.
- Sign-in and sign-up should always open through Clerk’s modal experience rather than as full-page routes.
- Any new auth-related UI or route changes should preserve these rules.

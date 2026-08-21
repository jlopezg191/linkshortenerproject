---
description: Read this before making any server action or data-mutation changes in the project.
---

# Server action guidelines

- All data mutations in this app must be done via server actions.
- Server actions must be called from client components only.
- Each server action file must be named `actions.ts` and live in the same directory as the component that calls it.
- All data passed to server actions must use explicit TypeScript types; do not use the `FormData` type for input values.
- Every server action must validate its input with Zod before performing any logic.
- Every server action must check that a user is logged in before continuing with database operations.
- Server actions should not throw errors; instead, they must return an object with a success or error property.
- Database operations must go through helper functions in `/data`; server actions must not issue Drizzle queries directly.
- Keep those helper functions responsible for Drizzle calls and typed data access, while server actions handle validation, auth checks, and orchestration.

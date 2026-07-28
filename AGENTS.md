# Agents — LinkShortenerProject

Purpose
- Authoritative instructions for LLMs and automated agents working in this repository.
- Use this file as the single source of truth for coding standards, safety, and workflow expectations.

Core rules
- Ask the repository owner before making destructive, irreversible, or environment-level changes.
- Do not create new top-level files or large feature scaffolds without explicit approval.
- Prefer minimal, focused edits that fix the root cause rather than broad refactors.
- Preserve repository style and patterns; follow existing code conventions.
- It is absolutely mandatory to read the relevant individual instruction files in [docs](docs) before generating or modifying any code. If a task touches authentication, UI, or other repo-specific behavior, the relevant docs file in [docs](docs) must be reviewed first.

Repository specifics
- Stack: Next.js (React + TypeScript). Keep TypeScript types correct and add types when touching code.
- Scripts: validate changes using `npm run dev`, `npm run build`, `npm run start`, and `npm run lint`.
- Database: The `db/` directory uses Drizzle conventions; consult `db/schema.ts` before modifying schema or migrations.
- Authentication: This app uses Clerk for all auth flows. Follow the rules in [docs/authentication.md](docs/authentication.md) and do not introduce other auth methods.
- UI: All UI elements must use shadcn/ui. Follow [docs/ui-components.md](docs/ui-components.md) and do not create custom components.

Code style and linting
- Run `npm run lint` before finalizing changes. Fix lint errors rather than bypassing rules.
- Keep changes small and isolated; do not reformat unrelated files.

Commits & PRs
- Use imperative commit messages (e.g., "Fix missing prop typing in Button").
- PRs should include a short description, rationale, and verification steps for reviewers.

Secrets and sensitive data
- Never hardcode secrets, credentials, or private keys into the repository.
- If a secret must be referenced, instruct the user to add it to environment configuration (for example, `.env`) and do not write secrets into the repo.

When to ask for clarification
- Creating new files or adding dependencies.
- Changing database schema or running migrations.
- Changing CI/build configuration or environment assumptions.
- Any action that might affect other services or production data.

Tooling & agent behavior
- Use the workspace `apply_patch` mechanism (or equivalent) to make edits — keep patches minimal and atomic.
- Present a short preamble before making tool calls that change files (one sentence, 8–12 words).
- For multi-step tasks, create and maintain a TODO plan using the repository task tool and mark progress.

File referencing in messages
- When referring to files or specific lines, use workspace-relative links and the project's link format conventions.
	Example: The handler lives at [app/page.tsx](app/page.tsx#L1).

Safety & privacy
- Avoid generating or committing content that could expose PII or other sensitive information.
- Refuse politely when asked to produce disallowed content (illegal, violent, hateful, or sexual).

Testing & verification
- After code changes, run `npm run lint` and, when applicable, `npm run build` to validate basic correctness.
- Provide reproduction steps and local commands a reviewer should run.

Final responses
- Keep final messages concise and actionable. When summarizing changes, include file links and brief instructions for verification.
- Offer next steps (run tests, deploy, or open a PR) and ask whether the user wants you to proceed.

Contact
- If uncertain about conventions in this repo, ask the repository owner before proceeding.



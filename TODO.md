# TODO

Rank-ordered path from fresh scaffold → production-ready. Start at the top.

Status markers: `[ ]` open · `[~]` in progress · `[x]` done.

## Product scope

- [ ] Write a one-paragraph product definition in `docs/product.md` — what Trade Hub is, who it's for, the one user flow that must work at launch. Nothing else can be prioritized correctly until this exists.
- [ ] Translate the product definition into 3–5 core user stories; pick the MVP slice.

## Foundation

- [ ] Initialize git (`git init`), commit the scaffold, create the GitHub repo (`gh repo create`), push `main`.
- [ ] Add `.env.example` documenting every env var the app expects; confirm `.env*.local` is ignored.
- [ ] Create `components/` and `lib/` directories with placeholder `README.md` files describing the intended contents (shared UI primitives vs. business logic).
- [ ] Pick and install a UI primitive library (shadcn/ui, Radix, Headless UI) or explicitly decide to roll your own — document the choice in `docs/architecture.md`.

## Security & data integrity

- [ ] Decide on auth provider (Auth.js, Clerk, Supabase Auth) before writing any user-facing route. Document in `docs/architecture.md`.
- [ ] Decide on database + ORM (Postgres + Drizzle/Prisma is the default). Capture migration workflow in `docs/database.md`.
- [ ] Add input validation at every server boundary using Zod (or similar) — server actions, route handlers, form submissions.
- [ ] Move every secret to environment variables; never hardcode. Add a pre-commit check (e.g. `gitleaks`) once a real codebase exists.

## Core reliability

- [ ] Add a global `app/error.tsx` and `app/not-found.tsx` with usable UI, not the defaults.
- [ ] Add a `loading.tsx` for each route segment that fetches data.
- [ ] Wire up a request-scoped logger (pino or similar) and use it in server code instead of `console.log`.

## Testing

- [ ] Pick a test stack (Vitest + React Testing Library for units, Playwright for E2E) and wire `make test` to actually run something.
- [ ] Add one smoke E2E test that loads `/` and asserts the app renders — a canary against total regressions.
- [ ] Add unit tests for any `lib/` module as it's written; don't let business logic land without tests.

## CI/CD

- [ ] Add `.github/workflows/ci.yml` running `make lint`, `make typecheck`, `make test`, `make build` on every PR.
- [ ] `vercel link` the repo and configure preview deployments per PR.
- [ ] Wire `make deploy TARGET=prod` and `make deploy TARGET=preview` to the Vercel CLI.

## Observability

- [ ] Add Sentry (or equivalent) for server + client error tracking before the first real user touches prod.
- [ ] Add a `/api/health` route returning build SHA + status for uptime monitoring.
- [ ] Configure Vercel Analytics or a self-hosted equivalent for basic usage signal.

## Performance

- [ ] Audit every image for `next/image` usage; no raw `<img>` tags for non-trivial assets.
- [ ] Add `generateMetadata` to every route for SEO + social previews.
- [ ] Run Lighthouse on the main flow and track scores in `docs/performance.md`.

## Developer experience

- [ ] Add `prettier` + a shared config; wire into `make lint` or a separate `make fmt`.
- [ ] Install `husky` + `lint-staged` to run lint/typecheck on staged files pre-commit.
- [ ] Write `docs/onboarding.md` covering local setup from clone → running app in under 10 minutes.

# TODO

Rank-ordered path from the current working dashboard → production-ready. Start at the top.

Status markers: `[ ]` open · `[~]` in progress · `[x]` done.

## Reliability (the app breaks silently today)

- [x] Add `app/error.tsx` and `app/not-found.tsx` with branded, useful UI — currently unhandled errors fall through to Next.js defaults.
- [x] Add `loading.tsx` for each data-fetching route segment (`app/crypto/`, `app/forex/`, `app/watchlist/`, `app/strategies/`) so first paint doesn't flash empty state.
- [x] Fix silent `catch` blocks in `app/api/**/route.ts` — at minimum, log the error and return a typed error response instead of swallowing it.
- [x] Validate upstream API responses with Zod in each route handler (`/api/crypto/prices`, `/api/crypto/ohlc/[id]`, `/api/forex/rates`) before returning them — a schema drift from CoinGecko or ExchangeRate API currently crashes the hooks.
- [x] Wire a request-scoped logger (pino) and replace `console.error` breadcrumbs with structured logs.

## Data & state integrity

- [x] Guard `useStrategies`/`useWatchlist` against corrupt `localStorage` values (Zod-validate on load; reset + warn on invalid).
- [x] Add an export/import flow for strategies + watchlist so a cleared browser doesn't lose months of notes.
- [ ] Decide whether to move strategies to a backing store (Supabase Postgres is the default); document the decision in `docs/architecture.md` before implementing. *(needs product decision)*

## Testing

- [x] Pick Vitest + React Testing Library for units, Playwright for E2E. Wire `make test` to actually run something.
- [x] Unit-test `lib/patterns/patterns.ts` — 21 detectors with hardcoded confidence scores are the highest-value regression surface. Use fixture candles per pattern.
- [x] Unit-test `lib/hooks/useMarketData.ts` transforms (CoinGecko → `PriceData`, ExchangeRate → `ForexRate` with pair inversion).
- [x] Smoke E2E: load `/`, `/crypto`, `/forex`, `/strategies`, `/watchlist`; assert no console errors and the sidebar renders.

## CI/CD

- [x] Add `.github/workflows/ci.yml` running lint, typecheck, unit tests, build, and Playwright smoke on every PR.
- [ ] `gh repo view` / confirm remote exists; `vercel link` the repo and enable preview deployments per PR.
- [ ] Implement `make deploy TARGET=prod|preview` against the Vercel CLI; update `make logs` and `make status` to use `vercel logs --follow` / `vercel ls`.

## Observability

- [ ] Add Sentry for server + client error tracking before the first real user touches prod. Scrub any stray upstream API responses from breadcrumbs. *(needs Sentry DSN from user)*
- [x] Add `/api/health` returning `{ status: "ok", sha, env, at }` for uptime monitoring.
- [ ] Enable Vercel Analytics (or Plausible) once linked. *(depends on `vercel link`)*

## Performance

- [ ] Profile `/crypto` detail panel: `useCryptoOHLC` + `detectPatterns` run on every selection change — memoize detector output per coin/time range.
- [ ] Audit images: `public/` assets should go through `next/image`; avoid raw `<img>` tags.
- [ ] Add `generateMetadata` per route for SEO + social previews (today only the root layout sets a title).

## UX polish

- [ ] Replace the "Loading..." text on `/crypto` and `/forex` with skeleton cards matching the final layout.
- [ ] Surface network/upstream errors in-page (today failed SWR fetches are invisible beyond a blank card).
- [ ] Add a confirm step to strategy delete — current single-click delete is easy to trigger accidentally.

## Developer experience

- [ ] Add Prettier + shared config; wire into `make lint` or a separate `make fmt`.
- [ ] Install Husky + lint-staged to run lint/typecheck on staged files pre-commit.
- [ ] Add a pre-commit secret scan (`gitleaks`) ahead of adding any API keys.
- [ ] Write `docs/onboarding.md` — clone to running app in under 10 minutes.

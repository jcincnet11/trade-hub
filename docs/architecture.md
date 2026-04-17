# Architecture

## Current state

Trade Hub is a working single-user trading dashboard built on Next.js 16 (App Router). There is no backend service, no database, and no auth. All user state (strategies, watchlist) lives in `localStorage`; all market data comes from free-tier third-party APIs proxied through Next.js route handlers. The app is functionally complete for its current scope — the open work is production hardening (tests, error boundaries, observability, deploy).

## Stack

| Layer         | Choice                                                     |
|---------------|------------------------------------------------------------|
| Framework     | Next.js 16 (App Router)                                    |
| UI            | React 19                                                   |
| Styling       | Tailwind CSS v4 (CSS-first via `app/globals.css`)          |
| Language      | TypeScript 5 (strict)                                      |
| Client data   | SWR v2 (`lib/hooks/*`)                                     |
| Server data   | Next.js `fetch` with ISR (`revalidate` on route handlers)  |
| Charts        | `lightweight-charts` v5                                    |
| Icons         | `lucide-react`                                             |
| Lint          | ESLint 9 + `eslint-config-next`                            |
| Target host   | Vercel (default, not yet linked)                           |

## Directory layout

- `app/` — App Router routes, layouts, and route handlers.
  - `app/api/crypto/prices/route.ts` — proxies CoinGecko `/simple/price` for 10 hardcoded coin IDs; `revalidate: 60`.
  - `app/api/crypto/ohlc/[id]/route.ts` — proxies CoinGecko `/coins/{id}/ohlc?days=14`; normalizes tuples to `{time, open, high, low, close}`; `revalidate: 300`.
  - `app/api/forex/rates/route.ts` — proxies ExchangeRate API `/latest/USD`; `revalidate: 3600`.
  - `app/page.tsx` — dashboard aggregating sentiment across all tracked pairs.
  - `app/crypto/`, `app/forex/`, `app/strategies/`, `app/watchlist/` — feature pages.
- `components/` — UI organized by purpose: `layout/` (Sidebar), `market/` (PairCard, PatternBadge, PriceChart), `ui/` (Badge, Card).
- `lib/`
  - `hooks/` — SWR + localStorage hooks (`useMarketData`, `useStrategies`, `useWatchlist`).
  - `patterns/` — 21 candlestick detector functions plus the `detectPatterns` orchestrator.
  - `types/` — `market.ts`, `strategy.ts`.
  - `utils/formatters.ts` — price/change/volume/market-cap formatting.
- `public/` — static assets served from `/`.
- `docs/` — living documentation.
- `.claude/` — Claude Code skills, hooks, and settings.

## Data flow

1. A page route (e.g. `app/crypto/page.tsx`) is a client component that calls a hook from `lib/hooks/useMarketData.ts`.
2. The hook uses SWR to fetch one of our own `/api/*` routes — never the upstream service directly.
3. The route handler calls CoinGecko or ExchangeRate API server-side with `next: { revalidate: N }`, so Next.js caches the upstream response for `N` seconds. This avoids CORS and smooths out rate limits.
4. The hook shapes the raw response into the app's domain types (`PriceData`, `ForexRate`, `OHLCCandle`) and returns `{ data, isLoading, error }`.
5. User state (strategies, watchlist) is read/written via `useStrategies` and `useWatchlist`, which wrap `localStorage`. Components never touch `localStorage` directly.

## Pattern detection

`lib/patterns/patterns.ts` defines 21 detector functions — one per candlestick pattern. Each takes 1–3 candles and returns a `PatternResult` (name, type: bullish/bearish/neutral, confidence, description, signal) or `null`. `lib/patterns/detector.ts` exposes `detectPatterns(candles)` which runs every detector on the most recent candles, filters nulls, sorts by confidence, and returns the top matches. Requires at least 3 candles. Runs fully client-side on OHLC data fetched for the currently selected crypto pair.

## External services

| Service            | Endpoint                                                       | Auth | Cache (revalidate) | Notes                                                |
|--------------------|----------------------------------------------------------------|------|--------------------|------------------------------------------------------|
| CoinGecko          | `api.coingecko.com/api/v3/simple/price`                        | none | 60s                | 10 hardcoded coins: BTC, ETH, SOL, XRP, BNB, ADA, AVAX, DOGE, DOT, MATIC |
| CoinGecko          | `api.coingecko.com/api/v3/coins/{id}/ohlc?days=14`             | none | 300s               | 14-day daily candles for the pattern detector        |
| ExchangeRate API   | `api.exchangerate-api.com/v4/latest/USD`                       | none | 3600s              | 8 pairs derived from USD rates (some inverted)       |

No `.env` files are required today. When a service that needs a key is added, document it in `.env.example` and load via `process.env` in the route handler only — never ship a key to the client.

## Persistent state (localStorage)

| Key                    | Shape                        | Owner hook         |
|------------------------|------------------------------|--------------------|
| `trade-hub-strategies` | `Strategy[]`                 | `useStrategies`    |
| `trade-hub-watchlist`  | `string[]` (pair IDs)        | `useWatchlist`     |
| `trade-hub-preferences`| reserved (not yet populated) | —                  |

Because all user data is browser-local, clearing site data wipes the user's strategies and watchlist. A future migration to a backing store (Supabase, etc.) is a likely next step; when it happens, keep the hook surface stable so pages don't change.

## Next.js 16 caveats

This is **not** the Next.js most AI training data knows. Before writing framework code (routing, data fetching, caching, metadata, middleware, etc.), read the relevant file under `node_modules/next/dist/docs/`. Pay attention to deprecation notices at build time. See `AGENTS.md`.

## Known gaps

These are tracked in `TODO.md`; listing here for architectural awareness:

- No test runner wired up (`make test` is a stub).
- No `app/error.tsx`, `app/not-found.tsx`, or per-segment `loading.tsx` — users see Next.js defaults on failure.
- No input validation on API responses before they're returned to the client; malformed upstream data could crash hooks.
- No structured logging; route-handler `catch` blocks swallow errors silently.
- No error tracking (Sentry or equivalent).
- No CI workflow under `.github/workflows/`.
- No deploy target configured — `vercel link` has not been run.

Update this doc as real architectural decisions are made.

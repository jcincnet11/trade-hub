@AGENTS.md

# CLAUDE.md

## Project Overview

Trade Hub is a single-user web dashboard for crypto and forex markets: live prices, 14-day candlestick charts, a 21-pattern detector that runs client-side on OHLC data, plus personal strategy notes and a watchlist. No auth, no database — user state persists in `localStorage`. External market data is proxied through Next.js route handlers (free-tier CoinGecko and ExchangeRate API, no keys). Intended deploy target is Vercel (not yet linked).

## Tech Stack

- **Framework:** Next.js 16 (App Router) — *breaking changes from prior versions; see AGENTS.md*
- **UI:** React 19 + Tailwind CSS v4 (via `@tailwindcss/postcss`, CSS-first; no `tailwind.config.*`)
- **Language:** TypeScript 5 (strict)
- **Data fetching:** SWR v2 on the client; Next.js fetch + ISR (`revalidate`) on route handlers
- **Charts:** `lightweight-charts` v5 (candlesticks)
- **Icons:** `lucide-react`
- **Lint:** ESLint 9 + `eslint-config-next`
- **Runtime target:** Node.js / Vercel

## Commands

All operations go through the `Makefile` — the single entry point for build, run, test, and deploy. Run `make help` for the full list.

```bash
make build
make test
make run
make deploy TARGET=prod
make logs TARGET=prod
make status
```

Complex commands that need real bash logic live in `scripts/` and are called from Makefile targets.

## Project Structure

```
app/                    # Next.js App Router
  api/                  #   Route handlers (proxy CoinGecko + ExchangeRate API)
    crypto/prices/      #     GET  live prices for 10 coins
    crypto/ohlc/[id]/   #     GET  14-day OHLC candles for one coin
    forex/rates/        #     GET  USD-based rates for 8 pairs
  crypto/               #   Crypto explorer (grid + detail panel w/ chart + patterns)
  forex/                #   Forex pair cards
  strategies/           #   Strategy CRUD (localStorage)
  watchlist/            #   User-selected pairs (localStorage)
  layout.tsx            #   Root layout + sidebar
  page.tsx              #   Dashboard (aggregated sentiment)
components/
  layout/Sidebar.tsx    # Responsive nav (desktop sidebar / mobile bottom bar)
  market/               # PairCard, PatternBadge, PriceChart
  ui/                   # Badge, Card primitives
lib/
  hooks/                # useMarketData, useStrategies, useWatchlist (SWR + localStorage)
  patterns/             # 21 candlestick detectors + orchestrator (detectPatterns)
  types/                # market.ts, strategy.ts
  utils/formatters.ts   # Price/change/volume/market-cap formatting
public/                 # Static assets
docs/                   # Living documentation
Makefile                # Project operations — single entry point for all commands
scripts/                # Complex build/deploy scripts called from Makefile
TODO.md                 # Task tracking (see TODO Workflow below)
AGENTS.md               # Critical notes for AI agents (Next.js 16 specifics)
.claude/
  skills/               # Claude skills — conventions and slash commands
```

## Architecture

Single Next.js app, no backend service or database. The client does most of the work: SWR hooks in `lib/hooks/useMarketData.ts` fetch from our own API routes, which proxy CoinGecko and ExchangeRate API (free tier, no auth) to sidestep CORS and add ISR caching. OHLC candles feed a client-side detector (`lib/patterns/`) that scores 21 candlestick patterns and surfaces the top results on the crypto detail panel. User-owned state — strategies and watchlist — lives in `localStorage` under the keys `trade-hub-strategies` and `trade-hub-watchlist`. See `docs/architecture.md` for a deeper walkthrough.

## Key Workflows

### Docs

The `docs/` folder is the single source of truth for institutional knowledge.

**For AI agents:** Before starting work on an unfamiliar area, check `docs/` for existing context. When you learn something significant during a task — integration quirks, architectural decisions, incident learnings — write it up or update an existing doc. Don't wait to be asked.

- Markdown files organized by topic — one topic per file
- Write as if explaining to a new team member who may be an AI agent

### TODO

`TODO.md` is a lightweight task tracker for human/AI collaboration.

**For AI agents:** Mark items `[~]` (pending) before starting so parallel agents don't collide. Mark `[x]` when done. Start from the top unless told otherwise.

### Skills

`.claude/skills/` teaches Claude project-specific conventions and provides reusable workflows as slash commands. See `docs/vibestack.md` for how to create new ones.

**Reference skills** (auto-loaded as context):
- `cli-first` — Use CLI tools and `.env*` files for third-party services
- `lsp` — Use language servers for type checking, references, and code navigation

**Task skills** (invoked via `/command`):
- `/vibestack` — Set up VibeStack conventions for an existing project (CLAUDE.md, Makefile, docs, TODO.md)
- `/docs` — Capture conversation learnings into docs and clean up stale content
- `/todo` — Work through TODO.md tasks sequentially (`/todo populate` to re-analyze the codebase and seed the next batch of tasks)
- `/squad` — Analyze the project and generate domain-specific rules and specialist subagents (`/squad refresh` to update)

## External Services

This project uses CLI tools for all third-party service interactions. Before using any external API or SDK, check `.env*` files for existing credentials and project configuration. Prefer CLI tools (`aws`, `vercel`, `supabase`, `gh`, `stripe`, `gcloud`, etc.) over web dashboards or raw API calls. See the `cli-first` skill for details.

Current integrations (both unauthenticated, free tier):
- **CoinGecko** — `api.coingecko.com/api/v3/simple/price` and `/coins/{id}/ohlc`
- **ExchangeRate API** — `api.exchangerate-api.com/v4/latest/USD`

## Conventions

- **App Router only** — all routes live in `app/` as `page.tsx` / `layout.tsx` / `route.ts`. No `pages/` directory.
- **Server Components by default** — add `"use client"` only when necessary (hooks, event handlers, browser APIs). Today most page routes are client components because they use SWR/localStorage hooks; any non-interactive render should stay server.
- **Tailwind v4** — configuration is CSS-first via `app/globals.css`; there is no `tailwind.config.*` file. Use CSS variables defined there (`--bg-primary`, `--green`, `--red`, etc.) instead of hardcoded colors.
- **TypeScript strict** — prefer typed props/returns; keep `any` out of committed code. Market/strategy types live in `lib/types/`.
- **Path alias** — `@/*` maps to the project root (see `tsconfig.json`). Use it instead of relative imports crossing directory boundaries.
- **Data fetching** — SWR on the client via hooks in `lib/hooks/useMarketData.ts`; never call external APIs directly from components. Add new market data by extending a hook + the corresponding `app/api/*/route.ts`, keeping the `revalidate` value realistic for the upstream rate limit.
- **Persistent state** — `localStorage` with the `trade-hub-*` prefix. Keep reads/writes inside `lib/hooks/` so components never touch `localStorage` directly.
- **Before writing Next.js code**, consult `node_modules/next/dist/docs/` — version 16 differs from prior training data.

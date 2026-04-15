# Architecture

## Current state

Trade Hub is a fresh Next.js 16 App Router scaffold. There is no backend, database, authentication, or external integration wired up yet. The product scope is still being defined.

## Stack

| Layer       | Choice                          |
|-------------|---------------------------------|
| Framework   | Next.js 16 (App Router)         |
| UI          | React 19                        |
| Styling     | Tailwind CSS v4 (CSS-first)     |
| Language    | TypeScript 5                    |
| Lint        | ESLint 9 + `eslint-config-next` |
| Target host | Vercel (default, not yet linked)|

## Directory layout

- `app/` — routes, layouts, and pages (App Router). Server Components by default; add `"use client"` only where needed.
- `public/` — static assets served from `/`.
- `docs/` — markdown docs; this file is the entry point.
- `.claude/` — Claude Code skills, hooks, and settings.

## Next.js 16 caveats

This is **not** the Next.js most AI training data knows. Before writing framework code (routing, data fetching, caching, metadata, middleware, etc.), read the relevant file under `node_modules/next/dist/docs/`. Pay attention to deprecation notices at build time.

## Where things will go as they get added

- **API routes / server actions** — `app/**/route.ts` or server actions in server components.
- **Auth** — not yet chosen. Likely Auth.js, Clerk, or Supabase Auth depending on other infra choices.
- **Database** — not yet chosen. When added, keep queries in a `lib/db/` module; never import DB clients into components directly.
- **Shared UI primitives** — `components/` at the project root.
- **Business logic** — `lib/` at the project root, organized by domain.
- **Environment variables** — `.env.local` (ignored); document required keys in `.env.example` when it's created.

Update this doc as real architectural decisions are made.

@AGENTS.md

# CLAUDE.md

## Project Overview

Trade Hub — a web application scaffolded with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4. Early-stage: the scaffold is in place, product scope is still being defined.

## Tech Stack

- **Framework:** Next.js 16 (App Router) — *breaking changes from prior versions; see AGENTS.md*
- **UI:** React 19 + Tailwind CSS v4 (via `@tailwindcss/postcss`)
- **Language:** TypeScript 5
- **Lint:** ESLint 9 with `eslint-config-next`
- **Runtime target:** Node.js (Vercel-friendly by default)

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
app/            # Next.js App Router routes, layouts, pages
public/         # Static assets served at /
docs/           # Living documentation
Makefile        # Project operations — single entry point for all commands
scripts/        # Complex build/deploy scripts called from Makefile
TODO.md         # Task tracking (see TODO Workflow below)
.claude/
  skills/       # Claude skills — conventions and slash commands
AGENTS.md       # Critical notes for AI agents (Next.js 16 specifics)
```

## Architecture

Single Next.js application. Routing and rendering are handled by the App Router under `app/`. No backend service, database, or external integrations have been added yet — add them under clear module boundaries as they appear.

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

## Conventions

- **App Router only** — all routes live in `app/` as `page.tsx` / `layout.tsx`. No `pages/` directory.
- **Server Components by default** — add `"use client"` only when necessary (hooks, event handlers, browser APIs).
- **Tailwind v4** — configuration is CSS-first via `app/globals.css`; there is no `tailwind.config.*` file.
- **TypeScript strict** — prefer typed props/returns; keep `any` out of committed code.
- **Path alias** — `@/*` maps to the project root (see `tsconfig.json`).
- **Before writing Next.js code**, consult `node_modules/next/dist/docs/` — version 16 differs from prior training data.

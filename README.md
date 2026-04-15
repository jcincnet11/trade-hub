# Trade Hub

Next.js 16 + React 19 + TypeScript + Tailwind v4 web application.

## Commands

All project operations go through the `Makefile`. Run `make help` for the full list.

### Development

```bash
make run          # Start the dev server at http://localhost:3000
make lint         # Lint the codebase
make typecheck    # Run TypeScript type checking
make test         # Run tests (not yet configured)
```

### Build & Release

```bash
make build        # Build for production
make start        # Start the production server (after build)
```

### Deploy & Operate

```bash
make deploy TARGET=prod    # Deploy (not yet configured — likely Vercel)
make logs TARGET=prod      # Tail logs
make status                # Show project status
```

### Utilities

```bash
make docs         # Serve the docs/ folder locally
make help         # Show all available commands
```

## Getting Started

```bash
make run
```

Open [http://localhost:3000](http://localhost:3000). Edit `app/page.tsx` — the page auto-updates.

## Learn More

- `CLAUDE.md` / `AGENTS.md` — conventions for AI agents working in this repo
- `docs/` — architecture notes and institutional knowledge
- `TODO.md` — prioritized task list for getting this to production
- [Next.js 16 docs](https://nextjs.org/docs) — *note: breaking changes from earlier versions*

## Deploy

Default target is [Vercel](https://vercel.com/new). Run `vercel link` once, then wire up `make deploy`.

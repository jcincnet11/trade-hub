# Makefile — project operations
#
# Single entry point for all project operations: build, run, test, deploy.
# Both humans and AI agents use this as the "how do I do anything" reference.
#
# Usage: make <target>
#
# Convention: keep targets simple. If a target needs more than a few lines of
# shell, put the logic in scripts/ and call it from here.

.PHONY: build test run start lint typecheck deploy logs status docs help

PROJECT_NAME := trade-hub

# ── Build & Run ───────────────────────────────────────────

build: ## Build the project for production
	npm run build

run: ## Run the dev server (http://localhost:3000)
	npm run dev

start: ## Start the production server (after build)
	npm start

# ── Quality ───────────────────────────────────────────────

test: ## Run unit tests (vitest)
	npm test

test-e2e: ## Run Playwright E2E tests (requires `npx playwright install chromium` once)
	npm run test:e2e

lint: ## Lint the codebase
	npm run lint

typecheck: ## Run TypeScript type checking
	npx tsc --noEmit

# ── Deploy & Manage ───────────────────────────────────────
# TODO: no deploy target configured yet. Likely Vercel (Next.js default).
# Wire up once `vercel link` has been run against a project.

deploy: ## Deploy to a target (usage: make deploy TARGET=prod)
	@test -n "$(TARGET)" || (echo "Usage: make deploy TARGET=<target>" && exit 1)
	@echo "Deploying $(PROJECT_NAME) to $(TARGET)..."
	# vercel deploy --prod        # when TARGET=prod
	# vercel deploy               # when TARGET=preview
	@echo "TODO: configure deploy — run 'vercel link' first, then wire this target"

logs: ## Tail logs (usage: make logs TARGET=prod)
	@test -n "$(TARGET)" || (echo "Usage: make logs TARGET=<target>" && exit 1)
	# vercel logs --follow
	@echo "TODO: configure logs — depends on deploy target"

status: ## Show project status
	@echo "$(PROJECT_NAME) status..."
	# vercel ls
	@echo "TODO: configure status — depends on deploy target"

# ── Utilities ─────────────────────────────────────────────

docs: ## Serve docs locally (usage: make docs PORT=3000)
	@echo "Serving docs on http://localhost:$${PORT:-8000} ..."
	cd docs && python3 -m http.server $${PORT:-8000}

# ── Help ──────────────────────────────────────────────────

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*##' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help

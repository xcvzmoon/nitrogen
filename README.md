# Nitrogen Starter Template

**Quick Start:**

```sh
pnpm dlx gitget xcvzmoon/nitrogen
```

---

Nitrogen is a starter template for building serverless backends with [Nitro](https://nitro.build/), TypeScript, and Drizzle ORM (PostgreSQL).

## Features

- N-Tier Architecture: Repository, Services, Controller (controllers are mapped to files in the `api` folder)
- TypeScript strictness and path aliases
- Drizzle ORM for migrations and schema
- Health check endpoints
- Pre-configured linting and formatting
- CI workflow for build/lint

## Directory Structure

- `server/` — Main backend code
  - `api/` — Route controllers (each file is a controller for its route)
  - `routes/` — HTTP endpoints
  - `database/` — DB connection and ORM
  - `config/` — Environment/config validation

## Developer Workflows

- Install dependencies: `pnpm install --frozen-lockfile`
- Build: `pnpm build`
- Dev server: `pnpm dev`
- Lint: `pnpm lint`
- Format: `pnpm format`
- Database: `pnpm db:generate`, `pnpm db:push`, `pnpm db:pull`, `pnpm db:studio`, `pnpm db:check`

## Health Checks

- `server/routes/health/ready.get.ts` — DB connection
- `server/routes/health/index.get.ts` — Uptime/memory

## Conventions

- Environment config via `.env` and `zod`
- Snake_case enforced for DB schema/migrations
- All DB access via Drizzle ORM and `pg`

---

See `.github/copilot-instructions.md` for AI agent guidance and architectural details.

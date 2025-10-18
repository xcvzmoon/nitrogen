# Copilot Instructions for Nitrogen

## Project Overview

## Architectural Pattern: N-Tier

- This template proposes an **N-Tier Architecture** with clear separation of concerns:
  - **Repository**: Handles direct database access and queries (see `server/database/`).
  - **Services**: Encapsulates business logic, typically implemented in dedicated service files (not shown in starter, but recommended for complex logic).
  - **Controller**: Manages HTTP request/response, mapped to files under the `api` folder. There is no dedicated `controller` folder; instead, each file in `api` (e.g., `api/users/[id].get.ts`, `api/users/[id].put.ts`) acts as a controller for its route.

- **Config**: `nitro.config.ts` sets up Nitro with `srcDir: 'server'` and disables auto-imports.

## Developer Workflows

- **Install dependencies**: `pnpm install --frozen-lockfile`
- **Build**: `pnpm build` (runs `nitro build`)
- **Dev server**: `pnpm dev` (runs `nitro dev`)
- **Lint**: `pnpm lint` (uses `oxlint` with custom flags)
- **Format**: `pnpm format` (formats all TS files with Prettier)
- **Database**: Use Drizzle Kit scripts (`pnpm db:generate`, `pnpm db:push`, `pnpm db:pull`, `pnpm db:studio`, `pnpm db:check`)
- **CI**: See `.github/workflows/ci.yaml` for build/lint steps on PRs and pushes to `main`.

## Patterns & Conventions

- **Environment Variables**: All DB config is loaded from `.env` and validated with `zod`.
- **TypeScript Paths**: Use `~/*` for `server/*` and `@/*` for project root (see `tsconfig.json`).
- **Health Checks**: `server/routes/health/ready.get.ts` tests DB connection; `server/routes/health/index.get.ts` reports uptime/memory.
- **Strict TypeScript**: `tsconfig.json` enforces strictness and disables unused locals.
- **Snake_case DB**: Drizzle config enforces snake_case for DB schema/migrations.

## Integration Points

- **PostgreSQL**: All DB access via Drizzle ORM and `pg`.
- **Nitro**: Handles routing, serverless deployment, and build.
- **Oxlint**: Used for linting with custom correctness flags.

## Examples

- To add a new route: create a `.get.ts` or `.post.ts` file in `server/routes/` and export an `eventHandler`.
- To add a DB migration: update schema in `server/database/schemas/`, then run `pnpm db:generate`.

---

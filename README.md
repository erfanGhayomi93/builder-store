# Store Builder

Source of truth: [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md).

## Local setup

Node.js 22.12+ (verified on Node 24), npm. Run `npm ci` after cloning.
Copy each app's `.env.example` to `.env` if overrides are needed; public frontend variables must never contain secrets.

| Command | Application |
| --- | --- |
| npm run dev:storefront | Next.js App Router, port 3000 |
| npm run dev:merchant | React/Vite/Router, port 4200 |
| npm run dev:admin | React/Vite/Router, port 4300 |
| npm run dev:api | NestJS, port 3001; GET /api/health |

Run each in its own terminal. Nx targets allow independent build and development: e.g. `npx nx build api`.

## Verification

- npm run lint
- npm run typecheck
- npm test
- npm run build
- npx playwright install chromium (once)
- npm run test:e2e

## Shared code

libs/contracts: wire contracts; libs/shared-types: enums/types; libs/validation: Zod schemas; libs/utils: pure helpers; libs/api-client: centralized HTTP client; libs/ui: shadcn-style source-owned components, Radix direction provider, Query provider and Tailwind v4 tokens.

React Hook Form, Zod resolver and Zustand are installed for subsequent flows; avoid creating unused state stores. API client does not persist credentials or assume an authentication strategy before stage 6.

Default document direction is RTL. Shared CSS uses logical alignment; Radix direction must match document direction when adding a locale switch. Store brand colors can override semantic CSS variables. Dark token overrides are prepared; no theme selector yet.

## Scope

Sprint 1 stages 1–4 only: documented workspace, four runnable app shells and shared foundations. Database, authentication, authorization, store creation and production deployment are subsequent work. Panels are public placeholder shells and expose no tenant data.

Nx runs the framework CLIs directly through project targets, keeping tooling small and versions independent. Shared source aliases are resolved by TypeScript/Vite/Next. Do not import backend persistence into the frontend.


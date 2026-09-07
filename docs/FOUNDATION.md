# Sprint 1, stages 1–4

The canonical context was copied verbatim from the supplied handoff. This foundation does not implement authentication, persistence, store creation or tenant access yet.

## Tooling choices

- npm with exact direct versions and a lockfile for reproducible installation.
- Nx explicit project targets invoke framework CLIs. No Nx Cloud subscription or remote cache is configured.
- Shared libraries contain source only. Frontend contracts must never import NestJS or persistence code.
- API development uses the TypeScript compiler through ts-node so Nest decorator metadata is preserved.
- Tailwind v4 and the shadcn manual source-owned component approach use Radix Slot, class-variance-authority, clsx and tailwind-merge. Components live in libs/ui, with a components.json configuration for future additions.
- QueryClient is instantiated per provider, avoiding a shared global cache between storefront requests. No authentication tokens are persisted in the API client.
- React Hook Form, its Zod resolver and Zustand are available for upcoming forms and genuine client state; no business forms or global state are fabricated in this stage.

References: [Nx custom commands](https://nx.dev/docs/kb/run-commands-executor), [shadcn components configuration](https://ui.shadcn.com/docs/components-json).

## Environment

Each app has an .env.example. Vite and Next load app-local environment files; Nest explicitly loads apps/api/.env when started from the workspace root. Only public API URLs belong in VITE_* and NEXT_PUBLIC_* variables. Database and authentication secrets will be added with their corresponding implementation.

## Remaining Sprint 1 work

PostgreSQL/Prisma, user and store models, migrations, registration/login/refresh/logout, authorization and tenant resolution, initial platform admin, audit persistence, store creation and isolation tests remain unimplemented.

## Deferred product clarifications

- Section 36 includes custom domain connection in MVP despite the ambiguous phrasing in section 3.
- Define how to handle a successful payment after a reservation expires before implementing payments.
- Define refund confirmation and money units/rounding before implementing billing.

These do not block stages 1–4.

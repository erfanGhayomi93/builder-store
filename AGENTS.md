# Store Builder

Read `docs/PROJECT_CONTEXT.md` completely before changes. It is the project source of truth; newer explicit user decisions take precedence.

- Follow the approved Nx, TypeScript, Next.js, React/Vite and NestJS architecture.
- Keep business logic and persistence in the backend. Never import backend code into frontend libraries.
- Default UI to Persian RTL; use logical CSS properties and support LTR with the same components.
- Use semantic HTML and Next.js metadata for the storefront.
- Scope tenant resources by server-resolved storeId; never trust a client-provided storeId. Only Platform Admin has cross-tenant access.
- Online payments require server verification. Financial and inventory changes must be transactional and idempotent; inventory never becomes negative.
- Keep MVP scope strict. Do not add AI, Redis, BullMQ, microservices or Kubernetes without explicit authorization.
- Justify new dependencies. Run relevant lint, typecheck, tests and builds after implementation.
- Do not commit or push unless explicitly requested.

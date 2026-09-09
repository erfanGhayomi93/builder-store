# Store Builder

Use `docs/PROJECT_CONTEXT.md` as the primary context. Read it fully once, then reuse it while unchanged and consult relevant sections as needed. It is the project source of truth; newer explicit user decisions take precedence.

- Follow the approved Nx, TypeScript, Next.js, React/Vite and NestJS architecture.
- Keep business logic and persistence in the backend. Never import backend code into frontend libraries.
- Default UI to Persian RTL; use logical CSS properties and support LTR with the same components.
- Use semantic HTML and Next.js metadata for the storefront.
- Scope tenant resources by server-resolved storeId; never trust a client-provided storeId. Only Platform Admin has cross-tenant access.
- Online payments require server verification. Financial and inventory changes must be transactional and idempotent; inventory never becomes negative.
- Keep MVP scope strict. Do not add AI, Redis, BullMQ, microservices or Kubernetes without explicit authorization.
- Justify new dependencies. Run relevant lint, typecheck, tests and builds after implementation.
- Do not commit or push unless explicitly requested.

## Working workflow

- Start with relevant documentation, identify the affected module and search by component, route, service, endpoint or type. Open only necessary files; do not scan the entire repository for general context.
- Do not reread unchanged PROJECT_CONTEXT.md, COMPETITIVE_STRATEGY.md or AGENTS.md in the same working session.
- Read docs/COMPETITIVE_STRATEGY.md only for product features, onboarding, customization, theme/page/section builders, analytics, AI, roadmap, prioritization or major UX decisions.
- Work incrementally: understand, locate, state a small plan, make focused changes, test the affected area first, then report changed files and important decisions.
- Preserve approved technologies and reuse existing design patterns. Account for loading, empty, error, success, disabled and permission states. Maintain semantic HTML and heading hierarchy.
- Keep Persian the default and support English and future languages with direction-aware components.
- Do not add SMS, OTP, email, advanced page building or advanced analytics without explicit authorization, in addition to the exclusions above.
- Update documentation only for changes to business rules, architecture, API contracts, database models, UX rules, technology choices or MVP scope, not minor implementation details.
- Avoid unrelated refactors and speculative reads. Documentation → targeted search → relevant files → implementation remains the default workflow for this project.

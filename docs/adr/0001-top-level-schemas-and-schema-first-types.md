# Top-level schemas workspace and schema-first domain types

Status: accepted

Shared persistence row contracts (DAO) and cross-boundary transport contracts (DTO) are separated into dedicated packages under a top-level `schemas/` directory (`@schema/*`), using Zod schemas as the single source of truth (`z.infer`) without entity `class` or separate `interface` wrappers.

## Considered Options

- Keep models inside `modules/universal/classes` with `class` wrappers and private static Zod schemas.
- Split DAO and DTO packages inside `modules/`, or place DAO schemas directly under `@module/database`.
- Create a top-level `schemas/` workspace partitioned into `@schema/database` (server-only DAO) and universal DTO packages (`@schema/auth`, `@schema/blog`, `@schema/rpc`).

## Consequences

- Separating `@schema/database` from `@module/database` prevents services that only validate database rows from pulling in top-level PostgreSQL pool initialization, while distinguishing DB `Date` timestamps from serialized ISO datetime strings.
- Removing `class` wrappers lets consumers derive create, update, and query schemas directly from canonical schemas; server-internal route schemas that are not shared remain local to their owning server.

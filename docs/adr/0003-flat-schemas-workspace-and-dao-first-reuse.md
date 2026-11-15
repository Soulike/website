# Flat schemas workspace and DAO-first contract reuse

Status: accepted

Supersedes ADR-0001's `server/` versus `universal/` subdirectory split while preserving the top-level `schemas/` workspace and schema-first `z.infer` convention: all `@schema/*` packages (`@schema/database`, `@schema/auth`, `@schema/blog`, `@schema/rpc`) live directly under `schemas/*` as pure `zod`-only packages, and DTO schemas reuse `@schema/database` DAO field contracts instead of duplicating column bounds.

## Considered Options

- Keep `@schema/database` under `schemas/server/database` and keep `schemas/universal/*` isolated from it, duplicating column bounds in `@schema/auth` and `@schema/blog`.
- Allow `schemas/universal/*` to depend on `schemas/server/database`, breaking the repository's `server/` versus `universal/` dependency direction.
- Flatten `schemas/` to `schemas/*` (`database`, `auth`, `blog`, `rpc`) as pure `zod`-only contract packages and reuse `@schema/database` field schemas from DTO packages.

## Consequences

- `@schema/database` has no Node-only or PostgreSQL pool imports and remains safe for browser bundles, allowing `@schema/auth` and `@schema/blog` to derive DTOs directly from DAO row schemas (`ArticleRowSchema.extend(...)`, `CategoryRowSchema`, `.shape.*`) without duplicating column constraints.
- Separating `schemas/` from `modules/` and `libraries/` remains sufficient to prevent database runtime initialization from leaking into contracts, while the flat layout matches the reality that all packages in `schemas/` are transport/persistence contracts rather than runtime-bound modules.
- Input DTOs that trim whitespace before enforcing DAO string bounds must compose with `z.string().trim().pipe(DaoSchema.shape.field)` so Zod v4 trims before evaluating `.min(1)`.

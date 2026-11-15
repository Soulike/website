# Domain Schemas

Pure, side-effect-free Zod contract packages (`@schema/*`) shared across server and web applications. Depend only on `zod` and sibling `@schema/*` packages.

## Conventions

- **DAO first**: Define canonical column bounds once in `@schema/database`, then derive downstream DTOs and sibling schemas via `.extend(...)` or `.shape` references rather than duplicating field constraints.
- **Trim before length checks**: When trimming whitespace before enforcing a `@schema/database` string bound in Zod v4, compose with `z.string().trim().pipe(DaoSchema.shape.field)` so trimming runs before `.min()`.
- **Language-neutral contracts**: Keep schemas free of UI copy; translate Zod validation issues and `ServerError` codes in web applications via `@library/i18n`.

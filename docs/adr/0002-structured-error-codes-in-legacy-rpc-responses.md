# Structured error codes in legacy RPC responses

Status: accepted

Legacy RPC endpoints (`database-legacy`, `admin-legacy`, `blog-legacy`, and `@module/model`) report failures using a nested `{ isSuccessful: false, error: { code, details? } }` payload driven by a shared error-code enum, while the frontend translates those codes into localized user messages via `@library/i18n`.

## Considered Options

- Continue returning hardcoded Chinese `message` strings from legacy servers.
- Flatten failure fields directly onto the response envelope (`{ isSuccessful: false, code, details? }`).
- Rewrite all legacy endpoints to RESTful HTTP status codes immediately instead of extending the RPC envelope.

## Consequences

- Legacy RPC services and RESTful services (such as `apps/server/auth`) intentionally coexist during the gradual migration to RESTful APIs; `auth` keeps standard HTTP status codes while legacy RPC responses carry structured error codes inside `error`.
- Changing the failure envelope breaks wire compatibility with prior `message`-based clients and smoke checks, so server producers, `@module/model`, web apps, and smoke tests must coordinate the cutover.

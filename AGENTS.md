# Development Instructions

This monorepo uses pnpm for dependency management and workspace commands, Node.js LTS for application builds and server runtimes, and Nginx for Web runtimes.

## Toolchain documentation

For Node version changes and generated configuration, see [Node toolchain](README.md#node-toolchain).

Use the [pnpm documentation](https://pnpm.io/) for dependency and workspace tasks. Check the [Node.js release status](https://nodejs.org/en/about/previous-releases) for the LTS selected by CI and Docker, then use that release's API documentation for runtime behavior.

## Task preparation

Before starting any task:

- Use pnpm for dependency and workspace commands.
- Review the relevant root and workspace `package.json` files.
- Review the relevant Vite, Vitest, ESLint, Prettier, and other tool configurations.

## Agent skills

### Issue tracker

Issues and specs live in GitHub Issues. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the canonical triage label vocabulary. See `docs/agents/triage-labels.md`.

### Domain docs

This repository uses a single-context domain documentation layout. See `docs/agents/domain.md`.

---

## Projects

- `apps/` - Web and server applications. Each app has its own `Dockerfile`.
- `configs/` - Shared configuration packages (ESLint, TypeScript, etc.).
- `modules/` - Business-specific packages containing domain logic.
- `schemas/` - Shared schema-first Zod contracts (DAO, DTO, and RPC schemas). See `schemas/AGENTS.md`.
- `libraries/` - Reusable, business-agnostic packages.
- `nginx/` - NGINX configs for server deployment.
- `scripts/` - Repository development and CI commands.

### New workspace packages

Every workspace package matched by `pnpm-workspace.yaml` must satisfy these checks so `pnpm validate:pr` discovers it without root-script edits:

- Register any new top-level directory in `pnpm-workspace.yaml` and update path filters in `.github/workflows/apps-ci.yml` and relevant Docker workflows.
- Set `"type": "module"` in `package.json` and define `"typecheck"` (`tsc --noEmit` for Node/library packages, `tsc -b` for Vite web apps) and `"lint"` (`eslint ./src`, or `eslint .` when TS files live outside `src/`), plus `"test"` if tested. Pure config packages without TypeScript/JavaScript sources still provide explicit no-op scripts matching `configs/typescript`.
- Extend the matching `@config/typescript/*` preset in `tsconfig.json` and `@config/eslint` in `eslint.config.mjs`.
- Formatting is enforced repository-wide by `pnpm format:check` (`prettier --check .`); do not add per-package format scripts or ignore source directories in `.prettierignore`.

---

## Code Style

### Overall

Follow Google TypeScript guide unless specified. Detail: <https://google.github.io/styleguide/tsguide.html>.

### Comments

- Add comments when code cannot explain itself.
- Consider making the code more self-descriptive when you want to add comments.

### File Naming

- A common folder/file: **dash-case**.
- Unit test for a file: **<file-name>.test.ts**.
- A folder containing a page component: **dash-case**.
- A folder containing a special page component: **\_dash-case**, e.g., `_layout`.
- A file/folder containing a React component: **UpperCamelCase**.
- A file containing a React hook: **camelCase**, and start with `use`, e.g., `useHello.ts`.
- A file/folder containing a Web Component: **dash-case**.

### Flow Control

- Always use early-return style for `if` to reduce levels.

---

## Unit Tests

- Use Vitest as the test runner.
- Create unit test only when user prompts.
- Can expose private methods and members required in testing with `xxxForTesting` methods. The test-only methods do
  not need test cases.
- All `xxxForTesting` methods must call `assertIsTest` from `@library/test-helpers` at the start to prevent
  production usage.

# Development Instructions

This monorepo uses pnpm for dependency management, workspace commands, validation, and tests. Some server bundles and application Docker images still use Bun during the staged toolchain migration.

## Toolchain documentation

Use the [pnpm documentation](https://pnpm.io/) for dependency and workspace tasks. Refer to the [Bun documentation](https://bun.com/docs/llms.txt) only for server-build and image paths that have not migrated yet.

## Task Preparation

Before starting any task, you must first confirm:

- What package manager is used. Use correct package manager to run commands.
- Configurations in package.json files, both in project and in workspace.
- Configurations for other tools, i.e., Vite, Vitest, ESLint, Prettier, etc.

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
- `libraries/` - Reusable, business-agnostic packages.
- `nginx/` - NGINX configs for server deployment.

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

- Create unit test only when user prompts.
- Can expose private methods and members required in testing with `xxxForTesting` methods. The test-only methods do
  not need test cases.
- All `xxxForTesting` methods must call `assertIsTest` from `@library/test-helpers` at the start to prevent
  production usage.

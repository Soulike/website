# Development Instructions

This is a bun monorepo containing multiple types of projects.

## Bun Doc

Since Bun is new, you may not know its latest functionalities. You can refer
to [latest Bun doc](https://bun.com/docs/llms.txt) if you need information.

## Task Preparation

Before starting any task, you must first confirm:

- What package manager is used. Use correct package manager to run commands.
- Configurations in packages.json files, both in project and in workspace.
- Configurations for other tools, i.e., Vite, Vitest, ESLint, Prettier, etc.

---

## Projects

- `apps/` - Web and server applications. All apps share the same `Dockerfile` at project root.
- `configs/` - Shared configuration packages (ESLint, TypeScript, etc.).
- `modules/` - Business-specific packages containing domain logic.
- `libraries/` - Reusable, business-agnostic packages.
- `nginx/` - NGINX configs for server deployment.

---

## Code Style

### Overall

Follow Google TypeScript guide unless specified. Detail: <https://google.github.io/styleguide/tsguide.html>.

### Comments

- Add comments when code can not explain itself.
- Consider make code more self-descriptive when you want to add comments.

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
- Can expose private methods and members required in testing with `xxxForTesting` methods. The test-only methods does
  not need test cases.
- All `xxxForTesting` methods must call `assertIsTest` from `@library/test-helpers` at the start to prevent
  production usage.

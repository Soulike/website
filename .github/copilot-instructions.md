---
applyTo: '**'
---

# Development Instructions

This is a pnpm monorepo containing multiple types of projects.

---

## Work Style

- Output as less as possible.
- All outputs should be concise.

---

## Work Memory

If you are not GitHub Copilot, ignore this section.

Before performing ANY actions or tasks, create a Markdown file as your work memory inside `.memory` folder. The content
of the file should be concise, and it includes:

1. Your plan and work status. Use checklist for steps, and update it after finishing a step.
2. Your insights.
3. Your investigation results.
4. Any other important information.

You MUST update the file after performing ANY actions or tasks.

---

## Projects

### Apps

All apps share the same `Dockerfile` at project root.

#### Web Apps

- Under `apps/web`.
- Use TypeScript, React and Vite.
- Use Vitest for testing.
- Built with docker. Nginx is included in docker image for static file serving.

#### Server Apps

- Under `apps/server`.
- Use TypeScript and koa2 with Node.js as runtime.
- Use Vitest for testing.
- Built with docker.

### NPM Packages

#### Web Packages

- Under `packages/web`.
- For web apps only.

#### Server Packages

- Under `packages/server`.
- For Node.js server apps only.

#### Universal Packages

- Under `packages/universal`.
- Usable to all types of apps.

### NGINX

- Under `nginx`, containing NGINX configs for server deployment.
- Has its own `Dockerfile`: `nginx/Dockerfile`.

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

### React Specific

#### File Structure

Typical structure for a React component:

```text
Component/
  | index.tsx               // For exporting the component.
  | container.tsx           // Optional
  | view.tsx
  | styles.module.css       // Part of view.tsx
  | assets/                 // Static assets needed
```

#### Component Exporting

We don't use default export, since it makes renaming difficult.

If the component is not for a page, use

```typescript
export {Component} from './container.js';
```

if not, consider using `React.lazy()` to export for better code-splitting.

```typescript
export const Component = React.lazy(async () => {
  const {Component} = await import('./container.js');
  return {default: Component};
});
```

#### Component Importing

Always import the `index.ts` inside the component folder. `index.ts` should be the only file imported by other
components.

```typescript
// ❌ Not Good, as it accesses a internal file, and prevents lazy loading.
import {Component} from 'path/to/Component/container.js';

// ✅ Good.
import {Component} from 'path/to/Component/index.js';
```

---

## Unit Tests

- Create unit test only when user prompts.
- When developing unit tests, develop based on API interfaces and DO NOT read implementations.
- Can expose private methods and members required in testing with `xxxForTesting` methods. The test-only methods does
  not need test cases.

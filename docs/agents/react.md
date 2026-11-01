# React conventions

These conventions apply to React components in Web applications, business modules, and reusable libraries. File naming follows the repository-wide rules in the root `AGENTS.md`; toolchain and deployment instructions belong to the applicable scoped `AGENTS.md` files.

## File structure

Use the following MVVM structure for React components:

```text
Component/
  | assets/                 // Static assets needed
  | components/             // Subcomponents
  | hooks/                  // Hooks as view models.
  | index.ts                // Public exports only; no TSX.
  | container.tsx           // Optional. Connect view models with view.
  | view.tsx                // Stateless view component. Get all information with props.
  | styles.module.css       // Part of view
```

Existing components also use `view-model.ts` or `view-model.tsx` for view models and `index.tsx` for public component entrypoints. Account for the existing layout when changing a component; keep unrelated layout changes outside the task.

## Component exporting

Use named exports so component names remain consistent across imports.

For a component with a container, expose it through the public entrypoint:

```typescript
export {Component} from './container.js';
```

If the component is for a page, consider `React.lazy()` for code splitting. The `default` property below adapts a named export to React's lazy-loading API:

```typescript
export const Component = React.lazy(async () => {
  const {Component} = await import('./container.js');
  return {default: Component};
});
```

## Component importing

Import another component through its public folder entrypoint. In the MVVM layout above, that is `index.ts`; existing `index.tsx` files also serve as public entrypoints. Keep container and view files internal to their component.

```typescript
// Accesses an internal file and can bypass lazy loading.
import {Component} from 'path/to/Component/container.js';

// Uses the component's public entrypoint.
import {Component} from 'path/to/Component/index.js';
```

- When importing public or shared modules, use the configured import alias, such as `@/hooks` or `@/components` in an application.
- When importing a component-internal module, such as a subcomponent, use relative imports.

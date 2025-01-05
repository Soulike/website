# Code Style

Check https://google.github.io/styleguide/tsguide.html.

## File Naming

- A common folder/file: **dash-case**.
- A file/folder containing a React component: **UpperCamelCase**.
- A file containing a React hook: **camelCase**, and start with `use`, e.g., `useHello.ts`.
- A file/folder containing a Web Component: **dash-case**.

## React Specific

### File Structure

Typical structure for a React component:

```text
Component/
  | index.tsx               // For export the component.
  | container.tsx           // Optional
  | view.tsx
  | styles.module.css       // Part of view.tsx
  | assets/                 // Static assets needed
```

### Component Exporting

We don't use default export, since it makes renaming difficult.

In most cases,

```typescript
export {Conmponent} from './container.js';
```

is sufficient.

but if the component has heavy dependencies, consider using `React.lazy()` to export for better code-splitting.

```typescript
export const Component = React.lazy(async () => {
  const {Component} = await import('./container.js');
  return {default: Component};
});
```

### Component Importing

Always import the `index.ts` inside the component folder. `index.ts` should be the only file imported by other components.

```typescript
// ❌ Not Good, as it accesses a internal file, and prevents lazy loading.
import {Component} from 'path/to/Component/container.js';

// ✅ Good.
import {Component} from 'path/to/Component';

// ✅ Good, if necessary.
import {Component} from 'path/to/Component/index.js';
```

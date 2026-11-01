# TypeScript 6 migration

Completed locally on 2026-11-01, using Node.js 26.13.0 and pnpm 12.16.1.
This records the migration from TypeScript 5.9.3 after the
[TypeScript 7 assessment](typescript-7-upgrade.md) established incompatible lint
and Jest integrations. It is a local validation record, not deployment evidence.

## Compiler and integrations

The workspace now uses ordinary `typescript@6.0.3` through the shared
[`pnpm-workspace.yaml`](../../pnpm-workspace.yaml) catalog. Existing `tsc` scripts
continue to use the JavaScript compiler and its API. The
[TypeScript 6 announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/)
describes this release as the bridge to the native compiler; the
[6.0.3 registry record](https://registry.npmjs.org/typescript/6.0.3) identifies the
selected package. Its 2026-04-16 publication predates the seven-day release-age
threshold. No release-age exceptions were added.

| Integration                                                | Selected version | Migration effect                                                                                                                                              |
| ---------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `typescript-eslint` and `@typescript-eslint/eslint-plugin` | 8.72.0           | Direct dependency ranges now start at this mature version, which supports TypeScript `>=4.8.4 <6.1.0`.                                                        |
| `@eslint-react/eslint-plugin`                              | 3.0.0            | The smallest stable major above the installed 2.13.0; its TypeScript peer permits TS6 and it retains the `recommended-typescript` preset used by the project. |
| `ts-jest`                                                  | 29.4.15          | The existing version supports TypeScript `>=4.3 <7`; no transformer replacement was needed.                                                                   |

The published manifests for
[typescript-eslint 8.72.0](https://registry.npmjs.org/typescript-eslint/8.72.0),
[React ESLint 3.0.0](https://registry.npmjs.org/@eslint-react/eslint-plugin/3.0.0),
and [ts-jest 29.4.15](https://registry.npmjs.org/ts-jest/29.4.15) own these version
constraints. The React preset now includes React Compiler checks, and replaces or
removes several older hook and legacy React rules; it is not an identical rule
set. Its adoption was checked against the existing source, without automatic
source fixes or suppression of the reported errors.

## Configuration changes

TypeScript 6 defaults `types` to an empty array and enables
`noUncheckedSideEffectImports`. The linked release announcement documents these
changes. An initial probe against the previous configurations passed 24 of 34
compiler entry points; the remaining failures came from missing Node/Jest
declarations and an untyped stylesheet import.

- [`Node configuration`](../../configs/typescript/src/tsconfig.node.json) explicitly includes `node` types. Packages and Node smoke scripts inherit it.
- Each Web application's app and Vite configuration includes `node` types, preserving the existing Node module imports used by the browser polyfills and build tooling.
- [`Database legacy configuration`](../../apps/server/database-legacy/tsconfig.json) includes `node` and `jest`, covering the discovered Jest test's globals.
- [`Markdown article renderer`](../../libraries/web/markdown-article-renderer/package.json) exports a declaration for its stylesheet from the package that owns the asset. The declaration has no JavaScript exports; the runtime export still resolves to the CSS file.

The stylesheet declaration keeps side-effect import checking enabled. No business
logic changes, new unit tests, or compiler deprecation suppressions were needed.

## Validation and remaining boundaries

- `pnpm install --strict-peer-dependencies` and the subsequent frozen-lockfile install passed with the seven-day policy and the regenerated lockfile. The workspace uses one TypeScript 6.0.3 dependency graph.
- `pnpm validate:pr` passed: all package/script/server type checks and all three Web builds.
- `CI=1 pnpm test` passed, including the database legacy server's five Jest tests using the actual `ts-jest` transformer.
- All four server builds passed through their existing `node build.ts` scripts.
- The shared ESLint configurations load with TypeScript 6.0.3; the new stylesheet declaration passes its package's ESLint check.
- At the migration checkpoint, full Web ESLint checks reported three errors in admin, two in blog, and none in game-2048. The same five Ant Design deprecation errors were reproduced using the cached TypeScript 5.9.3 and React ESLint 2.13.0 packages with equivalent temporary configurations. No migration-introduced lint errors were found. Warning counts changed with the React preset upgrade.
- A subsequent cleanup replaced `Select.Option` with `options` and four notification `message` arguments with `title`. Full Web lint then passed with zero errors; the existing 17 warnings remain. Admin and blog type checks and production builds passed again.
- Formatting, local documentation links, and `git diff --check` passed.

Docker builds were not run because the local Docker daemon was unavailable.
Local server bundles and Web builds do not establish container smoke-test,
hosted CI, editor, or deployment success. Recheck this record's version-specific
constraints and validation when changing the toolchain again.

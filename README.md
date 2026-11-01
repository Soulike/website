# website

The monorepo of my personal website.

## Dependency updates

Use pnpm to install and update dependencies. The policy in
[`pnpm-workspace.yaml`](pnpm-workspace.yaml) requires registry dependency versions,
including transitive dependencies, to have been published for at least seven days
before they can be selected. Resolution fails if no version in the requested range
is old enough or the registry cannot provide publication timestamps. Select an
older eligible version, adjusting the requested range if necessary, or wait until
the requested version has aged seven days. Use a registry that provides timestamps
if metadata is missing.

CI and application Docker builds use `pnpm install --frozen-lockfile`, which also
verifies the locked versions under this policy with the current pnpm toolchain.
Workspace packages use local links and do not need a registry publication date.
See pnpm's [dependency resolution settings](https://pnpm.io/settings/dependency-resolution#minimumreleaseage)
for the policy's supported sources and settings.

## Toolchain research

- [TypeScript 6 migration](docs/research/typescript-6-migration.md)
- [TypeScript 7 assessment before the migration](docs/research/typescript-7-upgrade.md)

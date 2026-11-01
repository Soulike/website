# website

The monorepo of my personal website.

## Node toolchain

[.node-version](.node-version) selects the Node major used by local development,
CI, application builders, and backend runtimes. Patch releases within that major
continue to update normally.

After changing that file, run `pnpm node:sync` to generate the Node engine minimum,
the `@types/node` catalog range, CI `setup-node` versions, Node Docker base-image
tags, and the Rolldown syntax target. Run `pnpm install` to update the lockfile,
then validate with `pnpm validate:pr` and `pnpm test`. Commit the version file,
generated changes, and lockfile together. Select an LTS major using the official
[Node release status](https://nodejs.org/en/about/previous-releases).

`pnpm node:check` detects stale generated values without rewriting files and
checks the active runtime against the selected major. CI runs it through
`pnpm validate:pr`. The matrix and image smoke jobs also check their active Node,
and backend smoke checks inspect the Node version inside the built image.
Local backend and Web builds check their runtime before compiling.

Only `.node-version` is edited by hand for a Node upgrade. Other settings in the
affected files remain hand-maintained; `node:sync` changes their Node version
fields. Generation is idempotent, and input validation completes before writes.
If generation is interrupted or a write fails, rerun it and check the diff;
`node:check` rejects any remaining partial synchronization. The sync command can
run on the previously installed Node so files can be prepared before switching
the local runtime; validation and application builds require the selected major.

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

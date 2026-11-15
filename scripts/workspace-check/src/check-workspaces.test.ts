import {mkdirSync, mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

import {afterEach, describe, expect, it} from 'vitest';

import {checkWorkspaces} from './check-workspaces.ts';

interface PackageFixture {
  dir: string;
  manifest: Record<string, unknown>;
}

const createdDirs: string[] = [];

function createWorkspaceFixture(packages: PackageFixture[]): string {
  const root = mkdtempSync(join(tmpdir(), 'workspace-check-'));
  createdDirs.push(root);
  writeFileSync(
    join(root, 'pnpm-workspace.yaml'),
    "packages:\n  - 'packages/*'\n",
  );
  writeFileSync(
    join(root, 'package.json'),
    JSON.stringify({name: 'fixture-root', private: true}),
  );
  for (const pkg of packages) {
    const pkgDir = join(root, 'packages', pkg.dir);
    mkdirSync(pkgDir, {recursive: true});
    writeFileSync(join(pkgDir, 'package.json'), JSON.stringify(pkg.manifest));
  }
  return root;
}

afterEach(() => {
  for (const dir of createdDirs.splice(0)) {
    rmSync(dir, {recursive: true, force: true});
  }
});

describe('checkWorkspaces', () => {
  it('passes when every workspace declares module type, typecheck, and lint', () => {
    const root = createWorkspaceFixture([
      {
        dir: 'pkg-a',
        manifest: {
          name: '@fixture/a',
          type: 'module',
          scripts: {typecheck: 'tsc --noEmit', lint: 'eslint ./src'},
        },
      },
      {
        dir: 'pkg-b',
        manifest: {
          name: '@fixture/b',
          type: 'module',
          scripts: {typecheck: 'tsc --noEmit', lint: 'eslint ./src'},
        },
      },
    ]);

    expect(checkWorkspaces(root)).toEqual({
      checkedCount: 2,
      issues: [],
    });
  });

  it('fails when any workspace omits lint, typecheck, or module type', () => {
    const root = createWorkspaceFixture([
      {
        dir: 'valid',
        manifest: {
          name: '@fixture/valid',
          type: 'module',
          scripts: {typecheck: 'tsc --noEmit', lint: 'eslint ./src'},
        },
      },
      {
        dir: 'missing-lint',
        manifest: {
          name: '@fixture/missing-lint',
          type: 'module',
          scripts: {typecheck: 'tsc --noEmit'},
        },
      },
      {
        dir: 'missing-typecheck',
        manifest: {
          name: '@fixture/missing-typecheck',
          type: 'module',
          scripts: {lint: 'eslint ./src'},
        },
      },
      {
        dir: 'missing-module',
        manifest: {
          name: '@fixture/missing-module',
          scripts: {typecheck: 'tsc --noEmit', lint: 'eslint ./src'},
        },
      },
    ]);

    expect(checkWorkspaces(root)).toEqual({
      checkedCount: 4,
      issues: [
        {
          workspacePath: 'packages/missing-lint',
          packageName: '@fixture/missing-lint',
          missing: ['scripts.lint'],
        },
        {
          workspacePath: 'packages/missing-module',
          packageName: '@fixture/missing-module',
          missing: ['type: "module"'],
        },
        {
          workspacePath: 'packages/missing-typecheck',
          packageName: '@fixture/missing-typecheck',
          missing: ['scripts.typecheck'],
        },
      ],
    });
  });
});

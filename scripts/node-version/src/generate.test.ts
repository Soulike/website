import {mkdir, mkdtemp, readFile, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {dirname, join} from 'node:path';
import {runInNewContext} from 'node:vm';

import {expect, test} from 'vitest';
import {parse} from 'yaml';

import {synchronizeNodeVersion} from './generate.ts';

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'node-version-generation-'));
  const files = {
    '.node-version': '28\n',
    'package.json': JSON.stringify({
      name: 'fixture',
      engines: {node: '>=24', pnpm: '>=12'},
    }),
    'pnpm-workspace.yaml':
      "# Preserve dependency policy\nminimumReleaseAge: 10080\ncatalog:\n  '@types/node': '^24.10.3'\n  typescript: '^6.0.3'\n",
    '.github/workflows/ci.yml':
      "name: CI\njobs:\n  test:\n    steps:\n      - uses: actions/setup-node@v7\n        with:\n          node-version: 'lts/*'\n          cache: pnpm\n      - run: pnpm test\n",
    'apps/server/example/Dockerfile':
      'FROM node:lts-alpine AS builder\nRUN echo keep\nFROM node:24 AS runtime\nCMD ["node", "index.mjs"]\n',
    'apps/web/example/Dockerfile':
      'FROM node:24-slim AS builder\nFROM nginx:stable-alpine AS runtime\n',
    'configs/rolldown/src/server.ts':
      "const unrelated = {target: 'node10'};\nconst serverBuildOptions = {platform: 'node', transform: {target: 'node24'}};\nserverBuildOptions;\n",
  };
  for (const [name, contents] of Object.entries(files)) {
    const path = join(root, name);
    await mkdir(dirname(path), {recursive: true});
    await writeFile(path, contents);
  }
  return {root, files};
}

test('generates every owned value from a non-default major and preserves other configuration', async () => {
  const {root} = await fixture();
  try {
    const changed = await synchronizeNodeVersion(root, true);
    expect(changed).toHaveLength(6);
    const packageJson: unknown = JSON.parse(
      await readFile(join(root, 'package.json'), 'utf8'),
    );
    expect(packageJson).toEqual({
      name: 'fixture',
      engines: {node: '>=28', pnpm: '>=12'},
    });
    const workspace = await readFile(join(root, 'pnpm-workspace.yaml'), 'utf8');
    expect(workspace).toContain('# Preserve dependency policy');
    const settings: unknown = parse(workspace);
    expect(settings).toEqual({
      minimumReleaseAge: 10080,
      catalog: {'@types/node': '^28.0.0', typescript: '^6.0.3'},
    });
    const workflow: unknown = parse(
      await readFile(join(root, '.github/workflows/ci.yml'), 'utf8'),
    );
    expect(workflow).toMatchObject({
      jobs: {
        test: {
          steps: [
            {
              uses: 'actions/setup-node@v7',
              with: {'node-version': '28', cache: 'pnpm'},
            },
            {run: 'pnpm test'},
          ],
        },
      },
    });
    expect(
      await readFile(join(root, 'apps/server/example/Dockerfile'), 'utf8'),
    ).toBe(
      'FROM node:28-alpine AS builder\nRUN echo keep\nFROM node:28 AS runtime\nCMD ["node", "index.mjs"]\n',
    );
    expect(
      await readFile(join(root, 'apps/web/example/Dockerfile'), 'utf8'),
    ).toBe(
      'FROM node:28-slim AS builder\nFROM nginx:stable-alpine AS runtime\n',
    );
    const script = await readFile(
      join(root, 'configs/rolldown/src/server.ts'),
      'utf8',
    );
    const options: unknown = runInNewContext(script);
    expect(options).toEqual({platform: 'node', transform: {target: 'node28'}});
    expect(script).toContain("unrelated = {target: 'node10'}");
    expect(await synchronizeNodeVersion(root, false)).toEqual([]);
  } finally {
    await rm(root, {recursive: true, force: true});
  }
});

test('check mode reports drift without writing any files', async () => {
  const {root, files} = await fixture();
  try {
    expect(await synchronizeNodeVersion(root, false)).toContain(
      '.github/workflows/ci.yml',
    );
    for (const [name, contents] of Object.entries(files)) {
      expect(await readFile(join(root, name), 'utf8')).toBe(contents);
    }
  } finally {
    await rm(root, {recursive: true, force: true});
  }
});

test('discovers new setup-node consumers, including steps without inputs', async () => {
  const {root} = await fixture();
  try {
    await synchronizeNodeVersion(root, true);
    const path = join(root, '.github/workflows/another.yml');
    await writeFile(
      path,
      'jobs:\n  another:\n    steps:\n      - uses: actions/setup-node@v7\n',
    );
    expect(await synchronizeNodeVersion(root, false)).toEqual([
      '.github/workflows/another.yml',
    ]);
    await synchronizeNodeVersion(root, true);
    const workflow: unknown = parse(await readFile(path, 'utf8'));
    expect(workflow).toMatchObject({
      jobs: {another: {steps: [{with: {'node-version': '28'}}]}},
    });
  } finally {
    await rm(root, {recursive: true, force: true});
  }
});

test('invalid later inputs cannot leave earlier projections partly updated', async () => {
  const {root, files} = await fixture();
  try {
    await writeFile(
      join(root, 'configs/rolldown/src/server.ts'),
      "const target = 'node24';\n",
    );
    await expect(synchronizeNodeVersion(root, true)).rejects.toThrow(
      'generated string literal',
    );
    expect(await readFile(join(root, 'package.json'), 'utf8')).toBe(
      files['package.json'],
    );
    expect(await readFile(join(root, '.github/workflows/ci.yml'), 'utf8')).toBe(
      files['.github/workflows/ci.yml'],
    );
  } finally {
    await rm(root, {recursive: true, force: true});
  }
});

import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

export const PROJECT_ROOT = fileURLToPath(
  new URL('../../../', import.meta.url),
);

export function readNodeMajor(projectRoot: string = PROJECT_ROOT): string {
  const major = readFileSync(join(projectRoot, '.node-version'), 'utf8').trim();
  if (!/^[1-9]\d*$/.test(major)) {
    throw new Error(
      '.node-version must contain a Node major version, such as 26.',
    );
  }
  return major;
}

export function nodeTarget(major: string): string {
  return `node${major}`;
}

export function assertNodeRuntime(
  expectedMajor: string = readNodeMajor(),
  actualVersion: string = process.versions.node,
): void {
  const actualMajor = actualVersion.replace(/^v/, '').split('.')[0];
  if (actualMajor === expectedMajor) {
    return;
  }
  throw new Error(
    `Expected Node ${expectedMajor}.x from .node-version, got ${actualVersion}. Switch Node versions and retry.`,
  );
}

export function assertNodeTarget(
  actualTarget: string,
  expectedMajor: string = readNodeMajor(),
): void {
  if (actualTarget === nodeTarget(expectedMajor)) {
    return;
  }
  throw new Error('The Node build target is stale. Run pnpm node:sync.');
}

import {mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

import {describe, expect, test} from 'vitest';

import {assertNodeRuntime, assertNodeTarget, readNodeMajor} from './runtime.ts';

describe('Node runtime policy', () => {
  test('accepts patch updates within the selected major', () => {
    expect(() => {
      assertNodeRuntime('26', '26.13.0');
    }).not.toThrow();
    expect(() => {
      assertNodeRuntime('26', 'v26.14.1');
    }).not.toThrow();
  });

  test('rejects older and different runtime lines', () => {
    expect(() => {
      assertNodeRuntime('26', '24.22.2');
    }).toThrow('Expected Node 26.x');
    expect(() => {
      assertNodeRuntime('26', '28.0.0');
    }).toThrow('Expected Node 26.x');
  });

  test('rejects a stale build target independently of the active runtime', () => {
    expect(() => {
      assertNodeTarget('node26', '26');
    }).not.toThrow();
    expect(() => {
      assertNodeTarget('node24', '26');
    }).toThrow('pnpm node:sync');
  });

  test('reads a concrete major and rejects moving aliases', () => {
    const root = mkdtempSync(join(tmpdir(), 'node-version-policy-'));
    try {
      writeFileSync(join(root, '.node-version'), '28\n');
      expect(readNodeMajor(root)).toBe('28');
      writeFileSync(join(root, '.node-version'), 'lts/*\n');
      expect(() => readNodeMajor(root)).toThrow('major version');
    } finally {
      rmSync(root, {recursive: true, force: true});
    }
  });
});

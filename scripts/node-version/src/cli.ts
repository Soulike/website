import {synchronizeNodeVersion} from './generate.ts';
import {assertNodeRuntime, PROJECT_ROOT} from './runtime.ts';

const args = process.argv.slice(2);
const mode = args[0] ?? '--check';
if (args.length > 1 || !['--check', '--write'].includes(mode)) {
  throw new Error('Usage: node src/cli.ts [--check | --write]');
}

try {
  const changed = await synchronizeNodeVersion(
    PROJECT_ROOT,
    mode === '--write',
  );
  if (mode === '--write') {
    console.log(
      changed.length > 0
        ? `Updated Node version projections:\n${changed.join('\n')}`
        : 'Node version projections are up to date.',
    );
  } else {
    if (changed.length > 0) {
      throw new Error(
        `Node version projections are stale:\n${changed.join('\n')}\nRun pnpm node:sync, then pnpm install.`,
      );
    }
    assertNodeRuntime();
    console.log(
      `Node version projections and runtime verified: ${process.versions.node}`,
    );
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}

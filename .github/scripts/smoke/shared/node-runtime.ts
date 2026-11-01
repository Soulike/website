import {assertNodeRuntime} from '../../../../scripts/node-version/src/runtime.ts';
import {runCommand} from './command.ts';

export function assertNodeImageRuntime(image: string): void {
  const result = runCommand('docker', [
    'run',
    '--rm',
    '--pull=never',
    '--network=none',
    '--entrypoint=node',
    image,
    '-p',
    'process.versions.node',
  ]);
  assertNodeRuntime(undefined, result.stdout.trim());
  console.log(`Node image runtime verified: ${result.stdout.trim()}`);
}

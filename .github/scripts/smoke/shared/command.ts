import {spawnSync} from 'node:child_process';

export interface CommandResult {
  status: number;
  stdout: string;
  stderr: string;
}

interface CommandOptions {
  allowFailure?: boolean;
  timeoutMs?: number;
}

export class CommandError extends Error {
  readonly command: string;
  readonly result: CommandResult;

  constructor(command: string, result: CommandResult) {
    super(
      `Command failed (${result.status}): ${command}\n${result.stderr || result.stdout}`,
    );
    this.name = 'CommandError';
    this.command = command;
    this.result = result;
  }
}

export function runCommand(
  command: string,
  args: readonly string[],
  options: CommandOptions = {},
): CommandResult {
  const renderedCommand = [command, ...args].join(' ');
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
    timeout: options.timeoutMs ?? 30_000,
  });

  if (result.error) {
    throw new Error(`Could not run ${renderedCommand}`, {cause: result.error});
  }

  const commandResult: CommandResult = {
    status: result.status ?? 1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };

  if (!options.allowFailure && commandResult.status !== 0) {
    throw new CommandError(renderedCommand, commandResult);
  }

  return commandResult;
}

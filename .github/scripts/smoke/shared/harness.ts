import {randomUUID} from 'node:crypto';
import {mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {setTimeout as delay} from 'node:timers/promises';

import {runCommand, type CommandResult} from './command.ts';
import {
  smokeDatabasePassword,
  smokeRedisPassword,
  startPostgres,
  startRedis,
  type DependencyRuntime,
  type PostgresOptions,
  type RedisOptions,
} from './dependencies.ts';
import {waitForHttp, type HttpResponse} from './http.ts';

export interface SecretMount {
  hostPath: string;
  containerPath: string;
}

interface ApplicationOptions {
  description: string;
  port: number;
  dockerArgs?: readonly string[];
}

interface ApplicationHttpOptions {
  description: string;
  path: string;
  expectedStatus: number;
  headers?: Readonly<Record<string, string>>;
  basicAuth?: readonly [username: string, password: string];
  deadlineMs?: number;
  requestTimeoutMs?: number;
}

export function requiredImageArgument(argv = process.argv): string {
  const image = argv[2];
  if (!image) throw new Error('Image tag is required.');
  return image;
}

export interface SmokeContext {
  createDatabaseSecret(): SecretMount;
  createRedisSecret(): SecretMount;
  startPostgres(options?: PostgresOptions): Promise<void>;
  startRedis(options?: RedisOptions): Promise<void>;
  startApplication(options: ApplicationOptions): void;
  waitForHttp(options: ApplicationHttpOptions): Promise<HttpResponse>;
}

class SmokeHarness implements SmokeContext {
  private readonly image: string;

  private readonly suffix: string;
  private readonly network: string;
  private readonly postgres: string;
  private readonly redis: string;
  private readonly application: string;
  private secretDirectory = '';
  private hostPort = '';

  constructor(image: string) {
    this.image = image;
    this.suffix = `${process.env.GITHUB_RUN_ID ?? 'local'}-${process.env.GITHUB_RUN_ATTEMPT ?? '1'}-${randomUUID().slice(0, 8)}`;
    this.network = `website-smoke-${this.suffix}`;
    this.postgres = `website-smoke-postgres-${this.suffix}`;
    this.redis = `website-smoke-redis-${this.suffix}`;
    this.application = `website-smoke-app-${this.suffix}`;
  }

  async run(action: (context: SmokeContext) => Promise<void>): Promise<void> {
    let failed = false;
    let failure: unknown;

    try {
      this.initialize();
      await action(this);
    } catch (error) {
      failed = true;
      failure = error;
      this.printDiagnostics();
    }

    try {
      this.cleanup();
    } catch (cleanupError) {
      if (!failed) throw cleanupError;
      console.error(cleanupError);
    }

    if (failed) throw failure;
  }

  private initialize(): void {
    this.installSignalHandlers();
    this.docker(['image', 'inspect', this.image]);
    this.docker(['network', 'create', this.network]);
  }

  private createSecret(name: string, value: string): SecretMount {
    if (!this.secretDirectory) {
      this.secretDirectory = mkdtempSync(join(tmpdir(), 'website-smoke-'));
    }
    const hostPath = join(this.secretDirectory, name);
    const containerPath = `/run/secrets/${name}`;
    writeFileSync(hostPath, value, {mode: 0o644});
    return {hostPath, containerPath};
  }

  createDatabaseSecret(): SecretMount {
    return this.createSecret('database-password', smokeDatabasePassword);
  }

  createRedisSecret(): SecretMount {
    return this.createSecret('redis-password', smokeRedisPassword);
  }

  async startPostgres({schema}: PostgresOptions = {}): Promise<void> {
    await startPostgres(this.dependencyRuntime(), {schema});
  }

  async startRedis({values = {}}: RedisOptions = {}): Promise<void> {
    await startRedis(this.dependencyRuntime(), {values});
  }

  startApplication({
    description,
    port,
    dockerArgs = [],
  }: ApplicationOptions): void {
    this.docker([
      'run',
      '--detach',
      '--name',
      this.application,
      '--network',
      this.network,
      '--publish',
      `127.0.0.1::${port}`,
      ...dockerArgs,
      this.image,
    ]);

    if (!this.applicationIsRunning()) {
      throw new Error(`${description} exited before becoming ready.`);
    }

    const portResult = this.docker(
      ['port', this.application, `${port}/tcp`],
      true,
    );
    this.hostPort = portResult.stdout.trim().split(':').at(-1) ?? '';
    if (!this.hostPort) {
      if (!this.applicationIsRunning()) {
        throw new Error(
          `${description} exited before publishing port ${port}.`,
        );
      }
      throw new Error(`${description} did not publish port ${port}.`);
    }
  }

  async waitForHttp({
    description,
    path,
    expectedStatus,
    headers,
    basicAuth,
    deadlineMs,
    requestTimeoutMs,
  }: ApplicationHttpOptions): Promise<HttpResponse> {
    if (!this.hostPort) throw new Error('Application has not been started.');
    return await waitForHttp({
      description,
      url: `http://127.0.0.1:${this.hostPort}${path}`,
      expectedStatus,
      isApplicationRunning: () => this.applicationIsRunning(),
      headers,
      basicAuth,
      deadlineMs,
      requestTimeoutMs,
    });
  }

  private printDiagnostics(): void {
    for (const container of [this.application, this.postgres, this.redis]) {
      try {
        if (!this.containerExists(container)) continue;
        console.error(`::group::${container} logs`);
        console.error(
          this.commandOutput(this.docker(['logs', container], true)),
        );
        console.error('::endgroup::');
        console.error(`::group::${container} inspect`);
        console.error(
          this.commandOutput(this.docker(['inspect', container], true)),
        );
        console.error('::endgroup::');
      } catch (error) {
        console.error(`Could not collect diagnostics for ${container}.`, error);
      }
    }
  }

  private cleanup(): void {
    const failures: unknown[] = [];
    for (const container of [this.application, this.postgres, this.redis]) {
      try {
        if (!this.containerExists(container)) continue;
        this.docker(['rm', '--force', '--volumes', container]);
      } catch (error) {
        failures.push(error);
      }
    }
    try {
      if (this.networkExists()) {
        this.docker(['network', 'rm', this.network]);
      }
    } catch (error) {
      failures.push(error);
    }
    if (this.secretDirectory) {
      try {
        rmSync(this.secretDirectory, {recursive: true, force: true});
      } catch (error) {
        failures.push(error);
      }
    }
    this.removeSignalHandlers();
    if (failures.length > 0) {
      throw new AggregateError(failures, 'Smoke cleanup failed.');
    }
  }

  private docker(
    args: readonly string[],
    allowFailure = false,
    timeoutMs = 30_000,
  ): CommandResult {
    return runCommand('docker', args, {allowFailure, timeoutMs});
  }

  private dependencyRuntime(): DependencyRuntime {
    return {
      network: this.network,
      postgres: this.postgres,
      redis: this.redis,
      runDocker: (args, allowFailure, timeoutMs) =>
        this.docker(args, allowFailure, timeoutMs),
      waitFor: async (description, predicate) =>
        await this.waitFor(description, predicate),
    };
  }

  private containerExists(name: string): boolean {
    return this.docker(['inspect', name], true, 5_000).status === 0;
  }

  private networkExists(): boolean {
    return (
      this.docker(['network', 'inspect', this.network], true, 5_000).status ===
      0
    );
  }

  private applicationIsRunning(): boolean {
    const result = this.docker(
      ['inspect', '--format', '{{.State.Running}}', this.application],
      true,
      2_000,
    );
    return result.status === 0 && result.stdout.trim() === 'true';
  }

  private commandOutput(result: CommandResult): string {
    return `${result.stdout}${result.stderr}`;
  }

  private async waitFor(
    description: string,
    predicate: () => boolean,
  ): Promise<void> {
    const deadline = performance.now() + 60_000;
    while (performance.now() < deadline) {
      if (predicate()) return;
      await delay(Math.min(1_000, Math.max(0, deadline - performance.now())));
    }
    throw new Error(`Timed out waiting for ${description}.`);
  }

  private readonly handleSigint = (): void => {
    this.exitFromSignal('SIGINT', 130);
  };

  private readonly handleSigterm = (): void => {
    this.exitFromSignal('SIGTERM', 143);
  };

  private installSignalHandlers(): void {
    process.once('SIGINT', this.handleSigint);
    process.once('SIGTERM', this.handleSigterm);
  }

  private removeSignalHandlers(): void {
    process.off('SIGINT', this.handleSigint);
    process.off('SIGTERM', this.handleSigterm);
  }

  private exitFromSignal(signal: NodeJS.Signals, exitCode: number): never {
    console.error(`Received ${signal}; cleaning smoke resources.`);
    try {
      this.printDiagnostics();
      this.cleanup();
    } catch (error) {
      console.error(error);
    }
    process.exit(exitCode);
  }
}

export async function withSmokeHarness(
  image: string,
  action: (harness: SmokeContext) => Promise<void>,
): Promise<void> {
  await new SmokeHarness(image).run(action);
}

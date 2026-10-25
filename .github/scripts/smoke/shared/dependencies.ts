import type {CommandResult} from './command.ts';

export const smokeDatabasePassword = 'smoke-database-password';
export const smokeRedisPassword = 'smoke-redis-password';

export interface DependencyRuntime {
  readonly network: string;
  readonly postgres: string;
  readonly redis: string;
  runDocker(
    args: readonly string[],
    allowFailure?: boolean,
    timeoutMs?: number,
  ): CommandResult;
  waitFor(description: string, predicate: () => boolean): Promise<void>;
}

export interface PostgresOptions {
  schema?: string;
}

export interface RedisOptions {
  values?: Readonly<Record<string, string>>;
}

function output(result: CommandResult): string {
  return `${result.stdout}${result.stderr}`;
}

export async function startPostgres(
  runtime: DependencyRuntime,
  {schema}: PostgresOptions = {},
): Promise<void> {
  const args = [
    'run',
    '--detach',
    '--name',
    runtime.postgres,
    '--network',
    runtime.network,
    '--network-alias',
    'db',
    '--env',
    'POSTGRES_USER=soulike',
    '--env',
    'POSTGRES_DB=website',
    '--env',
    `POSTGRES_PASSWORD=${smokeDatabasePassword}`,
  ];
  if (schema) {
    args.push(
      '--volume',
      `${schema}:/docker-entrypoint-initdb.d/database.sql:ro`,
    );
  }
  args.push('postgres:16-alpine');
  runtime.runDocker(args, false, 180_000);

  await runtime.waitFor('Postgres initialization', () =>
    output(runtime.runDocker(['logs', runtime.postgres], true, 5_000)).includes(
      'PostgreSQL init process complete',
    ),
  );
  await runtime.waitFor(
    'Postgres readiness',
    () =>
      runtime.runDocker(
        [
          'exec',
          runtime.postgres,
          'pg_isready',
          '--username',
          'soulike',
          '--dbname',
          'website',
        ],
        true,
        5_000,
      ).status === 0,
  );

  if (schema) {
    await runtime.waitFor(
      'database schema readiness',
      () =>
        runtime.runDocker(
          [
            'exec',
            runtime.postgres,
            'psql',
            '--username',
            'soulike',
            '--dbname',
            'website',
            '--tuples-only',
            '--command',
            'SELECT count(*) FROM "categories";',
          ],
          true,
          5_000,
        ).status === 0,
    );
  }
}

export async function startRedis(
  runtime: DependencyRuntime,
  {values = {}}: RedisOptions = {},
): Promise<void> {
  runtime.runDocker(
    [
      'run',
      '--detach',
      '--name',
      runtime.redis,
      '--network',
      runtime.network,
      '--network-alias',
      'redis',
      'redis:alpine',
      'redis-server',
      '--requirepass',
      smokeRedisPassword,
    ],
    false,
    180_000,
  );

  await runtime.waitFor(
    'Redis readiness',
    () =>
      runtime.runDocker(
        [
          'exec',
          runtime.redis,
          'redis-cli',
          '--no-auth-warning',
          '--pass',
          smokeRedisPassword,
          'ping',
        ],
        true,
        5_000,
      ).status === 0,
  );

  for (const [key, value] of Object.entries(values)) {
    runtime.runDocker([
      'exec',
      runtime.redis,
      'redis-cli',
      '--no-auth-warning',
      '--pass',
      smokeRedisPassword,
      'set',
      key,
      value,
    ]);
  }
}

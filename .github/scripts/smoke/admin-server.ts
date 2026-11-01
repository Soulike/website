import {requiredImageArgument, withSmokeHarness} from './shared/harness.ts';
import {
  databaseFixtureDockerArgs,
  smokeLegacyDatabaseClient,
} from './shared/legacy-database-client.ts';
import {assertNodeImageRuntime} from './shared/node-runtime.ts';

const image = requiredImageArgument();
assertNodeImageRuntime(image);

await withSmokeHarness(image, async (smoke) => {
  const redisSecret = smoke.createRedisSecret();

  await smoke.startRedis({
    values: {'smoke-session': JSON.stringify({username: 'smoke'})},
  });
  smoke.startApplication({
    description: 'Admin server',
    port: 4003,
    dockerArgs: [
      ...databaseFixtureDockerArgs,
      '--env',
      `REDIS_PASSWORD_FILE=${redisSecret.containerPath}`,
      '--volume',
      `${redisSecret.hostPath}:${redisSecret.containerPath}:ro`,
    ],
  });

  // A valid Redis session reaches the unmatched route; session rejection does not.
  await smoke.waitForHttp({
    description: 'Admin server HTTP readiness',
    path: '/smoke-not-found',
    expectedStatus: 404,
    headers: {cookie: 'sess=smoke-session'},
  });
  await smokeLegacyDatabaseClient(smoke, '/blog/article/getById', {
    cookie: 'sess=smoke-session',
  });
});

console.log(`Smoke passed for ${image}.`);

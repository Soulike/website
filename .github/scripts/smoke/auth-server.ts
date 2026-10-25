import assert from 'node:assert/strict';

import {requiredImageArgument, withSmokeHarness} from './shared/harness.ts';

const image = requiredImageArgument();

await withSmokeHarness(image, async (smoke) => {
  const databaseSecret = smoke.createDatabaseSecret();
  const redisSecret = smoke.createRedisSecret();

  await smoke.startPostgres();
  await smoke.startRedis({
    values: {'smoke-session': JSON.stringify({username: 'smoke'})},
  });
  smoke.startApplication({
    description: 'Auth server',
    port: 3000,
    dockerArgs: [
      '--env',
      `DB_PASSWORD_FILE=${databaseSecret.containerPath}`,
      '--volume',
      `${databaseSecret.hostPath}:${databaseSecret.containerPath}:ro`,
      '--env',
      `REDIS_PASSWORD_FILE=${redisSecret.containerPath}`,
      '--volume',
      `${redisSecret.hostPath}:${redisSecret.containerPath}:ro`,
    ],
  });

  const response = await smoke.waitForHttp({
    description: 'Auth server HTTP readiness',
    path: '/session',
    expectedStatus: 200,
    headers: {cookie: 'sess=smoke-session'},
  });
  const body: unknown = JSON.parse(response.body);
  assert(body && typeof body === 'object');
  assert.equal(Reflect.get(body, 'username'), 'smoke');
});

console.log(`Smoke passed for ${image}.`);

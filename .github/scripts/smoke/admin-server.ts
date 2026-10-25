import {requiredImageArgument, withSmokeHarness} from './shared/harness.ts';

const image = requiredImageArgument();

await withSmokeHarness(image, async (smoke) => {
  const redisSecret = smoke.createRedisSecret();

  await smoke.startRedis({
    values: {'smoke-session': JSON.stringify({username: 'smoke'})},
  });
  smoke.startApplication({
    description: 'Admin server',
    port: 4003,
    dockerArgs: [
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
});

console.log(`Smoke passed for ${image}.`);

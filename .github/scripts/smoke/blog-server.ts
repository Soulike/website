import {requiredImageArgument, withSmokeHarness} from './shared/harness.ts';
import {
  databaseFixtureDockerArgs,
  smokeLegacyDatabaseClient,
} from './shared/legacy-database-client.ts';

const image = requiredImageArgument();

await withSmokeHarness(image, async (smoke) => {
  smoke.startApplication({
    description: 'Blog server',
    port: 4004,
    dockerArgs: databaseFixtureDockerArgs,
  });
  await smoke.waitForHttp({
    description: 'Blog server HTTP readiness',
    path: '/smoke-not-found',
    expectedStatus: 404,
  });
  await smokeLegacyDatabaseClient(smoke, '/article/getById');
});

console.log(`Smoke passed for ${image}.`);

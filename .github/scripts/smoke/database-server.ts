import assert from 'node:assert/strict';
import {resolve} from 'node:path';

import {requiredImageArgument, withSmokeHarness} from './shared/harness.ts';

const image = requiredImageArgument();

await withSmokeHarness(image, async (smoke) => {
  const databaseSecret = smoke.createDatabaseSecret();

  await smoke.startPostgres({
    schema: resolve('apps/server/database-legacy/src/Database/database.sql'),
  });
  smoke.startApplication({
    description: 'Database server',
    port: 4000,
    dockerArgs: [
      '--env',
      `DB_PASSWORD_FILE=${databaseSecret.containerPath}`,
      '--volume',
      `${databaseSecret.hostPath}:${databaseSecret.containerPath}:ro`,
    ],
  });

  const response = await smoke.waitForHttp({
    description: 'Database server HTTP readiness',
    path: '/category/getAll',
    expectedStatus: 200,
    basicAuth: ['Soulike', 'Soulike@Database'],
  });
  const body: unknown = JSON.parse(response.body);
  assert(body && typeof body === 'object');
  assert.equal(Reflect.get(body, 'isSuccessful'), true);
  assert.deepEqual(Reflect.get(body, 'data'), []);
});

console.log(`Smoke passed for ${image}.`);

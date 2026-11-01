import assert from 'node:assert/strict';

import type {SmokeContext} from './harness.ts';

// The upstream fixture shares the application process and its cleanup lifecycle.
const databaseFixture = `
import {createServer} from "node:http";
const server = createServer((request, response) => {
  const url = new URL(request.url, "http://database-server");
  const query = JSON.parse(url.searchParams.get("json") ?? "{}");
  response.setHeader("content-type", "application/json");
  if (query.id === 1) {
    response.end("{");
    return;
  }
  if (query.id === 2) {
    response.end("");
    return;
  }
  if (query.id === 4) {
    response.statusCode = 401;
    response.end("Unauthorized");
    return;
  }
  response.end(JSON.stringify({
    isSuccessful: false,
    message: "fixture database failure",
  }));
});
await new Promise((resolve) => server.listen(4000, "127.0.0.1", resolve));
`;

export const databaseFixtureDockerArgs: readonly string[] = [
  '--add-host',
  'database-server:127.0.0.1',
  '--env',
  `NODE_OPTIONS=--import=data:text/javascript,${encodeURIComponent(databaseFixture)}`,
];

export async function smokeLegacyDatabaseClient(
  smoke: SmokeContext,
  articlePath: string,
  headers?: Readonly<Record<string, string>>,
): Promise<void> {
  for (const id of [1, 2, 4]) {
    const response = await smoke.waitForHttp({
      description: `Database response failure for article ${id}`,
      path: `${articlePath}?json=${encodeURIComponent(JSON.stringify({id}))}`,
      expectedStatus: 500,
      headers,
      deadlineMs: 5_000,
    });
    assert.equal(response.body, 'Internal Server Error');
  }

  const businessFailure = await smoke.waitForHttp({
    description: 'Database business failure',
    path: `${articlePath}?json=${encodeURIComponent(JSON.stringify({id: 3}))}`,
    expectedStatus: 200,
    headers,
    deadlineMs: 5_000,
  });
  assert.deepEqual(JSON.parse(businessFailure.body), {
    isSuccessful: false,
    message: 'fixture database failure',
  });

  const invalidQuery = await smoke.waitForHttp({
    description: 'Invalid client JSON query',
    path: `${articlePath}?json=%7B`,
    expectedStatus: 400,
    headers,
    deadlineMs: 5_000,
  });
  assert.deepEqual(JSON.parse(invalidQuery.body), {
    isSuccessful: false,
    message: '请求参数错误',
  });
}

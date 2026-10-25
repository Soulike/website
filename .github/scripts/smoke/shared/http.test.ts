import assert from 'node:assert/strict';
import {createServer, type Server} from 'node:http';
import test from 'node:test';

import {waitForHttp} from './http.ts';

async function listen(server: Server): Promise<string> {
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve());
  });
  const address = server.address();
  assert(address && typeof address === 'object');
  return `http://127.0.0.1:${address.port}`;
}

async function close(server: Server): Promise<void> {
  server.closeAllConnections();
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

test('returns the expected HTTP response', async () => {
  const server = createServer((_request, response) => {
    response.writeHead(200, {'content-type': 'text/html'});
    response.end('<!doctype html><html></html>');
  });

  try {
    const url = await listen(server);
    const response = await waitForHttp({
      description: 'test server',
      url,
      expectedStatus: 200,
      isApplicationRunning: () => true,
      deadlineMs: 1_000,
      requestTimeoutMs: 500,
    });

    assert.equal(response.status, 200);
    assert.match(response.body, /<!doctype html>/i);
  } finally {
    await close(server);
  }
});

test('bounds a response that never completes', {timeout: 5_000}, async () => {
  const {promise: partialResponseSent, resolve: markPartialResponseSent} =
    Promise.withResolvers<void>();
  const server = createServer((_request, response) => {
    response.writeHead(200, {'content-type': 'text/plain'});
    response.write('partial response');
    markPartialResponseSent();
    // Keep the body open to reproduce a stalled application.
  });

  try {
    const url = await listen(server);
    const startedAt = performance.now();
    const waiting = waitForHttp({
      description: 'stalled server',
      url,
      expectedStatus: 200,
      isApplicationRunning: () => true,
      deadlineMs: 1_000,
      requestTimeoutMs: 1_000,
    });

    await Promise.race([
      partialResponseSent,
      waiting.then(
        () => {
          throw new Error(
            'HTTP wait completed before the partial response was sent.',
          );
        },
        (error: unknown) => {
          throw new Error(
            'HTTP wait failed before the partial response was sent.',
            {cause: error},
          );
        },
      ),
    ]);

    await assert.rejects(waiting, (error: unknown) => {
      assert(error instanceof Error);
      assert.match(error.message, /Timed out waiting for stalled server/);
      assert.match(error.message, /last HTTP status: 200/);
      assert.match(error.message, /partial response/);
      return true;
    });

    const elapsedMs = performance.now() - startedAt;
    assert(elapsedMs >= 750, `deadline fired too early: ${elapsedMs}ms`);
    assert(elapsedMs < 3_000, `deadline was not bounded: ${elapsedMs}ms`);
  } finally {
    await close(server);
  }
});

test('does not request after the running-state check exhausts the deadline', async (context) => {
  let fetchCalls = 0;
  context.mock.method(globalThis, 'fetch', async () => {
    fetchCalls += 1;
    throw new Error('fetch should not be called');
  });

  const waitArray = new Int32Array(
    new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT),
  );

  await assert.rejects(
    waitForHttp({
      description: 'expired-budget server',
      url: 'http://127.0.0.1:1',
      expectedStatus: 200,
      isApplicationRunning: () => {
        Atomics.wait(waitArray, 0, 0, 20);
        return true;
      },
      deadlineMs: 5,
      requestTimeoutMs: 500,
    }),
    /Timed out waiting for expired-budget server/,
  );

  assert.equal(fetchCalls, 0);
});

test('does not follow redirects when checking a status oracle', async () => {
  const server = createServer((request, response) => {
    if (request.url === '/redirect') {
      response.writeHead(302, {location: '/missing'});
      response.end();
      return;
    }
    response.writeHead(404);
    response.end('missing');
  });

  try {
    const url = await listen(server);
    const response = await waitForHttp({
      description: 'redirecting server',
      url: `${url}/redirect`,
      expectedStatus: 302,
      isApplicationRunning: () => true,
      deadlineMs: 1_000,
      requestTimeoutMs: 500,
    });

    assert.equal(response.status, 302);
  } finally {
    await close(server);
  }
});

test('fails immediately when the application exits', async () => {
  await assert.rejects(
    waitForHttp({
      description: 'exited server',
      url: 'http://127.0.0.1:1',
      expectedStatus: 200,
      isApplicationRunning: () => false,
      deadlineMs: 1_000,
    }),
    /exited server exited before becoming ready/,
  );
});

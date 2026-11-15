import assert from 'node:assert/strict';
import {once} from 'node:events';
import {mkdtemp, rm, writeFile} from 'node:fs/promises';
import {type Server} from 'node:http';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

import Router from '@koa/router';
import {errorHandling} from '@library/koa-middlewares';
import Koa from 'koa';
import {koaBody} from 'koa-body';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

const database = vi.hoisted(() => ({
  query: vi.fn(),
  clientQuery: vi.fn(),
  release: vi.fn(),
}));

const logger = vi.hoisted(() => ({
  warn: vi.fn(),
  error: vi.fn(),
}));

vi.mock('signale', () => ({
  default: logger,
}));

vi.mock('pg', () => ({
  Pool: class {
    query = database.query;

    connect() {
      return Promise.resolve({
        query: database.clientQuery,
        release: database.release,
      });
    }
  },
}));

let secretDirectory: string | undefined;
let server: Server | undefined;
let baseUrl: string;

beforeAll(async () => {
  secretDirectory = await mkdtemp(join(tmpdir(), 'user-route-'));
  const passwordFile = join(secretDirectory, 'database-password');
  await writeFile(passwordFile, 'unused-test-password', {mode: 0o600});
  vi.stubEnv('DB_PASSWORD_FILE', passwordFile);

  const [{default: userDispatcher}, {BODY}] = await Promise.all([
    import('./Dispatcher.js'),
    import('../../CONFIG/index.js'),
  ]);
  const router = new Router();
  userDispatcher(router);
  const app = new Koa();
  app.use(errorHandling());
  app.use(koaBody(BODY));
  app.use(router.routes());
  app.use(router.allowedMethods());
  server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  assert(typeof address === 'object' && address !== null);
  baseUrl = `http://127.0.0.1:${address.port}`;
});

afterAll(async () => {
  try {
    if (server) {
      const activeServer = server;
      await new Promise<void>((resolve, reject) => {
        activeServer.close((error) => {
          if (error) reject(error);
          else resolve();
        });
        activeServer.closeAllConnections();
      });
    }
  } finally {
    vi.unstubAllEnvs();
    if (secretDirectory !== undefined) {
      await rm(secretDirectory, {recursive: true, force: true});
    }
  }
});

beforeEach(() => {
  database.query.mockReset().mockRejectedValue(new Error('Unexpected query'));
  database.clientQuery.mockReset().mockResolvedValue({rows: [], rowCount: 0});
  database.release.mockReset();
  logger.warn.mockReset();
  logger.error.mockReset();
});

async function getRequest(path: string, json?: string) {
  const url = new URL(path, baseUrl);
  if (json !== undefined) url.searchParams.set('json', json);
  const response = await fetch(url, {signal: AbortSignal.timeout(1_000)});
  const body: unknown =
    response.headers.get('content-type')?.includes('application/json') === true
      ? await response.json()
      : await response.text();
  return {status: response.status, body};
}

async function postRequest(path: string, payload: unknown) {
  const response = await fetch(new URL(path, baseUrl), {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(1_000),
  });
  const body: unknown =
    response.headers.get('content-type')?.includes('application/json') === true
      ? await response.json()
      : await response.text();
  return {status: response.status, body};
}

describe('User RPC endpoints', () => {
  it('returns early without querying database on invalid POST /user/add, GET /user/get, and POST /user/modify params', async () => {
    expect(
      await postRequest('/user/add', {username: ' alice ', password: 'secret'}),
    ).toEqual({
      status: 200,
      body: {isSuccessful: false, error: {code: 'INVALID_REQUEST_PARAMS'}},
    });
    expect(await getRequest('/user/get', '{"username":""}')).toEqual({
      status: 200,
      body: {isSuccessful: false, error: {code: 'INVALID_REQUEST_PARAMS'}},
    });
    expect(await postRequest('/user/modify', {username: 'alice'})).toEqual({
      status: 200,
      body: {isSuccessful: false, error: {code: 'INVALID_REQUEST_PARAMS'}},
    });
    expect(database.query).not.toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalledTimes(3);
  });

  it('handles valid User add, get, and modify flows with structured error codes and data: null', async () => {
    database.query.mockResolvedValueOnce({rows: [{c: '1'}]});
    expect(
      await postRequest('/user/add', {username: 'alice', password: 'secret'}),
    ).toEqual({
      status: 200,
      body: {isSuccessful: false, error: {code: 'ACCOUNT_ALREADY_EXISTS'}},
    });

    database.query.mockResolvedValueOnce({rows: [{c: '0'}]});
    expect(
      await postRequest('/user/add', {username: 'alice', password: 'secret'}),
    ).toEqual({
      status: 200,
      body: {isSuccessful: true, data: null},
    });

    database.query.mockResolvedValueOnce({rows: [], rowCount: 0});
    expect(await getRequest('/user/get', '{"username":"alice"}')).toEqual({
      status: 200,
      body: {isSuccessful: false, error: {code: 'ACCOUNT_NOT_FOUND'}},
    });

    database.query.mockResolvedValueOnce({
      rows: [{username: 'alice', password: 'secret'}],
      rowCount: 1,
    });
    expect(await getRequest('/user/get', '{"username":"alice"}')).toEqual({
      status: 200,
      body: {
        isSuccessful: true,
        data: {username: 'alice', password: 'secret'},
      },
    });

    database.query.mockResolvedValueOnce({rows: [{c: '0'}]});
    expect(
      await postRequest('/user/modify', {
        username: 'alice',
        password: 'updated',
      }),
    ).toEqual({
      status: 200,
      body: {isSuccessful: false, error: {code: 'ACCOUNT_NOT_FOUND'}},
    });

    database.query.mockResolvedValueOnce({rows: [{c: '1'}]});
    expect(
      await postRequest('/user/modify', {
        username: 'alice',
        password: 'updated',
      }),
    ).toEqual({
      status: 200,
      body: {isSuccessful: true, data: null},
    });
  });
});

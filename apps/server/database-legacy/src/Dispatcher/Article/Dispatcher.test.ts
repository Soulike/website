import assert from 'node:assert/strict';
import {once} from 'node:events';
import {mkdtemp, rm, writeFile} from 'node:fs/promises';
import {type Server} from 'node:http';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

import Router from '@koa/router';
import {errorHandling} from '@library/koa-middlewares';
import Koa from 'koa';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

const database = vi.hoisted(() => ({query: vi.fn()}));

vi.mock('pg', () => ({
  Pool: class {
    query = database.query;

    connect() {
      return Promise.resolve({
        query(_text: string, callback: (error: null) => void) {
          callback(null);
        },
        release: vi.fn(),
      });
    }
  },
}));

let secretDirectory: string | undefined;
let server: Server | undefined;
let baseUrl: string;

beforeAll(async () => {
  secretDirectory = await mkdtemp(join(tmpdir(), 'article-date-route-'));
  const passwordFile = join(secretDirectory, 'database-password');
  await writeFile(passwordFile, 'unused-test-password', {mode: 0o600});
  vi.stubEnv('DB_PASSWORD_FILE', passwordFile);

  const {default: articleDispatcher} = await import('./Dispatcher.js');
  const router = new Router();
  articleDispatcher(router);
  const app = new Koa();
  app.use(errorHandling());
  app.use(router.routes());
  app.use(router.allowedMethods());
  server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  assert(address && typeof address === 'object');
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
    if (secretDirectory) {
      await rm(secretDirectory, {recursive: true, force: true});
    }
  }
});

beforeEach(() => {
  database.query.mockReset().mockRejectedValue(new Error('Unexpected query'));
});

async function getByDate(json?: string) {
  const url = new URL('/article/getByDate', baseUrl);
  if (json !== undefined) url.searchParams.set('json', json);
  const response = await fetch(url, {signal: AbortSignal.timeout(1_000)});
  const body: unknown = response.headers
    .get('content-type')
    ?.includes('application/json')
    ? await response.json()
    : await response.text();
  return {status: response.status, body};
}

describe('GET /article/getByDate', () => {
  it('returns articles for a valid leap day using all three date fields', async () => {
    const article = {
      id: 1,
      title: 'Leap day',
      content: 'Published on leap day',
      category: 1,
      publicationTime: '2024-02-29T12:00:00.000Z',
      modificationTime: '2024-02-29T12:00:00.000Z',
      pageViews: 0,
      isVisible: true,
    };
    database.query.mockResolvedValue({rows: [article]});

    expect(await getByDate('{"year":2024,"month":2,"day":29}')).toEqual({
      status: 200,
      body: {isSuccessful: true, data: [article]},
    });
    expect(database.query).toHaveBeenCalledExactlyOnceWith(
      expect.any(String),
      [2024, 2, 29],
    );
  });

  it.each([
    ['year', {year: 2024}, [2024]],
    ['year and month', {year: 2024, month: 2}, [2024, 2]],
    ['ordinary date', {year: 2026, month: 11, day: 3}, [2026, 11, 3]],
  ])(
    'returns an empty result for a valid %s with no matching articles',
    async (_label, query, parameters) => {
      database.query.mockResolvedValue({rows: []});

      expect(await getByDate(JSON.stringify(query))).toEqual({
        status: 200,
        body: {isSuccessful: true, data: []},
      });
      expect(database.query).toHaveBeenCalledExactlyOnceWith(
        expect.any(String),
        parameters,
      );
    },
  );

  it.each([
    {year: 2025, month: 2, day: 29},
    {year: 2024, month: 4, day: 31},
    {year: 2024, month: 2, day: 0},
    {year: 2024, month: 13, day: 1},
    {year: 2024, month: 0, day: 1},
    {year: 2024, month: 13},
    {year: 2024, month: 0},
  ])(
    'rejects an invalid calendar query %j without querying the database',
    async (query) => {
      expect(await getByDate(JSON.stringify(query))).toEqual({
        status: 200,
        body: {isSuccessful: false, message: '日期无效'},
      });
      expect(database.query).not.toHaveBeenCalled();
    },
  );

  it.each([{}, {year: '2024'}])(
    'rejects a missing or nonnumeric year %j',
    async (query) => {
      expect(await getByDate(JSON.stringify(query))).toEqual({
        status: 200,
        body: {isSuccessful: false, message: '请求参数错误'},
      });
      expect(database.query).not.toHaveBeenCalled();
    },
  );

  it.each([undefined, '{'])(
    'rejects a missing or malformed JSON query %s',
    async (json) => {
      expect(await getByDate(json)).toEqual({
        status: 400,
        body: {isSuccessful: false, message: '请求参数错误'},
      });
      expect(database.query).not.toHaveBeenCalled();
    },
  );

  it('keeps database failures distinct from invalid dates', async () => {
    database.query.mockRejectedValue(new Error('Database unavailable'));

    expect(await getByDate('{"year":2024,"month":2,"day":29}')).toEqual({
      status: 500,
      body: 'Internal Server Error',
    });
  });

  it('rejects a fractional year before querying the database', async () => {
    expect(await getByDate('{"year":2024.5}')).toEqual({
      status: 200,
      body: {isSuccessful: false, message: '日期无效'},
    });
    expect(database.query).not.toHaveBeenCalled();
  });

  it.each([
    '{"year":2024,"month":2.5}',
    '{"year":2024,"month":2.5,"day":1}',
    '{"year":2024,"month":2,"day":1.5}',
    '{"year":1e400}',
    '{"year":2024,"month":1e400}',
    '{"year":2024,"month":2,"day":1e400}',
  ])(
    'rejects noninteger date fields in %s without querying the database',
    async (json) => {
      expect(await getByDate(json)).toEqual({
        status: 200,
        body: {isSuccessful: false, message: '日期无效'},
      });
      expect(database.query).not.toHaveBeenCalled();
    },
  );

  it.each([
    {year: 2024, month: '2'},
    {year: 2024, month: null},
    {year: 2024, month: 2, day: '29'},
    {year: 2024, month: 2, day: null},
    {year: 2024, day: 29},
  ])('rejects malformed optional date fields in %j', async (query) => {
    expect(await getByDate(JSON.stringify(query))).toEqual({
      status: 200,
      body: {isSuccessful: false, message: '请求参数错误'},
    });
    expect(database.query).not.toHaveBeenCalled();
  });

  it('rejects a null query as invalid parameters', async () => {
    expect(await getByDate('null')).toEqual({
      status: 200,
      body: {isSuccessful: false, message: '请求参数错误'},
    });
    expect(database.query).not.toHaveBeenCalled();
  });
});

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
  secretDirectory = await mkdtemp(join(tmpdir(), 'article-route-'));
  const passwordFile = join(secretDirectory, 'database-password');
  await writeFile(passwordFile, 'unused-test-password', {mode: 0o600});
  vi.stubEnv('DB_PASSWORD_FILE', passwordFile);

  const [{default: articleDispatcher}, {BODY}] = await Promise.all([
    import('./Dispatcher.js'),
    import('../../CONFIG/index.js'),
  ]);
  const router = new Router();
  articleDispatcher(router);
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

function getByDate(json?: string) {
  return getRequest('/article/getByDate', json);
}

const sampleDate = new Date('2024-02-29T12:00:00.000Z');
const sampleDbRow = {
  id: 1,
  title: 'Leap day',
  content: 'Published on leap day',
  category: 1,
  publicationTime: sampleDate,
  modificationTime: sampleDate,
  pageViews: 0,
  isVisible: true,
};
const sampleSerializedArticle = {
  id: 1,
  title: 'Leap day',
  content: 'Published on leap day',
  category: 1,
  publicationTime: '2024-02-29T12:00:00.000Z',
  modificationTime: '2024-02-29T12:00:00.000Z',
  pageViews: 0,
  isVisible: true,
};

describe('GET /article/getByDate', () => {
  it('returns articles with ISO datetime strings for a valid leap day using all three date fields', async () => {
    database.query.mockResolvedValue({rows: [sampleDbRow]});

    expect(await getByDate('{"year":2024,"month":2,"day":29}')).toEqual({
      status: 200,
      body: {isSuccessful: true, data: [sampleSerializedArticle]},
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
    'rejects an invalid calendar query %j with INVALID_DATE without querying the database',
    async (query) => {
      expect(await getByDate(JSON.stringify(query))).toEqual({
        status: 200,
        body: {isSuccessful: false, error: {code: 'INVALID_DATE'}},
      });
      expect(database.query).not.toHaveBeenCalled();
    },
  );

  it.each([{}, {year: '2024'}])(
    'rejects a missing or nonnumeric year %j with INVALID_REQUEST_PARAMS',
    async (query) => {
      expect(await getByDate(JSON.stringify(query))).toEqual({
        status: 200,
        body: {isSuccessful: false, error: {code: 'INVALID_REQUEST_PARAMS'}},
      });
      expect(database.query).not.toHaveBeenCalled();
    },
  );

  it.each([undefined, '{'])(
    'rejects a missing or malformed JSON query %s with INVALID_REQUEST_PARAMS',
    async (json) => {
      expect(await getByDate(json)).toEqual({
        status: 400,
        body: {isSuccessful: false, error: {code: 'INVALID_REQUEST_PARAMS'}},
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
      body: {isSuccessful: false, error: {code: 'INVALID_DATE'}},
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
        body: {isSuccessful: false, error: {code: 'INVALID_DATE'}},
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
      body: {isSuccessful: false, error: {code: 'INVALID_REQUEST_PARAMS'}},
    });
    expect(database.query).not.toHaveBeenCalled();
  });

  it('rejects a null query as invalid parameters', async () => {
    expect(await getByDate('null')).toEqual({
      status: 200,
      body: {isSuccessful: false, error: {code: 'INVALID_REQUEST_PARAMS'}},
    });
    expect(database.query).not.toHaveBeenCalled();
  });
});

describe('Article RPC endpoints', () => {
  it('serializes Date timestamps to ISO strings on GET /article/getAll and GET /article/get', async () => {
    database.query.mockResolvedValue({rows: [sampleDbRow]});

    expect(await getRequest('/article/getAll')).toEqual({
      status: 200,
      body: {isSuccessful: true, data: [sampleSerializedArticle]},
    });

    expect(await getRequest('/article/get', '{"id":1}')).toEqual({
      status: 200,
      body: {isSuccessful: true, data: [sampleSerializedArticle]},
    });
    expect(database.query).toHaveBeenLastCalledWith(
      expect.stringContaining('"id"=$1'),
      [1],
    );
  });

  it.each([{}, {unknownField: 1}, {id: -1}, {id: '1'}])(
    'rejects invalid or non-whitelisted filter %j on GET /article/get and GET /article/count without querying DB',
    async (filter) => {
      const getResponse = await getRequest(
        '/article/get',
        JSON.stringify(filter),
      );
      expect(getResponse).toEqual({
        status: 200,
        body: {isSuccessful: false, error: {code: 'INVALID_REQUEST_PARAMS'}},
      });
      expect(
        'details' in
          (getResponse.body as {error: Record<string, unknown>}).error,
      ).toBe(false);

      const countResponse = await getRequest(
        '/article/count',
        JSON.stringify(filter),
      );
      expect(countResponse).toEqual({
        status: 200,
        body: {isSuccessful: false, error: {code: 'INVALID_REQUEST_PARAMS'}},
      });
      expect(database.query).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
    },
  );

  it('validates POST /article/add, returns data: null on success, and maps domain errors', async () => {
    const invalidResponse = await postRequest('/article/add', {
      title: '   ',
      content: 'Hello',
      category: 1,
      isVisible: true,
    });
    expect(invalidResponse).toEqual({
      status: 200,
      body: {isSuccessful: false, error: {code: 'INVALID_REQUEST_PARAMS'}},
    });
    expect(database.query).not.toHaveBeenCalled();

    database.query.mockResolvedValueOnce({rows: [{c: '0'}]});
    expect(
      await postRequest('/article/add', {
        title: 'Hello',
        content: 'Body',
        category: 99,
        isVisible: true,
      }),
    ).toEqual({
      status: 200,
      body: {isSuccessful: false, error: {code: 'ARTICLE_CATEGORY_NOT_FOUND'}},
    });

    database.query
      .mockResolvedValueOnce({rows: [{c: '1'}]})
      .mockResolvedValueOnce({rows: [{c: '1'}]});
    expect(
      await postRequest('/article/add', {
        title: 'Existing',
        content: 'Body',
        category: 1,
        isVisible: true,
      }),
    ).toEqual({
      status: 200,
      body: {
        isSuccessful: false,
        error: {code: 'ARTICLE_TITLE_ALREADY_EXISTS'},
      },
    });

    database.query
      .mockResolvedValueOnce({rows: [{c: '1'}]})
      .mockResolvedValueOnce({rows: [{c: '0'}]});
    expect(
      await postRequest('/article/add', {
        title: 'New title',
        content: 'Body',
        category: 1,
        isVisible: true,
      }),
    ).toEqual({
      status: 200,
      body: {isSuccessful: true, data: null},
    });
  });

  it('rejects empty modify payload on POST /article/modify and returns ARTICLE_NOT_FOUND / data: null appropriately', async () => {
    expect(await postRequest('/article/modify', {id: 1})).toEqual({
      status: 200,
      body: {isSuccessful: false, error: {code: 'INVALID_REQUEST_PARAMS'}},
    });
    expect(database.query).not.toHaveBeenCalled();

    database.query.mockResolvedValueOnce({rows: [], rowCount: 0});
    expect(
      await postRequest('/article/modify', {id: 1, title: 'Updated'}),
    ).toEqual({
      status: 200,
      body: {isSuccessful: false, error: {code: 'ARTICLE_NOT_FOUND'}},
    });

    database.query.mockResolvedValueOnce({rows: [sampleDbRow], rowCount: 1});
    expect(
      await postRequest('/article/modify', {id: 1, title: 'Updated'}),
    ).toEqual({
      status: 200,
      body: {isSuccessful: true, data: null},
    });
  });

  it('returns data: null on POST /article/deleteById and POST /article/addPageView, or ARTICLE_NOT_FOUND', async () => {
    database.query.mockResolvedValueOnce({rows: [{c: '0'}]});
    expect(await postRequest('/article/deleteById', {id: 1})).toEqual({
      status: 200,
      body: {isSuccessful: false, error: {code: 'ARTICLE_NOT_FOUND'}},
    });

    database.query.mockResolvedValueOnce({rows: [{c: '1'}]});
    expect(await postRequest('/article/deleteById', {id: 1})).toEqual({
      status: 200,
      body: {isSuccessful: true, data: null},
    });

    database.query.mockResolvedValueOnce({rows: [], rowCount: 0});
    expect(await postRequest('/article/addPageView', {id: 1})).toEqual({
      status: 200,
      body: {isSuccessful: false, error: {code: 'ARTICLE_NOT_FOUND'}},
    });

    database.query.mockResolvedValueOnce({rows: [sampleDbRow], rowCount: 1});
    expect(await postRequest('/article/addPageView', {id: 1})).toEqual({
      status: 200,
      body: {isSuccessful: true, data: null},
    });
  });
});

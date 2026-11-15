import assert from 'node:assert/strict';
import {once} from 'node:events';
import {mkdtemp, rm} from 'node:fs/promises';
import {type Server} from 'node:http';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

import {errorHandling} from '@library/koa-middlewares';
import Koa from 'koa';
import {koaBody} from 'koa-body';
import session from 'koa-session';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

const sessionStore = vi.hoisted(() => new Map<string, string>());
const upstreamRequests = vi.hoisted(() => ({
  handler:
    vi.fn<
      (
        url: string,
        init?: RequestInit,
      ) => Promise<{status: number; body: unknown}>
    >(),
}));
const staticDirectory = vi.hoisted(() => ({path: ''}));

vi.mock('../Singleton/index.js', () => ({
  ioredis: {
    get: (key: string) => Promise.resolve(sessionStore.get(key) ?? null),
    set: (key: string, value: string) => {
      sessionStore.set(key, value);
      return Promise.resolve('OK');
    },
    del: (key: string) => {
      sessionStore.delete(key);
      return Promise.resolve(1);
    },
  },
}));

vi.mock('../CONFIG/SERVER.js', () => ({
  SERVER: {
    PORT: 4003,
    get STATIC_POSITION() {
      return staticDirectory.path;
    },
  },
}));

let server: Server | undefined;
let baseUrl: string;
const originalFetch = globalThis.fetch;

beforeAll(async () => {
  staticDirectory.path = await mkdtemp(join(tmpdir(), 'admin-legacy-static-'));

  vi.stubGlobal(
    'fetch',
    async (input: string | URL | Request, init?: RequestInit) => {
      const urlString =
        typeof input === 'string'
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url;
      if (urlString.startsWith('http://database-server:4000')) {
        const result = await upstreamRequests.handler(urlString, init);
        return new Response(JSON.stringify(result.body), {
          status: result.status,
          headers: {'content-type': 'application/json'},
        });
      }
      return originalFetch(input, init);
    },
  );

  const [{BODY, SESSION}, {default: dispatcher}, {sessionChecker}] =
    await Promise.all([
      import('../CONFIG/index.js'),
      import('./index.js'),
      import('../Middleware/index.js'),
    ]);

  const app = new Koa();
  app.use(errorHandling());
  app.use(session({...SESSION, secure: false}, app));
  app.use(sessionChecker());
  app.use(koaBody(BODY));
  app.use(dispatcher());

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
    vi.unstubAllGlobals();
    if (staticDirectory.path) {
      await rm(staticDirectory.path, {recursive: true, force: true});
    }
  }
});

beforeEach(() => {
  sessionStore.clear();
  upstreamRequests.handler
    .mockReset()
    .mockRejectedValue(new Error('Unexpected upstream call'));
});

async function getRequest(path: string, cookie?: string) {
  const response = await originalFetch(new URL(path, baseUrl), {
    method: 'GET',
    headers: cookie === undefined ? undefined : {cookie},
    signal: AbortSignal.timeout(1_000),
  });
  const body: unknown =
    response.headers.get('content-type')?.includes('application/json') === true
      ? await response.json()
      : await response.text();
  return {status: response.status, body};
}

async function postRequest(path: string, payload: unknown, cookie?: string) {
  const headers: Record<string, string> = {'content-type': 'application/json'};
  if (cookie !== undefined) {
    headers.cookie = cookie;
  }
  const response = await originalFetch(new URL(path, baseUrl), {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(1_000),
  });
  const body: unknown =
    response.headers.get('content-type')?.includes('application/json') === true
      ? await response.json()
      : await response.text();
  return {status: response.status, body};
}

const sampleArticle = {
  id: 1,
  title: 'Hello',
  content: 'World',
  category: 2,
  publicationTime: '2024-02-29T12:00:00.000Z',
  modificationTime: '2024-02-29T12:00:00.000Z',
  pageViews: 5,
  isVisible: true,
};

describe('admin-legacy HTTP RPC boundary', () => {
  it.each([
    undefined,
    'sess=missing',
    'sess=bad-outer-space',
    'sess=empty-username',
  ])(
    'rejects unauthorized or invalid session (%s) with UNAUTHORIZED',
    async (cookie) => {
      sessionStore.set(
        'bad-outer-space',
        JSON.stringify({username: ' alice '}),
      );
      sessionStore.set('empty-username', JSON.stringify({username: ''}));

      const result = await getRequest('/blog/article/getAll', cookie);
      expect(result).toEqual({
        status: 200,
        body: {isSuccessful: false, error: {code: 'UNAUTHORIZED'}},
      });
      expect(upstreamRequests.handler).not.toHaveBeenCalled();
    },
  );

  it('validates ADD and MODIFY payloads before forwarding to database-legacy', async () => {
    sessionStore.set('valid', JSON.stringify({username: 'alice'}));
    const cookie = 'sess=valid';

    expect(
      await postRequest(
        '/blog/article/add',
        {title: '   ', content: 'Body', category: 1, isVisible: true},
        cookie,
      ),
    ).toEqual({
      status: 200,
      body: {isSuccessful: false, error: {code: 'INVALID_REQUEST_PARAMS'}},
    });
    expect(await postRequest('/blog/article/modify', {id: 1}, cookie)).toEqual({
      status: 200,
      body: {isSuccessful: false, error: {code: 'INVALID_REQUEST_PARAMS'}},
    });
    expect(
      await postRequest('/blog/category/add', {name: '   '}, cookie),
    ).toEqual({
      status: 200,
      body: {isSuccessful: false, error: {code: 'INVALID_REQUEST_PARAMS'}},
    });
    expect(
      await postRequest('/blog/category/modify', {id: 1, name: ''}, cookie),
    ).toEqual({
      status: 200,
      body: {isSuccessful: false, error: {code: 'INVALID_REQUEST_PARAMS'}},
    });
    expect(
      await postRequest('/blog/option/setAbout', {about: '   '}, cookie),
    ).toEqual({
      status: 200,
      body: {isSuccessful: false, error: {code: 'INVALID_REQUEST_PARAMS'}},
    });
    expect(upstreamRequests.handler).not.toHaveBeenCalled();

    upstreamRequests.handler.mockResolvedValueOnce({
      status: 200,
      body: {isSuccessful: true, data: null},
    });
    expect(
      await postRequest(
        '/blog/article/add',
        {
          title: '  Trimmed Title  ',
          content: '  keep markdown indent  ',
          category: 1,
          isVisible: true,
        },
        cookie,
      ),
    ).toEqual({
      status: 200,
      body: {isSuccessful: true, data: null},
    });
    const requestBody = upstreamRequests.handler.mock.calls[0]?.[1]?.body;
    assert(typeof requestBody === 'string');
    const forwardedBody: unknown = JSON.parse(requestBody);
    expect(forwardedBody).toEqual({
      title: 'Trimmed Title',
      content: '  keep markdown indent  ',
      category: 1,
      isVisible: true,
    });
  });

  it('passes through structured ServerError (including CATEGORY_IN_USE) and maps empty getById to NOT_FOUND', async () => {
    sessionStore.set('valid', JSON.stringify({username: 'alice'}));
    const cookie = 'sess=valid';

    upstreamRequests.handler.mockResolvedValueOnce({
      status: 200,
      body: {
        isSuccessful: false,
        error: {code: 'CATEGORY_IN_USE', details: {articleAmount: 4}},
      },
    });
    expect(
      await postRequest('/blog/category/deleteById', {id: 2}, cookie),
    ).toEqual({
      status: 200,
      body: {
        isSuccessful: false,
        error: {code: 'CATEGORY_IN_USE', details: {articleAmount: 4}},
      },
    });

    upstreamRequests.handler.mockResolvedValueOnce({
      status: 200,
      body: {isSuccessful: true, data: []},
    });
    expect(
      await getRequest('/blog/article/getById?json=%7B%22id%22%3A1%7D', cookie),
    ).toEqual({
      status: 200,
      body: {isSuccessful: false, error: {code: 'ARTICLE_NOT_FOUND'}},
    });

    upstreamRequests.handler.mockResolvedValueOnce({
      status: 200,
      body: {isSuccessful: true, data: []},
    });
    expect(
      await getRequest(
        '/blog/category/getById?json=%7B%22id%22%3A1%7D',
        cookie,
      ),
    ).toEqual({
      status: 200,
      body: {isSuccessful: false, error: {code: 'CATEGORY_NOT_FOUND'}},
    });
  });

  it('returns 500 when database-legacy returns a malformed ServerResponse payload', async () => {
    sessionStore.set('valid', JSON.stringify({username: 'alice'}));
    const cookie = 'sess=valid';

    upstreamRequests.handler.mockResolvedValueOnce({
      status: 200,
      body: {isSuccessful: false, message: 'legacy string message'},
    });
    const response = await getRequest('/blog/article/getAll', cookie);
    expect(response.status).toBe(500);

    upstreamRequests.handler.mockResolvedValueOnce({
      status: 200,
      body: {isSuccessful: true, data: [{...sampleArticle, id: 'bad'}]},
    });
    const invalidDataResponse = await getRequest(
      '/blog/article/getAll',
      cookie,
    );
    expect(invalidDataResponse.status).toBe(500);
  });

  it('sets and gets about markdown with void data: null', async () => {
    sessionStore.set('valid', JSON.stringify({username: 'alice'}));
    const cookie = 'sess=valid';

    expect(
      await postRequest(
        '/blog/option/setAbout',
        {about: '  # About  '},
        cookie,
      ),
    ).toEqual({
      status: 200,
      body: {isSuccessful: true, data: null},
    });
    expect(await getRequest('/blog/option/getAbout', cookie)).toEqual({
      status: 200,
      body: {isSuccessful: true, data: {about: '  # About  '}},
    });
  });
});

import assert from 'node:assert/strict';
import {once} from 'node:events';
import {mkdtemp, rm, writeFile} from 'node:fs/promises';
import {type Server} from 'node:http';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

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

vi.mock('../CONFIG/SERVER.js', () => ({
  SERVER: {
    PORT: 4004,
    get STATIC_POSITION() {
      return staticDirectory.path;
    },
  },
}));

let server: Server | undefined;
let baseUrl: string;
const originalFetch = globalThis.fetch;

beforeAll(async () => {
  staticDirectory.path = await mkdtemp(join(tmpdir(), 'blog-legacy-static-'));
  await writeFile(join(staticDirectory.path, 'about.md'), '# About me', {
    encoding: 'utf-8',
  });

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

  const [{BODY}, {default: dispatcher}] = await Promise.all([
    import('../CONFIG/index.js'),
    import('./index.js'),
  ]);

  const app = new Koa();
  app.use(errorHandling());
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
  upstreamRequests.handler
    .mockReset()
    .mockRejectedValue(new Error('Unexpected upstream call'));
});

async function getRequest(path: string) {
  const response = await originalFetch(new URL(path, baseUrl), {
    method: 'GET',
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
  content: 'a'.repeat(400),
  category: 2,
  publicationTime: '2024-02-29T12:00:00.000Z',
  modificationTime: '2024-02-29T12:00:00.000Z',
  pageViews: 5,
  isVisible: true,
};

describe('blog-legacy HTTP RPC boundary', () => {
  it('validates id and category query params with INVALID_REQUEST_PARAMS', async () => {
    expect(
      await getRequest('/article/getById?json=%7B%22id%22%3A0%7D'),
    ).toEqual({
      status: 200,
      body: {isSuccessful: false, error: {code: 'INVALID_REQUEST_PARAMS'}},
    });
    expect(
      await getRequest(
        '/article/getByCategoryWithAbstract?json=%7B%22category%22%3A-1%7D',
      ),
    ).toEqual({
      status: 200,
      body: {isSuccessful: false, error: {code: 'INVALID_REQUEST_PARAMS'}},
    });
    expect(
      await getRequest('/category/getById?json=%7B%22id%22%3A%221%22%7D'),
    ).toEqual({
      status: 200,
      body: {isSuccessful: false, error: {code: 'INVALID_REQUEST_PARAMS'}},
    });
    expect(upstreamRequests.handler).not.toHaveBeenCalled();
  });

  it('truncates abstracts to 301 chars and maps missing article/category to NOT_FOUND', async () => {
    upstreamRequests.handler.mockResolvedValueOnce({
      status: 200,
      body: {isSuccessful: true, data: [sampleArticle]},
    });
    const allResult = await getRequest('/article/getAllWithAbstract');
    expect(allResult.status).toBe(200);
    expect(allResult.body).toEqual({
      isSuccessful: true,
      data: [{...sampleArticle, content: 'a'.repeat(301)}],
    });

    upstreamRequests.handler.mockResolvedValueOnce({
      status: 200,
      body: {isSuccessful: true, data: []},
    });
    expect(
      await getRequest('/article/getById?json=%7B%22id%22%3A1%7D'),
    ).toEqual({
      status: 200,
      body: {isSuccessful: false, error: {code: 'ARTICLE_NOT_FOUND'}},
    });

    upstreamRequests.handler.mockResolvedValueOnce({
      status: 200,
      body: {isSuccessful: true, data: []},
    });
    expect(
      await getRequest('/category/getById?json=%7B%22id%22%3A1%7D'),
    ).toEqual({
      status: 200,
      body: {isSuccessful: false, error: {code: 'CATEGORY_NOT_FOUND'}},
    });
  });

  it('returns 500 when database-legacy returns a malformed ServerResponse envelope', async () => {
    upstreamRequests.handler.mockResolvedValueOnce({
      status: 200,
      body: {isSuccessful: false, message: 'legacy string message'},
    });
    expect((await getRequest('/category/getAll')).status).toBe(500);
  });

  it('returns SiteOption about content on GET /option/getAbout', async () => {
    expect(await getRequest('/option/getAbout')).toEqual({
      status: 200,
      body: {isSuccessful: true, data: {about: '# About me'}},
    });
  });
});

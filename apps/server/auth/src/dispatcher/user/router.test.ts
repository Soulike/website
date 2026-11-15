import assert from 'node:assert/strict';
import {once} from 'node:events';
import {type Server} from 'node:http';

import {bodyParser} from '@koa/bodyparser';
import {FakeUserTable} from '@module/database/fake';
import Koa from 'koa';
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

import {KOA_BODY_OPTIONS} from '@/configurations/koa-body-options.js';
import {KOS_SESSION_OPTIONS} from '@/configurations/koa-session-options.js';

const sessionStore = vi.hoisted(() => new Map<string, string>());

vi.mock('@module/database', () => ({
  UserTable: FakeUserTable,
}));

vi.mock('@/singletons/index.js', () => ({
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

let server: Server | undefined;
let baseUrl: string;

beforeAll(async () => {
  const {dispatcher} = await import('../index.js');
  const sessionOptions = {
    key: KOS_SESSION_OPTIONS.key,
    maxAge: KOS_SESSION_OPTIONS.maxAge,
    overwrite: KOS_SESSION_OPTIONS.overwrite,
    httpOnly: KOS_SESSION_OPTIONS.httpOnly,
    signed: KOS_SESSION_OPTIONS.signed,
    rolling: KOS_SESSION_OPTIONS.rolling,
    renew: KOS_SESSION_OPTIONS.renew,
    sameSite: KOS_SESSION_OPTIONS.sameSite,
    store: KOS_SESSION_OPTIONS.store,
    secure: false,
  };
  const app = new Koa();
  app.use(session(sessionOptions, app));
  app.use(bodyParser(KOA_BODY_OPTIONS));
  app.use(dispatcher());

  server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  assert(typeof address === 'object' && address !== null);
  baseUrl = `http://127.0.0.1:${address.port}`;
});

afterAll(async () => {
  if (!server) {
    return;
  }
  const activeServer = server;
  await new Promise<void>((resolve, reject) => {
    activeServer.close((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
    activeServer.closeAllConnections();
  });
});

beforeEach(() => {
  FakeUserTable.reset();
  sessionStore.clear();
});

async function requestSession(
  method: 'GET' | 'POST' | 'DELETE',
  options?: {body?: unknown; cookie?: string},
) {
  const headers: Record<string, string> = {};
  if (options?.cookie !== undefined) {
    headers.cookie = options.cookie;
  }
  if (options?.body !== undefined) {
    headers['content-type'] = 'application/json';
  }
  const response = await fetch(new URL('/session', baseUrl), {
    method,
    headers,
    body:
      options?.body === undefined ? undefined : JSON.stringify(options.body),
    signal: AbortSignal.timeout(1_000),
  });
  const body: unknown =
    response.headers.get('content-type')?.includes('application/json') === true
      ? await response.json()
      : await response.text();
  return {
    status: response.status,
    body,
    setCookie: response.headers.get('set-cookie'),
  };
}

describe('/session HTTP boundary', () => {
  it.each([
    {username: '', password: 'secret'},
    {username: '   ', password: 'secret'},
    {username: ' alice', password: 'secret'},
    {username: 'alice ', password: 'secret'},
    {username: 'a'.repeat(256), password: 'secret'},
    {username: 'alice', password: ''},
    {username: 123, password: 'secret'},
  ])(
    'returns 400 on POST /session for invalid credentials %j',
    async (payload) => {
      const result = await requestSession('POST', {body: payload});
      expect(result.status).toBe(400);
      expect(sessionStore.size).toBe(0);
    },
  );

  it('creates a session on valid credentials, reads it cleanly, and deletes it', async () => {
    const {CheckUserTask} = await import('@/tasks/check-user-task.js');
    const hashedPassword = CheckUserTask.getSaltedPasswordForTesting(
      'alice',
      'secret',
    );
    await FakeUserTable.insert({username: 'alice', password: hashedPassword});

    const loginResult = await requestSession('POST', {
      body: {username: 'alice', password: 'secret'},
    });
    expect(loginResult.status).toBe(204);
    assert(loginResult.setCookie !== null);

    const cookie = loginResult.setCookie.split(';')[0] ?? '';
    assert(cookie.length > 0);
    const getResult = await requestSession('GET', {cookie});
    expect(getResult.status).toBe(200);
    expect(getResult.body).toEqual({username: 'alice'});

    const deleteResult = await requestSession('DELETE', {cookie});
    expect(deleteResult.status).toBe(204);

    const afterDelete = await requestSession('GET', {cookie});
    expect(afterDelete.status).toBe(404);
  });

  it('returns 404 when no session cookie is provided', async () => {
    const result = await requestSession('GET');
    expect(result.status).toBe(404);
  });

  it('returns 401 when credentials are valid shape but do not match', async () => {
    const result = await requestSession('POST', {
      body: {username: 'alice', password: 'wrong'},
    });
    expect(result.status).toBe(401);
    expect(sessionStore.size).toBe(0);
  });

  it('returns 500 when credential verification fails unexpectedly', async () => {
    vi.spyOn(FakeUserTable, 'selectByUsername').mockRejectedValueOnce(
      new Error('Database unavailable'),
    );
    const result = await requestSession('POST', {
      body: {username: 'alice', password: 'secret'},
    });
    expect(result.status).toBe(500);
    expect(sessionStore.size).toBe(0);
  });

  it.each([
    {username: ''},
    {username: '   '},
    {username: ' alice '},
    {username: 123},
    {},
  ])(
    'clears corrupted session %j and returns 404 on GET /session',
    async (corrupted) => {
      sessionStore.set('corrupt-key', JSON.stringify(corrupted));
      const result = await requestSession('GET', {cookie: 'sess=corrupt-key'});
      expect(result.status).toBe(404);
      expect(sessionStore.has('corrupt-key')).toBe(false);
    },
  );
});

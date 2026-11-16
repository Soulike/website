import {afterEach, describe, expect, it, vi} from 'vitest';

import {AUTH_URL, createSession, deleteSession, getSession} from './api.js';
import {CreateSessionResult} from './types.js';

function stubFetch(status: number, body?: unknown) {
  const response =
    body === undefined
      ? new Response(null, {status})
      : Response.json(body, {status});
  const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(response);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('@module/session-sdk', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe('getSession', () => {
    it('returns parsed Session when server responds 200 with valid payload', async () => {
      const fetchMock = stubFetch(200, {username: 'alice'});

      await expect(getSession()).resolves.toEqual({username: 'alice'});
      expect(fetchMock).toHaveBeenCalledWith(AUTH_URL, {
        method: 'GET',
        credentials: 'include',
      });
    });

    it('returns null when server responds 404', async () => {
      stubFetch(404);
      await expect(getSession()).resolves.toBeNull();
    });

    it.each([
      {username: ''},
      {username: '   '},
      {username: ' alice '},
      {username: 123},
      {},
    ])(
      'throws when server responds 200 with invalid Session %j',
      async (invalidSession) => {
        stubFetch(200, invalidSession);
        await expect(getSession()).rejects.toThrow('Invalid Session');
      },
    );

    it('throws on unexpected HTTP error status', async () => {
      stubFetch(500);
      await expect(getSession()).rejects.toThrow(
        'Get session failed with HTTP status 500',
      );
    });
  });

  describe('createSession', () => {
    it('returns SUCCESS when server responds 204', async () => {
      const fetchMock = stubFetch(204);

      await expect(
        createSession({username: 'alice', password: 'secret'}),
      ).resolves.toBe(CreateSessionResult.SUCCESS);
      expect(fetchMock).toHaveBeenCalledWith(AUTH_URL, {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: 'alice', password: 'secret'}),
      });
    });

    it('returns UNAUTHORIZED when server responds 401', async () => {
      stubFetch(401);

      await expect(
        createSession({username: 'alice', password: 'wrong'}),
      ).resolves.toBe(CreateSessionResult.UNAUTHORIZED);
    });

    it('throws on unexpected HTTP error status such as 400', async () => {
      stubFetch(400);

      await expect(
        createSession({username: 'alice', password: 'secret'}),
      ).rejects.toThrow('Create session failed with HTTP status 400');
    });

    it('rejects invalid LoginCredentials before issuing fetch', async () => {
      const fetchMock = stubFetch(204);

      await expect(
        createSession({username: ' alice ', password: 'secret'}),
      ).rejects.toThrow();
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe('deleteSession', () => {
    it('resolves when server responds 204', async () => {
      const fetchMock = stubFetch(204);

      await expect(deleteSession()).resolves.toBeUndefined();
      expect(fetchMock).toHaveBeenCalledWith(AUTH_URL, {
        method: 'DELETE',
        credentials: 'include',
      });
    });

    it('throws when server responds with an error status', async () => {
      stubFetch(500);
      await expect(deleteSession()).rejects.toThrow(
        'Delete session failed with HTTP status 500',
      );
    });
  });
});

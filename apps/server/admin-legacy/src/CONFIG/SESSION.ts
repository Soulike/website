import type {SessionOptions} from 'koa-session';

import {ioredis} from '../Singleton/index.js';

export const SESSION: Partial<SessionOptions> = {
  key: 'sess',
  maxAge: 60 * 60 * 1000,
  overwrite: false,
  httpOnly: true,
  signed: false,
  rolling: false,
  renew: false,
  autoCommit: false,
  sameSite: 'strict',
  secure: true,
  store: {
    get: async (key) => {
      const value = await ioredis.get(key);
      if (value === null) {
        return null;
      }
      try {
        return JSON.parse(value);
      } catch {
        await ioredis.del(key);
        return null;
      }
    },
    set: async () => {
      // Read-only: session management is handled by the auth server.
    },
    destroy: async () => {
      // Read-only: session management is handled by the auth server.
    },
  },
};

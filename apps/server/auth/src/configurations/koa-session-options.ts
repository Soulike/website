import type {CreateSessionOptions} from 'koa-session';

import {ioredis} from '@/singletons/index.js';

// koa-session passes all options through to ctx.cookies.set(), which
// supports cookie attributes like `domain`. The koa-session Zod schema
// does not include these, so we extend the type here.
interface CookieOptions {
  domain?: string;
}

export const KOS_SESSION_OPTIONS: CreateSessionOptions & CookieOptions = {
  key: 'sess',
  maxAge: 60 * 60 * 1000,
  overwrite: true,
  httpOnly: true,
  signed: false,
  rolling: false,
  renew: true,
  sameSite: 'strict',
  secure: true,
  domain: '.soulike.tech',
  store: {
    get: async (key) => {
      const value = await ioredis.get(key);
      if (value === null) {
        return null;
      }
      try {
        return JSON.parse(value) as unknown;
      } catch {
        await ioredis.del(key);
        return null;
      }
    },
    set: async (key, sess, maxAge) => {
      await ioredis.set(key, JSON.stringify(sess), 'PX', maxAge);
    },
    destroy: async (key) => {
      await ioredis.del(key);
    },
  },
};

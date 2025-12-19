import {SessionOptions} from 'koa-session';

import {ioredis} from '../Singleton/index.js';

export const SESSION: Partial<SessionOptions> = {
  key: 'sess' /** (string) cookie key (default is koa:sess) */,
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 60 * 60 * 1000,
  overwrite: true,
  /** (boolean) can overwrite or not (default true) */
  httpOnly: true,
  /** (boolean) httpOnly or not (default true) */
  signed: false,
  /** (boolean) signed or not (default true) */
  rolling: false,
  /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: true,
  /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false) */
  sameSite: 'strict',
  store: {
    get: async (key) => {
      const value = await ioredis.get(key);
      if (value !== null) {
        return JSON.parse(value);
      } else {
        return value;
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

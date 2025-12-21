import {SessionOptions} from 'koa-session';

import {ioredis} from '../Singleton/index.js';

export const SESSION: Partial<SessionOptions> = {
  key: 'sess' /** (string) cookie key (default is koa:sess) */,
  /** (number || 'session') maxAge in ms (default is 1 day) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  signed: false,
  /** (boolean) signed or not (default true) */
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

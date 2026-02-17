import type {SessionOptions} from 'koa-session';

export const SESSION: Partial<SessionOptions> = {
  key: 'sess',
  signed: false,
};

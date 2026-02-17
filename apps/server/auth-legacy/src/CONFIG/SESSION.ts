import type {SessionOptions} from 'koa-session';

export const SESSION: Partial<SessionOptions> = {
  key: 'sess',
  maxAge: 60 * 60 * 1000,
  overwrite: true,
  httpOnly: true,
  signed: false,
  rolling: false,
  renew: true,
  sameSite: 'strict',
};

import type {SessionOptions} from 'koa-session';

export const SESSION: Partial<SessionOptions> = {
  key: 'sess',
  maxAge: 60 * 60 * 1000,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
  renew: true,
  sameSite: 'strict',
  secure: true,
};

import type {SessionOptions} from 'koa-session';

export const KOS_SESSION_OPTIONS: Partial<SessionOptions> = {
  key: 'sess',
  maxAge: 60 * 60 * 1000,
  overwrite: true,
  httpOnly: true,
  signed: false,
  rolling: false,
  renew: true,
  sameSite: 'strict',
  secure: true,
};

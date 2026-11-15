import Router from '@koa/router';
import {Logger} from '@library/logger';
import {LoginCredentialsSchema, SessionSchema} from '@schema/auth';
import {StatusCodes} from 'http-status-codes';
import {DefaultState} from 'koa';

import {createSession} from '@/service/user/create-session.js';

import type {Context} from '../types.js';
import {SESSION} from './path.js';

const router = new Router<DefaultState, Context>();

router.get(SESSION, (ctx) => {
  const parsedSession = SessionSchema.safeParse(ctx.session);
  if (!parsedSession.success) {
    ctx.session = null;
    ctx.response.status = StatusCodes.NOT_FOUND;
    return;
  }
  ctx.response.body = parsedSession.data;
});

router.post(SESSION, async (ctx) => {
  const parsedCredentials = LoginCredentialsSchema.safeParse(ctx.request.body);
  if (!parsedCredentials.success) {
    ctx.response.status = StatusCodes.BAD_REQUEST;
    return;
  }
  try {
    const session = await createSession(parsedCredentials.data);
    if (!session) {
      ctx.response.status = StatusCodes.UNAUTHORIZED;
      return;
    }
    ctx.session = session;
    ctx.response.status = StatusCodes.NO_CONTENT;
  } catch (e: unknown) {
    ctx.response.status = StatusCodes.INTERNAL_SERVER_ERROR;
    Logger.dispatcherError(SESSION, 'POST', e);
  }
});

router.delete(SESSION, (ctx) => {
  ctx.session = null;
  ctx.response.status = StatusCodes.NO_CONTENT;
});

export {router};

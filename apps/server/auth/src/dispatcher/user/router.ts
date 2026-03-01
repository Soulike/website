import Router from '@koa/router';
import {Logger} from '@library/logger';
import {User} from '@module/classes';
import {StatusCodes} from 'http-status-codes';
import {DefaultState} from 'koa';

import {createSession} from '@/service/user/create-session.js';

import type {Context} from '../types.js';
import {SESSION} from './path.js';

const router = new Router<DefaultState, Context>();

router.get(SESSION, (ctx) => {
  if (!ctx.session) {
    ctx.response.status = StatusCodes.NOT_FOUND;
  } else {
    ctx.response.body = ctx.session;
  }
});

router.post(SESSION, async (ctx) => {
  const body: unknown = ctx.request.body;
  if (!User.validate(body)) {
    ctx.response.status = StatusCodes.BAD_REQUEST;
    return;
  }
  try {
    const session = await createSession(User.from(body));
    if (session) {
      ctx.session = session;
      ctx.response.status = StatusCodes.NO_CONTENT;
    } else {
      ctx.response.status = StatusCodes.UNAUTHORIZED;
    }
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

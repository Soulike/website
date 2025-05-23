import Router from '@koa/router';
import {Logger} from '@server/logger';
import {UserValidator} from '@website/classes';
import {StatusCodes} from 'http-status-codes';
import {DefaultState} from 'koa';

import {createSession} from '@/service/user/create-session.js';

import type {Context} from '../types.js';
import {SESSION} from './path.js';

const router = new Router<DefaultState, Context>();

router.get(SESSION, (ctx) => {
  if (!ctx.session) {
    ctx.response.body = {username: null};
  } else {
    ctx.response.body = {username: ctx.session.username};
  }
});

router.post(SESSION, async (ctx) => {
  const body: unknown = ctx.request.body;
  if (!UserValidator.validate(body)) {
    ctx.response.status = StatusCodes.BAD_REQUEST;
    return;
  }
  try {
    const result = await createSession(body, ctx);
    if (result) {
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

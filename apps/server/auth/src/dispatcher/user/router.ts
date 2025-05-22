import Router from '@koa/router';
import {DefaultState} from 'koa';

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

router.post(SESSION, (ctx) => {
  const body: unknown = ctx.request.body;
  if (!body || typeof body !== 'object') {
    ctx.response.status = 400;
    return;
  }
  if (!('username' in body) || !('password' in body)) {
    ctx.response.status = 400;
    return;
  }
  if (typeof body.username !== 'string' || typeof body.password !== 'string') {
    ctx.response.status = 400;
    return;
  }
  // TODO: create session
});

router.delete(SESSION, (ctx) => {
  ctx.session = null;
});

export {router};

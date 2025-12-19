import {FailServerResponse, SuccessfulServerResponse} from '@module/classes';

import {checkSessionService, loginService} from '../../Service/index.js';
import {AppRouter} from '../../types.js';
import {CHECK_SESSION, LOGIN, LOGOUT} from './ROUTE.js';

export default (router: AppRouter) => {
  router.post(LOGIN, async (ctx) => {
    const {username, password} = ctx.request.body;
    if (typeof username !== 'string' || typeof password !== 'string') {
      ctx.response.body = new FailServerResponse('请求参数错误');
    } else {
      const response = await loginService(username, password);
      if (response.isSuccessful) {
        ctx.session.username = username;
      }
      ctx.response.body = response;
    }
  });

  router.post(LOGOUT, (ctx) => {
    ctx.session.username = null;
    ctx.response.body = new SuccessfulServerResponse(undefined);
  });

  router.get(CHECK_SESSION, (ctx) => {
    ctx.response.body = checkSessionService(ctx.session.username);
  });
};

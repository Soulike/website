import {jsonQsParser} from '@library/koa-middlewares';
import {FailServerResponse} from '@module/classes';

import {AppRouter} from '@/types.js';

import {User as UserService} from '../../Service/index.js';
import {onJSONQsParseError} from '../Function.js';
import {ADD, GET, MODIFY} from './ROUTE.js';

export default (router: AppRouter) => {
  router.post(ADD, async (ctx) => {
    const {username, password} = ctx.request.body;
    if (typeof username !== 'string' || typeof password !== 'string') {
      ctx.response.body = new FailServerResponse('请求参数错误');
    }
    ctx.response.body = await UserService.add({username, password});
  });

  router.get(GET, jsonQsParser({onError: onJSONQsParseError}), async (ctx) => {
    const {username} = ctx.request.body;
    if (typeof username !== 'string') {
      ctx.response.body = new FailServerResponse('请求参数错误');
    }
    ctx.response.body = await UserService.get(username);
  });

  router.post(MODIFY, async (ctx) => {
    const user = ctx.request.body;
    const {username} = user;
    if (typeof username !== 'string') {
      ctx.response.body = new FailServerResponse('请求参数错误');
    }
    ctx.response.body = await UserService.modify(user);
  });
};

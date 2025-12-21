import {FailServerResponse} from '@module/classes';
import {type Middleware} from 'koa';

export default (): Middleware => {
  return async (ctx, next) => {
    if (ctx.session === null || typeof ctx.session.username !== 'string') {
      ctx.response.body = new FailServerResponse('请先登录');
    } else {
      await next();
    }
  };
};

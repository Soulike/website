import {SessionSchema} from '@schema/auth';
import {failResponse} from '@schema/rpc';
import {type Middleware} from 'koa';

export default (): Middleware => {
  return async (ctx, next) => {
    const parsed = SessionSchema.safeParse(ctx.session);
    if (!parsed.success) {
      ctx.response.body = failResponse({code: 'UNAUTHORIZED'});
      return;
    }
    await next();
  };
};

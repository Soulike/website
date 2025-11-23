import type {Middleware} from 'koa';

type ErrorHandler = (error: unknown) => void | Promise<void>;

export function errorHandling(handler?: ErrorHandler): Middleware {
  return async (ctx, next) => {
    try {
      await next();
    } catch (e) {
      ctx.response.status = 500;
      if (handler) {
        await handler(e);
      }
    }
  };
}

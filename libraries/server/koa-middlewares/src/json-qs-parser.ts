import type Koa from 'koa';

export interface JsonQsParserOptions {
  onError?: (e: unknown, ctx: Koa.Context) => void;
}

/**
 * Koa middleware that parses the `json` query parameter from GET requests
 * and places the parsed object in `ctx.request.body`.
 */
export function jsonQsParser(
  options?: JsonQsParserOptions,
): Koa.Middleware<Koa.DefaultState, {request: {body?: unknown}}> {
  const {onError} = options ?? {};
  return async (ctx, next) => {
    const {json} = ctx.request.query;
    if (typeof json !== 'string') {
      if (onError !== undefined) {
        onError(new Error('Invalid json in ctx.request.query'), ctx);
      }
      return;
    }

    try {
      ctx.request.body = JSON.parse(json);
      await next();
    } catch (e) {
      if (e instanceof SyntaxError) {
        if (onError !== undefined) {
          onError(e, ctx);
        }
      } else {
        throw e;
      }
    }
  };
}

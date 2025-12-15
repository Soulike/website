import type Koa from 'koa';

function generateRequestInfo(method: string, path: string, body: unknown) {
  return `Request: ${method} ${path} with body ${JSON.stringify(
    body ?? {},
  ).slice(0, 50)}...`;
}

function generateResponseInfo(method: string, path: string, response: unknown) {
  return `Response: ${method} ${path} with body ${JSON.stringify(
    response ?? {},
  ).slice(0, 50)}...`;
}

export function requestLogger(
  logger: (log: string) => void,
): Koa.Middleware<Koa.DefaultState, {request: {body?: unknown}}> {
  return async (ctx, next) => {
    logger(
      generateRequestInfo(
        ctx.request.method,
        ctx.request.originalUrl,
        ctx.request.body,
      ),
    );
    await next();
    logger(
      generateResponseInfo(
        ctx.request.method,
        ctx.request.originalUrl,
        ctx.response.body,
      ),
    );
  };
}

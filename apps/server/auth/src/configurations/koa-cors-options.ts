import type {Options} from '@koa/cors';

function isAllowedOrigin(origin: string): boolean {
  try {
    const url = new URL(origin);
    const hostname = url.hostname;
    return (
      hostname === 'localhost' ||
      hostname === 'soulike.tech' ||
      hostname.endsWith('.soulike.tech')
    );
  } catch {
    return false;
  }
}

export const KOA_CORS_OPTIONS: Options = {
  origin: (ctx) => {
    const origin = ctx.get('Origin');
    if (isAllowedOrigin(origin)) {
      return origin;
    }
    return '';
  },
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type'],
};

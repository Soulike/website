import type Session from 'koa-session';

export interface IContext {
  session: ReturnType<typeof Session> & {username?: string | null};
}

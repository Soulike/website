import type {DefaultContext} from 'koa';

export interface Context extends DefaultContext {
  session: {username?: string | null} | null;
}

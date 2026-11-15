import type {Session} from '@schema/auth';
import type {DefaultContext} from 'koa';

export interface Context extends DefaultContext {
  session: Session | null;
}

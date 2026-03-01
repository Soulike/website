import {Session} from '@module/classes';
import type {DefaultContext} from 'koa';

export interface Context extends DefaultContext {
  session: Session | null;
}

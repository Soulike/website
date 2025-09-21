import {UserInfo} from '@website/classes';
import type {DefaultContext} from 'koa';

export interface Context extends DefaultContext {
  session: {data: UserInfo} | null;
}

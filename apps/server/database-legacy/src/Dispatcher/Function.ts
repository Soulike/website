import {FailServerResponse} from '@module/classes';
import {type Context} from 'koa';

export function onJSONQsParseError(e: unknown, ctx: Context): void {
  ctx.response.status = 400;
  ctx.response.body = new FailServerResponse('请求参数错误');
}

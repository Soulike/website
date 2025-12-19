import {FailServerResponse} from '@module/classes';
import {type koaBody} from 'koa-body';
import signale from 'signale';

export const BODY: Parameters<typeof koaBody>[0] = {
  multipart: true,
  onError: (err, ctx) => {
    signale.error(err);
    ctx.response.body = new FailServerResponse('请求参数错误');
  },
};

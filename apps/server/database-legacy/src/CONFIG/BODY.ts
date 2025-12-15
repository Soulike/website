import {FailServerResponse} from '@module/classes';
import {type koaBody} from 'koa-body';
import signale from 'signale';

export const BODY: Parameters<typeof koaBody>[0] = {
  multipart: true,
  jsonLimit: 10 * 1024 * 1024,
  onError: (err, ctx) => {
    signale.error(err);
    ctx.response.status = 400;
    ctx.response.body = new FailServerResponse('请求参数错误');
  },
};

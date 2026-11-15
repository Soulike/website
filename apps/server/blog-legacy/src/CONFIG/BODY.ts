import {failResponse} from '@schema/rpc';
import {type koaBody} from 'koa-body';
import signale from 'signale';

export const BODY: Parameters<typeof koaBody>[0] = {
  multipart: true,
  onError: (err, ctx) => {
    signale.error(err);
    ctx.response.body = failResponse({code: 'INVALID_REQUEST_PARAMS'});
  },
};

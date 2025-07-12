import {type koaBody} from 'koa-body';

export const KOA_BODY_OPTIONS: Parameters<typeof koaBody>[0] = {
  multipart: true,
  onError: (err, ctx) => {
    ctx.throw(400, 'Unparsable request body');
  },
};

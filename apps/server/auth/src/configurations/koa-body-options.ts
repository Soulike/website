import {bodyParser} from '@koa/bodyparser';
import {Context} from 'koa';

export const KOA_BODY_OPTIONS: Parameters<typeof bodyParser>[0] = {
  onError: (err, ctx: Context) => {
    ctx.throw(400, `Unparsable request body\n${err}`);
  },
};

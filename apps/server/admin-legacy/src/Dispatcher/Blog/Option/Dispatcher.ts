import {FailServerResponse} from '@module/classes';

import {Option} from '../../../Service/index.js';
import {AppRouter} from '../../../types.js';
import {GET_ABOUT, SET_ABOUT} from './ROUTE.js';

export default (router: AppRouter) => {
  router.get(GET_ABOUT, async (ctx, next) => {
    try {
      ctx.response.body = await Option.get();
    } finally {
      await next();
    }
  });

  router.post(SET_ABOUT, async (ctx, next) => {
    try {
      const {about} = ctx.request.body;
      if (typeof about !== 'string') {
        ctx.response.body = new FailServerResponse('请求参数错误');
      } else {
        ctx.response.body = await Option.set(about);
      }
    } finally {
      await next();
    }
  });
};

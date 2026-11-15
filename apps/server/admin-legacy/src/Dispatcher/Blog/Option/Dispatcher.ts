import {SiteOptionSchema} from '@schema/blog';

import {Option} from '../../../Service/index.js';
import {AppRouter} from '../../../types.js';
import {parseRequestPayload} from '../../Function.js';
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
      const parsed = parseRequestPayload(
        SiteOptionSchema,
        ctx.request.body,
        SET_ABOUT,
      );
      if (!parsed.success) {
        ctx.response.body = parsed.response;
        return;
      }
      ctx.response.body = await Option.set(parsed.data.about);
    } finally {
      await next();
    }
  });
};

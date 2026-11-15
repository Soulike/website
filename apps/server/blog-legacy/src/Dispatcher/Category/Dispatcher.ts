import {jsonQsParser} from '@library/koa-middlewares';
import {CategorySchema} from '@schema/blog';
import {z} from 'zod';

import {Category as CategoryService} from '../../Service/index.js';
import {AppRouter} from '../../types.js';
import {onJSONQsParseError, parseRequestPayload} from '../Function.js';
import {GET_ALL, GET_BY_ID} from './ROUTE.js';

const CategoryIdPayloadSchema = z.object({
  id: CategorySchema.shape.id,
});

export default (router: AppRouter) => {
  router.get(GET_ALL, async (ctx) => {
    ctx.response.body = await CategoryService.getAll();
  });

  router.get(
    GET_BY_ID,
    jsonQsParser({onError: onJSONQsParseError}),
    async (ctx) => {
      const parsed = parseRequestPayload(
        CategoryIdPayloadSchema,
        ctx.request.body,
        GET_BY_ID,
      );
      if (!parsed.success) {
        ctx.response.body = parsed.response;
        return;
      }
      ctx.response.body = await CategoryService.getById(parsed.data.id);
    },
  );
};

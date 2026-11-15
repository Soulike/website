import {jsonQsParser} from '@library/koa-middlewares';
import {ArticleSchema, CategorySchema} from '@schema/blog';
import {z} from 'zod';

import {Article as ArticleService} from '../../Service/index.js';
import {AppRouter} from '../../types.js';
import {onJSONQsParseError, parseRequestPayload} from '../Function.js';
import {
  GET_ALL_WITH_ABSTRACT,
  GET_BY_CATEGORY_WITH_ABSTRACT,
  GET_BY_ID,
} from './ROUTE.js';

const ArticleIdPayloadSchema = z.object({
  id: ArticleSchema.shape.id,
});

const ArticleCategoryPayloadSchema = z.object({
  category: CategorySchema.shape.id,
});

export default (router: AppRouter) => {
  router.get(GET_ALL_WITH_ABSTRACT, async (ctx) => {
    ctx.response.body = await ArticleService.getAllWithAbstract();
  });

  router.get(
    GET_BY_ID,
    jsonQsParser({onError: onJSONQsParseError}),
    async (ctx) => {
      const parsed = parseRequestPayload(
        ArticleIdPayloadSchema,
        ctx.request.body,
        GET_BY_ID,
      );
      if (!parsed.success) {
        ctx.response.body = parsed.response;
        return;
      }
      ctx.response.body = await ArticleService.getById(parsed.data.id);
    },
  );

  router.get(
    GET_BY_CATEGORY_WITH_ABSTRACT,
    jsonQsParser({onError: onJSONQsParseError}),
    async (ctx) => {
      const parsed = parseRequestPayload(
        ArticleCategoryPayloadSchema,
        ctx.request.body,
        GET_BY_CATEGORY_WITH_ABSTRACT,
      );
      if (!parsed.success) {
        ctx.response.body = parsed.response;
        return;
      }
      ctx.response.body = await ArticleService.getByCategoryWithAbstract(
        parsed.data.category,
      );
    },
  );
};

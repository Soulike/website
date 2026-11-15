import {jsonQsParser} from '@library/koa-middlewares';
import {
  CategoryDraftSchema,
  CategorySchema,
  UpdateCategorySchema,
} from '@schema/blog';
import {z} from 'zod';

import {AppRouter} from '@/types.js';

import {Category as CategoryService} from '../../Service/index.js';
import {onJSONQsParseError, parseRequestPayload} from '../Function.js';
import {
  ADD,
  COUNT_ARTICLE_BY_ID,
  DELETE_BY_ID,
  GET,
  GET_ALL,
  MODIFY,
} from './ROUTE.js';

const CategoryIdPayloadSchema = z.object({
  id: CategorySchema.shape.id,
});

const CategoryFilterSchema = CategorySchema.partial()
  .strict()
  .refine(
    (value) => Object.values(value).some((field) => field !== undefined),
    {message: 'At least one filter field is required'},
  );

const StrictCategoryDraftSchema = CategoryDraftSchema.strict();

export default (router: AppRouter) => {
  router.get(GET, jsonQsParser({onError: onJSONQsParseError}), async (ctx) => {
    const parsed = parseRequestPayload(
      CategoryFilterSchema,
      ctx.request.body,
      GET,
    );
    if (!parsed.success) {
      ctx.response.body = parsed.response;
      return;
    }
    ctx.response.body = await CategoryService.get(parsed.data);
  });

  router.get(GET_ALL, async (ctx) => {
    ctx.response.body = await CategoryService.getAll();
  });

  router.post(ADD, async (ctx) => {
    const parsed = parseRequestPayload(
      StrictCategoryDraftSchema,
      ctx.request.body,
      ADD,
    );
    if (!parsed.success) {
      ctx.response.body = parsed.response;
      return;
    }
    ctx.response.body = await CategoryService.add(parsed.data);
  });

  router.post(DELETE_BY_ID, async (ctx) => {
    const parsed = parseRequestPayload(
      CategoryIdPayloadSchema,
      ctx.request.body,
      DELETE_BY_ID,
    );
    if (!parsed.success) {
      ctx.response.body = parsed.response;
      return;
    }
    ctx.response.body = await CategoryService.deleteById(parsed.data.id);
  });

  router.post(MODIFY, async (ctx) => {
    const parsed = parseRequestPayload(
      UpdateCategorySchema,
      ctx.request.body,
      MODIFY,
    );
    if (!parsed.success) {
      ctx.response.body = parsed.response;
      return;
    }
    ctx.response.body = await CategoryService.modify(parsed.data);
  });

  router.get(
    COUNT_ARTICLE_BY_ID,
    jsonQsParser({onError: onJSONQsParseError}),
    async (ctx) => {
      const parsed = parseRequestPayload(
        CategoryIdPayloadSchema,
        ctx.request.body,
        COUNT_ARTICLE_BY_ID,
      );
      if (!parsed.success) {
        ctx.response.body = parsed.response;
        return;
      }
      ctx.response.body = await CategoryService.countArticleById(
        parsed.data.id,
      );
    },
  );
};

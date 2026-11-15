import {jsonQsParser} from '@library/koa-middlewares';
import {
  CategoryDraftSchema,
  CategorySchema,
  UpdateCategorySchema,
} from '@schema/blog';
import {z} from 'zod';

import {Category as CategoryService} from '../../../Service/index.js';
import {AppRouter} from '../../../types.js';
import {onJSONQsParseError, parseRequestPayload} from '../../Function.js';
import {
  ADD,
  DELETE_BY_ID,
  GET_ALL,
  GET_ALL_ARTICLE_AMOUNT_BY_ID,
  GET_ARTICLE_AMOUNT_BY_ID,
  GET_BY_ID,
  MODIFY,
} from './ROUTE.js';

const CategoryIdPayloadSchema = z.object({
  id: CategorySchema.shape.id,
});

export default (router: AppRouter) => {
  router.get(
    GET_BY_ID,
    jsonQsParser({onError: onJSONQsParseError}),
    async (ctx, next) => {
      try {
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
      } finally {
        await next();
      }
    },
  );

  router.get(GET_ALL, async (ctx, next) => {
    try {
      ctx.response.body = await CategoryService.getAll();
    } finally {
      await next();
    }
  });

  router.get(GET_ALL_ARTICLE_AMOUNT_BY_ID, async (ctx, next) => {
    try {
      ctx.response.body = await CategoryService.getAllArticleAmountById();
    } finally {
      await next();
    }
  });

  router.get(
    GET_ARTICLE_AMOUNT_BY_ID,
    jsonQsParser({onError: onJSONQsParseError}),
    async (ctx, next) => {
      try {
        const parsed = parseRequestPayload(
          CategoryIdPayloadSchema,
          ctx.request.body,
          GET_ARTICLE_AMOUNT_BY_ID,
        );
        if (!parsed.success) {
          ctx.response.body = parsed.response;
          return;
        }
        ctx.response.body = await CategoryService.getArticleAmountById(
          parsed.data.id,
        );
      } finally {
        await next();
      }
    },
  );

  router.post(ADD, async (ctx, next) => {
    try {
      const parsed = parseRequestPayload(
        CategoryDraftSchema,
        ctx.request.body,
        ADD,
      );
      if (!parsed.success) {
        ctx.response.body = parsed.response;
        return;
      }
      ctx.response.body = await CategoryService.add(parsed.data);
    } finally {
      await next();
    }
  });

  router.post(DELETE_BY_ID, async (ctx, next) => {
    try {
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
    } finally {
      await next();
    }
  });

  router.post(MODIFY, async (ctx, next) => {
    try {
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
    } finally {
      await next();
    }
  });
};

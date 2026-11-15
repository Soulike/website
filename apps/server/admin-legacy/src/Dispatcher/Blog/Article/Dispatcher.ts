import {jsonQsParser} from '@library/koa-middlewares';
import {
  ArticleDraftSchema,
  ArticleSchema,
  CategorySchema,
  UpdateArticleSchema,
} from '@schema/blog';
import {z} from 'zod';

import {Article as ArticleService} from '../../../Service/index.js';
import {AppRouter} from '../../../types.js';
import {onJSONQsParseError, parseRequestPayload} from '../../Function.js';
import {
  ADD,
  DELETE_BY_ID,
  GET_ALL,
  GET_BY_CATEGORY,
  GET_BY_ID,
  MODIFY,
} from './ROUTE.js';

const ArticleIdPayloadSchema = z.object({
  id: ArticleSchema.shape.id,
});

const ArticleCategoryPayloadSchema = z.object({
  category: CategorySchema.shape.id,
});

export default (router: AppRouter) => {
  router.get(
    GET_BY_ID,
    jsonQsParser({onError: onJSONQsParseError}),
    async (ctx, next) => {
      try {
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
      } finally {
        await next();
      }
    },
  );

  router.get(GET_ALL, async (ctx, next) => {
    try {
      ctx.response.body = await ArticleService.getAll();
    } finally {
      await next();
    }
  });

  router.get(
    GET_BY_CATEGORY,
    jsonQsParser({onError: onJSONQsParseError}),
    async (ctx, next) => {
      try {
        const parsed = parseRequestPayload(
          ArticleCategoryPayloadSchema,
          ctx.request.body,
          GET_BY_CATEGORY,
        );
        if (!parsed.success) {
          ctx.response.body = parsed.response;
          return;
        }
        ctx.response.body = await ArticleService.getByCategory(
          parsed.data.category,
        );
      } finally {
        await next();
      }
    },
  );

  router.post(ADD, async (ctx, next) => {
    try {
      const parsed = parseRequestPayload(
        ArticleDraftSchema,
        ctx.request.body,
        ADD,
      );
      if (!parsed.success) {
        ctx.response.body = parsed.response;
        return;
      }
      ctx.response.body = await ArticleService.add(parsed.data);
    } finally {
      await next();
    }
  });

  router.post(DELETE_BY_ID, async (ctx, next) => {
    try {
      const parsed = parseRequestPayload(
        ArticleIdPayloadSchema,
        ctx.request.body,
        DELETE_BY_ID,
      );
      if (!parsed.success) {
        ctx.response.body = parsed.response;
        return;
      }
      ctx.response.body = await ArticleService.deleteById(parsed.data.id);
    } finally {
      await next();
    }
  });

  router.post(MODIFY, async (ctx, next) => {
    try {
      const parsed = parseRequestPayload(
        UpdateArticleSchema,
        ctx.request.body,
        MODIFY,
      );
      if (!parsed.success) {
        ctx.response.body = parsed.response;
        return;
      }
      ctx.response.body = await ArticleService.modify(parsed.data);
    } finally {
      await next();
    }
  });
};

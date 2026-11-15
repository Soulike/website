import {jsonQsParser} from '@library/koa-middlewares';
import {
  ArticleDraftSchema,
  ArticleSchema,
  UpdateArticleSchema,
} from '@schema/blog';
import {failResponse} from '@schema/rpc';
import signale from 'signale';
import {z} from 'zod';

import {AppRouter} from '@/types.js';

import {Article as ArticleService} from '../../Service/index.js';
import {onJSONQsParseError, parseRequestPayload} from '../Function.js';
import {
  ADD,
  ADD_PAGE_VIEW,
  COUNT,
  COUNT_ALL,
  DELETE_BY_ID,
  GET,
  GET_ALL,
  GET_BY_DATE,
  MODIFY,
} from './ROUTE.js';

const ArticleIdPayloadSchema = z.object({
  id: ArticleSchema.shape.id,
});

const ArticleFilterSchema = ArticleSchema.partial()
  .strict()
  .refine(
    (value) => Object.values(value).some((field) => field !== undefined),
    {message: 'At least one filter field is required'},
  );

const NumericTypeSchema = z.custom<number>(
  (value) => typeof value === 'number',
);

const ArticleDateParamsSchema = z.object({
  year: NumericTypeSchema,
  month: NumericTypeSchema.optional(),
  day: NumericTypeSchema.optional(),
});

export default (router: AppRouter) => {
  router.post(ADD, async (ctx) => {
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
  });

  router.post(DELETE_BY_ID, async (ctx) => {
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
  });

  router.post(MODIFY, async (ctx) => {
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
  });

  router.get(GET, jsonQsParser({onError: onJSONQsParseError}), async (ctx) => {
    const parsed = parseRequestPayload(
      ArticleFilterSchema,
      ctx.request.body,
      GET,
    );
    if (!parsed.success) {
      ctx.response.body = parsed.response;
      return;
    }
    ctx.response.body = await ArticleService.get(parsed.data);
  });

  router.get(GET_ALL, async (ctx) => {
    ctx.response.body = await ArticleService.getAll();
  });

  router.get(
    GET_BY_DATE,
    jsonQsParser({onError: onJSONQsParseError}),
    async (ctx) => {
      const parsed = ArticleDateParamsSchema.safeParse(ctx.request.body);
      if (
        !parsed.success ||
        (parsed.data.day !== undefined && parsed.data.month === undefined)
      ) {
        if (!parsed.success) {
          signale.warn(`Invalid request payload for ${GET_BY_DATE}`, {
            issues: parsed.error.issues,
          });
        }
        ctx.response.body = failResponse({code: 'INVALID_REQUEST_PARAMS'});
        return;
      }

      const {year, month, day} = parsed.data;

      if (
        !Number.isInteger(year) ||
        (typeof month === 'number' && !Number.isInteger(month)) ||
        (typeof day === 'number' && !Number.isInteger(day))
      ) {
        ctx.response.body = failResponse({code: 'INVALID_DATE'});
        return;
      }

      if (
        month !== undefined &&
        day === undefined &&
        (month < 1 || month > 12)
      ) {
        ctx.response.body = failResponse({code: 'INVALID_DATE'});
        return;
      }

      if (month !== undefined && day !== undefined) {
        try {
          Temporal.PlainDate.from({year, month, day}, {overflow: 'reject'});
        } catch (error) {
          if (!(error instanceof RangeError)) {
            throw error;
          }
          ctx.response.body = failResponse({code: 'INVALID_DATE'});
          return;
        }
      }

      ctx.response.body = await ArticleService.getByDate(year, month, day);
    },
  );

  router.get(
    COUNT,
    jsonQsParser({onError: onJSONQsParseError}),
    async (ctx) => {
      const parsed = parseRequestPayload(
        ArticleFilterSchema,
        ctx.request.body,
        COUNT,
      );
      if (!parsed.success) {
        ctx.response.body = parsed.response;
        return;
      }
      ctx.response.body = await ArticleService.count(parsed.data);
    },
  );

  router.get(COUNT_ALL, async (ctx) => {
    ctx.response.body = await ArticleService.countAll();
  });

  router.post(ADD_PAGE_VIEW, async (ctx) => {
    const parsed = parseRequestPayload(
      ArticleIdPayloadSchema,
      ctx.request.body,
      ADD_PAGE_VIEW,
    );
    if (!parsed.success) {
      ctx.response.body = parsed.response;
      return;
    }
    ctx.response.body = await ArticleService.addPageView(parsed.data.id);
  });
};

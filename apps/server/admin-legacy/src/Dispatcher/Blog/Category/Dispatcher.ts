import {jsonQsParser} from '@library/koa-middlewares';
import {Category, FailServerResponse} from '@module/classes';

import {Category as CategoryService} from '../../../Service/index.js';
import {AppRouter} from '../../../types.js';
import {onJSONQsParseError} from '../../Function.js';
import {
  ADD,
  DELETE_BY_ID,
  GET_ALL,
  GET_ALL_ARTICLE_AMOUNT_BY_ID,
  GET_ARTICLE_AMOUNT_BY_ID,
  GET_BY_ID,
  MODIFY,
} from './ROUTE.js';

export default (router: AppRouter) => {
  router.get(
    GET_BY_ID,
    jsonQsParser({onError: onJSONQsParseError}),
    async (ctx, next) => {
      try {
        const {id} = ctx.request.body;
        if (typeof id !== 'number') {
          ctx.response.body = new FailServerResponse('请求参数错误');
        } else {
          ctx.response.body = await CategoryService.getById(id);
        }
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
        const {id} = ctx.request.body;
        if (typeof id !== 'number') {
          ctx.response.body = new FailServerResponse('请求参数错误');
        } else {
          ctx.response.body = await CategoryService.getArticleAmountById(id);
        }
      } finally {
        await next();
      }
    },
  );

  router.post(ADD, async (ctx, next) => {
    try {
      // 参数检查在数据库层
      ctx.response.body = await CategoryService.add(
        Category.from(ctx.request.body),
      );
    } finally {
      await next();
    }
  });

  router.post(DELETE_BY_ID, async (ctx, next) => {
    try {
      const {id} = ctx.request.body;
      if (typeof id !== 'number') {
        ctx.response.body = new FailServerResponse('请求参数错误');
      } else {
        ctx.response.body = await CategoryService.deleteById(id);
      }
    } finally {
      await next();
    }
  });

  router.post(MODIFY, async (ctx, next) => {
    try {
      // 参数检查在数据库层
      ctx.response.body = await CategoryService.modify(
        Category.from(ctx.request.body),
      );
    } finally {
      await next();
    }
  });
};

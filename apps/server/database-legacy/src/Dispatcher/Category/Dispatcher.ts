import {jsonQsParser} from '@library/koa-middlewares';
import {FailServerResponse} from '@module/classes';

import {AppRouter} from '@/types.js';

import {Category as CategoryService} from '../../Service/index.js';
import {onJSONQsParseError} from '../Function.js';
import {
  ADD,
  COUNT_ARTICLE_BY_ID,
  DELETE_BY_ID,
  GET,
  GET_ALL,
  MODIFY,
} from './ROUTE.js';

export default (router: AppRouter) => {
  router.get(GET, jsonQsParser({onError: onJSONQsParseError}), async (ctx) => {
    const category = ctx.request.body;
    ctx.response.body = await CategoryService.get(category);
  });

  router.get(GET_ALL, async (ctx) => {
    ctx.response.body = await CategoryService.getAll();
  });

  router.post(ADD, async (ctx) => {
    const category = ctx.request.body;
    if (
      typeof category.name !== 'string' ||
      typeof category.id !== 'undefined'
    ) {
      ctx.response.body = new FailServerResponse('请求参数错误');
    } else {
      ctx.response.body = await CategoryService.add(category);
    }
  });

  router.post(DELETE_BY_ID, async (ctx) => {
    const {id} = ctx.request.body;
    if (typeof id !== 'number') {
      ctx.response.body = new FailServerResponse('请求参数错误');
    } else {
      ctx.response.body = await CategoryService.deleteById(id);
    }
  });

  router.post(MODIFY, async (ctx) => {
    const {id, name} = ctx.request.body;
    if (
      typeof id !== 'number' ||
      (typeof name !== 'string' && typeof name !== 'undefined')
    ) {
      ctx.response.body = new FailServerResponse('请求参数错误');
    } else {
      ctx.response.body = await CategoryService.modify({
        id,
        name,
      });
    }
  });

  router.get(
    COUNT_ARTICLE_BY_ID,
    jsonQsParser({onError: onJSONQsParseError}),
    async (ctx) => {
      const {id} = ctx.request.body;
      if (typeof id !== 'number') {
        ctx.response.body = new FailServerResponse('请求参数错误');
      } else {
        ctx.response.body = await CategoryService.countArticleById(id);
      }
    },
  );
};

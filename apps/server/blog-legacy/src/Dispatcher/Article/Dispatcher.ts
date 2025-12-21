import {jsonQsParser} from '@library/koa-middlewares';
import {FailServerResponse} from '@module/classes';

import {Article as ArticleService} from '../../Service/index.js';
import {AppRouter} from '../../types.js';
import {onJSONQsParseError} from '../Function.js';
import {
  GET_ALL_WITH_ABSTRACT,
  GET_BY_CATEGORY_WITH_ABSTRACT,
  GET_BY_ID,
} from './ROUTE.js';

export default (router: AppRouter) => {
  router.get(GET_ALL_WITH_ABSTRACT, async (ctx) => {
    ctx.response.body = await ArticleService.getAllWithAbstract();
  });

  router.get(
    GET_BY_ID,
    jsonQsParser({onError: onJSONQsParseError}),
    async (ctx) => {
      const {id} = ctx.request.body;
      if (typeof id !== 'number') {
        ctx.response.body = new FailServerResponse('请求参数错误');
      } else {
        ctx.response.body = await ArticleService.getById(id);
      }
    },
  );

  router.get(
    GET_BY_CATEGORY_WITH_ABSTRACT,
    jsonQsParser({onError: onJSONQsParseError}),
    async (ctx) => {
      const {category} = ctx.request.body;
      if (typeof category !== 'number') {
        ctx.response.body = new FailServerResponse('请求参数错误');
      } else {
        ctx.response.body =
          await ArticleService.getByCategoryWithAbstract(category);
      }
    },
  );
};

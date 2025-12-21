import {jsonQsParser} from '@library/koa-middlewares';
import {FailServerResponse} from '@module/classes';

import {Category as CategoryService} from '../../Service/index.js';
import {AppRouter} from '../../types.js';
import {onJSONQsParseError} from '../Function.js';
import {GET_ALL, GET_BY_ID} from './ROUTE.js';

export default (router: AppRouter) => {
  router.get(GET_ALL, async (ctx) => {
    ctx.response.body = await CategoryService.getAll();
  });

  router.get(
    GET_BY_ID,
    jsonQsParser({onError: onJSONQsParseError}),
    async (ctx) => {
      const {id} = ctx.request.body;
      if (typeof id !== 'number') {
        ctx.response.body = new FailServerResponse('请求参数错误');
      } else {
        ctx.response.body = await CategoryService.getById(id);
      }
    },
  );
};

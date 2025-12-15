import {jsonQsParser} from '@library/koa-middlewares';
import {FailServerResponse} from '@module/classes';
import moment from 'moment';

import {AppRouter} from '@/types.js';

import {Article as ArticleService} from '../../Service/index.js';
import {onJSONQsParseError} from '../Function.js';
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

export default (router: AppRouter) => {
  router.post(ADD, async (ctx) => {
    const {title, content, category, isVisible} = ctx.request.body;
    if (
      typeof title !== 'string' ||
      typeof content !== 'string' ||
      typeof category !== 'number' ||
      typeof isVisible !== 'boolean'
    ) {
      ctx.response.body = new FailServerResponse('请求参数错误');
    } else {
      ctx.response.body = await ArticleService.add({
        title,
        content,
        category,
        isVisible,
      });
    }
  });

  router.post(DELETE_BY_ID, async (ctx) => {
    const {id} = ctx.request.body;
    if (typeof id !== 'number') {
      ctx.response.body = new FailServerResponse('请求参数错误');
    } else {
      ctx.response.body = await ArticleService.deleteById(id);
    }
  });

  router.post(MODIFY, async (ctx) => {
    const {id, title, content, category, isVisible} = ctx.request.body;
    if (
      typeof id !== 'number' ||
      (typeof title !== 'string' && typeof title !== 'undefined') ||
      (typeof content !== 'string' && typeof content !== 'undefined') ||
      (typeof category !== 'number' && typeof category !== 'undefined') ||
      (typeof isVisible !== 'boolean' && typeof isVisible !== 'undefined')
    ) {
      ctx.response.body = new FailServerResponse('请求参数错误');
    } else {
      ctx.response.body = await ArticleService.modify({
        id,
        title,
        content,
        category,
        isVisible,
      });
    }
  });

  router.get(GET, jsonQsParser({onError: onJSONQsParseError}), async (ctx) => {
    const article = ctx.request.body;
    ctx.response.body = await ArticleService.get(article);
  });

  router.get(GET_ALL, async (ctx) => {
    ctx.response.body = await ArticleService.getAll();
  });

  router.get(
    GET_BY_DATE,
    jsonQsParser({onError: onJSONQsParseError}),
    async (ctx) => {
      const {year, month, day} = ctx.request.body;
      if (typeof year !== 'number') {
        ctx.response.body = new FailServerResponse('请求参数错误');
        return;
      }

      if (typeof month === 'number') {
        if (typeof day === 'number') {
          // 年月日都有
          const date = moment(`${year}-${month}-${day}`, 'YYYY-MM-DD');
          if (!date.isValid()) {
            ctx.response.body = new FailServerResponse('日期无效');
            return;
          }
        } // 仅有年月
        else {
          if (month < 1 || month > 12) {
            ctx.response.body = new FailServerResponse('日期无效');
            return;
          }
        }
      }

      ctx.response.body = await ArticleService.getByDate(year, month, day);
    },
  );

  router.get(
    COUNT,
    jsonQsParser({onError: onJSONQsParseError}),
    async (ctx) => {
      const article = ctx.request.body;
      ctx.response.body = await ArticleService.count(article);
    },
  );

  router.get(COUNT_ALL, async (ctx) => {
    ctx.response.body = await ArticleService.countAll();
  });

  router.post(ADD_PAGE_VIEW, async (ctx) => {
    const {id} = ctx.request.body;
    if (typeof id !== 'number') {
      ctx.response.body = new FailServerResponse('请求参数错误');
    } else {
      ctx.response.body = await ArticleService.addPageView(id);
    }
  });
};

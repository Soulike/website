import path from 'node:path';

import {Request} from '@library/request';
import {
  type Article,
  type ArticleAbstract,
  ArticleAbstractSchema,
  ArticleSchema,
} from '@schema/blog';
import {z} from 'zod';

import {prependServerPrefix} from '../path-helper.js';
import {parseServerResponse} from '../response-helper.js';

const ArticleAbstractListSchema = z.array(ArticleAbstractSchema);

class ArticleModel {
  private static readonly PATH = Object.freeze({
    GET_ALL_WITH_ABSTRACT: ArticleModel.prependArticlePrefix(
      '/getAllWithAbstract',
    ),
    GET_BY_ID: ArticleModel.prependArticlePrefix('/getById'),
    GET_BY_CATEGORY_WITH_ABSTRACT: ArticleModel.prependArticlePrefix(
      '/getByCategoryWithAbstract',
    ),
  });

  private static prependArticlePrefix(subPath: string): string {
    return prependServerPrefix(path.join('article', subPath));
  }

  public async getAllWithAbstract(): Promise<ArticleAbstract[]> {
    const response = await Request.JSONToJSON.get(
      ArticleModel.PATH.GET_ALL_WITH_ABSTRACT,
    );
    return parseServerResponse(ArticleAbstractListSchema, response);
  }

  public async getById(id: Article['id']): Promise<Article> {
    const response = await Request.JSONToJSON.get(ArticleModel.PATH.GET_BY_ID, {
      searchParams: new URLSearchParams({json: JSON.stringify({id})}),
    });
    return parseServerResponse(ArticleSchema, response);
  }

  public async getByCategoryWithAbstract(
    category: Article['category'],
  ): Promise<ArticleAbstract[]> {
    const response = await Request.JSONToJSON.get(
      ArticleModel.PATH.GET_BY_CATEGORY_WITH_ABSTRACT,
      {
        searchParams: new URLSearchParams({
          json: JSON.stringify({category}),
        }),
      },
    );
    return parseServerResponse(ArticleAbstractListSchema, response);
  }
}

export const articleModel = new ArticleModel();

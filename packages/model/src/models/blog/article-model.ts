import path from 'node:path';

import {ModelAccessDeniedError} from '@models/model-access-error.js';
import {Article, ServerResponse} from '@website/classes';
import {Request} from '@website/request';

import {prependBlogPrefix} from './path-helper.js';

export class ArticleModel {
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
    return prependBlogPrefix(path.join('article', subPath));
  }

  public async getAllWithAbstract(): Promise<Article[]> {
    const response = await Request.JSONToJSON.get<ServerResponse<Article[]>>(
      ArticleModel.PATH.GET_ALL_WITH_ABSTRACT,
    );
    if (!response.isSuccessful) {
      throw new ModelAccessDeniedError(response.message);
    } else {
      return response.data;
    }
  }

  public async getById(id: Article['id']): Promise<Article> {
    const response = await Request.JSONToJSON.get<ServerResponse<Article>>(
      ArticleModel.PATH.GET_BY_ID,
      {
        searchParams: new URLSearchParams({json: JSON.stringify({id})}),
      },
    );
    if (!response.isSuccessful) {
      throw new ModelAccessDeniedError(response.message);
    } else {
      return response.data;
    }
  }

  public async getByCategoryWithAbstract(
    category: Article['category'],
  ): Promise<Article[]> {
    const response = await Request.JSONToJSON.get<ServerResponse<Article[]>>(
      ArticleModel.PATH.GET_BY_CATEGORY_WITH_ABSTRACT,
      {
        searchParams: new URLSearchParams({
          json: JSON.stringify({category}),
        }),
      },
    );
    if (!response.isSuccessful) {
      throw new ModelAccessDeniedError(response.message);
    } else {
      return response.data;
    }
  }
}

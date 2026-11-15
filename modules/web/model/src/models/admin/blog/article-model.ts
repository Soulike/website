import path from 'node:path';

import {Request} from '@library/request';
import {
  type Article,
  type ArticleDraft,
  ArticleSchema,
  type UpdateArticle,
} from '@schema/blog';
import {z} from 'zod';

import {
  parseServerResponse,
  parseVoidServerResponse,
} from '../../response-helper.js';
import {prependBlogPrefix} from './path-helper.js';

const ArticleListSchema = z.array(ArticleSchema);

export class ArticleModel {
  private static readonly PATH = Object.freeze({
    GET_BY_ID: ArticleModel.prependArticlePrefix('/getById'),
    GET_ALL: ArticleModel.prependArticlePrefix('/getAll'),
    GET_BY_CATEGORY: ArticleModel.prependArticlePrefix('/getByCategory'),
    ADD: ArticleModel.prependArticlePrefix('/add'),
    DELETE_BY_ID: ArticleModel.prependArticlePrefix('/deleteById'),
    MODIFY: ArticleModel.prependArticlePrefix('/modify'),
  });

  private static prependArticlePrefix(subPath: string): string {
    return prependBlogPrefix(path.join('article', subPath));
  }

  public async getById(id: Article['id']): Promise<Article> {
    const response = await Request.JSONToJSON.get<unknown>(
      ArticleModel.PATH.GET_BY_ID,
      {
        searchParams: new URLSearchParams({json: JSON.stringify({id})}),
      },
    );
    return parseServerResponse(ArticleSchema, response);
  }

  public async getAll(): Promise<Article[]> {
    const response = await Request.JSONToJSON.get<unknown>(
      ArticleModel.PATH.GET_ALL,
    );
    return parseServerResponse(ArticleListSchema, response);
  }

  public async getByCategory(
    category: Article['category'],
  ): Promise<Article[]> {
    const response = await Request.JSONToJSON.get<unknown>(
      ArticleModel.PATH.GET_BY_CATEGORY,
      {
        searchParams: new URLSearchParams({
          json: JSON.stringify({category}),
        }),
      },
    );
    return parseServerResponse(ArticleListSchema, response);
  }

  public async add(article: ArticleDraft): Promise<void> {
    const response = await Request.JSONToJSON.post<unknown>(
      ArticleModel.PATH.ADD,
      {
        body: article,
      },
    );
    parseVoidServerResponse(response);
  }

  public async deleteById(id: Article['id']): Promise<void> {
    const response = await Request.JSONToJSON.post<unknown>(
      ArticleModel.PATH.DELETE_BY_ID,
      {
        body: {id},
      },
    );
    parseVoidServerResponse(response);
  }

  public async modify(
    id: UpdateArticle['id'],
    modifiedParts: Omit<UpdateArticle, 'id'>,
  ): Promise<void> {
    const response = await Request.JSONToJSON.post<unknown>(
      ArticleModel.PATH.MODIFY,
      {
        body: {id, ...modifiedParts},
      },
    );
    parseVoidServerResponse(response);
  }
}
